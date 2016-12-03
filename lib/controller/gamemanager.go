package controller

import (
	"context"
	"errors"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/event"
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

func (gm *gameManager) runPlayerProxies(ctx context.Context, actionCh chan<- action.Action) error {
	ctx, cancel := context.WithCancel(ctx)
	errCh := make(chan error, 0)

	go func() {
		errCh <- gm.p1Proxy.Run(ctx, actionCh)
	}()
	go func() {
		errCh <- gm.p2Proxy.Run(ctx, actionCh)
	}()
	err := <-errCh
	cancel()
	<-errCh
	return err
}

func (gm *gameManager) eventDispatch(ctx context.Context, eventCh <-chan event.Event) error {
	errCh := make(chan error, 0)
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case evt, ok := <-eventCh:
			if !ok {
				return errors.New("eventCh closed")
			}

			// TODO: should delivery order be fixed?
			go func() {
				errCh <- gm.p1Proxy.OnEvent(evt)
			}()
			go func() {
				errCh <- gm.p2Proxy.OnEvent(evt)
			}()
			err1 := <-errCh
			err2 := <-errCh
			if err1 != nil {
				return err1
			}
			if err2 != nil {
				return err2
			}
		}
	}
}

func (gm *gameManager) RunGame(ctx context.Context) error {
	// TODO: ensure not running
	logEntry := logutil.ModuleEntryWithID(gm.log, "gameManager")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	var wg sync.WaitGroup
	ctx, cancel := context.WithTimeout(ctx, DefaultGameTimeout)

	actionCh := make(chan action.Action, 0)
	eventCh := make(chan event.Event, 0)

	// Run the player proxies
	wg.Add(1)
	go func() {
		err := gm.runPlayerProxies(ctx, actionCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("Player proxy quit")
		}
		cancel()
		wg.Done()
	}()

	// Spawn an event dispatcher loop
	wg.Add(1)
	go func() {
		err := gm.eventDispatch(ctx, eventCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("eventLoop quit")
		}
		cancel()
		wg.Done()
	}()

	// Run the game logic loop
	wg.Add(1)
	go func() {
		err := gm.gameLoop.Run(ctx, actionCh, eventCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("gameLoop quit")
		}
		cancel()
		wg.Done()
	}()

	wg.Wait()
	return nil
}

func newGameManager(log *logrus.Logger, game *model.Game, p1Conn, p2Conn network.PlayerConn) (*gameManager, error) {
	gameLoop, err := newGameLoop(log, game)
	if err != nil {
		return nil, fmt.Errorf("Error creating gameLoop: %v", err)
	}
	p1Proxy, err := newPlayerProxy(game.Player1(), p1Conn)
	if err != nil {
		return nil, fmt.Errorf("Error creating player1 proxy: %v", err)
	}
	p2Proxy, err := newPlayerProxy(game.Player2(), p2Conn)
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
