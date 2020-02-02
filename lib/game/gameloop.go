package game

import (
	"context"
	"sync"
	"time"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/model"
)

const defaultTickInterval time.Duration = time.Second / 3

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
	// Flag for if the game has completed
	gameOver bool

	eventHandlerMu sync.Mutex
	// A handler to handle events produced when applying actions
	// to the game instance.
	eventHandler eventHandler

	// A WaitGroup for events being handled by the registered event
	// handler. We wait for this WaitGroup before returning from Run,
	// to make sure that each event has finished being handled.
	handleEventWG sync.WaitGroup

	actionsMu sync.Mutex
	// A slice of actions to be applied on the next tick
	actions []model.Action
}

// eventHandler is a handler for game events produced when applying actions to
// the game.
type eventHandler interface {
	// handleEvent handles an event produced. This method will be called on a
	// separate go routine and must block until the even has been handled, or
	// the context is cancelled.
	handleEvent(ctx context.Context, event model.Event)
}

func newGameLoop(log *logrus.Logger, game *model.Game) (*gameLoop, error) {
	logEntry := common.ModuleLogEntryWithID(log, "gameLoop")
	return &gameLoop{
		logEntry:     logEntry,
		tickInterval: defaultTickInterval,
		game:         game,
		actions:      make([]model.Action, 0),
	}, nil
}

// Sets the handler for game events.
func (gl *gameLoop) SetEventHandler(eventHandler eventHandler) {
	gl.eventHandlerMu.Lock()
	gl.eventHandler = eventHandler
	gl.eventHandlerMu.Unlock()
}

// Adds an action to be processed in the next tick.
func (gl *gameLoop) AddAction(action model.Action) {
	gl.actionsMu.Lock()
	gl.actions = append(gl.actions, action)
	gl.actionsMu.Unlock()
}

// Runs the game loop. Run blocks until the context is cancelled, an
// error occurs, or the game is over.
func (gl *gameLoop) Run(ctx context.Context) error {
	gl.logEntry.Debug("Starting")
	defer gl.logEntry.Debug("Stopped")
	err := gl.tickLoop(ctx)
	// Before returning control, wait for calls to eventHandler to finish
	gl.handleEventWG.Wait()
	return errors.Wrap(err, "error while running tickLoop")
}

// setGameOver sets the game over flag to true
func (gl *gameLoop) setGameOver() {
	gl.gameOver = true
}

// isGameOver checks if the game over flag has been set
func (gl *gameLoop) isGameOver() bool {
	return gl.gameOver
}

// Performs a "tick" each tickInterval. The tick is what updates the game, by applying
// actions that has been added since the last tick. This method blocks until the game
// is over, on an error occurs.
func (gl *gameLoop) tickLoop(ctx context.Context) error {
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
			elapsed := time.Since(lastTick)
			actions := gl.getActions()
			// Append tick and "check game over" events each tick.
			actions = append(actions, &model.ActionTick{Delta: elapsed})
			actions = append(actions, &model.ActionCheckGameOver{})
			if err := gl.applyActions(ctx, actions); err != nil {
				return errors.Wrap(err, "Error when performing tick")
			}
			lastTick = time.Now()
		}
	}
}

// getActions swaps the current slice of actions with a new empty slice,
// returning the previous actions.
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

// applyActions applies actions on the game sequentially, making it safe
// for the applied actions to modify the game-state.
func (gl *gameLoop) applyActions(ctx context.Context, actions []model.Action) error {
	for _, action := range actions {
		if err := gl.applyAction(ctx, action); err != nil {
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
func (gl *gameLoop) applyAction(ctx context.Context, action model.Action) error {
	events, err := action.Apply(gl.game)
	if err != nil {
		if _, ok := err.(*model.IllegalActionError); ok {
			gl.logEntry.Warnf("Ignoring illegal action error: %v", err)
			return nil
		}
		return errors.Wrapf(err, "Error applying action: %+v (%T)", action, action)
	}
	if err := gl.handleEvents(ctx, events); err != nil {
		return errors.Wrap(err, "Error handling events")
	}
	return nil
}

// handleEvents handles each event by delegating to the event handler. If an
// event representing the game being over is encountered, then all further
// events are discarded and the gameLoop is set to game over state.
func (gl *gameLoop) handleEvents(ctx context.Context, events []model.Event) error {
	for _, event := range events {
		if err := gl.handleEvent(ctx, event); err != nil {
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

// handleEvent handles a single event by forwarding it to the registered
// eventHandler on a new go-routine.
func (gl *gameLoop) handleEvent(ctx context.Context, event model.Event) error {
	gl.eventHandlerMu.Lock()
	handler := gl.eventHandler
	gl.eventHandlerMu.Unlock()
	if handler == nil {
		return errors.New("Unable to handle event, no eventHandler was registered")
	}
	gl.handleEventWG.Add(1)
	go func() {
		defer gl.handleEventWG.Done()
		handler.handleEvent(ctx, event)
	}()
	return nil
}
