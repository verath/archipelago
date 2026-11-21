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
	gl := newGameLoop(testutil.DiscardLogger, game)
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
	gl := newGameLoop(testutil.DiscardLogger, game)
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
	gl := newGameLoop(testutil.DiscardLogger, game)
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

// Tests that the game time, the sum of the ticks' time steps, is in whole
// milliseconds and keeps up with the wall clock.
func TestGameLoop_TickStepsSumToWholeMilliseconds(t *testing.T) {
	game := &model.Game{}
	gl := newGameLoop(testutil.DiscardLogger, game)
	gl.tickInterval = 3*time.Millisecond + 300*time.Microsecond
	var steps []time.Duration
	// Called on the game loop goroutine; read after Run returned.
	gl.perTickActionsFunc = func(elapsed time.Duration) []model.Action {
		steps = append(steps, elapsed)
		return nil
	}
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()
	start := time.Now()
	gl.Run(ctx)
	wall := time.Since(start)

	if len(steps) < 5 {
		t.Fatalf("only %d ticks", len(steps))
	}
	var gameTime time.Duration
	for _, step := range steps {
		gameTime += step
		if gameTime%time.Millisecond != 0 {
			t.Fatalf("game time %v after steps %v is not whole milliseconds", gameTime, steps)
		}
	}
	if gameTime > wall || gameTime < wall-gl.tickInterval-10*time.Millisecond {
		t.Errorf("game time %v, want close to the wall clock %v", gameTime, wall)
	}
}
