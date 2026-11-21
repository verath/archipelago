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
	"github.com/verath/archipelago/lib/session"
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

// Options configures a Server. The zero value is the production
// configuration.
type Options struct {
	// ResumeGrace is how long a client whose connection broke during a game
	// has to resume the game on a new connection. Zero means
	// session.DefaultGrace.
	ResumeGrace time.Duration
}

// Server is the main entry point to the game server.
type Server struct {
	logger          *slog.Logger
	gameCoordinator *game.Coordinator
	wsUpgrader      *websocket.Upgrader
	router          *http.ServeMux
	// sessions holds the sessions of remote clients, which can resume.
	sessions *session.Registry

	clientContextMu sync.RWMutex
	clientContext   func() context.Context
	clientsWG       sync.WaitGroup
}

// New returns a new Server using the provided logger.
// wsOpts configures the websocket endpoint, its zero value is the production
// configuration. coordinatorOpts configures how games are created, see
// game.DefaultCoordinatorOptions for the production defaults. opts
// configures the rest.
func New(logger *slog.Logger, wsOpts websocket.UpgraderOptions, coordinatorOpts game.CoordinatorOptions, opts Options) (*Server, error) {
	if opts.ResumeGrace < 0 {
		return nil, fmt.Errorf("ResumeGrace must not be negative, got %v", opts.ResumeGrace)
	}
	if opts.ResumeGrace == 0 {
		opts.ResumeGrace = session.DefaultGrace
	}
	gameCoordinator, err := game.NewCoordinator(logger, coordinatorOpts)
	if err != nil {
		return nil, fmt.Errorf("error creating game coordinator: %w", err)
	}
	wsUpgrader := websocket.NewUpgrader(wsOpts)
	srv := &Server{
		logger:          common.ModuleLogEntry(logger, "server"),
		gameCoordinator: gameCoordinator,
		router:          http.NewServeMux(),
		wsUpgrader:      wsUpgrader,
		sessions:        session.NewRegistry(opts.ResumeGrace),

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
// connections. With the "resume" query parameter, the connection resumes
// the game of the session with that token (see EventGameStart.resume_token
// in game.proto). If that game can't be resumed, the request fails with
// 410 Gone.
func (srv *Server) handleWSConnect() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		var resume *session.Session
		if query := r.URL.Query(); query.Has("resume") {
			// Fail before upgrading, so that the client can tell a game it
			// can't resume from a network error.
			// A wrong version fails the upgrade too, but should not
			// look like a game that can't be resumed.
			if query.Get("v") != websocket.Version {
				http.Error(w, http.StatusText(http.StatusBadRequest)+" (version missmatch)", http.StatusBadRequest)
				return
			}
			resume = srv.sessions.Resumable(query.Get("resume"))
			if resume == nil {
				srv.logger.Debug("Can't resume, unknown or ended session")
				http.Error(w, http.StatusText(http.StatusGone)+" (game can't be resumed)", http.StatusGone)
				return
			}
		}
		wsConn, err := srv.wsUpgrader.Upgrade(w, r)
		if err != nil {
			// Note upgrader has already written error response.
			srv.logger.Debug("Failed upgrading to ws", "err", err)
			return
		}
		if err := srv.newWSClient(ctx, wsConn, resume); err != nil {
			srv.logger.Debug("Error handling new ws connection", "err", err)
			wsConn.Close()
		}
	}
}

// newWSClient starts a new websocket client for the provided ws connection.
// If resume is not nil, the client is attached to that session, otherwise
// it is added to the game coordinator to join a new game.
func (srv *Server) newWSClient(ctx context.Context, wsConn *websocket.WSConnection, resume *session.Session) error {
	client := network.NewClient(srv.logger, wsConn)
	wireClient := wire.NewPBClientAdapter(client)
	// Get client context. Note that it is not tied to the request context.
	srv.clientContextMu.RLock()
	clientCtx := srv.clientContext()
	srv.clientContextMu.RUnlock()
	// Start the client.
	srv.clientsWG.Add(1)
	go func() {
		defer srv.clientsWG.Done()
		start := time.Now()
		srv.logger.Debug("client connected", "resume", resume != nil)
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
	if resume != nil {
		// Attach disconnects the client on error.
		if err := resume.Attach(clientCtx, wireClient); err != nil {
			return fmt.Errorf("error resuming session: %w", err)
		}
		srv.logger.Debug("client resumed session")
		return nil
	}
	gameClient := srv.sessions.New(wireClient)
	if err := srv.gameCoordinator.AddClient(ctx, gameClient); err != nil {
		gameClient.Disconnect()
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
