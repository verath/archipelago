package game

import (
	"context"
	"math"
	"math/rand"
	"sync"
	"time"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/ai"
)

const (
	// A timeout for the maximum length of a game before it is force-closed.
	// Used so that a client leaving a game open will not keep its resources
	// allocated forever.
	maxGameDuration time.Duration = 45 * time.Minute

	// The max number of clients in the client queue
	// TODO(2017-01-13): What is an appropriate number here?
	clientQueueSize = 2

	// additionalClientsTimeout is the time that we wait for new clients when
	// we have the minimum required clients connected to start a new game.
	additionalClientsTimeout = 8 * time.Second
)

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
	logEntry *logrus.Entry
	// A queue of clients that has connected and should be added to a game
	clientsCh chan Client
	// WaitGroup for games related goroutines created by the Coordinator.
	gamesWG sync.WaitGroup
}

// NewCoordinator creates a new Coordinator, using the given logger.
func NewCoordinator(log *logrus.Logger) (*Coordinator, error) {
	logEntry := common.ModuleLogEntry(log, "game/coordinator")
	return &Coordinator{
		logEntry:  logEntry,
		clientsCh: make(chan Client, clientQueueSize),
	}, nil
}

// Run starts and runs the Coordinator. This method blocks until the context is cancelled or
// an error occurs, and always returns a non-nil error.
func (c *Coordinator) Run(ctx context.Context) error {
	c.logEntry.Info("Starting")
	err := c.run(ctx)
	c.logEntry.Info("Waiting for games to stop...")
	c.gamesWG.Wait()
	c.logEntry.Info("Stopped")
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
		// for at most additionalClientsTimeout.
		timeout := time.Duration(math.MaxInt64)
		timeoutExpired := false
		if len(clients) >= minNumClients {
			timeout = additionalClientsTimeout
		}
		nextClient, err := c.nextClientWithTimeout(ctx, timeout)
		if err == nil {
			clients = clients[:len(clients)+1]
			clients[len(clients)-1] = nextClient
			c.logEntry.Debug("awaitClients: new client")
		} else if errors.Cause(err) == errNextClientTimeout {
			timeoutExpired = true
			c.logEntry.Debug("awaitClients: timeout")
		} else {
			return nil, errors.Wrap(err, "error waiting for next client")
		}
		// Prune disconnected clients, *then* test exit conditions.
		clients = removeDisconnected(clients)
		if len(clients) == maxNumClients || timeoutExpired && len(clients) >= minNumClients {
			break
		}
	}
	c.logEntry.WithField("numClients", len(clients)).Debug("awaitClients: done")
	return clients, nil
}

// run runs the main "loop" of the game coordinator. The loop waits for a group
// of remote players, creates a new games for these players, and wait for
// another group of players. This method blocks until the context is cancelled
// or an error occurs. Always returns a non-nil error.
func (c *Coordinator) run(ctx context.Context) error {
	minRemoteClientsPerGame := 1
	maxRemoteClientsPerGame := 10
	for {
		clients, err := c.awaitRemoteClients(ctx, minRemoteClientsPerGame, maxRemoteClientsPerGame)
		if err != nil {
			return errors.Wrap(err, "error awaiting remote clients")
		}

		// Add a couple of AI clients.
		numAIClients := 4 - len(clients)
		if numAIClients <= 0 {
			numAIClients = 1
		}
		for i := 0; i < numAIClients; i++ {
			var aiClient *ai.Client
			var err error
			if i%2 == 0 {
				aiClient, err = ai.NewClient(c.logEntry.Logger, ai.OpportunisticStrategy())
			} else {
				aiClient, err = ai.NewClient(c.logEntry.Logger, ai.RandomStrategy(rand.Int63n(30)+2))
			}
			if err != nil {
				return errors.Wrap(err, "error creating ai client")
			}
			clients = append(clients, aiClient)
		}

		c.logEntry.Debug("Starting a new game")
		err = c.startGame(ctx, clients)
		if err != nil {
			// As we still own the clients here, make sure we stop them
			// before quiting ourselves.
			disconnectAll(clients)
			return errors.Wrap(err, "Error starting game")
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
		return errors.Wrap(err, "Error creating game")
	}
	gameLoop, err := newGameLoop(c.logEntry.Logger, game)
	if err != nil {
		return errors.Wrap(err, "Error creating gameLoop")
	}
	playerProxies := make([]*playerProxy, numClients)
	for i, player := range game.Players() {
		playerProxies[i], err = newPlayerProxy(player, clients[i])
		if err != nil {
			return errors.Wrapf(err, "error creating player proxy")
		}
	}
	ctrl, err := newController(c.logEntry.Logger, gameLoop, playerProxies)
	if err != nil {
		return errors.Wrap(err, "Error creating game controller")
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
			if errors.Cause(err) == context.Canceled {
				c.logEntry.Debugf("game stopped with ctx error: %v", err)
			} else {
				c.logEntry.Errorf("game stopped with error: %+v", err)
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
