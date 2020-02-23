package game

import (
	"context"
	"testing"
	"time"

	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/game/testutil"
)

// Type implementing the Action interface as a function
type actionFunc func(game *model.Game) ([]model.Event, error)

func (f actionFunc) Apply(g *model.Game) ([]model.Event, error) {
	return f(g)
}

func TestGameLoop_Start_Stop(t *testing.T) {
	game := &model.Game{}
	gl, err := newGameLoop(testutil.DiscardLogger, game)
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	// Override per tick actions, add no additional actions.
	gl.perTickActionsFunc = func(time.Duration) []model.Action { return nil }

	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		time.Sleep(20 * time.Millisecond)
		cancel()
	}()
	gl.Run(ctx)
	// Note this test requires the timeout flag to be set
}

func TestGameLoop_AddAction(t *testing.T) {
	game := &model.Game{}
	gl, err := newGameLoop(testutil.DiscardLogger, game)
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	// Override per tick actions, add no additional actions.
	gl.perTickActionsFunc = func(time.Duration) []model.Action { return nil }

	t.Log("Adding actions to game loop...")
	a1Applied := false
	a1 := actionFunc(func(_ *model.Game) ([]model.Event, error) {
		a1Applied = true
		return nil, nil
	})

	t.Log("Tick 1: actions added")
	gl.AddAction(a1)
	gl.tick(1 * time.Nanosecond)
	if !a1Applied {
		t.Error("Action was not applied")
	}

	t.Log("Tick 2: without actions")
	a1Applied = false
	gl.tick(1 * time.Nanosecond)
	if a1Applied {
		t.Error("Action was applied twice")
	}

	t.Log("Tick 3: actions added")
	a1Applied = false
	gl.AddAction(a1)
	gl.tick(1 * time.Nanosecond)
	if !a1Applied {
		t.Error("Action was not applied")
	}
}

// Tests that game loop finishes without an error if a game over event
// is sent.
func TestGameLoop_GameOverEvent(t *testing.T) {
	game := &model.Game{}
	gl, err := newGameLoop(testutil.DiscardLogger, game)
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	// GIVEN a gameLoop that add no actions per tick, tick as fast as possible
	// and an eventHandler that always return no error.
	gl.perTickActionsFunc = func(time.Duration) []model.Action { return nil }
	gl.tickInterval = 1 * time.Nanosecond
	gl.SetEventHandler(eventHandlerFunc(func(event model.Event) error {
		return nil
	}))

	// WHEN The only action added is an action that forces game over.
	gl.AddAction(&model.ActionForceGameOver{})

	// THEN The gameLoop quits without an error.
	if err := gl.Run(context.Background()); err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
}
