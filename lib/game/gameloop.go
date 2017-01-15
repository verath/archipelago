package game

import (
	"context"
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

	tickInterval time.Duration
	game         *model.Game

	// A signaling channel that is sent a value each time
	// the events *might* have been updated.
	eventsSCh chan bool
	eventsMu  sync.Mutex
	events    []events.Event

	actionsMu sync.Mutex
	actions   []actions.Action
}

// Perform a tick on the game; Applies all queued actions on the game
// sequentially, making it safe for the applied actions to modify the
// game state. An additional TickAction is always performed as the
// last actions.
func (gl *gameLoop) tick(delta time.Duration) error {
	// We make a copy of the current gl.actions and replace gl.actions
	// with a new array so that we can release the lock asap
	gl.actionsMu.Lock()
	acts := gl.actions
	gl.actions = make([]actions.Action, 0, len(acts))
	gl.actionsMu.Unlock()

	// Add a tick actions as the last actions
	tickAction, err := actions.NewTickAction(delta)
	if err != nil {
		return fmt.Errorf("Error creating tick action: %v", err)
	}
	acts = append(acts, tickAction)

	// Process actions
	evts := make([]events.Event, 0)
	for _, act := range acts {
		actionEvts, err := act.Apply(gl.game)
		if err != nil {
			return fmt.Errorf("Error applying actions: %v", err)
		}
		evts = append(evts, actionEvts...)
	}

	// Append the new events to the gl.events slice
	gl.eventsMu.Lock()
	gl.events = append(gl.events, evts...)
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

// Adds an actions to the actions to be processed.
func (gl *gameLoop) AddAction(action actions.Action) {
	gl.actionsMu.Lock()
	gl.logEntry.Debug("Adding action: %v", action)
	gl.actions = append(gl.actions, action)
	gl.actionsMu.Unlock()
}

// Returns the next event from the list of events. Blocks until an event
// can be returned or the context is cancelled.
func (gl *gameLoop) NextEvent(ctx context.Context) (events.Event, error) {
	var evt events.Event
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
	gl.logEntry.Debug("Starting")
	defer gl.logEntry.Debug("Stopped")

	// Add a game start event as the first event
	// TODO: should probably move this somewhere else
	createdEvt := events.NewGameStartEvent()
	gl.eventsMu.Lock()
	gl.events = append(gl.events, createdEvt)
	gl.eventsMu.Unlock()

	err := gl.tickLoop(ctx)
	return fmt.Errorf("tickLoop quit: %v", err)
}

func newGameLoop(log *logrus.Logger, game *model.Game) (*gameLoop, error) {
	logEntry := common.ModuleLogEntryWithID(log, "gameLoop")

	return &gameLoop{
		logEntry:     logEntry,
		tickInterval: defaultTickInterval,
		game:         game,
		eventsSCh:    make(chan bool, 0),
		events:       make([]events.Event, 0),
		actions:      make([]actions.Action, 0),
	}, nil
}
