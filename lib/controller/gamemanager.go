package controller

import (
	"context"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/logutil"
	"github.com/verath/archipelago/lib/model"
	"github.com/verath/archipelago/lib/network"
	"sync"
	"time"
)

const (
	DefaultGameTimeout time.Duration = 45 * time.Minute
)

// The game manager represents a single game. It handles communication
// between the game loop and the player connections. For actions
// sent by a player connection, the game manager also sets the appropriate
// sender (as a player in the model).
type gameManager struct {
	log *logrus.Logger

	gameLoop *gameLoop
	p1Proxy  *playerProxy
	p2Proxy  *playerProxy
}

// eventLoop reads from the eventCh and forwards each event to both
// of the player proxies. Blocks until the eventCh is closed or the
// context is cancelled.
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

func (gm *gameManager) actionLoop(ctx context.Context) error {
	ctx, cancel := context.WithCancel(ctx)
	actionCh := make(chan action.Action)
	errCh := make(chan error)

	go func() {
		errCh <- gm.playerActionLoop(ctx, gm.p1Proxy, actionCh)
	}()
	go func() {
		errCh <- gm.playerActionLoop(ctx, gm.p2Proxy, actionCh)
	}()

	for {
		select {
		case err := <-errCh:
			cancel()
			<-errCh
			return fmt.Errorf("Error during playerActionLoop: %v", err)
		case act := <-actionCh:
			err := gm.gameLoop.AddAction(ctx, act)
			if err != nil {
				return fmt.Errorf("Error adding action to gameLoop: %v", err)
			}
		}
	}
}

func (gm *gameManager) RunGame(ctx context.Context) error {
	logEntry := logutil.ModuleEntryWithID(gm.log, "gameManager")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	var wg sync.WaitGroup
	ctx, cancel := context.WithTimeout(ctx, DefaultGameTimeout)

	// Spawn an event dispatcher loop
	wg.Add(1)
	go func() {
		err := gm.eventLoop(ctx)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("Event dispatch quit")
		}
		cancel()
		wg.Done()
	}()

	// Spawn an action dispatcher loop
	wg.Add(1)
	go func() {
		err := gm.actionLoop(ctx)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("Event dispatch quit")
		}
		cancel()
		wg.Done()
	}()

	// Run the game logic loop
	wg.Add(1)
	go func() {
		err := gm.gameLoop.Run(ctx)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("Game loop quit")
		}
		logEntry.Debug("Game loop quit")
		cancel()
		wg.Done()
	}()

	wg.Wait()
	return nil
}

func newGameManager(log *logrus.Logger, game *model.Game, p1Client, p2Client *network.Client) (*gameManager, error) {
	gameLoop, err := newGameLoop(log, game)
	if err != nil {
		return nil, fmt.Errorf("Error creating gameLoop: %v", err)
	}

	p1Proxy, err := newPlayerProxy(game.Player1(), p1Client)
	if err != nil {
		return nil, fmt.Errorf("Error creating player1 proxy: %v", err)
	}

	p2Proxy, err := newPlayerProxy(game.Player2(), p2Client)
	if err != nil {
		return nil, fmt.Errorf("Error creating player2 proxy: %v", err)
	}

	return &gameManager{
		log:      log,
		gameLoop: gameLoop,
		p1Proxy:  p1Proxy,
		p2Proxy:  p2Proxy,
	}, nil
}
