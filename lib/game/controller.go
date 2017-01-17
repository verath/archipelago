package game

import (
	"context"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/actions"
	"github.com/verath/archipelago/lib/game/events"
	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/network"
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

	return &controller{
		logEntry: logEntry,
		gameLoop: gameLoop,
		p1Proxy:  p1Proxy,
		p2Proxy:  p2Proxy,
	}, nil
}

// Run starts the game controller, in turn starting the gameLoop and makes
// the game controller start listening for player actions. Blocks until an
// error occurs or the context is canceled. Always returns a non-nil error.
func (ctrl *controller) Run(ctx context.Context) error {
	defer func() {
		ctrl.logEntry.Debug("Stopping clients")
		ctrl.p1Proxy.Disconnect()
		ctrl.p2Proxy.Disconnect()
		ctrl.logEntry.Debug("Stopped")
	}()

	ctrl.logEntry.Debug("Starting")
	errCh := make(chan error)
	ctx, cancel := context.WithCancel(ctx)

	// Notify the players that the game is starting
	startEvt := events.NewGameStartEvent()
	if err := ctrl.broadcastEvent(ctx, startEvt); err != nil {
		return err
	}

	// TODO: Better way than having 3 go-routines here?
	go func() { errCh <- ctrl.eventLoop(ctx) }()
	go func() { errCh <- ctrl.actionLoop(ctx) }()
	go func() { errCh <- ctrl.gameLoop.Run(ctx) }()

	err := <-errCh
	ctrl.logEntry.WithError(err).Debug("Error in Run, stopping...")
	cancel()
	// TODO: log these errors? Most likely context.Cancelled
	<-errCh
	<-errCh

	return err
}

// Broadcast an event to both the player proxies.
func (ctrl *controller) broadcastEvent(ctx context.Context, evt events.Event) error {
	if err := ctrl.p1Proxy.SendEvent(ctx, evt); err != nil {
		return err
	}
	if err := ctrl.p2Proxy.SendEvent(ctx, evt); err != nil {
		return err
	}
	return nil
}

// eventLoop reads from the eventCh and forwards each event to both
// of the player proxies. Blocks until an error occurs or the context
// is canceled. Always returns a non-nil error.
func (ctrl *controller) eventLoop(ctx context.Context) error {
	for {
		evt, err := ctrl.gameLoop.NextEvent(ctx)
		if err != nil {
			return err
		}
		if err := ctrl.broadcastEvent(ctx, evt); err != nil {
			return err
		}
	}
}

// playerActionLoop is a helper method for reading actions from one player
// and sending them to the actionCh. Blocks until an error occurs or the context
// is canceled. Always returns a non-nil error.
func (ctrl *controller) playerActionLoop(ctx context.Context, proxy *playerProxy, actionCh chan<- actions.Action) error {
	for {
		act, err := proxy.NextAction(ctx)
		if err != nil {
			return err
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
	ctx, cancel := context.WithCancel(ctx)
	actionCh := make(chan actions.Action)
	errCh := make(chan error)

	// Spawn a actions reading loop for each player, both broadcasting
	// new actions to a shared actionCh channel.
	go func() { errCh <- ctrl.playerActionLoop(ctx, ctrl.p1Proxy, actionCh) }()
	go func() { errCh <- ctrl.playerActionLoop(ctx, ctrl.p2Proxy, actionCh) }()

	// Read actions from the actionCh channel and forward them to the
	// gameLoop, adding them to the game.
	for {
		select {
		case err := <-errCh:
			cancel()
			<-errCh
			return fmt.Errorf("Error during playerActionLoop: %v", err)
		case act := <-actionCh:
			ctrl.gameLoop.AddAction(act)
		}
	}
}
