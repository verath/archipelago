package archipelago

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/game"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/network/websocket"
	"net/http"
)

const (
	// The max number of clients in the client queue
	// TODO(2017-01-13): What is an appropriate number here?
	clientQueueSize = 2
)

// Server is the main entry point to the game server. It is responsible for
// starting the gameCoordinator, and also forwarding http connections to the
// websocket upgrade handler.
type Server struct {
	gameCoordinator *game.Coordinator
	wsHandler       http.Handler
}

func New(log *logrus.Logger) (*Server, error) {
	clientQueue, err := network.NewClientQueue(log, clientQueueSize)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating client pool")
	}
	gameCoordinator, err := game.NewCoordinator(log, clientQueue)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating game coordinator")
	}
	wsHandler := websocket.NewUpgradeHandler(log, clientQueue)
	return &Server{
		gameCoordinator: gameCoordinator,
		wsHandler:       wsHandler,
	}, nil
}

// WebsocketHandler returns an http.Handler that should be registered as handler
// for a route that accepts websocket connections.
func (a *Server) WebsocketHandler() http.Handler {
	return a.wsHandler
}

// Run starts the game server and blocks until an error occurs, or
// the context is canceled. Run always returns a non-nil error.
func (a *Server) Run(ctx context.Context) error {
	return a.gameCoordinator.Run(ctx)
}
