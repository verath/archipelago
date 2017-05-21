package game

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/model"
	"sync"
	"time"
)

const defaultTickInterval time.Duration = time.Second / 2

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

	gameOverMu sync.Mutex
	// Flag for if the game has completed
	gameOver bool

	eventHandlerMu sync.Mutex
	// A handler to handle events produced when applying actions
	// to the game instance.
	eventHandler eventHandler
	// A WaitGroup for events being handled by the registered event
	// handler.
	handleEventWG sync.WaitGroup

	actionsMu sync.Mutex
	// A slice of actions to be applied on the next tick
	actions []model.Action
}

// A handler for game events produced from applying actions.
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
// error occurs, or the game is finished.
func (gl *gameLoop) Run(ctx context.Context) error {
	gl.logEntry.Debug("Starting")
	defer gl.logEntry.Debug("Stopped")
	err := gl.tickLoop(ctx)
	// Before returning control, wait for calls to eventHandler to finish
	gl.handleEventWG.Wait()
	return errors.Wrap(err, "error while running tickLoop")
}

// Sets the game over flag, returning an error if it is already set
func (gl *gameLoop) setGameOver() error {
	gl.gameOverMu.Lock()
	defer gl.gameOverMu.Unlock()
	if gl.gameOver {
		return errors.New("Game is already over")
	}
	gl.gameOver = true
	return nil
}

// Checks if the game over flag has been set
func (gl *gameLoop) isGameOver() bool {
	gl.gameOverMu.Lock()
	defer gl.gameOverMu.Unlock()
	return gl.gameOver
}

// Performs a "tick" each tickInterval. The tick is what updates the game, by applying
// actions that has been added since the last tick. This method blocks until the game
// is over, on an error occurs.
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
				return errors.Wrap(err, "Error when performing tick")
			}
		}
		// Check for game over after each tick, and stop the loop if game is over
		if gl.isGameOver() {
			return nil
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
	tickAction := &model.ActionTick{Delta: delta}
	acts = append(acts, tickAction)

	for _, act := range acts {
		if err := gl.applyAction(ctx, act); err != nil {
			return err
		}
		// Check for game over after each action applied, and
		// stop processing actions if the game is over
		if gl.isGameOver() {
			return nil
		}
	}
	return nil
}

// Swaps the current slice of actions with a new empty slice, returning
// the previous actions.
func (gl *gameLoop) getActions() []model.Action {
	gl.actionsMu.Lock()
	defer gl.actionsMu.Unlock()
	acts := gl.actions

	// We slowly shrink the initial capacity of the actions here, so
	// that one tick with an abnormal number of actions doesn't result
	// in every new actions slice being allocated that same large size.
	newLen := len(acts) / 2
	gl.actions = make([]model.Action, 0, newLen)
	return acts
}

// Applies a single action to the game, and handles each event this action
// produced sequentially.
func (gl *gameLoop) applyAction(ctx context.Context, act model.Action) error {
	evts, err := act.Apply(gl.game)
	if err != nil {
		err = gl.handleActionError(ctx, err)
		return errors.Wrap(err, "Unable to handle action error")
	}
	if err := gl.handleEvents(ctx, evts); err != nil {
		return errors.Wrap(err, "Error handling events")
	}
	return nil
}

// Handles an error returned from applying an action. Non-fatal errors
// are logged and ignored. Fatal action errors results in a game over event
// being sent. All but non-fatal action errors are returned to the caller.
func (gl *gameLoop) handleActionError(ctx context.Context, err error) error {
	switch err := err.(type) {
	case model.ActionError:
		if !err.IsFatal() {
			gl.logEntry.WithError(err).Warn("Ignoring non-fatal ActionError")
			return nil
		}

		gl.logEntry.WithError(err).Debug("handle fatal ActionError")
		// Send a game over event with the opponent as winner
		var winner *model.Player
		if err.Player() != nil {
			winner = gl.game.Opponent(err.Player().ID())
		}
		gl.handleEvent(ctx, model.NewEventGameOver(winner))
	default:
		gl.logEntry.WithError(err).Debug("handle generic error")
	}
	return err
}

// handleEvent handles a single event by forwarding it to the registered
// eventHandler on a new go-routine.
func (gl *gameLoop) handleEvent(ctx context.Context, evt model.Event) {
	gl.eventHandlerMu.Lock()
	handler := gl.eventHandler
	gl.eventHandlerMu.Unlock()
	if handler == nil {
		gl.logEntry.Warn("handleEvent called, but no eventHandler was registered")
		return
	}
	gl.handleEventWG.Add(1)
	go func() {
		defer gl.handleEventWG.Done()
		handler.handleEvent(ctx, evt)
	}()
}

// handleEvents handles each event produced by delegating to the event handler.
// If an event representing the game being over is encountered, then all further
// events are discarded and the gameLoop is set to game over state.
func (gl *gameLoop) handleEvents(ctx context.Context, evts []model.Event) error {
	for _, evt := range evts {
		gl.handleEvent(ctx, evt)
		// Stop processing events if we sent a game over event
		if model.IsGameOverEvent(evt) {
			return gl.setGameOver()
		}
	}
	return nil
}
