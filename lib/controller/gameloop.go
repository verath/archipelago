package controller

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/event"
	"github.com/verath/archipelago/lib/model"
	"sync"
	"time"
)

const defaultTickInterval time.Duration = (time.Second / 5)

type gameLoop struct {
	log *logrus.Logger

	game         model.Game
	tickInterval time.Duration

	actionsMu sync.Mutex
	actions   []action.Action
}

func (gl *gameLoop) applyActions(delta time.Duration) {
	logEntry := gl.log.WithField("module", "gameloop")

	// We make a copy of the current gl.actions and replace gl.actions
	// with a new array so that we can release the lock asap
	gl.actionsMu.Lock()
	actions := gl.actions
	gl.actions = make([]action.Action, 0, len(actions))
	gl.actionsMu.Unlock()

	// Add a tick action as the last action
	tickAction, err := action.NewTickAction(delta)
	if err != nil {
		logEntry.WithField("err", err).Fatal("Could not create tick action")
	}
	actions = append(actions, tickAction)

	// Process actions
	events := make([]event.Event, 0, 0)
	for _, act := range actions {
		evts, err := act.Apply(gl.game)
		if err != nil {
			logEntry.WithField("err", err).Fatal("Error applying action")
		}
		events = append(events, evts...)
	}
}

func (gl *gameLoop) dispatchEvents() {

}

func (gl *gameLoop) tick(delta time.Duration) {
	gl.applyActions(delta)
	gl.dispatchEvents()
}

func (gl *gameLoop) runLoop(ctx context.Context) error {
	tickInterval := gl.tickInterval
	ticker := time.NewTicker(tickInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-ticker.C:
			gl.tick(tickInterval)
		}
	}
}

func (gl *gameLoop) AddAction(action action.Action) {
	gl.actionsMu.Lock()
	gl.actions = append(gl.actions, action)
	gl.actionsMu.Unlock()
}

func (gl *gameLoop) Run(ctx context.Context) error {
	return gl.runLoop(ctx)
}

func newGameLoop(log *logrus.Logger, game model.Game) *gameLoop {
	return &gameLoop{
		log:          log,
		game:         game,
		actions:      make([]action.Action, 0),
		tickInterval: defaultTickInterval,
	}
}
