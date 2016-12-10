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
	"sync"
	"time"
)

const defaultTickInterval time.Duration = (time.Second * 2)

// The gameLoop is what updates the game model instance that it is
// associated with. The updates are performed in ticks. Each tick
// applies all actions that has been added since the last tick
// sequentially on the model. For each such action, zero or more
// events is created. All these events are dispatched as the last
// stage of the tick.
//
// Notice that any reads or writes (outside of actions) on the model
// once the gameLoop is started is not safe.
type gameLoop struct {
	tickInterval time.Duration
	log          *logrus.Logger
	game         *model.Game

	eventCh chan event.Event

	actionsMu sync.Mutex
	actions   []action.Action
}

// Applies all queued actions on the game sequentially, making it safe
// for the applied actions to modify the game state. An additional
// TickAction is always performed as the last action.
func (gl *gameLoop) applyActions(delta time.Duration) ([]event.Event, error) {
	// We make a copy of the current gl.actions and replace gl.actions
	// with a new array so that we can release the lock asap
	gl.actionsMu.Lock()
	actions := gl.actions
	gl.actions = make([]action.Action, 0, len(actions))
	gl.actionsMu.Unlock()

	// Add a tick action as the last action
	tickAction, err := action.NewTickAction(delta)
	if err != nil {
		return nil, fmt.Errorf("Error creating tick action: %v", err)
	}
	actions = append(actions, tickAction)

	// Process actions
	events := make([]event.Event, 0, 0)
	for _, act := range actions {
		evts, err := act.Apply(gl.game)
		if err != nil {
			return nil, fmt.Errorf("Error applying action: %v", err)
		}
		events = append(events, evts...)
	}
	return events, nil
}

// Pushes each event created during the application of actions to the
// event channel for this game instance.
func (gl *gameLoop) dispatchEvents(ctx context.Context, events []event.Event) error {
	// TODO: should we dispatch events async?
	for _, evt := range events {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case gl.eventCh <- evt:
		}
	}
	return nil
}

// Perform a tick on the game.
func (gl *gameLoop) tick(ctx context.Context, delta time.Duration) error {
	events, err := gl.applyActions(delta)
	if err != nil {
		return err
	}
	return gl.dispatchEvents(ctx, events)
}

// Performs a "tick" each tickInterval. The tick is what updates the game.
func (gl *gameLoop) tickLoop(ctx context.Context) error {
	tickInterval := gl.tickInterval
	ticker := time.NewTicker(tickInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-ticker.C:
			if err := gl.tick(ctx, tickInterval); err != nil {
				return err
			}
		}
	}
}

func (gl *gameLoop) addAction(action action.Action) {
	gl.actionsMu.Lock()
	gl.actions = append(gl.actions, action)
	gl.actionsMu.Unlock()
	gl.log.Info("Action added!!")
}

// Adds an action to the actions to be processed.
func (gl *gameLoop) AddAction(ctx context.Context, action action.Action) error {
	gl.addAction(action)
	return nil
}

func (gl *gameLoop) NextEvent(ctx context.Context) (event.Event, error) {
	select {
	case <-ctx.Done():
		return nil, ctx.Err()
	case evt, ok := <-gl.eventCh:
		if !ok {
			return nil, errors.New("eventCh was closed")
		}
		return evt, nil
	}

}

func (gl *gameLoop) Run(ctx context.Context) error {
	logEntry := logutil.ModuleEntryWithID(gl.log, "gameLoop")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	ctx, cancel := context.WithCancel(ctx)
	var wg sync.WaitGroup

	// Spawn tick loop (updates game)
	wg.Add(1)
	go func() {
		err := gl.tickLoop(ctx)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("tickLoop quit")
		}
		cancel()
		wg.Done()
	}()

	wg.Wait()
	return nil
}

func newGameLoop(log *logrus.Logger, game *model.Game) (*gameLoop, error) {
	return &gameLoop{
		tickInterval: defaultTickInterval,
		log:          log,
		game:         game,
		eventCh:      make(chan event.Event),
		actions:      make([]action.Action, 0),
	}, nil
}
