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

type gameManager struct {
	log *logrus.Logger
}

func (gm *gameManager) playerActionLoop(ctx context.Context, pConn network.PlayerConn, playerId model.PlayerID, actionCh chan<- action.Action) error {
	for {
		var playerAction network.PlayerAction
		var ok bool
		// Get the next action from the player connection
		select {
		case <-ctx.Done():
			return ctx.Err()
		case playerAction, ok = <-pConn.ActionChannel():
			if !ok {
				return errors.New("player connection action channel closed")
			}
		}
		// Transform it into a model action by applying the player id
		// assigned to the connection
		act := playerAction.ToAction(playerId)
		// Queue the action to be performed on the model
		select {
		case <-ctx.Done():
			return ctx.Err()
		case actionCh <- act:
		}
	}
}

func (gm *gameManager) eventLoop(ctx context.Context, p1Conn, p2Conn network.PlayerConn, eventCh <-chan event.Event) error {
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case evt, ok := <-eventCh:
			if !ok {
				return errors.New("eventCh closed")
			}
			go p1Conn.OnEvent(evt)
			go p2Conn.OnEvent(evt)
		}
	}
}

func (gm *gameManager) createGame() (*model.Game, error) {
	p1, err := model.NewPlayer("player1")
	if err != nil {
		return nil, fmt.Errorf("Error creating player: %v", err)
	}
	p2, err := model.NewPlayer("player2")
	if err != nil {
		return nil, fmt.Errorf("Error creating player: %v", err)
	}

	p1Island := model.NewIsland(p1, 10, 5.0*time.Second)
	p2Island := model.NewIsland(p2, 10, 5.0*time.Second)
	neIsland := model.NewIsland(nil, 10, 5.0*time.Second)

	board := model.NewBoard(model.Coordinate{10, 10})
	board.AddIsland(model.Coordinate{0, 0}, *p1Island)
	board.AddIsland(model.Coordinate{9, 9}, *p2Island)
	board.AddIsland(model.Coordinate{4, 4}, *neIsland)

	game := model.NewGame(*p1, *p2, *board)
	return game, nil
}

func (gm *gameManager) RunGame(ctx context.Context, p1Conn, p2Conn network.PlayerConn) error {
	logEntry := logutil.ModuleEntryWithID(gm.log, "gameManager")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	// TODO: This method is kinda large...

	// We don't want games to stay around forever
	ctx, cancel := context.WithTimeout(ctx, DefaultGameTimeout)

	game, err := gm.createGame()
	if err != nil {
		return err
	}
	player1ID := game.Player1().ID()
	player2ID := game.Player2().ID()
	gameLoop := newGameLoop(gm.log, game)
	actionCh := make(chan action.Action, 0)
	eventCh := make(chan event.Event, 0)
	var wg sync.WaitGroup

	// Spawn an action "transformer" loop for each player
	wg.Add(2)
	go func() {
		err := gm.playerActionLoop(ctx, p1Conn, player1ID, actionCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Errorf("playerActionLoop[id:%s] quit: %v", player1ID, err)
		}
		cancel()
		wg.Done()
	}()
	go func() {
		err := gm.playerActionLoop(ctx, p2Conn, player2ID, actionCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Errorf("playerActionLoop[id:%s] quit: %v", player2ID, err)
		}
		cancel()
		wg.Done()
	}()

	// Spawn an event dispatcher loop
	wg.Add(1)
	go func() {
		err := gm.eventLoop(ctx, p1Conn, p2Conn, eventCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Errorf("eventLoop quit: %v", err)
		}
		cancel()
		wg.Done()
	}()

	// Run the game logic loop
	wg.Add(1)
	go func() {
		err := gameLoop.Run(ctx, actionCh, eventCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Errorf("gameLoop.Run quit: %v", err)
		}
		cancel()
		wg.Done()
	}()

	wg.Wait()
	// TODO: return errors?
	return nil
}

func newGameManager(log *logrus.Logger) *gameManager {
	return &gameManager{
		log: log,
	}
}
