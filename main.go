package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"net/http"
	"net/http/pprof"
	"os"
	"os/signal"
	"syscall"
	"time"

	archipelago "github.com/verath/archipelago/lib"
	"log/slog"
)

const (
	httpReadTimeout  = 10 * time.Second
	httpWriteTimeout = 10 * time.Second
)

func main() {
	var (
		debug         bool
		wsCompression bool
		httpAddr      string
		pprofAddr     string
	)
	opts := archipelago.DefaultOptions()
	flag.BoolVar(&debug, "debug", false, "Set to true to log debug messages.")
	flag.BoolVar(&opts.SkipWSOriginCheck, "skipWSOriginCheck", false, "")
	flag.BoolVar(&wsCompression, "wsCompression", true,
		"Negotiate permessage-deflate compression with websocket clients.")
	flag.StringVar(&httpAddr, "addr", ":8080", "TCP address for the http server to listen on.")
	flag.StringVar(&pprofAddr, "pprofAddr", "",
		"TCP address to serve net/http/pprof on, e.g. localhost:6060. Empty (the default) disables it.")
	flag.DurationVar(&opts.LobbyWait, "lobbyWait", opts.LobbyWait,
		"Time to wait for more players once enough players to start a game have joined.")
	flag.IntVar(&opts.AIPlayers, "aiPlayers", opts.AIPlayers,
		"AI players per game: -1 fills each game up to 4 players with at least 1 AI; "+
			"0 adds none, so a game needs at least 2 human players; n > 0 adds exactly n (at most 10).")
	flag.DurationVar(&opts.ResumeGrace, "resumeGrace", opts.ResumeGrace,
		"Time a client whose connection broke during a game has to resume it on a new connection.")
	flag.Parse()
	opts.DisableWSCompression = !wsCompression
	logLevel := slog.LevelInfo
	if debug {
		logLevel = slog.LevelDebug
	}
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: logLevel}))
	if debug {
		logger.Info("Debug logging enabled")
	}
	if opts.SkipWSOriginCheck {
		logger.Info("Skipping WebSocket origin check.")
	}
	if !wsCompression {
		logger.Info("WebSocket compression disabled.")
	}
	logger.Info("HTTP server will listen", "addr", httpAddr)
	if pprofAddr != "" {
		startPprofServer(logger, pprofAddr)
	}
	// Setup archipelago server instance.
	archipelagoServer, err := archipelago.New(logger, opts)
	if err != nil {
		logger.Error("Error creating archipelago", "err", err)
		os.Exit(1)
	}
	// Use a mux of our own, as importing net/http/pprof registers its
	// endpoints on http.DefaultServeMux, which must not be public.
	mux := http.NewServeMux()
	// Register archipelago HTTP rooted at "app/".
	mux.Handle("/app/", http.StripPrefix("/app", archipelagoServer))
	// HTTP util routes.
	mux.HandleFunc("/healthcheck", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})
	// Setup toplevel HTTP server.
	httpServer := &http.Server{
		Addr:         httpAddr,
		Handler:      mux,
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

// startPprofServer serves net/http/pprof on addr, on a listener of its own
// so that the profiling endpoints are never served on the public one.
func startPprofServer(logger *slog.Logger, addr string) {
	mux := http.NewServeMux()
	mux.HandleFunc("/debug/pprof/", pprof.Index)
	mux.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
	mux.HandleFunc("/debug/pprof/profile", pprof.Profile)
	mux.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
	mux.HandleFunc("/debug/pprof/trace", pprof.Trace)
	logger.Info("pprof server will listen", "addr", addr)
	go func() {
		// Profiling is optional, so a failure should not take the game down.
		err := http.ListenAndServe(addr, mux)
		logger.Error("pprof server stopped", "err", err)
	}()
}

func runBackend(logger *slog.Logger, archipelagoServer *archipelago.Server, httpServer *http.Server) error {
	// sigCtx is canceled on the first SIGINT or SIGTERM.
	sigCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	ctx, cancel := context.WithCancel(sigCtx)
	defer cancel()
	sigDone := make(chan struct{})
	go func() {
		defer close(sigDone)
		<-ctx.Done()
		if sigCtx.Err() == nil {
			return
		}
		logger.Info("Caught interrupt, shutting down")
		// Restore the default signal handling, so that a second signal
		// kills the process if the shutdown hangs.
		stop()
	}()
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
	<-sigDone
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
