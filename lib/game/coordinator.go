package game

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/common"
	"sync"
	"time"
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
	clientsCh chan client
	// WaitGroup for games created by the Coordinator
	gamesWG sync.WaitGroup
}

// NewCoordinator creates a new Coordinator, using the given logger.
func NewCoordinator(log *logrus.Logger) (*Coordinator, error) {
	logEntry := common.ModuleLogEntry(log, "game/coordinator")
	return &Coordinator{
		logEntry:  logEntry,
		clientsCh: make(chan client, clientQueueSize),
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

// AddClient takes a client and adds it to the coordinator. This method blocks
// until the client can be added, or the context is cancelled.
func (c *Coordinator) AddClient(ctx context.Context, client client) error {
	select {
	case c.clientsCh <- client:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

// nextClient returns a client from the clientsCh. This method blocks
// until a client can be retrieved or the context is cancelled.
func (c *Coordinator) nextClient(ctx context.Context) (client, error) {
	select {
	case client := <-c.clientsCh:
		return client, nil
	case <-ctx.Done():
		return nil, ctx.Err()
	}
}

// awaitClients waits for two player connections to be made. If successful, the
// methods returns two started clients. These clients *must* be stopped. If the
// method returns an error the clients can be assumed to be stopped.
func (c *Coordinator) awaitClients(ctx context.Context) (client, client, error) {
	p1Client, err := c.nextClient(ctx)
	if err != nil {
		return nil, nil, errors.Wrap(err, "Error when getting a Client")
	}
	for {
		p2Client, err := c.nextClient(ctx)
		if err != nil {
			p1Client.Disconnect()
			return nil, nil, errors.Wrap(err, "Error when getting a Client")
		}
		select {
		case <-p1Client.DisconnectCh():
			// p1 disconnected while waiting for p2. Set p1=p2
			// and find a new p2.
			p1Client = p2Client
		default:
			return p1Client, p2Client, nil
		}
	}
}

// run runs the main "loop" of the game coordinator. The loop waits for
// two players, creates a new games for these players, and wait for another
// pair of players. This method blocks until the context is cancelled or
// an error occurs. Always returns a non-nil error.
func (c *Coordinator) run(ctx context.Context) error {
	for {
		p1Client, p2Client, err := c.awaitClients(ctx)
		if err != nil {
			return errors.Wrap(err, "Error when awaiting clients")
		}

		c.logEntry.Debug("Starting a new game")
		err = c.startGame(ctx, p1Client, p2Client)
		if err != nil {
			// As we still own the clients here, make sure we stop them
			// before quiting ourselves
			p1Client.Disconnect()
			p2Client.Disconnect()
			return errors.Wrap(err, "Error starting game")
		}
	}
}

// startGame starts a new game for the two clients. The game is run on a new goroutine.
// This method blocks until the game has been created, but not until it has finished
// running.
func (c *Coordinator) startGame(ctx context.Context, p1Client client, p2Client client) error {
	game, err := createBasicGame()
	if err != nil {
		return errors.Wrap(err, "Error creating game")
	}
	ctrl, err := newController(c.logEntry.Logger, game, p1Client, p2Client)
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
		if err != nil && errors.Cause(err) != context.Canceled {
			c.logEntry.Errorf("Game stopped with an error: %+v", err)
		}
		// Disconnect the clients after the game is over
		p1Client.Disconnect()
		p2Client.Disconnect()
	}()
	return nil
}
