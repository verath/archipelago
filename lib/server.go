package archipelago

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"sync"
	"time"

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
// wsOpts configures the websocket endpoint, its zero value is the production
// configuration. coordinatorOpts configures how games are created, see
// game.DefaultCoordinatorOptions for the production defaults.
func New(logger *slog.Logger, wsOpts websocket.UpgraderOptions, coordinatorOpts game.CoordinatorOptions) (*Server, error) {
	gameCoordinator, err := game.NewCoordinator(logger, coordinatorOpts)
	if err != nil {
		return nil, fmt.Errorf("error creating game coordinator: %w", err)
	}
	wsUpgrader, err := websocket.NewUpgrader(wsOpts)
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
		start := time.Now()
		err := client.Run(clientCtx)
		if err != nil {
			if errors.Is(err, context.Canceled) {
				srv.logger.Debug("client stopped with ctx error", "err", err)
			} else {
				srv.logger.Info("client stopped with error", "err", err)
			}
		}
		srv.logClientTraffic(time.Since(start), wsConn.Stats())
	}()
	if err := srv.gameCoordinator.AddClient(ctx, wireClient); err != nil {
		client.Disconnect()
		return fmt.Errorf("error adding client to game coordinator: %w", err)
	}
	return nil
}

// logClientTraffic logs the traffic of a websocket client over its lifetime,
// one line per client, to be able to follow network usage in production.
func (srv *Server) logClientTraffic(duration time.Duration, stats websocket.Stats) {
	srv.logger.Info("client traffic",
		"duration", duration.Round(time.Millisecond),
		"msgsOut", stats.MessagesWritten,
		"payloadBytesOut", stats.PayloadBytesWritten,
		"wireBytesOut", stats.WireBytesWritten,
		"wireBytesOutPerSec", perSecond(stats.WireBytesWritten, duration),
		"compressionRatio", fmt.Sprintf("%.2f", stats.CompressionRatio()),
		"msgsIn", stats.MessagesRead,
		"payloadBytesIn", stats.PayloadBytesRead,
		"wireBytesIn", stats.WireBytesRead,
	)
}

// perSecond returns n per second over duration d, rounded down. Returns 0 if
// d is less than a second.
func perSecond(n int64, d time.Duration) int64 {
	if d < time.Second {
		return 0
	}
	return int64(float64(n) / d.Seconds())
}
