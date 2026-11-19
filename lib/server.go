package archipelago

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"sync"

	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/network/websocket"
	"github.com/verath/archipelago/lib/wire"
	"log/slog"
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
	logger          *slog.Logger
	gameCoordinator *game.Coordinator
	wsUpgrader      *websocket.Upgrader
	router          *http.ServeMux

	clientContextMu sync.RWMutex
	clientContext   func() context.Context
	clientsWG       sync.WaitGroup
}

// New returns a new Server using the provided logger.
// skipWSOriginCheck controls if websocket origin checking is disabled.
func New(logger *slog.Logger, skipWSOriginCheck bool) (*Server, error) {
	gameCoordinator, err := game.NewCoordinator(logger)
	if err != nil {
		return nil, fmt.Errorf("error creating game coordinator: %w", err)
	}
	wsUpgrader, err := websocket.NewUpgrader(skipWSOriginCheck)
	if err != nil {
		return nil, fmt.Errorf("error creating websocket upgrader: %w", err)
	}
	srv := &Server{
		logger:          common.ModuleLogEntry(logger, "server"),
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
	srv.logger.Info("Starting")
	defer srv.logger.Info("Stopped")

	ctx, cancel := context.WithCancel(ctx)
	srv.setClientContext(ctx)
	defer srv.setClientContext(canceledClientContext)
	err := srv.gameCoordinator.Run(ctx)
	cancel()
	srv.logger.Info("Waiting for clients to stop...")
	srv.clientsWG.Wait()
	if err != nil {
		return fmt.Errorf("GameCoordinator error: %w", err)
	}
	return nil
}

// ServeHTTP dispatches HTTP requests.
func (srv *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	srv.logger.Debug("request", "method", r.Method, "path", r.URL.Path)
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
			srv.logger.Debug("Failed upgrading to ws", "err", err)
			return
		}
		if err := srv.newWSClient(ctx, wsConn); err != nil {
			srv.logger.Debug("Error handling new ws connection", "err", err)
			wsConn.Close()
		}
	}
}

// newWSClient starts a new websocket client for the provided ws connection.
func (srv *Server) newWSClient(ctx context.Context, wsConn *websocket.WSConnection) error {
	client, err := network.NewClient(srv.logger, wsConn)
	if err != nil {
		return fmt.Errorf("error creating new Client from ws connection: %w", err)
	}
	wireClient, err := wire.NewPBClientAdapter(client)
	if err != nil {
		return fmt.Errorf("error creating client wire adapter: %w", err)
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
			if errors.Is(err, context.Canceled) {
				srv.logger.Debug("client stopped with ctx error", "err", err)
			} else {
				srv.logger.Info("client stopped with error", "err", err)
			}
		}
	}()
	if err := srv.gameCoordinator.AddClient(ctx, wireClient); err != nil {
		client.Disconnect()
		return fmt.Errorf("error adding client to game coordinator: %w", err)
	}
	return nil
}
