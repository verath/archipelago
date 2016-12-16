package controller

import (
	"context"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/util"
	"time"
)

const (
	// A timeout for the maximum length of a game before it is force-closed.
	// Used so that a client leaving a game open will not keep it resources
	// allocated forever.
	DefaultGameTimeout time.Duration = 45 * time.Minute
)

// The game manager represents a single game. It starts and
// handles communication between the game loop and the
// player connections.
type gameManager struct {
	logEntry *logrus.Entry

	gameLoop *gameLoop
	p1Proxy  *playerProxy
	p2Proxy  *playerProxy
}

// eventLoop reads from the eventCh and forwards each event to both
// of the player proxies. Blocks until an error occurs or the context
// is canceled. Always returns a non-nil error.
func (gm *gameManager) eventLoop(ctx context.Context) error {
	for {
		evt, err := gm.gameLoop.NextEvent(ctx)
		if err != nil {
			return err
		}
		if err := gm.p1Proxy.SendEvent(ctx, evt); err != nil {
			return err
		}
		if err := gm.p2Proxy.SendEvent(ctx, evt); err != nil {
			return err
		}
	}
}

// playerActionLoop is a helper method for reading actions from one player
// and sending them to the actionCh. Blocks until an error occurs or the context
// is canceled. Always returns a non-nil error.
func (gm *gameManager) playerActionLoop(ctx context.Context, proxy *playerProxy, actionCh chan<- action.Action) error {
	for {
		act, err := proxy.NextAction(ctx)
		if err != nil {
			return err
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		case actionCh <- act:
		}
	}
}

// The actionLoop takes actions from both players and forwards them
// to the gameLoop. Blocks until an error occurs or the context
// is canceled. Always returns a non-nil error.
func (gm *gameManager) actionLoop(ctx context.Context) error {
	ctx, cancel := context.WithCancel(ctx)
	actionCh := make(chan action.Action)
	errCh := make(chan error)

	// Spawn a action reading loop for each player, both broadcasting
	// new actions to a shared actionCh channel.
	go func() {
		errCh <- gm.playerActionLoop(ctx, gm.p1Proxy, actionCh)
	}()
	go func() {
		errCh <- gm.playerActionLoop(ctx, gm.p2Proxy, actionCh)
	}()

	// Read actions from the actionCh channel and forward them to the
	// gameLoop, adding them to the game.
	for {
		select {
		case err := <-errCh:
			cancel()
			<-errCh
			return fmt.Errorf("Error during playerActionLoop: %v", err)
		case act := <-actionCh:
			if err := gm.gameLoop.AddAction(ctx, act); err != nil {
				return fmt.Errorf("Error adding action to gameLoop: %v", err)
			}
		}
	}
}

// Run starts the game manager, in turn starting the gameLoop
// and makes the game manager start listening for player actions.
// Blocks until an error occurs or the context is canceled.
// Always returns a non-nil error.
func (gm *gameManager) Run(ctx context.Context) error {
	gm.logEntry.Debug("Starting")
	defer gm.logEntry.Debug("Stopped")

	// We set a timeout here so games cannot run forever.
	ctx, _ = context.WithTimeout(ctx, DefaultGameTimeout)
	return util.RunWithContext(ctx,
		gm.eventLoop,
		gm.actionLoop,
		gm.gameLoop.Run,
	)
}

func newGameManager(log *logrus.Logger, gameLoop *gameLoop, p1Proxy, p2Proxy *playerProxy) (*gameManager, error) {
	logEntry := util.ModuleLogEntryWithID(log, "gameManager")

	return &gameManager{
		logEntry: logEntry,
		gameLoop: gameLoop,
		p1Proxy:  p1Proxy,
		p2Proxy:  p2Proxy,
	}, nil
}
