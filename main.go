package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/pkg/profile"
	archipelago "github.com/verath/archipelago/lib"
	"github.com/verath/archipelago/lib/game"
	"github.com/verath/archipelago/lib/network/websocket"
	"github.com/verath/archipelago/lib/session"
	"log/slog"
)

const (
	httpReadTimeout  = 10 * time.Second
	httpWriteTimeout = 10 * time.Second
)

func main() {
	var (
		debug             bool
		skipWSOriginCheck bool
		wsCompression     bool
		httpAddr          string
		profileMode       string
		lobbyWait         time.Duration
		aiPlayers         int
		resumeGrace       time.Duration
	)
	flag.BoolVar(&debug, "debug", false, "Set to true to log debug messages.")
	flag.BoolVar(&skipWSOriginCheck, "skipWSOriginCheck", false, "")
	flag.BoolVar(&wsCompression, "wsCompression", true,
		"Negotiate permessage-deflate compression with websocket clients.")
	flag.StringVar(&httpAddr, "addr", ":8080", "TCP address for the http server to listen on.")
	flag.StringVar(&profileMode, "profile", "", "Enable profiling mode, one of [cpu, mem, mutex, block]")
	flag.DurationVar(&lobbyWait, "lobbyWait", game.DefaultLobbyWait,
		"Time to wait for more players once enough players to start a game have joined.")
	flag.IntVar(&aiPlayers, "aiPlayers", game.AIPlayersAuto,
		"AI players per game: -1 fills each game up to 4 players with at least 1 AI; "+
			"0 adds none, so a game needs at least 2 human players; n > 0 adds exactly n (at most 10).")
	flag.DurationVar(&resumeGrace, "resumeGrace", session.DefaultGrace,
		"Time a (v5) client whose connection broke during a game has to resume it on a new connection.")
	flag.Parse()
	logLevel := slog.LevelInfo
	if debug {
		logLevel = slog.LevelDebug
	}
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: logLevel}))
	if debug {
		logger.Info("Debug logging enabled")
	}
	if skipWSOriginCheck {
		logger.Info("Skipping WebSocket origin check.")
	}
	if !wsCompression {
		logger.Info("WebSocket compression disabled.")
	}
	logger.Info("HTTP server will listen", "addr", httpAddr)
	if profileMode != "" {
		defer startProfiling(profileMode)()
	}
	// Setup archipelago server instance.
	coordinatorOpts := game.CoordinatorOptions{LobbyWait: lobbyWait, AIPlayers: aiPlayers}
	wsOpts := websocket.UpgraderOptions{SkipOriginCheck: skipWSOriginCheck, DisableCompression: !wsCompression}
	if resumeGrace <= 0 {
		logger.Error("resumeGrace must be positive", "resumeGrace", resumeGrace)
		os.Exit(1)
	}
	srvOpts := archipelago.Options{ResumeGrace: resumeGrace}
	archipelagoServer, err := archipelago.New(logger, wsOpts, coordinatorOpts, srvOpts)
	if err != nil {
		logger.Error("Error creating archipelago", "err", err)
		os.Exit(1)
	}
	// Register archipelago HTTP rooted at "app/".
	http.Handle("/app/", http.StripPrefix("/app", archipelagoServer))
	// HTTP util routes.
	http.HandleFunc("/healthcheck", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})
	// Setup toplevel HTTP server.
	httpServer := &http.Server{
		Addr:         httpAddr,
		ReadTimeout:  httpReadTimeout,
		WriteTimeout: httpWriteTimeout,
	}
	// Run archipelago server, HTTP Server.
	err = runBackend(logger, archipelagoServer, httpServer)
	if errors.Is(err, context.Canceled) {
		logger.Debug("Error caught in main", "err", err)
	} else {
		logger.Error("Error caught in main", "err", err)
		os.Exit(1)
	}
	logger.Info("Archipelago backend stopped.")
}

// startProfiling starts profiling for the given profileMode. See
// pkg/profile. Returns a function that should be called when profiling
// should be stopped.
func startProfiling(profileMode string) func() {
	switch profileMode {
	case "cpu":
		return profile.Start(profile.NoShutdownHook, profile.ProfilePath("."), profile.CPUProfile).Stop
	case "mem":
		return profile.Start(profile.NoShutdownHook, profile.ProfilePath("."), profile.MemProfile).Stop
	case "mutex":
		return profile.Start(profile.NoShutdownHook, profile.ProfilePath("."), profile.MutexProfile).Stop
	case "block":
		return profile.Start(profile.NoShutdownHook, profile.ProfilePath("."), profile.BlockProfile).Stop
	default:
		return func() {}
	}
}

// lifetimeContext returns a context that is cancelled on the first SIGINT or
// SIGTERM signal received. The application is force closed if more than one
// signal is received.
func lifetimeContext(logger *slog.Logger) context.Context {
	ctx, cancel := context.WithCancel(context.Background())
	stopSigs := []os.Signal{os.Interrupt, syscall.SIGTERM}
	stopCh := make(chan os.Signal, len(stopSigs))
	signal.Notify(stopCh, stopSigs...)
	go func() {
		<-stopCh
		logger.Info("Caught interrupt, shutting down")
		cancel()
		<-stopCh
		logger.Error("Caught second interrupt, force closing")
		os.Exit(1)
	}()
	return ctx
}

func runBackend(logger *slog.Logger, archipelagoServer *archipelago.Server, httpServer *http.Server) error {
	ctx, cancel := context.WithCancel(lifetimeContext(logger))
	errCh := make(chan error)
	go func() {
		err := archipelagoServer.Run(ctx)
		if err != nil {
			err = fmt.Errorf("archipelagoServer error: %w", err)
		}
		errCh <- err
	}()
	go func() {
		err := runHTTPServer(ctx, httpServer)
		if err != nil {
			err = fmt.Errorf("httpServer error: %w", err)
		}
		errCh <- err
	}()
	logger.Info("Archipelago backend started.")
	err := <-errCh
	cancel()
	<-errCh
	return err
}

// runHTTPServer starts and runs the given HTTP server until either an error
// occurs or the context is cancelled.
func runHTTPServer(ctx context.Context, server *http.Server) error {
	errCh := make(chan error)
	go func() {
		err := server.ListenAndServe()
		if err != nil {
			err = fmt.Errorf("ListenAndServe error: %w", err)
		}
		errCh <- err
	}()
	select {
	case err := <-errCh:
		return err
	case <-ctx.Done():
		server.Close()
		<-errCh
		return ctx.Err()
	}
}
