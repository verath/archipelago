package game

import (
	"context"
	"sync"
	"time"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"github.com/verath/archipelago/lib/common"
)

const (
	// A timeout for the maximum length of a game before it is force-closed.
	// Used so that a client leaving a game open will not keep its resources
	// allocated forever.
	maxGameDuration time.Duration = 45 * time.Minute

	// The max number of clients in the client queue
	// TODO(2017-01-13): What is an appropriate number here?
	clientQueueSize = 2
)

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
	// WaitGroup for games created by the Coordinator
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
	c.logEntry.Debug("Waiting for games to stop...")
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

// nextClient returns a Client from the clientsCh. This method blocks
// until a Client can be retrieved or the context is cancelled.
func (c *Coordinator) nextClient(ctx context.Context) (Client, error) {
	select {
	case client := <-c.clientsCh:
		return client, nil
	case <-ctx.Done():
		return nil, ctx.Err()
	}
}

// awaitClients blocks until numClients Client connections has been made,
// returning a slice of the connected Clients. It is the callers responsibility
// to disconnect any clients returned. awaitClients does not return any clients
// on error.
func (c *Coordinator) awaitClients(ctx context.Context, numClients int) ([]Client, error) {
	clients := make([]Client, 0, numClients)
	for len(clients) < numClients {
		// Wait for the next client to connect.
		newClient, err := c.nextClient(ctx)
		if err != nil {
			disconnectAll(clients)
			return nil, errors.Wrap(err, "error awaiting next client")
		}
		clients = clients[:len(clients)+1]
		clients[len(clients)-1] = newClient
		// Remove any client that disconnected.
		i := 0
		for _, client := range clients {
			select {
			case <-client.DisconnectCh():
			default:
				clients[i] = client
				i++
			}
		}
		clients = clients[:i]
	}
	return clients, nil
}

// run runs the main "loop" of the game coordinator. The loop waits for
// two players, creates a new games for these players, and wait for another
// pair of players. This method blocks until the context is cancelled or
// an error occurs. Always returns a non-nil error.
func (c *Coordinator) run(ctx context.Context) error {
	clientsPerGame := 2
	for {
		clients, err := c.awaitClients(ctx, clientsPerGame)
		if err != nil {
			return errors.Wrap(err, "Error when awaiting clients")
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

// disconnectAll calls Disconnect on each client.
func disconnectAll(clients []Client) {
	for _, c := range clients {
		c.Disconnect()
	}
}
