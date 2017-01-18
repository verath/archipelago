package game

import (
	"context"
	"errors"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/actions"
	"github.com/verath/archipelago/lib/game/events"
	"github.com/verath/archipelago/lib/game/model"
	"sync"
	"time"
)

const defaultTickInterval time.Duration = (time.Second / 2)

// A special error returned if the game loop finished because the
// game has successfully come to an end.
var ErrGameOver = errors.New("Game is over")

// The gameLoop is what updates the game model instance that it is
// associated with. The updates are performed in ticks. Each tick
// applies all actions that has been added since the last tick
// sequentially on the model. For each such actions, zero or more
// events are created. Those events are dispatched as the last stage
// of the tick.
//
// Notice that any reads or writes (outside of actions) on the model
// once the gameLoop is started is not safe.
type gameLoop struct {
	logEntry *logrus.Entry
	// Duration between each tick
	tickInterval time.Duration
	// The game instance on which actions are to be applied
	game *model.Game

	eventHandlerMu sync.Mutex
	// A handler to handle events produced when applying actions
	// to the game instance.
	eventHandler eventHandler

	actionsMu sync.Mutex
	// A slice of actions to be applied on the next tick
	actions []actions.Action
}

// A handler for game events produced from applying actions.
type eventHandler interface {
	// Handles an event produced. This method will be called from the
	// "tick" goroutine. As such, the handleEvent call will block any
	// further processing of the current tick. If the context expires,
	// the handler must unblock.
	handleEvent(ctx context.Context, event events.Event)
}

func newGameLoop(log *logrus.Logger, game *model.Game) (*gameLoop, error) {
	logEntry := common.ModuleLogEntryWithID(log, "gameLoop")

	return &gameLoop{
		logEntry:     logEntry,
		tickInterval: defaultTickInterval,
		game:         game,
		actions:      make([]actions.Action, 0),
	}, nil
}

// Sets the handler for game events.
func (gl *gameLoop) SetEventHandler(eventHandler eventHandler) {
	gl.eventHandlerMu.Lock()
	gl.eventHandler = eventHandler
	gl.eventHandlerMu.Unlock()
}

// Adds an action to be processed in the next tick.
func (gl *gameLoop) AddAction(action actions.Action) {
	gl.actionsMu.Lock()
	gl.actions = append(gl.actions, action)
	gl.actionsMu.Unlock()
}

// Runs the game loop. Run blocks until the context is cancelled, or an
// error occurs. The special ErrGameOver is returned if the reason for
// the game loop quitting is that the underlying game has finished.
func (gl *gameLoop) Run(ctx context.Context) error {
	gl.logEntry.Debug("Starting")
	defer gl.logEntry.Debug("Stopped")
	err := gl.tickLoop(ctx)
	return fmt.Errorf("tickLoop quit: %v", err)
}

// Performs a "tick" each tickInterval. The tick is what updates the game, by applying
// actions that has been added since the last tick.  This method blocks, and always
// returns a non-nil error.
func (gl *gameLoop) tickLoop(ctx context.Context) error {
	tickInterval := gl.tickInterval
	ticker := time.NewTicker(tickInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-ticker.C:
			err := gl.tick(ctx, tickInterval)
			if err != nil {
				return err
			}
		}
	}
}

// Perform a tick on the game; Applies all queued actions on the game
// sequentially, making it safe for the applied actions to modify the
// game-state. An additional TickAction is always performed as the
// last actions during a tick.
func (gl *gameLoop) tick(ctx context.Context, delta time.Duration) error {
	// Obtain a slice of the actions added since the last tick.
	acts := gl.getActions()

	// Add a tick actions as the last action to our local actions slice.
	tickAction, err := actions.NewTickAction(delta)
	if err != nil {
		return fmt.Errorf("Error creating tick action: %v", err)
	}
	acts = append(acts, tickAction)

	for _, act := range acts {
		if err := gl.applyAction(ctx, act); err != nil {
			return err
		}
	}
	return nil
}

// Swaps the current slice of actions with a new empty slice, returning
// the previous actions.
func (gl *gameLoop) getActions() []actions.Action {
	gl.actionsMu.Lock()
	defer gl.actionsMu.Unlock()
	acts := gl.actions

	// We slowly shrink the initial capacity of the actions here, so
	// that one tick with an abnormal number of actions doesn't result
	// in every new actions slice being allocated that same large size.
	newLen := len(acts) / 2
	gl.actions = make([]actions.Action, 0, newLen)
	return acts
}

// Applies a single event to the game, and handles each event this action
// produced sequentially. Returns an ErrGameOver if a game over event
// was encountered.
func (gl *gameLoop) applyAction(ctx context.Context, act actions.Action) error {
	evts, err := act.Apply(gl.game)
	if err != nil {
		return fmt.Errorf("Error applying actions: %v", err)
	}
	if err := gl.handleEvents(ctx, evts); err != nil {
		if err == ErrGameOver {
			// We don't want to add context to the game over event, as
			// that would prevent the caller from identifying it.
			return err
		} else {
			return fmt.Errorf("Error handling events: %v", err)
		}
	}
	return nil
}

// Handles each event produced by delegating to the event handler.
// If an event representing the game being over is encountered, an
// ErrGameOver error is returned, after the event has been processed
// by the event handler.
func (gl *gameLoop) handleEvents(ctx context.Context, evts []events.Event) error {
	gl.eventHandlerMu.Lock()
	defer gl.eventHandlerMu.Unlock()

	if gl.eventHandler != nil {
		for _, evt := range evts {
			gl.eventHandler.handleEvent(ctx, evt)
			if events.IsGameOverEvent(evt) {
				return ErrGameOver
			}
		}
	}
	return nil
}
