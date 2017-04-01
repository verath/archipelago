package game

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/actions"
	"github.com/verath/archipelago/lib/game/events"
	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/network"
	"sync"
)

// The game controller represents a single game. It starts and
// handles communication between the game loop and the
// player connections.
type controller struct {
	logEntry *logrus.Entry

	gameLoop *gameLoop
	p1Proxy  *playerProxy
	p2Proxy  *playerProxy
}

// Creates a new game controller.
func newController(log *logrus.Logger, game *model.Game, p1Client, p2Client network.Client) (*controller, error) {
	logEntry := common.ModuleLogEntryWithID(log, "game/controller")

	gameLoop, err := newGameLoop(log, game)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating gameLoop")
	}
	p1Proxy, err := newPlayerProxy(game.Player1(), p1Client)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating player1 proxy")
	}
	p2Proxy, err := newPlayerProxy(game.Player2(), p2Client)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating player2 proxy")
	}

	return &controller{
		logEntry: logEntry,
		gameLoop: gameLoop,
		p1Proxy:  p1Proxy,
		p2Proxy:  p2Proxy,
	}, nil
}

// Run starts the game controller, in turn starting the gameLoop and makes
// the game controller start listening for player actions. Blocks until an
// error occurs, the context is canceled, or the game is successfully finished.
func (ctrl *controller) Run(ctx context.Context) error {
	ctrl.logEntry.Debug("Starting")
	defer ctrl.logEntry.Debug("Stopped")

	// Make sure we always disconnect the player proxies after
	// Run is finished.
	defer func() {
		ctrl.logEntry.Debug("Stopping the player proxies")
		ctrl.p1Proxy.Disconnect()
		ctrl.p2Proxy.Disconnect()
	}()
	ctx, cancel := context.WithCancel(ctx)
	var shutdownWG sync.WaitGroup
	defer func() {
		// Stop, and wait for the action loop to shutdown, before returning control
		ctrl.logEntry.Debug("Stopping the action loop")
		cancel()
		shutdownWG.Wait()
	}()
	// Notify the players that the game is starting
	startEvt := events.NewGameStartEvent()
	if err := ctrl.broadcastEvent(ctx, startEvt); err != nil {
		return errors.Wrap(err, "Could not broadcast game starting event")
	}
	// Start the action forwarding loop
	shutdownWG.Add(1)
	go func() {
		defer shutdownWG.Done()
		ctrl.actionLoop(ctx)
	}()
	// Register ourselves as the eventHandler of the game loop
	ctrl.gameLoop.SetEventHandler(ctrl)
	defer ctrl.gameLoop.SetEventHandler(nil)
	// Run the game loop until it finishes
	err := ctrl.gameLoop.Run(ctx)
	return errors.Wrap(err, "Error while running game loop")
}

// Broadcast an event to both the player proxies. Blocks until both events have been
// processed.
func (ctrl *controller) broadcastEvent(ctx context.Context, evt events.Event) error {
	errCh := make(chan error)
	go func() { errCh <- ctrl.p1Proxy.SendEvent(ctx, evt) }()
	go func() { errCh <- ctrl.p2Proxy.SendEvent(ctx, evt) }()
	// TODO(2017-04-01): Might want to log something if we get 2 errors here
	err, err2 := <-errCh, <-errCh
	if err == nil {
		err = err2
	}
	return errors.Wrapf(err, "Failed broadcasting event: %v", evt)
}

// Forwards the event to both players, and blocks until the event has been
// successfully sent. Called by the gameloop for each event produced.
func (ctrl *controller) handleEvent(ctx context.Context, evt events.Event) error {
	// We don't handle errors here, as it wouldn't let us identify
	// which player is the problem. Instead we rely on that players
	// that cannot be written to will also post errors when reading,
	// which will be handled in the action loop.
	if err := ctrl.broadcastEvent(ctx, evt); err != nil {
		ctrl.logEntry.WithError(err).Debug("Error in handleEvent")
	}
	return nil
}

// playerActionLoop is a helper method for reading actions from one player
// and sending them to the actionCh. Blocks until an error occurs or the context
// is canceled. Always returns a non-nil error.
func (ctrl *controller) playerActionLoop(ctx context.Context, proxy *playerProxy, actionCh chan<- actions.Action) error {
	for {
		act, err := proxy.NextAction(ctx)
		if err != nil {
			return errors.Wrap(err, "Could not get action from proxy")
		}
		select {
		case actionCh <- act:
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

// The actionLoop takes actions from both players and forwards them
// to the gameLoop. Blocks until an error occurs or the context
// is canceled. Always returns a non-nil error.
func (ctrl *controller) actionLoop(ctx context.Context) {
	// A struct holding both an error and the proxy in which the error occurred,
	// used so we can share the handling of the error
	type actionLoopError struct {
		error error
		proxy *playerProxy
	}
	ctx, cancel := context.WithCancel(ctx)
	actionCh := make(chan actions.Action)
	errCh := make(chan actionLoopError)

	// Spawn a actions reading loop for each player, both broadcasting
	// new actions to a shared actionCh channel.
	go func() {
		err := ctrl.playerActionLoop(ctx, ctrl.p1Proxy, actionCh)
		errCh <- actionLoopError{err, ctrl.p1Proxy}
	}()
	go func() {
		err := ctrl.playerActionLoop(ctx, ctrl.p2Proxy, actionCh)
		errCh <- actionLoopError{err, ctrl.p2Proxy}
	}()

	// Read actions from the actionCh channel and forward them to the
	// gameLoop, applying them to the game. If an error is posted on the
	// errCh, then a player leave action is created for that player,
	// resulting in a game over with the remaining player as the winner.
	for {
		select {
		case act := <-actionCh:
			ctrl.gameLoop.AddAction(act)
		case err := <-errCh:
			leaveAct := actions.NewLeaveAction(err.proxy.playerID)
			ctrl.gameLoop.AddAction(leaveAct)
			cancel()
			<-errCh
			ctrl.logEntry.WithFields(logrus.Fields{
				logrus.ErrorKey: err.error,
				"PlayerID":      err.proxy.playerID,
			}).Debug("Error in action loop")
			return
		}
	}
}
