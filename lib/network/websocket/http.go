package websocket

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/verath/archipelago/lib/logutil"
	"github.com/verath/archipelago/lib/network"
	"net"
	"net/http"
	"sync"
	"time"
)

const (
	DefaultServerAddr string = ":8080"
)

type server struct {
	log        *logrus.Logger
	serverAddr string
}

type playerConnCh chan<- network.PlayerConn

var upgrader = websocket.Upgrader{
	// TODO: should we allow all origins?
	CheckOrigin: func(r *http.Request) bool { return true },
}

func (s *server) handleWSConn(ctx context.Context, playerCh playerConnCh, wg sync.WaitGroup, conn *websocket.Conn) {
	logEntry := logutil.ModuleEntry(s.log, "http")

	// Move to a new go-routine so the current http response go-routine
	// is allowed to finish.
	// TODO: Does this matter?
	wg.Add(1)
	go func() {
		defer wg.Done()
		playerConn := newPlayerConn(conn, s.log)

		wg.Add(1)
		go func() {
			defer wg.Done()
			playerConn.run(ctx)
		}()

		// As sending to playerCh could block forever, we make sure to also
		// listen for context cancellation
		select {
		case playerCh <- playerConn:
		case <-ctx.Done():
			logEntry.WithError(ctx.Err()).Info("could not send playerConn")
		}
	}()
}

func (s *server) Run(ctx context.Context, playerCh playerConnCh) error {
	logEntry := logutil.ModuleEntry(s.log, "http")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	var wg sync.WaitGroup

	mux := http.NewServeMux()
	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			logEntry.WithError(err).Error("Failed upgrading to websocket")
			return
		}
		s.handleWSConn(ctx, playerCh, wg, conn)
	})

	server := http.Server{
		Addr:         s.serverAddr,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		Handler:      mux,
	}

	listener, err := net.Listen("tcp", s.serverAddr)
	if err != nil {
		return err
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		server.Serve(listener)
	}()
	<-ctx.Done()
	listener.Close()
	wg.Wait()
	return nil
}

func NewServer(log *logrus.Logger) *server {
	return &server{
		log:        log,
		serverAddr: DefaultServerAddr,
	}
}
