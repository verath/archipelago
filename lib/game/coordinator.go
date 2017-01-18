package game

import (
	"context"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/network"
	"sync"
	"time"
)

const (
	// A timeout for the maximum length of a game before it is force-closed.
	// Used so that a client leaving a game open will not keep it resources
	// allocated forever.
	GameMaxDuration time.Duration = 45 * time.Minute
)

// The game coordinator is responsible for connecting players to
// a game. Once enough players has been found so that a game can
// be created, the game coordinator creates and starts a new game
// with the given players.
//
// The lifetime of the game coordinator is not tied to a single
// game but rather the entire lifetime of the game server.
type Coordinator struct {
	logEntry       *logrus.Entry
	clientProvider ClientProvider
	// WaitGroup for games created by the Coordinator
	gamesWG sync.WaitGroup
}

func NewCoordinator(log *logrus.Logger, clientProvider ClientProvider) (*Coordinator, error) {
	logEntry := common.ModuleLogEntry(log, "game/coordinator")
	return &Coordinator{
		logEntry:       logEntry,
		clientProvider: clientProvider,
	}, nil
}

func (c *Coordinator) Run(ctx context.Context) error {
	c.logEntry.Info("Starting")
	err := c.run(ctx)
	c.logEntry.Debug("Waiting for games to stop...")
	c.gamesWG.Wait()
	c.logEntry.Info("Stopped")
	return err
}

// Waits for two player connections to be made. If successful, the methods
// returns two started clients. These clients *must* be stopped. If the
// method returns an error the clients can be assumed to be stopped.
func (c *Coordinator) waitForClients(ctx context.Context) (network.Client, network.Client, error) {
	p1Client, err := c.clientProvider.NextClient(ctx)
	if err != nil {
		return nil, nil, err
	}
	p1Client.Start()

	for {
		p2Client, err := c.clientProvider.NextClient(ctx)
		if err != nil {
			p1Client.Disconnect()
			return nil, nil, err
		}
		p2Client.Start()

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
		p1Client, p2Client, err := c.waitForClients(ctx)
		if err != nil {
			return fmt.Errorf("Error waiting for players: %v", err)
		}

		c.logEntry.Debug("Starting a new game")
		err = c.startGame(ctx, p1Client, p2Client)
		if err != nil {
			// As we still own the clients here, make sure we stop them
			// before quiting ourselves
			p1Client.Disconnect()
			p2Client.Disconnect()
			return fmt.Errorf("Error starting game: %v", err)
		}
	}
}

// Starts a new game for the two clients. The game is run on a new goroutine.
// This method blocks until the game has been created, but not until it has
// finished running.
func (c *Coordinator) startGame(ctx context.Context, p1Client, p2Client network.Client) error {
	game, err := model.CreateBasicGame()
	if err != nil {
		return fmt.Errorf("Error creating game: %v", err)
	}
	ctrl, err := newController(c.logEntry.Logger, game, p1Client, p2Client)
	if err != nil {
		return fmt.Errorf("Error creating game controller: %v", err)
	}

	// We create a new context that has a limited lifetime, so a game
	// cannot run forever.
	gameCtx, cancel := context.WithTimeout(ctx, GameMaxDuration)
	c.gamesWG.Add(1)
	go func() {
		defer c.gamesWG.Done()
		err := ctrl.Run(gameCtx)
		if err != nil && err != ErrGameOver && err != context.Canceled {
			c.logEntry.WithError(err).Error("Game stopped with an error")
		}
		cancel()
	}()
	return nil
}
