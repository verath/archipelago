package main

import (
	"context"
	"flag"
	"github.com/Sirupsen/logrus"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib"
	"net/http"
	"os"
	"os/signal"
	"time"
)

const (
	httpReadTimeout  = 10 * time.Second
	httpWriteTimeout = 10 * time.Second
)

func main() {
	var (
		debug       bool
		serveStatic bool
		staticPath  string
		serverAddr  string
	)
	flag.BoolVar(&debug, "debug", false, "Set to true to log debug messages.")
	flag.BoolVar(&serveStatic, "servestatic", false, "Enable serving of static assets.")
	flag.StringVar(&staticPath, "staticpath", "./web/dist", "Specifies the path to static assets "+
		"directory. Only applicable if servestatic is true.")
	flag.StringVar(&serverAddr, "addr", ":8080", "TCP address for the http server to listen on.")
	flag.Parse()

	logger := logrus.New()
	logger.Formatter = &logrus.TextFormatter{}
	if debug {
		logger.Level = logrus.DebugLevel
	}

	archipelagoServer, err := archipelago.New(logger)
	if err != nil {
		logger.Fatalf("Error creating game: %+v", err)
	}

	http.Handle("/ws", archipelagoServer.WebsocketHandler())
	if serveStatic {
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
	err = <-errCh
	cancel()
	<-errCh
	if errors.Cause(err) == context.Canceled {
		logger.Debugf("Error caught in main: %+v", err)
	} else {
		logger.Fatalf("Error caught in main: %+v", err)
	}
}

// lifetimeContext returns a context that is cancelled on the first SIGINT or
// SIGKILL signal received. The application is force closed if more than
// one signal is received.
func lifetimeContext(logger *logrus.Logger) context.Context {
	ctx, cancel := context.WithCancel(context.Background())
	stopSigs := make(chan os.Signal, 2)
	signal.Notify(stopSigs, os.Interrupt, os.Kill)
	go func() {
		<-stopSigs
		logger.Info("Caught interrupt, shutting down")
		cancel()
		<-stopSigs
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
