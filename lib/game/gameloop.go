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

// defaultTickInterval is the time between ticks. Airplanes arrive and
// launches take effect on a tick, so on top of the network a player waits up
// to this long to see an arrival change an island (the client moves airplanes
// itself between ticks, see GameClock in the frontend).
const defaultTickInterval time.Duration = time.Second / 10

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
// is processed, by onEvent.
//
// Notice that any reads or writes (outside of actions) on the model
// once the gameLoop is started is not safe.
type gameLoop struct {
	logger *slog.Logger
	// Duration between each tick
	tickInterval time.Duration
	// The game instance on which actions are to be applied
	game *model.Game
	// gameOver is set once the game has completed.
	gameOver atomic.Bool

	// perTickActionsFunc returns a slice of actions to be applied per tick,
	// it is exposed to allow overriding per tick actions in tests.
	perTickActionsFunc func(time.Duration) []model.Action

	// onEvent handles the events produced when applying actions to the
	// game. It is called on the game loop goroutine and must return quickly,
	// so as not to hold up the game. An error stops the game loop. Must be
	// set before Run if any action produces events.
	onEvent func(event model.Event) error

	actionsMu sync.Mutex
	// A slice of actions to be applied on the next tick
	actions []model.Action
}

func newGameLoop(logger *slog.Logger, game *model.Game) *gameLoop {
	logger = common.ModuleLogEntryWithID(logger, "gameLoop")
	return &gameLoop{
		logger:             logger,
		tickInterval:       defaultTickInterval,
		game:               game,
		actions:            make([]model.Action, 0),
		perTickActionsFunc: defaultPerTickActionsFunc,
	}
}

// AddAction adds an action to be processed the next tick.
func (gl *gameLoop) AddAction(action model.Action) {
	if gl.gameOver.Load() {
		// No more actions will be processed if game is over.
		return
	}
	gl.actionsMu.Lock()
	gl.actions = append(gl.actions, action)
	gl.actionsMu.Unlock()
}

// Run runs the game loop, performing a tick each tickInterval. Run blocks
// until the context is cancelled, an error occurs, or the game is over.
func (gl *gameLoop) Run(ctx context.Context) error {
	gl.logger.Debug("Starting")
	defer gl.logger.Debug("Stopped")
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
	for !gl.gameOver.Load() {
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
	return nil
}

// tick performs a tick for the elapsed duration: it applies the actions
// queued since the last tick, then the per tick actions, one by one, and
// passes the events each produces to onEvent before applying the next. At a
// game over event the game is over: the remaining events and actions are
// discarded.
func (gl *gameLoop) tick(elapsed time.Duration) error {
	gl.actionsMu.Lock()
	actions := gl.actions
	// We slowly shrink the initial capacity of the actions here, so
	// that one tick with an abnormal number of actions doesn't result
	// in every new actions slice being allocated that same large size.
	gl.actions = make([]model.Action, 0, len(actions)/2)
	gl.actionsMu.Unlock()
	actions = append(actions, gl.perTickActionsFunc(elapsed)...)

	for _, action := range actions {
		events, err := action.Apply(gl.game)
		if _, ok := err.(*model.IllegalActionError); ok {
			gl.logger.Debug("Ignoring illegal action error", "err", err)
			continue
		}
		if err != nil {
			return fmt.Errorf("error applying action: %+v (%T): %w", action, action, err)
		}
		for _, event := range events {
			if err := gl.onEvent(event); err != nil {
				return fmt.Errorf("error handling event: %+v (%T): %w", event, event, err)
			}
			if model.IsGameOverEvent(event) {
				gl.logger.Debug("gameOver set")
				gl.gameOver.Store(true)
				return nil
			}
		}
	}
	return nil
}
