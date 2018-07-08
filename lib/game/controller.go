package game

import (
	"context"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/model"
	"sync"
)

// The game controller represents a single game. It starts and handles
// communication between the game loop and the player proxies.
type controller struct {
	logEntry *logrus.Entry

	gameLoop *gameLoop

	playersMu sync.RWMutex
	// players is a list of players that the controller reads actions
	// from, and sends event to. This list may shrink while the game
	// is running due to players leaving.
	players []*playerProxy
}

// newController creates a new game controller.
func newController(log *logrus.Logger, gameLoop *gameLoop, players ... *playerProxy) (*controller, error) {
	logEntry := common.ModuleLogEntryWithID(log, "game/controller")
	if len(players) == 0 {
		return nil, errors.New("there must be at least one player")
	}
	return &controller{
		logEntry: logEntry,
		gameLoop: gameLoop,
		players:  players,
	}, nil
}

// run starts the game controller, in turn starting the gameLoop and makes
// the game controller start listening for player actions. Blocks until an
// error occurs, the context is canceled, or the game is successfully finished.
func (ctrl *controller) run(ctx context.Context) error {
	ctrl.logEntry.Debug("Starting")
	defer ctrl.logEntry.Debug("Stopped")

	// Notify the players that the game is starting
	startEvt := &model.EventGameStart{TickInterval: ctrl.gameLoop.tickInterval}
	if err := ctrl.broadcastEvent(ctx, startEvt); err != nil {
		return errors.Wrap(err, "Could not broadcast game starting event")
	}
	// Register ourselves as the eventHandler of the game loop
	ctrl.gameLoop.SetEventHandler(ctrl)
	defer ctrl.gameLoop.SetEventHandler(nil)

	// Start the action forwarding loop and the game loop
	ctx, cancel := context.WithCancel(ctx)
	errCh := make(chan error)
	go func() {
		err := ctrl.actionLoop(ctx)
		errCh <- errors.Wrap(err, "error in actionLoop")
	}()
	go func() {
		err := ctrl.gameLoop.Run(ctx)
		errCh <- errors.Wrap(err, "error in gameLoop")
	}()
	err := <-errCh
	cancel()
	<-errCh
	return err
}

// broadcastEvent broadcast an event to all players simultaneously. Blocks until
// all events have been sent. broadcastEvent return an error if any write to a
// player failed.
func (ctrl *controller) broadcastEvent(ctx context.Context, evt model.Event) error {
	ctrl.playersMu.RLock()
	players := make([]*playerProxy, len(ctrl.players))
	copy(players, ctrl.players)
	ctrl.playersMu.RUnlock()

	errCh := make(chan error)
	for _, player := range players {
		go func(player *playerProxy) {
			errCh <- player.WriteEvent(ctx, evt)
		}(player)
	}
	// Wait for all writes to finish, return first error (if any)
	var err error
	for range players {
		if err2 := <-errCh; err == nil {
			err = err2
		}
	}
	return errors.Wrapf(err, "failed broadcasting event of type: %T", evt)
}

// handleEvent forwards the event to all players, and blocks until the event
// has been successfully sent. Called by the gameLoop for each event produced.
func (ctrl *controller) handleEvent(ctx context.Context, evt model.Event) {
	if err := ctrl.broadcastEvent(ctx, evt); err != nil {
		ctrl.logEntry.Debugf("Error in handleEvent: %+v", err)
	}
}

// playerActionLoop is a helper method for reading actions from one player
// and sending them to the actionCh. Blocks until an error occurs or the
// context is canceled. Always returns a non-nil error.
func (ctrl *controller) playerActionLoop(ctx context.Context, player *playerProxy, actionCh chan<- model.Action) error {
	for {
		act, err := player.ReadAction(ctx)
		if err != nil {
			return errors.Wrap(err, "could not read action from player")
		}
		select {
		case actionCh <- act:
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

// removePlayer removes the given player from the controller, making
// it no longer part of the players receiving game events. Returns
// an error if the player could not be found.
func (ctrl *controller) removePlayer(playerToRemove *playerProxy) error {
	ctrl.playersMu.Lock()
	defer ctrl.playersMu.Unlock()
	for i, player := range ctrl.players {
		if player == playerToRemove {
			ctrl.players[i] = ctrl.players[len(ctrl.players)-1]
			ctrl.players[len(ctrl.players)-1] = nil
			ctrl.players = ctrl.players[:len(ctrl.players)-1]
			return nil
		}
	}
	return errors.New("tried to remove player that did not exist")
}

// The actionLoop takes actions from all players and forwards them
// to the gameLoop. If reading actions from a player fails, that
// player is removed from the controller. actionLoop blocks until
// the context is cancelled or an error occurs.
func (ctrl *controller) actionLoop(ctx context.Context) error {
	// A struct holding both an error and the proxy in which the error occurred,
	// used so we can share the handling of the error
	type actionLoopError struct {
		error  error
		player *playerProxy
	}
	ctx, cancel := context.WithCancel(ctx)
	actionCh := make(chan model.Action)
	actionErrCh := make(chan actionLoopError)

	// Spawn an action reading loop for each player, each broadcasting
	// new actions to a shared actionCh channel.
	for _, player := range ctrl.players {
		go func(player *playerProxy) {
			err := ctrl.playerActionLoop(ctx, player, actionCh)
			actionErrCh <- actionLoopError{err, player}
		}(player)
	}

	// Read actions from the actionCh channel and forward them to the gameLoop,
	// which applies them to the game. If an error is posted on the errCh,
	// then a player leave action is created for that player and the player is
	// removed from the controller.
	remainingPlayers := len(ctrl.players)
	var err error
	for err == nil {
		select {
		case act := <-actionCh:
			ctrl.gameLoop.AddAction(act)
		case actLoopErr := <-actionErrCh:
			remainingPlayers -= 1
			if removeErr := ctrl.removePlayer(actLoopErr.player); removeErr != nil {
				err = errors.Wrap(removeErr, "could not remove player")
				break
			}
			leavePlayerAct := &model.PlayerActionLeave{}
			leaveAct := leavePlayerAct.ToAction(actLoopErr.player.playerID)
			ctrl.gameLoop.AddAction(leaveAct)
			ctrl.logEntry.WithFields(logrus.Fields{
				logrus.ErrorKey: actLoopErr.error,
				"PlayerID":      actLoopErr.player.playerID,
			}).Debug("error in action loop, sending leave action for player")
		case <-ctx.Done():
			err = ctx.Err()
			break
		}
	}

	// Wait for remaining (if any) player action reading loops to finish
	cancel()
	for i := 0; i < remainingPlayers; i++ {
		<-actionErrCh
	}
	close(actionCh)
	close(actionErrCh)
	return err
}
