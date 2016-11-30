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

type gameLoop struct {
	log *logrus.Logger

	game         *model.Game
	tickInterval time.Duration

	actionsMu sync.Mutex
	actions   []action.Action
}

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

func (gl *gameLoop) dispatchEvents(ctx context.Context, eventsCh chan<- event.Event, events []event.Event) error {
	// TODO: should we dispatch events async?
	for _, evt := range events {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case eventsCh <- evt:
		}
	}
	return nil
}

func (gl *gameLoop) tick(ctx context.Context, eventsCh chan<- event.Event, delta time.Duration) error {
	events, err := gl.applyActions(delta)
	if err != nil {
		return err
	}
	return gl.dispatchEvents(ctx, eventsCh, events)
}

func (gl *gameLoop) tickLoop(ctx context.Context, eventsCh chan<- event.Event) error {
	tickInterval := gl.tickInterval
	ticker := time.NewTicker(tickInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-ticker.C:
			if err := gl.tick(ctx, eventsCh, tickInterval); err != nil {
				return err
			}
		}
	}
}

func (gl *gameLoop) addAction(action action.Action) {
	gl.actionsMu.Lock()
	gl.actions = append(gl.actions, action)
	gl.actionsMu.Unlock()
}

func (gl *gameLoop) actionsLoop(ctx context.Context, actionsCh <-chan action.Action) error {
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case act, ok := <-actionsCh:
			if !ok {
				return errors.New("actionsCh was closed")
			}
			gl.addAction(act)
		}
	}
}

func (gl *gameLoop) Run(ctx context.Context, actionsCh <-chan action.Action, eventsCh chan<- event.Event) error {
	logEntry := logutil.ModuleEntryWithID(gl.log, "gameLoop")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	errCh := make(chan error, 0)
	ctx, cancel := context.WithCancel(ctx)

	go func() {
		err := gl.tickLoop(ctx, eventsCh)
		if err != nil && err != context.Canceled {
			errCh <- fmt.Errorf("tickLoop quit: %v", err)
		} else {
			errCh <- nil
		}
	}()
	go func() {
		err := gl.actionsLoop(ctx, actionsCh)
		if err != nil && err != context.Canceled {
			errCh <- fmt.Errorf("actionsLoop quit: %v", err)
		} else {
			errCh <- nil
		}
	}()

	err1 := <-errCh
	cancel()
	err2 := <-errCh
	if err1 != nil || err2 != nil {
		return fmt.Errorf("gameLoop Run: %v; %v", err1, err2)
	}
	return nil
}

func newGameLoop(log *logrus.Logger, game *model.Game) *gameLoop {
	return &gameLoop{
		log:          log,
		game:         game,
		actions:      make([]action.Action, 0),
		tickInterval: defaultTickInterval,
	}
}
