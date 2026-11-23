package game

import (
	"context"
	"errors"
	"fmt"
	"math"
	"math/rand"
	"sync"
	"time"

	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/ai"
	"log/slog"
)

const (
	// A timeout for the maximum length of a game before it is force-closed.
	// Used so that a client leaving a game open will not keep its resources
	// allocated forever.
	maxGameDuration time.Duration = 45 * time.Minute

	// The max number of clients in the client queue
	// TODO(2017-01-13): What is an appropriate number here?
	clientQueueSize = 2

	// DefaultLobbyWait is the default CoordinatorOptions.LobbyWait.
	DefaultLobbyWait = 8 * time.Second

	// AIPlayersAuto is the CoordinatorOptions.AIPlayers value for adding AI
	// players to fill each game up to 4 players, always adding at least one.
	AIPlayersAuto = -1

	// minPlayersPerGame is the minimum number of players (remote and AI) in
	// a game. A game with a single player would be over immediately.
	minPlayersPerGame = 2

	// maxRemoteClientsPerGame is the maximum number of remote clients in a game.
	maxRemoteClientsPerGame = 10

	// MaxAIPlayers is the maximum CoordinatorOptions.AIPlayers value. The game
	// board has a limited number of island positions, so the total number of
	// players per game must stay small.
	MaxAIPlayers = 10
)

// CoordinatorOptions configures how the Coordinator creates games.
type CoordinatorOptions struct {
	// LobbyWait is the time that we wait for additional clients once the
	// minimum required clients are connected, before starting a new game.
	LobbyWait time.Duration

	// AIPlayers is the number of AI players added to each game. AIPlayersAuto
	// (-1) fills each game up to 4 players, adding at least one AI player.
	// With 0, no AI players are added and a game needs at least 2 remote
	// clients to start. With n > 0, exactly n AI players are added.
	AIPlayers int
}

// validate returns an error if the options are invalid.
func (opts CoordinatorOptions) validate() error {
	if opts.LobbyWait < 0 {
		return fmt.Errorf("LobbyWait must not be negative, got %v", opts.LobbyWait)
	}
	if opts.AIPlayers < AIPlayersAuto || opts.AIPlayers > MaxAIPlayers {
		return fmt.Errorf("AIPlayers must be between %d and %d, got %d", AIPlayersAuto, MaxAIPlayers, opts.AIPlayers)
	}
	return nil
}

// minRemoteClients returns the minimum number of remote clients required to
// start a game, so that the game has at least minPlayersPerGame players.
func (opts CoordinatorOptions) minRemoteClients() int {
	if opts.AIPlayers == AIPlayersAuto {
		return 1
	}
	return max(1, minPlayersPerGame-opts.AIPlayers)
}

// numAIClients returns the number of AI clients to add to a game with
// numRemoteClients remote clients.
func (opts CoordinatorOptions) numAIClients(numRemoteClients int) int {
	if opts.AIPlayers != AIPlayersAuto {
		return opts.AIPlayers
	}
	return max(1, 4-numRemoteClients)
}

// errNextClientTimeout is returned when no new client connection was made
// before timeout.
var errNextClientTimeout = errors.New("next client timeout")

// The Coordinator is responsible for connecting players to a game. Once enough
// players has been found so that a game can be created, the game coordinator
// creates and starts a new game with the given players.
//
// The lifetime of the game coordinator is not tied to a single game but rather
// the entire lifetime of the game server.
type Coordinator struct {
	logger *slog.Logger
	opts   CoordinatorOptions
	// A queue of clients that has connected and should be added to a game
	clientsCh chan Client
	// WaitGroup for games related goroutines created by the Coordinator.
	gamesWG sync.WaitGroup
}

// NewCoordinator creates a new Coordinator, using the given logger and options.
func NewCoordinator(logger *slog.Logger, opts CoordinatorOptions) (*Coordinator, error) {
	if err := opts.validate(); err != nil {
		return nil, fmt.Errorf("invalid coordinator options: %w", err)
	}
	logger = common.ModuleLogEntry(logger, "game/coordinator")
	return &Coordinator{
		logger:    logger,
		opts:      opts,
		clientsCh: make(chan Client, clientQueueSize),
	}, nil
}

// Run starts and runs the Coordinator. This method blocks until the context is cancelled or
// an error occurs, and always returns a non-nil error.
func (c *Coordinator) Run(ctx context.Context) error {
	c.logger.Info("Starting")
	err := c.run(ctx)
	c.logger.Info("Waiting for games to stop...")
	c.gamesWG.Wait()
	c.logger.Info("Stopped")
	return err
}

// AddClient takes a Client and adds it to the coordinator. This method blocks
// until the Client can be added, or the context is cancelled.
func (c *Coordinator) AddClient(ctx context.Context, client Client) error {
	select {
	case c.clientsCh <- client:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

// nextClientWithTimeout returns the next client added to clientsCh.
// Blocks for at most timeout, or until the context is canceled.
// Returns errNextClientTimeout if waiting was aborted due to timeout.
func (c *Coordinator) nextClientWithTimeout(ctx context.Context, timeout time.Duration) (Client, error) {
	t := time.NewTimer(timeout)
	defer t.Stop()
	select {
	case client := <-c.clientsCh:
		return client, nil
	case <-t.C:
		return nil, errNextClientTimeout
	case <-ctx.Done():
		return nil, ctx.Err()
	}
}

// awaitRemoteClients returns a slice of at least minNumClients and at most
// maxNumClients newly connected (remote) Clients. awaitRemoteClients does not
// return any Clients on error.
// It is responsibility of the caller to disconnect any Clients returned.
func (c *Coordinator) awaitRemoteClients(ctx context.Context, minNumClients, maxNumClients int) (clients []Client, err error) {
	clients = make([]Client, 0, maxNumClients)
	defer func() {
		if err != nil {
			disconnectAll(clients)
			clients = nil
		}
	}()
	for {
		// Wait for the next client to connect. With >= minNumClients we wait
		// for at most opts.LobbyWait.
		timeout := time.Duration(math.MaxInt64)
		timeoutExpired := false
		if len(clients) >= minNumClients {
			timeout = c.opts.LobbyWait
		}
		nextClient, err := c.nextClientWithTimeout(ctx, timeout)
		if err == nil {
			clients = clients[:len(clients)+1]
			clients[len(clients)-1] = nextClient
			c.logger.Debug("awaitClients: new client")
		} else if errors.Is(err, errNextClientTimeout) {
			timeoutExpired = true
			c.logger.Debug("awaitClients: timeout")
		} else {
			return nil, fmt.Errorf("error waiting for next client: %w", err)
		}
		// Prune disconnected clients, *then* test exit conditions.
		clients = removeDisconnected(clients)
		if len(clients) == maxNumClients || timeoutExpired && len(clients) >= minNumClients {
			break
		}
	}
	c.logger.Debug("awaitClients: done", "numClients", len(clients))
	return clients, nil
}

// run runs the main "loop" of the game coordinator. The loop waits for a group
// of remote players, creates a new games for these players, and wait for
// another group of players. This method blocks until the context is cancelled
// or an error occurs. Always returns a non-nil error.
func (c *Coordinator) run(ctx context.Context) error {
	for {
		clients, err := c.awaitRemoteClients(ctx, c.opts.minRemoteClients(), maxRemoteClientsPerGame)
		if err != nil {
			return fmt.Errorf("error awaiting remote clients: %w", err)
		}

		// Add a couple of AI clients.
		numAIClients := c.opts.numAIClients(len(clients))
		for i := 0; i < numAIClients; i++ {
			var aiClient *ai.Client
			var err error
			if i%3 == 2 {
				aiClient, err = ai.NewClient(c.logger, ai.RandomStrategy(rand.Int63n(30)+2))
			} else {
				aiClient, err = ai.NewClient(c.logger, ai.OpportunisticStrategy())
			}
			if err != nil {
				return fmt.Errorf("error creating ai client: %w", err)
			}
			clients = append(clients, aiClient)
		}

		c.logger.Debug("Starting a new game")
		err = c.startGame(ctx, clients)
		if err != nil {
			// As we still own the clients here, make sure we stop them
			// before quiting ourselves.
			disconnectAll(clients)
			return fmt.Errorf("Error starting game: %w", err)
		}
	}
}

// startGame starts a new game for the given clients. The game is run on a new
// goroutine. This method blocks until the game has been created, but not until
// it has finished running.
func (c *Coordinator) startGame(ctx context.Context, clients []Client) error {
	numClients := len(clients)
	game, err := createBasicGame(numClients)
	if err != nil {
		return fmt.Errorf("Error creating game: %w", err)
	}
	gameLoop := newGameLoop(c.logger, game)
	players := make([]*player, numClients)
	for i, p := range game.Players() {
		players[i] = &player{id: p.ID(), client: clients[i]}
	}
	ctrl, err := newController(c.logger, gameLoop, players)
	if err != nil {
		return fmt.Errorf("Error creating game controller: %w", err)
	}

	// Run a "monitoring" goroutine that disconnects all clients if all non-AI
	// clients has disconnected, to prevent AI playing against only itself.
	c.gamesWG.Add(1)
	go func() {
		defer c.gamesWG.Done()
		for _, client := range clients {
			if _, ok := client.(*ai.Client); !ok {
				<-client.DisconnectCh()
			}
		}
		disconnectAll(clients)
	}()

	// Run the game controller.
	c.gamesWG.Add(1)
	go func() {
		defer c.gamesWG.Done()
		// We create a new context that has a limited lifetime, so a game
		// cannot run forever.
		gameCtx, cancel := context.WithTimeout(ctx, maxGameDuration)
		defer cancel()
		err := ctrl.run(gameCtx)
		if err != nil {
			if errors.Is(err, context.Canceled) {
				c.logger.Debug("game stopped with ctx error", "err", err)
			} else {
				c.logger.Error("game stopped with error", "err", err)
			}
		}
		// Disconnect the clients after the game is over.
		disconnectAll(clients)
	}()
	return nil
}

// removeDisconnected removes any client that has disconnected from the
// provided clients slice.
func removeDisconnected(clients []Client) []Client {
	j := 0
	for i, client := range clients {
		select {
		case <-client.DisconnectCh():
			// Unset in backing array.
			clients[i] = nil
		default:
			clients[j] = client
			j++
		}
	}
	return clients[:j]
}

// disconnectAll calls Disconnect on each client.
func disconnectAll(clients []Client) {
	for _, c := range clients {
		c.Disconnect()
	}
}
