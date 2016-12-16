package network

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/util"
	"log"
	"net"
	"net/http"
	"time"
)

const (
	httpReadTimeout  = 10 * time.Second
	httpWriteTimeout = 10 * time.Second
)

// Server is a thin wrapper around http.Server that can be shut
// down by context cancellation
type HTTPServer struct {
	logEntry *logrus.Entry
	mux      *http.ServeMux

	serverAddr string
}

// Run starts the http server and blocks until it has finished.
// Run always returns a non-nil error.
func (srv *HTTPServer) Run(ctx context.Context) error {
	srv.logEntry.Info("Starting")
	defer srv.logEntry.Info("Stopped")

	// Create a std logger that writes to the logrus instance
	logWriter := srv.logEntry.Logger.Writer()
	defer logWriter.Close()
	errorLog := log.New(logWriter, "", 0)

	httpServer := http.Server{
		Addr:         srv.serverAddr,
		ReadTimeout:  httpReadTimeout,
		WriteTimeout: httpWriteTimeout,
		Handler:      srv.mux,
		ErrorLog:     errorLog,
	}

	listener, err := net.Listen("tcp", srv.serverAddr)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithCancel(ctx)
	errCh := make(chan error, 0)
	go func() {
		errCh <- httpServer.Serve(listener)
		cancel()
	}()

	<-ctx.Done()
	listener.Close()
	return <-errCh
}

func NewServer(log *logrus.Logger, mux *http.ServeMux, serverAddr string) (*HTTPServer, error) {
	logEntry := util.ModuleLogEntry(log, "http")

	return &HTTPServer{
		logEntry:   logEntry,
		mux:        mux,
		serverAddr: serverAddr,
	}, nil
}
