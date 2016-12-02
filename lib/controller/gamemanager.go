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
}

func (gm *gameManager) playerActionLoop(ctx context.Context, pConn network.PlayerConn, playerId model.PlayerID, actionCh chan<- action.Action) error {
	playerActionCh := make(chan network.PlayerAction, 0)
	pConn.AddActionListener(playerActionCh)
	defer pConn.RemoveActionListener(playerActionCh)

	for {
		var playerAction network.PlayerAction
		var ok bool
		// Get the next action from the player connection
		select {
		case <-ctx.Done():
			return ctx.Err()
		case playerAction, ok = <-playerActionCh:
			if !ok {
				return errors.New("playerActionCh closed")
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

func createPlayers() (p1 *model.Player, p2 *model.Player, pn *model.Player, err error) {
	p1, err = model.NewPlayer("player1")
	if err != nil {
		err = fmt.Errorf("Error creating p1: %v", err)
	}
	p2, err = model.NewPlayer("player2")
	if err != nil {
		err = fmt.Errorf("Error creating p2: %v", err)
	}
	pn, err = model.NewPlayer("neutral")
	if err != nil {
		err = fmt.Errorf("Error creating pn: %v", err)
	}
	return
}

func createGame() (*model.Game, error) {
	p1, p2, pn, err := createPlayers()
	if err != nil {
		return nil, fmt.Errorf("Error creating players: %v", err)
	}

	p1Island := model.NewIsland(p1, 10, 5.0*time.Second)
	p2Island := model.NewIsland(p2, 10, 5.0*time.Second)
	neIsland := model.NewIsland(pn, 10, 5.0*time.Second)

	board := model.NewBoard(model.Coordinate{10, 10})
	board.SetIsland(model.Coordinate{0, 0}, p1Island)
	board.SetIsland(model.Coordinate{9, 9}, p2Island)
	board.SetIsland(model.Coordinate{4, 4}, neIsland)

	game := model.NewGame(p1, p2, pn, board)
	return game, nil
}

func (gm *gameManager) RunGame(ctx context.Context, p1Conn, p2Conn network.PlayerConn) error {
	logEntry := logutil.ModuleEntryWithID(gm.log, "gameManager")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	// TODO: This method is kinda large...

	// We don't want games to stay around forever
	game, err := createGame()
	if err != nil {
		return err
	}

	var wg sync.WaitGroup
	ctx, cancel := context.WithTimeout(ctx, DefaultGameTimeout)
	player1ID := game.Player1().ID()
	player2ID := game.Player2().ID()
	gameLoop := newGameLoop(gm.log, game)
	actionCh := make(chan action.Action, 0)
	eventCh := make(chan event.Event, 0)

	// Spawn an action "forwarder" loop for each player
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
