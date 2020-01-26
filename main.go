package main

import (
	"context"
	"flag"
	"net/http"
	"os"
	"os/signal"
	"path"
	"syscall"
	"time"

	"github.com/pkg/errors"
	"github.com/pkg/profile"
	"github.com/sirupsen/logrus"
	archipelago "github.com/verath/archipelago/lib"
)

const (
	httpReadTimeout  = 10 * time.Second
	httpWriteTimeout = 10 * time.Second
)

func main() {
	var (
		debug       bool
		serveStatic bool
		serverAddr  string
		profileMode string
	)
	flag.BoolVar(&debug, "debug", false, "Set to true to log debug messages.")
	flag.BoolVar(&serveStatic, "servestatic", false, "Enable serving of static assets.")
	flag.StringVar(&serverAddr, "addr", ":8080", "TCP address for the http server to listen on.")
	flag.StringVar(&profileMode, "profile", "", "Enable profiling mode, one of [cpu, mem, mutex, block]")
	flag.Parse()

	logger := logrus.New()
	logger.Formatter = &logrus.TextFormatter{}
	if debug {
		logger.Level = logrus.DebugLevel
		logger.Info("Debug logging enabled")
	}

	if profileMode != "" {
		defer startProfiling(profileMode)()
	}

	archipelagoServer, err := archipelago.New(logger)
	if err != nil {
		logger.Fatalf("Error creating game: %+v", err)
	}

	http.Handle("/ws", archipelagoServer.WebsocketHandler())
	http.HandleFunc("/healthcheck", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})
	if serveStatic {
		staticPath := "./web/dist"
		// Explicitly set a max-age of 0 for service worker script.
		http.HandleFunc("/sw.js", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Cache-Control", "max-age=0")
			http.ServeFile(w, r, path.Join(staticPath, "sw.js"))
		})
		http.Handle("/", http.FileServer(http.Dir(staticPath)))
	}
	httpServer := &http.Server{
		Addr:         serverAddr,
		ReadTimeout:  httpReadTimeout,
		WriteTimeout: httpWriteTimeout,
	}

	ctx, cancel := context.WithCancel(lifetimeContext(logger))
	errCh := make(chan error)
	go func() { errCh <- archipelagoServer.Run(ctx) }()
	go func() { errCh <- runHTTPServer(ctx, httpServer) }()
	logger.Infof("Archipelago backend started: '%s'", serverAddr)
	err = <-errCh
	cancel()
	<-errCh
	if errors.Cause(err) == context.Canceled {
		logger.Debugf("Error caught in main: %+v", err)
	} else {
		logger.Fatalf("Error caught in main: %+v", err)
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

// lifetimeContext returns a context that is cancelled on the first SIGINT, SIGTERM,
// or SIGKILL signal received. The application is force closed if more than one
// signal is received.
func lifetimeContext(logger *logrus.Logger) context.Context {
	ctx, cancel := context.WithCancel(context.Background())
	stopSigs := []os.Signal{os.Interrupt, os.Kill, syscall.SIGTERM}
	stopCh := make(chan os.Signal, len(stopSigs))
	signal.Notify(stopCh, stopSigs...)
	go func() {
		<-stopCh
		logger.Info("Caught interrupt, shutting down")
		cancel()
		<-stopCh
		logger.Fatal("Caught second interrupt, force closing")
	}()
	return ctx
}

// runHTTPServer starts and runs the given HTTP server until either an error
// occurs or the context is cancelled.
func runHTTPServer(ctx context.Context, server *http.Server) error {
	errCh := make(chan error)
	go func() { errCh <- server.ListenAndServe() }()
	select {
	case err := <-errCh:
		return err
	case <-ctx.Done():
		server.Close()
		return ctx.Err()
	}
}
