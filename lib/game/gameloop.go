package game

import (
	"context"
	"fmt"
	"sync"
	"sync/atomic"
	"time"

	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/model"
	"log/slog"
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
	logger *slog.Logger
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

func newGameLoop(logger *slog.Logger, game *model.Game) (*gameLoop, error) {
	logger = common.ModuleLogEntryWithID(logger, "gameLoop")
	return &gameLoop{
		logger:             logger,
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
	gl.logger.Debug("Starting")
	defer gl.logger.Debug("Stopped")
	if err := gl.tickLoop(ctx); err != nil {
		return fmt.Errorf("error while running tickLoop: %w", err)
	}
	return nil
}

// setGameOver sets the game over flag to true.
func (gl *gameLoop) setGameOver() {
	gl.logger.Debug("gameOver set")
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
		return fmt.Errorf("initial tick error: %w", err)
	}
	// Perform a new tick each tickInterval. Each tick's time step is the
	// time since the previous tick, but the game time (the sum of the steps)
	// is kept in whole milliseconds: clients get the game time in ms and
	// compute airplane positions from it, so they then agree exactly with
	// the server. Rounding the total rather than each step means the game
	// time doesn't drift from the wall clock.
	ticker := time.NewTicker(gl.tickInterval)
	defer ticker.Stop()
	start := time.Now()
	var gameTime time.Duration
	for {
		if gl.isGameOver() {
			return nil
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-ticker.C:
			now := time.Since(start).Truncate(time.Millisecond)
			if err := gl.tick(now - gameTime); err != nil {
				return fmt.Errorf("tick error: %w", err)
			}
			gameTime = now
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
		return fmt.Errorf("failed aplying actions: %w", err)
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
			return fmt.Errorf("Error applying action: %w", err)
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
			gl.logger.Debug("Ignoring illegal action error", "err", err)
			return nil
		}
		return fmt.Errorf("Error applying action: %+v (%T): %w", action, action, err)
	}
	if err := gl.handleEvents(events); err != nil {
		return fmt.Errorf("Error handling events: %w", err)
	}
	return nil
}

// handleEvents handles each event by delegating to the event handler. If an
// event representing the game being over is encountered, then all further
// events are discarded and the gameLoop is set to game over state.
func (gl *gameLoop) handleEvents(events []model.Event) error {
	for _, event := range events {
		if err := gl.handleEvent(event); err != nil {
			return fmt.Errorf("Error handling event: %+v (%T): %w", event, event, err)
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
	if err := gl.eventHandler.handleEvent(event); err != nil {
		return fmt.Errorf("event handler error while handling event: %w", err)
	}
	return nil
}
