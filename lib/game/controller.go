package game

import (
	"context"
	"errors"
	"fmt"

	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/model"
	"log/slog"
)

// eventQueueSize is the number of events queued for a player before the
// player is considered too slow and disconnected. Queued ticks are coalesced
// (see playerEventLoop), so the queue only fills up if writing a single event
// blocks. 256 events is ~25 s of ticks (at defaultTickInterval), longer than
// the network write timeout, so a client on a slow connection is disconnected
// by the write timeout rather than by a full queue.
const eventQueueSize = 256

// A player is a player of the game, and the Client playing it.
type player struct {
	id     model.PlayerID
	client Client
}

// playerError is a struct holding both an error and the player for which
// the error occurred.
type playerError struct {
	error  error
	player *player
}

// The game controller represents a single game. It starts and handles
// communication between the game loop and the players' clients: it writes
// the game's events to each client, as its player sees them, and reads the
// player's actions from it.
type controller struct {
	logger *slog.Logger

	gameLoop *gameLoop

	// players is a list of players that the controller reads actions
	// from, and sends event to.
	players []*player
}

// newController creates a new game controller.
func newController(logger *slog.Logger, gameLoop *gameLoop, players []*player) (*controller, error) {
	logger = common.ModuleLogEntryWithID(logger, "game/controller")
	if len(players) == 0 {
		return nil, errors.New("there must be at least one player")
	}
	return &controller{
		logger:   logger,
		gameLoop: gameLoop,
		players:  players,
	}, nil
}

// run starts the game controller, in turn starting the gameLoop and makes
// the game controller start listening for player actions. Blocks until an
// error occurs, the context is canceled, or the game is successfully over.
func (ctrl *controller) run(ctx context.Context) error {
	ctrl.logger.Debug("Starting")
	defer ctrl.logger.Debug("Stopped")

	// Setup forwarding of events produced by the game loop to eventCh.
	eventCh := make(chan model.Event, eventQueueSize)
	ctrl.gameLoop.onEvent = func(evt model.Event) error {
		select {
		case eventCh <- evt:
			return nil
		default:
			return errors.New("eventCh was full")
		}
	}

	// Queue a GameStart event as the first event to be forwarded to all players.
	eventCh <- &model.EventGameStart{TickInterval: ctrl.gameLoop.tickInterval}

	// Start and setup dependency chain: actionLoop <- gameLoop <- eventLoop.
	actionLoopQuitCh := make(chan struct{})
	errCh := make(chan error)
	go func() {
		err := ctrl.actionLoop(ctx, actionLoopQuitCh)
		if err != nil {
			err = fmt.Errorf("error in actionLoop: %w", err)
		}
		errCh <- err
		// Queue a force game over action to make gameLoop eventually quit.
		ctrl.gameLoop.AddAction(&model.ActionForceGameOver{})
	}()
	go func() {
		err := ctrl.gameLoop.Run(ctx)
		if err != nil {
			err = fmt.Errorf("error in gameLoop: %w", err)
		}
		errCh <- err
		// Closing eventCh signals eventLoop to eventually quit.
		close(eventCh)
	}()
	go func() {
		err := ctrl.eventLoop(ctx, eventCh)
		if err != nil {
			err = fmt.Errorf("error in eventBroadcastLoop: %w", err)
		}
		errCh <- err
	}()
	err := <-errCh
	// Closing actionLoopQuitCh signals actionLoop to quit, which
	// will bring down the chain of "loops".
	close(actionLoopQuitCh)
	<-errCh
	<-errCh
	return err
}

// playerEventLoop forwards events published on eventCh to a player. Blocks
// until eventCh is closed, an error occurs, or the context is canceled.
//
// Ticks are coalesced: if a player is slower than the game, more events are
// queued on eventCh by the time a write has finished. Of a run of queued
// ticks only the latest one is written, as each tick has the full game state
// (the client gets a delta computed against what was last sent to it, so
// skipping ticks is fine). Other events are never skipped and keep their
// order relative to the ticks.
func (ctrl *controller) playerEventLoop(ctx context.Context, p *player, eventCh <-chan model.Event) error {
	// next is an event taken from eventCh while coalescing ticks, to be
	// written next.
	var next model.Event
	for {
		evt := next
		next = nil
		if evt == nil {
			select {
			case e, ok := <-eventCh:
				if !ok {
					// eventCh closed, we have handled all events.
					return nil
				}
				evt = e
			case <-ctx.Done():
				return ctx.Err()
			}
		}
		if _, isTick := evt.(*model.EventTick); isTick {
			evt, next = latestQueuedTick(evt, eventCh)
		}
		if err := p.client.WritePlayerEvent(ctx, evt.ToPlayerEvent(p.id)); err != nil {
			return fmt.Errorf("error writing PlayerEvent to Client: %w", err)
		}
	}
}

// latestQueuedTick takes events already queued on eventCh, without blocking,
// for as long as they are ticks. It returns the last tick of the run, starting
// with tick, and the first queued non-tick event, or nil if there was none.
func latestQueuedTick(tick model.Event, eventCh <-chan model.Event) (latest, next model.Event) {
	latest = tick
	for {
		select {
		case evt, ok := <-eventCh:
			if !ok {
				// Closed. The caller sees that on its next receive.
				return latest, nil
			}
			if _, isTick := evt.(*model.EventTick); !isTick {
				return latest, evt
			}
			latest = evt
		default:
			return latest, nil
		}
	}
}

// eventLoop forwards events published on eventCh to all players. Blocks until
// eventCh is closed, all players have had an error, or the context is
// canceled.
func (ctrl *controller) eventLoop(ctx context.Context, eventCh <-chan model.Event) error {
	playerErrCh := make(chan playerError)
	playerEventChs := make(map[*player]chan model.Event, len(ctrl.players))
	for _, p := range ctrl.players {
		playerEventCh := make(chan model.Event, eventQueueSize)
		playerEventChs[p] = playerEventCh
		go func() {
			err := ctrl.playerEventLoop(ctx, p, playerEventCh)
			playerErrCh <- playerError{err, p}
		}()
	}

	var err error
	var eventChClosed bool
	for !eventChClosed && err == nil {
		select {
		case playerErr := <-playerErrCh:
			playerErr.player.client.Disconnect()
			delete(playerEventChs, playerErr.player)
			ctrl.playerErrorLogger(playerErr).Debug("player event loop error")
			if len(playerEventChs) == 0 {
				err = errors.New("no players remaining")
				break
			}
		case evt, ok := <-eventCh:
			if !ok {
				eventChClosed = true
				break
			}
			for p, ch := range playerEventChs {
				select {
				case ch <- evt:
				default:
					// Player event ch full (player too slow), force disconnect.
					p.client.Disconnect()
					ctrl.logger.Debug("player eventCh full", "playerID", p.id)
				}
			}
		case <-ctx.Done():
			err = ctx.Err()
			break
		}
	}

	// Signal and wait for remaining player event loops to finish.
	for _, ch := range playerEventChs {
		close(ch)
		<-playerErrCh
	}
	return err
}

// playerActionLoop reads actions from player and posts them to actionCh.
// Blocks until an error occurs or the context is canceled.
func (ctrl *controller) playerActionLoop(ctx context.Context, p *player, actionCh chan<- model.Action) error {
	for {
		act, err := p.client.ReadPlayerAction(ctx)
		if err != nil {
			return fmt.Errorf("could not read action from player: %w", err)
		}
		select {
		case actionCh <- act.ToAction(p.id):
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

// The actionLoop takes actions from all players and forwards them to the
// gameLoop. actionLoop blocks until quitCh is closed, all players have failed
// reading actions, or the context is canceled.
func (ctrl *controller) actionLoop(ctx context.Context, quitCh <-chan struct{}) error {
	actionCh := make(chan model.Action)
	playerErrCh := make(chan playerError)
	ctxPlayerLoops, cancelPlayerLoops := context.WithCancel(ctx)

	// Spawn an action reading loop for each player, each broadcasting
	// new actions to a shared actionCh channel.
	for _, p := range ctrl.players {
		go func() {
			err := ctrl.playerActionLoop(ctxPlayerLoops, p, actionCh)
			playerErrCh <- playerError{err, p}
		}()
	}

	// Read actions from the actionCh channel and forward them to the gameLoop.
	remainingPlayers := len(ctrl.players)
	var err error = nil
	quitRequested := false
	for err == nil && !quitRequested {
		select {
		case act := <-actionCh:
			ctrl.gameLoop.AddAction(act)
		case playerErr := <-playerErrCh:
			playerErr.player.client.Disconnect()
			// "Translate" read error into a player leave action.
			leavePlayerAct := &model.PlayerActionLeave{}
			leaveAct := leavePlayerAct.ToAction(playerErr.player.id)
			ctrl.gameLoop.AddAction(leaveAct)
			ctrl.playerErrorLogger(playerErr).Debug("player action loop error")
			remainingPlayers--
			if remainingPlayers == 0 {
				err = errors.New("no players remaining")
				break
			}
		case <-quitCh:
			quitRequested = true
			break
		case <-ctx.Done():
			err = ctx.Err()
			break
		}
	}

	// Signal and wait for remaining player action reading loops to finish.
	cancelPlayerLoops()
	for i := 0; i < remainingPlayers; i++ {
		<-playerErrCh
	}
	return err
}

func (ctrl *controller) playerErrorLogger(playerErr playerError) *slog.Logger {
	return ctrl.logger.With(
		"err", playerErr.error,
		"PlayerID", playerErr.player.id,
	)
}
