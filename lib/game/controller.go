package game

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/model"
)

// The game controller represents a single game. It starts and handles
// communication between the game loop and the player connections.
type controller struct {
	logEntry *logrus.Entry

	gameLoop *gameLoop
	p1Proxy  *playerProxy
	p2Proxy  *playerProxy
}

// newController creates a new game controller.
func newController(log *logrus.Logger, game *model.Game, p1Client, p2Client client) (*controller, error) {
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

// run starts the game controller, in turn starting the gameLoop and makes
// the game controller start listening for player actions. Blocks until an
// error occurs, the context is canceled, or the game is successfully finished.
func (ctrl *controller) run(ctx context.Context) error {
	ctrl.logEntry.Debug("Starting")
	defer ctrl.logEntry.Debug("Stopped")

	// Notify the players that the game is starting
	startEvt := model.NewEventGameStart()
	if err := ctrl.broadcastEvent(ctx, startEvt); err != nil {
		return errors.Wrap(err, "Could not broadcast game starting event")
	}
	// Register ourselves as the eventHandler of the game loop
	ctrl.gameLoop.SetEventHandler(ctrl)
	defer ctrl.gameLoop.SetEventHandler(nil)

	// Start the action forwarding loop
	ctx, cancel := context.WithCancel(ctx)
	actionErrCh := make(chan error)
	go func() { actionErrCh <- ctrl.actionLoop(ctx) }()
	// Before returning control, make sure the action loop has finished
	defer func() {
		ctrl.logEntry.Debug("Stopping the action loop")
		cancel()
		<-actionErrCh
	}()
	// Run the game loop until it finishes
	err := ctrl.gameLoop.Run(ctx)
	return errors.Wrap(err, "Error while running game loop")
}

// Broadcast an event to both the player proxies simultaneously. Blocks until both
// events have been sent.
func (ctrl *controller) broadcastEvent(ctx context.Context, evt model.Event) error {
	errCh := make(chan error)
	go func() { errCh <- ctrl.p1Proxy.WriteEvent(ctx, evt) }()
	go func() { errCh <- ctrl.p2Proxy.WriteEvent(ctx, evt) }()
	err, err2 := <-errCh, <-errCh
	if err == nil {
		err = err2
	}
	return errors.Wrapf(err, "Failed broadcasting event: %v", evt)
}

// handleEvent forwards the event to both players, and blocks until the event
// has been successfully sent. Called by the gameLoop for each event produced.
func (ctrl *controller) handleEvent(ctx context.Context, evt model.Event) {
	if err := ctrl.broadcastEvent(ctx, evt); err != nil {
		ctrl.logEntry.Debugf("Error in handleEvent: %+v", err)
	}
}

// playerActionLoop is a helper method for reading actions from one player
// and sending them to the actionCh. Blocks until an error occurs or the context
// is canceled. Always returns a non-nil error.
func (ctrl *controller) playerActionLoop(ctx context.Context, proxy *playerProxy, actionCh chan<- model.Action) error {
	for {
		act, err := proxy.ReadAction(ctx)
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
func (ctrl *controller) actionLoop(ctx context.Context) error {
	// A struct holding both an error and the proxy in which the error occurred,
	// used so we can share the handling of the error
	type actionLoopError struct {
		error error
		proxy *playerProxy
	}
	ctx, cancel := context.WithCancel(ctx)
	actionCh := make(chan model.Action)
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
			leavePlayerAct := &model.PlayerActionLeave{}
			leaveAct := leavePlayerAct.ToAction(err.proxy.playerID)
			ctrl.gameLoop.AddAction(leaveAct)
			cancel()
			<-errCh
			ctrl.logEntry.WithFields(logrus.Fields{
				logrus.ErrorKey: err.error,
				"PlayerID":      err.proxy.playerID,
			}).Debug("Error in action loop")
			return err.error
		}
	}
}
