package game

import (
	"context"
	"sync"
	"sync/atomic"
	"time"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/model"
)

const defaultTickInterval time.Duration = time.Second / 3

var defaultEventHandler = eventHandlerFunc(func(event model.Event) error {
	return nil
})

func defaultPerTickActionsFunc(elapsed time.Duration) []model.Action {
	return []model.Action{
		&model.ActionTick{Delta: elapsed},
		&model.ActionCheckGameOver{},
	}
}

// The gameLoop is what updates the game model instance that it is
// associated with. The updates are performed in ticks. Each tick
// applies all actions that has been added since the last tick
// sequentially on the model. For each such actions, zero or more
// events are created. Those events are handled before the next action
// is processed, by delegating to the registered eventHandler.
//
// Notice that any reads or writes (outside of actions) on the model
// once the gameLoop is started is not safe.
type gameLoop struct {
	logEntry *logrus.Entry
	// Duration between each tick
	tickInterval time.Duration
	// The game instance on which actions are to be applied
	game *model.Game
	// Flag set to 1 once the game has completed.
	gameOver int32

	// perTickActionsFunc returns a slice of actions to be applied per tick,
	// it is exposed to allow overriding per tick actions in tests.
	perTickActionsFunc func(time.Duration) []model.Action

	// A handler to handle events produced when applying actions
	// to the game instance.
	eventHandler eventHandler

	actionsMu sync.Mutex
	// A slice of actions to be applied on the next tick
	actions []model.Action
}

// eventHandler is a handler for game events produced when applying actions to
// the game.
type eventHandler interface {
	// handleEvent handles an event produced. This method will be called on the
	// game loop goroutine and must return as quickly as possible to prevent
	// blocking the game loop.
	handleEvent(event model.Event) error
}

// eventHandlerFunc is a function that implements the eventHandler interface
type eventHandlerFunc func(event model.Event) error

// handleEvent calls the function itself.
func (f eventHandlerFunc) handleEvent(event model.Event) error {
	return f(event)
}

func newGameLoop(log *logrus.Logger, game *model.Game) (*gameLoop, error) {
	logEntry := common.ModuleLogEntryWithID(log, "gameLoop")
	return &gameLoop{
		logEntry:           logEntry,
		tickInterval:       defaultTickInterval,
		game:               game,
		actions:            make([]model.Action, 0),
		perTickActionsFunc: defaultPerTickActionsFunc,
		eventHandler:       defaultEventHandler,
	}, nil
}

// SetEventHandler sets the handler for game events. Must not be called
// while the gameLoop is running.
func (gl *gameLoop) SetEventHandler(eventHandler eventHandler) {
	if eventHandler == nil {
		eventHandler = defaultEventHandler
	}
	gl.eventHandler = eventHandler
}

// AddAction adds an action to be processed the next tick.
func (gl *gameLoop) AddAction(action model.Action) {
	if gl.isGameOver() {
		// No more actions will be processed if game is over.
		return
	}
	gl.actionsMu.Lock()
	gl.actions = append(gl.actions, action)
	gl.actionsMu.Unlock()
}

// Run runs the game loop. Run blocks until the context is cancelled, an
// error occurs, or the game is over.
func (gl *gameLoop) Run(ctx context.Context) error {
	gl.logEntry.Debug("Starting")
	defer gl.logEntry.Debug("Stopped")
	err := gl.tickLoop(ctx)
	return errors.Wrap(err, "error while running tickLoop")
}

// setGameOver sets the game over flag to true.
func (gl *gameLoop) setGameOver() {
	gl.logEntry.Debug("gameOver set")
	atomic.StoreInt32(&gl.gameOver, 1)
}

// isGameOver checks if the game over flag has been set.
func (gl *gameLoop) isGameOver() bool {
	return atomic.LoadInt32(&gl.gameOver) == 1
}

// tickLoop performs a "tick" each tickInterval. This method blocks until the
// game is over, the context is canceled, or an error occurs.
func (gl *gameLoop) tickLoop(ctx context.Context) error {
	// Perform an initial tick as soon as we can.
	if err := gl.tick(0); err != nil {
		return errors.Wrap(err, "initial tick error")
	}
	// Perform a new tick each tickInterval.
	ticker := time.NewTicker(gl.tickInterval)
	defer ticker.Stop()
	lastTick := time.Now()
	for {
		if gl.isGameOver() {
			return nil
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-ticker.C:
			if err := gl.tick(time.Since(lastTick)); err != nil {
				return errors.Wrap(err, "tick error")
			}
			lastTick = time.Now()
		}
	}
}

// tick performs a tick for the elapsed duration. The tick is what updates the
// game by applying actions that has been queued since the last tick.
func (gl *gameLoop) tick(elapsed time.Duration) error {
	actions := gl.getActions()
	perTickActions := gl.getPerTickActions(elapsed)
	actions = append(actions, perTickActions...)
	if err := gl.applyActions(actions); err != nil {
		return errors.Wrap(err, "failed aplying actions")
	}
	return nil
}

// getActions swaps the current slice of queued actions with a new empty slice,
// returning the previous slice of actions.
func (gl *gameLoop) getActions() []model.Action {
	gl.actionsMu.Lock()
	defer gl.actionsMu.Unlock()
	// We slowly shrink the initial capacity of the actions here, so
	// that one tick with an abnormal number of actions doesn't result
	// in every new actions slice being allocated that same large size.
	newLen := len(gl.actions) / 2
	actions := gl.actions
	gl.actions = make([]model.Action, 0, newLen)
	return actions
}

// getPerTickActions returns actions that should be applied once per tick.
func (gl *gameLoop) getPerTickActions(elapsed time.Duration) []model.Action {
	return gl.perTickActionsFunc(elapsed)
}

// applyActions applies actions on the game sequentially, making it safe
// for the applied actions to modify the game-state.
func (gl *gameLoop) applyActions(actions []model.Action) error {
	for _, action := range actions {
		if err := gl.applyAction(action); err != nil {
			return errors.Wrap(err, "Error applying action")
		}
		if gl.isGameOver() {
			break
		}
	}
	return nil
}

// applyAction applies a single action to the game, and handles each
// event this action produced sequentially.
func (gl *gameLoop) applyAction(action model.Action) error {
	events, err := action.Apply(gl.game)
	if err != nil {
		if _, ok := err.(*model.IllegalActionError); ok {
			gl.logEntry.Debugf("Ignoring illegal action error: %v", err)
			return nil
		}
		return errors.Wrapf(err, "Error applying action: %+v (%T)", action, action)
	}
	if err := gl.handleEvents(events); err != nil {
		return errors.Wrap(err, "Error handling events")
	}
	return nil
}

// handleEvents handles each event by delegating to the event handler. If an
// event representing the game being over is encountered, then all further
// events are discarded and the gameLoop is set to game over state.
func (gl *gameLoop) handleEvents(events []model.Event) error {
	for _, event := range events {
		if err := gl.handleEvent(event); err != nil {
			return errors.Wrapf(err, "Error handling event: %+v (%T)", event, event)
		}
		// Stop processing events if we just sent a game over event
		if model.IsGameOverEvent(event) {
			gl.setGameOver()
			break
		}
	}
	return nil
}

// handleEvent handles a single event by forwarding it to the registered eventHandler.
func (gl *gameLoop) handleEvent(event model.Event) error {
	err := gl.eventHandler.handleEvent(event)
	return errors.Wrap(err, "event handler error while handling event")
}
