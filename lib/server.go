package archipelago

import (
	"context"
	"net/http"
	"sync"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/network/websocket"
	"github.com/verath/archipelago/lib/wire"
)

// canceledClientContext is a canceled context used by default for new clients
// until the Server is running, and after the Server has quit.
var canceledClientContext context.Context = func() context.Context {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	return ctx
}()

// Server is the main entry point to the game server.
type Server struct {
	logEntry        *logrus.Entry
	gameCoordinator *game.Coordinator
	wsUpgrader      *websocket.Upgrader
	router          *http.ServeMux

	clientContextMu sync.RWMutex
	clientContext   func() context.Context
	clientsWG       sync.WaitGroup
}

// New returns a new Server using the provided logger.
// skipWSOriginCheck controls if websocket origin checking is disabled.
func New(log *logrus.Logger, skipWSOriginCheck bool) (*Server, error) {
	logEntry := common.ModuleLogEntry(log, "server")
	gameCoordinator, err := game.NewCoordinator(log)
	if err != nil {
		return nil, errors.Wrap(err, "error creating game coordinator")
	}
	wsUpgrader, err := websocket.NewUpgrader(skipWSOriginCheck)
	if err != nil {
		return nil, errors.Wrap(err, "error creating websocket upgrader")
	}
	srv := &Server{
		logEntry:        logEntry,
		gameCoordinator: gameCoordinator,
		router:          http.NewServeMux(),
		wsUpgrader:      wsUpgrader,

		clientContext: func() context.Context { return canceledClientContext },
	}
	srv.routes()
	return srv, nil
}

// Run starts the game server and blocks until an error occurs, or
// the context is canceled. Run always returns a non-nil error.
func (srv *Server) Run(ctx context.Context) error {
	srv.logEntry.Info("Starting")
	defer srv.logEntry.Info("Stopped")

	ctx, cancel := context.WithCancel(ctx)
	srv.setClientContext(ctx)
	defer srv.setClientContext(canceledClientContext)
	err := srv.gameCoordinator.Run(ctx)
	cancel()
	srv.logEntry.Info("Waiting for clients to stop...")
	srv.clientsWG.Wait()
	return errors.Wrap(err, "GameCoordinator error")
}

// ServeHTTP dispatches HTTP requests.
func (srv *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	srv.logEntry.Debugf("%s - %s", r.Method, r.URL.Path)
	srv.router.ServeHTTP(w, r)
}

// setClientContext modifies clientContext func to return the given clientCtx.
func (srv *Server) setClientContext(clientCtx context.Context) {
	srv.clientContextMu.Lock()
	defer srv.clientContextMu.Unlock()
	srv.clientContext = func() context.Context {
		return clientCtx
	}
}

// handleWSConnect returns an HTTP handler that handles new websocket
// connections.
func (srv *Server) handleWSConnect() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		wsConn, err := srv.wsUpgrader.Upgrade(w, r)
		if err != nil {
			// Note upgrader has already written error response.
			srv.logEntry.Debugf("Failed upgrading to ws: %v", err)
			return
		}
		if err := srv.newWSClient(ctx, wsConn); err != nil {
			srv.logEntry.Debugf("Error handling new ws connection: %v", err)
			wsConn.Close()
		}
	}
}

// newWSClient starts a new websocket client for the provided ws connection.
func (srv *Server) newWSClient(ctx context.Context, wsConn *websocket.WSConnection) error {
	client, err := network.NewClient(srv.logEntry.Logger, wsConn)
	if err != nil {
		return errors.Wrap(err, "error creating new Client from ws connection")
	}
	wireClient, err := wire.NewPBClientAdapter(client)
	if err != nil {
		return errors.Wrap(err, "error creating client wire adapter")
	}
	// Get client context. Note that it is not tied to the request context.
	srv.clientContextMu.RLock()
	clientCtx := srv.clientContext()
	srv.clientContextMu.RUnlock()
	// Start the client.
	srv.clientsWG.Add(1)
	go func() {
		defer srv.clientsWG.Done()
		err := client.Run(clientCtx)
		if err != nil {
			if errors.Cause(err) == context.Canceled {
				srv.logEntry.Debugf("client stopped with ctx error: %v", err)
			} else {
				srv.logEntry.Infof("client stopped with error: %v", err)
			}
		}
	}()
	if err := srv.gameCoordinator.AddClient(ctx, wireClient); err != nil {
		client.Disconnect()
		return errors.Wrap(err, "error adding client to game coordinator")
	}
	return nil
}
