package archipelago

import (
	"context"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/controller"
	"github.com/verath/archipelago/lib/logutil"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/network/websocket"
	"net/http"
)

type archipelago struct {
	log *logrus.Logger

	clientPool      *network.ClientPool
	gameCoordinator *controller.GameCoordinator
	httpServer      *network.HTTPServer
}

func (a *archipelago) Run(ctx context.Context) error {
	logEntry := logutil.ModuleEntry(a.log, "archipelago")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	ctx, cancel := context.WithCancel(ctx)
	errCh := make(chan error, 0)

	go func() {
		// TODO: Move client pool inside game coordinator?
		err := a.clientPool.Run(ctx)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("Client pool quit")
		}
		errCh <- err
	}()
	go func() {
		err := a.gameCoordinator.Run(ctx)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("Game coordinator quit")
		}
		errCh <- err
	}()
	go func() {
		err := a.httpServer.Serve(ctx)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("HTTP server quit")
		}
		errCh <- err
	}()

	err := <-errCh
	cancel()
	<-errCh
	<-errCh
	return err
}

func New(log *logrus.Logger, staticRoot http.FileSystem, httpServerAddr string) (*archipelago, error) {
	clientPool, err := network.NewClientPool(log)
	if err != nil {
		return nil, fmt.Errorf("Error creating client pool: %v", err)
	}

	gameCoordinator, err := controller.NewGameCoordinator(log, clientPool)
	if err != nil {
		return nil, fmt.Errorf("Error creating game coordinator: %v", err)
	}

	mux := http.NewServeMux()
	mux.Handle("/ws", websocket.ConnectHandler(log, clientPool))
	mux.Handle("/", http.FileServer(staticRoot))

	httpServer, err := network.NewServer(log, mux, httpServerAddr)
	if err != nil {
		return nil, fmt.Errorf("Error creating server: %v", err)

	}

	return &archipelago{
		log:             log,
		clientPool:      clientPool,
		gameCoordinator: gameCoordinator,
		httpServer:      httpServer,
	}, nil
}
