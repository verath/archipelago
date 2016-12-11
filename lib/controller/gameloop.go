package controller

import (
	"context"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/event"
	"github.com/verath/archipelago/lib/logutil"
	"github.com/verath/archipelago/lib/model"
	"sync"
	"time"
)

const defaultTickInterval time.Duration = (time.Second * 2)

// The gameLoop is what updates the game model instance that it is
// associated with. The updates are performed in ticks. Each tick
// applies all actions that has been added since the last tick
// sequentially on the model. For each such action, zero or more
// events are created. Those events are dispatched as the last stage
// of the tick.
//
// Notice that any reads or writes (outside of actions) on the model
// once the gameLoop is started is not safe.
type gameLoop struct {
	tickInterval time.Duration
	log          *logrus.Logger
	game         *model.Game

	// A signaling channel that is sent a value each time
	// the events *might* have been updated.
	eventsSCh chan bool
	eventsMu  sync.Mutex
	events    []event.EventBuilder

	actionsMu sync.Mutex
	actions   []action.Action
}

// Perform a tick on the game; Applies all queued actions on the game
// sequentially, making it safe for the applied actions to modify the
// game state. An additional TickAction is always performed as the
// last action.
func (gl *gameLoop) tick(delta time.Duration) error {
	// We make a copy of the current gl.actions and replace gl.actions
	// with a new array so that we can release the lock asap
	gl.actionsMu.Lock()
	actions := gl.actions
	gl.actions = make([]action.Action, 0, len(actions))
	gl.actionsMu.Unlock()

	// Add a tick action as the last action
	tickAction, err := action.NewTickAction(delta)
	if err != nil {
		return fmt.Errorf("Error creating tick action: %v", err)
	}
	actions = append(actions, tickAction)

	// Process actions
	events := make([]event.EventBuilder, 0)
	for _, act := range actions {
		evts, err := act.Apply(gl.game)
		if err != nil {
			return fmt.Errorf("Error applying action: %v", err)
		}
		events = append(events, evts...)
	}

	// Append the new events to the gl.events slice
	gl.eventsMu.Lock()
	gl.events = append(gl.events, events...)
	gl.eventsMu.Unlock()

	// Signal that events (might have) been added
	select {
	case gl.eventsSCh <- true:
	default:
	}
	return nil
}

// Performs a "tick" each tickInterval. The tick is what updates the game.
// This method blocks, and always returns a non-nil error .
func (gl *gameLoop) tickLoop(ctx context.Context) error {
	tickInterval := gl.tickInterval
	ticker := time.NewTicker(tickInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-ticker.C:
			if err := gl.tick(tickInterval); err != nil {
				return err
			}
		}
	}
}

// Helper method for adding actions without using a context.
func (gl *gameLoop) addAction(action action.Action) {
	gl.actionsMu.Lock()
	gl.actions = append(gl.actions, action)
	gl.actionsMu.Unlock()
}

// Adds an action to the actions to be processed. This method should never
// block.
func (gl *gameLoop) AddAction(ctx context.Context, action action.Action) error {
	// Should never block for long, so we don't care about the ctx
	gl.addAction(action)
	return nil
}

// Returns the next event from the list of events. Blocks until an event
// can be returned or the context is cancelled.
func (gl *gameLoop) NextEvent(ctx context.Context) (event.EventBuilder, error) {
	var evt event.EventBuilder
	for {
		// Try get the first event
		gl.eventsMu.Lock()
		if len(gl.events) > 0 {
			evt, gl.events = gl.events[0], gl.events[1:]
		}
		gl.eventsMu.Unlock()

		if evt != nil {
			return evt, nil
		}

		// If we did not find an event, wait for the gl.eventsSCh
		// and try again.
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-gl.eventsSCh:
		}
	}
}

// Runs the game loop. Run blocks until the context is cancelled and
// always returns a non-nil error.
func (gl *gameLoop) Run(ctx context.Context) error {
	logEntry := logutil.ModuleEntryWithID(gl.log, "gameLoop")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	// Add a game start event as the first event
	// TODO: should probably move this somewhere else
	createdEvt := event.NewGameStartEventBuilder()
	gl.eventsMu.Lock()
	gl.events = append(gl.events, createdEvt)
	gl.eventsMu.Unlock()

	err := gl.tickLoop(ctx)
	if err != nil && err != context.Canceled {
		logEntry.WithError(err).Error("tickLoop quit")
	}

	return err
}

func newGameLoop(log *logrus.Logger, game *model.Game) (*gameLoop, error) {
	return &gameLoop{
		tickInterval: defaultTickInterval,
		log:          log,
		game:         game,
		eventsSCh:    make(chan bool, 0),
		events:       make([]event.EventBuilder, 0),
		actions:      make([]action.Action, 0),
	}, nil
}
