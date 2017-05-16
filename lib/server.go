package archipelago

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/network/websocket"
	"github.com/verath/archipelago/lib/wire"
	"sync"
)

// Server is the main entry point to the game server. It connects the different
// parts of the server and runs them.
type Server struct {
	logEntry        *logrus.Entry
	wsHandler       *websocket.UpgradeHandler
	gameCoordinator *game.Coordinator
	// A wait group for all clients started by the Server.
	clientsWG sync.WaitGroup
}

// New returns a new Server using the provided logger.
func New(log *logrus.Logger) (*Server, error) {
	logEntry := common.ModuleLogEntry(log, "server")
	wsHandler, err := websocket.NewUpgradeHandler(log)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating websocket upgrade handler")
	}
	gameCoordinator, err := game.NewCoordinator(log)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating game coordinator")
	}
	return &Server{
		logEntry:        logEntry,
		wsHandler:       wsHandler,
		gameCoordinator: gameCoordinator,
	}, nil
}

// Run starts the game server and blocks until an error occurs, or
// the context is canceled. Run always returns a non-nil error.
func (srv *Server) Run(ctx context.Context) error {
	srv.logEntry.Info("Starting")
	defer srv.logEntry.Info("Stopped")
	ctx, cancel := context.WithCancel(ctx)
	srv.wsHandler.SetConnectionHandler(srv.wsConnectionHandler(ctx))
	err := srv.gameCoordinator.Run(ctx)
	srv.wsHandler.SetConnectionHandler(nil)
	cancel()
	srv.logEntry.Debug("Waiting for clients to stop...")
	srv.clientsWG.Wait()
	return err
}

// WebsocketHandler returns an http.Handler that should be registered as handler
// for a route that accepts websocket connections.
func (srv *Server) WebsocketHandler() *websocket.UpgradeHandler {
	return srv.wsHandler
}

// wsConnectionHandler creates a WSConnectionHandler that wraps the given context,
// calling handleWSConnection for each new connection.
func (srv *Server) wsConnectionHandler(ctx context.Context) websocket.WSConnectionHandler {
	return websocket.WSConnectionHandlerFunc(func(conn *websocket.WSConnection) error {
		return srv.handleWSConnection(ctx, conn)
	})
}

// handleWSConnection handles new websocket connections. The connection is
// wrapped in a Client, started, and added to the gameCoordinator.
func (srv *Server) handleWSConnection(ctx context.Context, conn *websocket.WSConnection) error {
	client, err := network.NewClient(srv.logEntry.Logger, conn)
	if err != nil {
		return errors.Wrap(err, "Error creating new Client from ws connection")
	}
	clientAdapter, err := wire.NewClientAdapter(client)
	if err != nil {
		return errors.Wrap(err, "Error creating client wire adapter")
	}
	srv.clientsWG.Add(1)
	go func() {
		defer srv.clientsWG.Done()
		err := client.Run(ctx)
		if err != nil && errors.Cause(err) != context.Canceled {
			srv.logEntry.Debugf("Client stopped with an error: %+v", err)
		}
	}()
	if err := srv.gameCoordinator.AddClient(ctx, clientAdapter); err != nil {
		errors.Wrap(err, "Error in game coordinator when handling client")
	}
	return nil
}
