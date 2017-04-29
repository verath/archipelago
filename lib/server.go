package archipelago

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/network/websocket"
)

const (
	// The max number of clients in the client queue
	// TODO(2017-01-13): What is an appropriate number here?
	clientQueueSize = 2
)

// Server is the main entry point to the game server. It connects the different
// parts of the server and runs them.
type Server struct {
	logEntry        *logrus.Entry
	wsHandler       *websocket.UpgradeHandler
	clientManager   *network.ClientManager
	gameCoordinator *game.Coordinator
}

// New returns a new Server using the provided logger.
func New(log *logrus.Logger) (*Server, error) {
	logEntry := common.ModuleLogEntry(log, "server")
	wsHandler, err := websocket.NewUpgradeHandler(log)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating websocket upgrade handler")
	}
	clientQueue, err := network.NewClientQueue(clientQueueSize)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating client queue")
	}
	clientManager, err := network.NewClientManager(log, clientQueue)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating client manager")
	}
	gameCoordinator, err := game.NewCoordinator(log, clientQueue)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating game coordinator")
	}
	return &Server{
		logEntry:        logEntry,
		wsHandler:       wsHandler,
		clientManager:   clientManager,
		gameCoordinator: gameCoordinator,
	}, nil
}

// Run starts the game server and blocks until an error occurs, or
// the context is canceled. Run always returns a non-nil error.
func (srv *Server) Run(ctx context.Context) error {
	ctx, cancel := context.WithCancel(ctx)
	errCh := make(chan error)
	go func() {
		err := srv.clientManager.Run(ctx, srv.wsHandler)
		errCh <- errors.Wrap(err, "clientManager stopped with an error")
	}()
	go func() {
		err := srv.gameCoordinator.Run(ctx)
		errCh <- errors.Wrap(err, "gameCooridnator stopped with an error")
	}()
	err := <-errCh
	cancel()
	<-errCh
	return err
}

// WebsocketHandler returns an http.Handler that should be registered as handler
// for a route that accepts websocket connections.
func (srv *Server) WebsocketHandler() *websocket.UpgradeHandler {
	return srv.wsHandler
}
