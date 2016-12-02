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
	"github.com/verath/archipelago/lib/transformer"
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

	gameLoop   *gameLoop
	p1ActTrans *transformer.PlayerActionTransformer
	p2ActTrans *transformer.PlayerActionTransformer

	p1Conn network.PlayerConn
	p2Conn network.PlayerConn
}

func (gm *gameManager) eventLoop(ctx context.Context, eventCh <-chan event.Event) error {
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case evt, ok := <-eventCh:
			if !ok {
				return errors.New("eventCh closed")
			}
			go gm.p1Conn.OnEvent(evt)
			go gm.p2Conn.OnEvent(evt)
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
	p1ActionCh := make(chan network.PlayerAction, 0)
	p2ActionCh := make(chan network.PlayerAction, 0)

	// Connect the player action channels to the player connections
	gm.p1Conn.AddActionListener(p1ActionCh)
	gm.p2Conn.AddActionListener(p2ActionCh)
	defer gm.p1Conn.RemoveActionListener(p1ActionCh)
	defer gm.p2Conn.RemoveActionListener(p2ActionCh)

	// Start the action transformer for player 1
	wg.Add(1)
	go func() {
		err := gm.p1ActTrans.Run(ctx, p1ActionCh, actionCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("p1ActTrans quit")
		}
		cancel()
		wg.Done()
	}()

	// Start the action transformer for player 2
	wg.Add(1)
	go func() {
		err := gm.p2ActTrans.Run(ctx, p2ActionCh, actionCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("p2ActTrans quit")
		}
		cancel()
		wg.Done()
	}()

	// Spawn an event dispatcher loop
	wg.Add(1)
	go func() {
		err := gm.eventLoop(ctx, eventCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Errorf("eventLoop quit: %v", err)
		}
		cancel()
		wg.Done()
	}()

	// Run the game logic loop
	wg.Add(1)
	go func() {
		err := gm.gameLoop.Run(ctx, actionCh, eventCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Errorf("gameLoop.Run quit: %v", err)
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
	p1ActTrans, err := transformer.NewPlayerActionTransformer(game.Player1())
	if err != nil {
		return nil, fmt.Errorf("Error creating player transformer: %v", err)
	}
	p2ActTrans, err := transformer.NewPlayerActionTransformer(game.Player2())
	if err != nil {
		return nil, fmt.Errorf("Error creating player transformer: %v", err)
	}

	return &gameManager{
		log:        log,
		gameLoop:   gameLoop,
		p1ActTrans: p1ActTrans,
		p2ActTrans: p2ActTrans,
		p1Conn:     p1Conn,
		p2Conn:     p2Conn,
	}, nil
}
