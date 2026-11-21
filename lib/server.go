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
	"github.com/verath/archipelago/lib/session"
	"github.com/verath/archipelago/lib/wire"
	"log/slog"
)

// canceledClientContext is a canceled context used for new clients until the
// Server is running, and after the Server has quit.
var canceledClientContext context.Context = func() context.Context {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	return ctx
}()

// Options configures a Server. Use DefaultOptions for the production
// configuration.
type Options struct {
	// SkipWSOriginCheck disables checking the Origin of websocket requests.
	SkipWSOriginCheck bool
	// DisableWSCompression disables negotiating permessage-deflate
	// compression with websocket clients.
	DisableWSCompression bool
	// LobbyWait is the time to wait for additional clients once enough
	// clients to start a game have connected (see game.CoordinatorOptions).
	LobbyWait time.Duration
	// AIPlayers is the number of AI players added to each game, or
	// game.AIPlayersAuto (see game.CoordinatorOptions).
	AIPlayers int
	// ResumeGrace is how long a client whose connection broke during a game
	// has to resume the game on a new connection. Must be positive.
	ResumeGrace time.Duration
}

// DefaultOptions returns the Options used in production.
func DefaultOptions() Options {
	return Options{
		LobbyWait:   game.DefaultLobbyWait,
		AIPlayers:   game.AIPlayersAuto,
		ResumeGrace: session.DefaultGrace,
	}
}

// Server is the main entry point to the game server.
type Server struct {
	logger          *slog.Logger
	gameCoordinator *game.Coordinator
	wsUpgrader      *network.Upgrader
	router          *http.ServeMux
	// sessions holds the sessions of remote clients, which can resume.
	sessions *session.Registry

	// clientCtx is the context that clients run with, guarded by clientCtxMu.
	// It is canceled unless the Server is running.
	clientCtxMu sync.RWMutex
	clientCtx   context.Context
	clientsWG   sync.WaitGroup
}

// New returns a new Server using the provided logger and options, see
// DefaultOptions for the production configuration.
func New(logger *slog.Logger, opts Options) (*Server, error) {
	if opts.ResumeGrace <= 0 {
		return nil, fmt.Errorf("ResumeGrace must be positive, got %v", opts.ResumeGrace)
	}
	gameCoordinator, err := game.NewCoordinator(logger, game.CoordinatorOptions{
		LobbyWait: opts.LobbyWait,
		AIPlayers: opts.AIPlayers,
	})
	if err != nil {
		return nil, fmt.Errorf("error creating game coordinator: %w", err)
	}
	wsUpgrader := network.NewUpgrader(network.UpgraderOptions{
		SkipOriginCheck:    opts.SkipWSOriginCheck,
		DisableCompression: opts.DisableWSCompression,
	})
	srv := &Server{
		logger:          common.ModuleLogEntry(logger, "server"),
		gameCoordinator: gameCoordinator,
		router:          http.NewServeMux(),
		wsUpgrader:      wsUpgrader,
		sessions:        session.NewRegistry(opts.ResumeGrace),
		clientCtx:       canceledClientContext,
	}
	srv.router.HandleFunc("/ws", srv.handleWSConnect())
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

// setClientContext sets the context that new clients run with.
func (srv *Server) setClientContext(clientCtx context.Context) {
	srv.clientCtxMu.Lock()
	defer srv.clientCtxMu.Unlock()
	srv.clientCtx = clientCtx
}

// handleWSConnect returns an HTTP handler that handles new websocket
// connections. With the "resume" query parameter, the connection resumes
// the game of the session with that token (see EventGameStart.resume_token
// in game.proto). If that game can't be resumed, the request fails with
// 410 Gone.
func (srv *Server) handleWSConnect() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		query := r.URL.Query()
		// Check the version first, so that a wrong one never looks like a
		// game that can't be resumed.
		if query.Get("v") != network.Version {
			http.Error(w, http.StatusText(http.StatusBadRequest)+" (version mismatch)", http.StatusBadRequest)
			return
		}
		var resume *session.Session
		if query.Has("resume") {
			// Fail before upgrading, so that the client can tell a game it
			// can't resume from a network error.
			resume = srv.sessions.Resumable(query.Get("resume"))
			if resume == nil {
				srv.logger.Debug("Can't resume, unknown or ended session")
				http.Error(w, http.StatusText(http.StatusGone)+" (game can't be resumed)", http.StatusGone)
				return
			}
		}
		client, err := srv.wsUpgrader.Upgrade(w, r)
		if err != nil {
			// Note upgrader has already written error response.
			srv.logger.Debug("Failed upgrading to ws", "err", err)
			return
		}
		if err := srv.newWSClient(ctx, client, resume); err != nil {
			srv.logger.Debug("Error handling new ws connection", "err", err)
		}
	}
}

// newWSClient runs the new websocket client. If resume is not nil, the
// client is attached to that session, otherwise it is added to the game
// coordinator to join a new game. On error, the client is disconnected.
func (srv *Server) newWSClient(ctx context.Context, client *network.Client, resume *session.Session) error {
	wireClient := wire.NewPBClientAdapter(client)
	// Get client context. Note that it is not tied to the request context.
	srv.clientCtxMu.RLock()
	clientCtx := srv.clientCtx
	srv.clientCtxMu.RUnlock()
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
		srv.logClientTraffic(time.Since(start), client.Stats())
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
func (srv *Server) logClientTraffic(duration time.Duration, stats network.Stats) {
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
