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
	gl, _ := newGameLoop(testutil.DiscardLogger, game)
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
	ctx := context.Background()
	gl, _ := newGameLoop(testutil.DiscardLogger, game)

	t.Log("Adding actions to game loop...")
	a1Applied := false
	a1 := actionFunc(func(_ *model.Game) ([]model.Event, error) {
		a1Applied = true
		return nil, nil
	})

	t.Log("Tick 1: actions added")
	gl.AddAction(a1)
	gl.tick(ctx, 1*time.Millisecond)
	if !a1Applied {
		t.Error("Action was not applied")
	}

	t.Log("Tick 2: without actions")
	a1Applied = false
	gl.tick(ctx, 1*time.Millisecond)
	if a1Applied {
		t.Error("Action was applied twice")
	}

	t.Log("Tick 3: actions added")
	a1Applied = false
	gl.AddAction(a1)
	gl.tick(ctx, 1*time.Millisecond)
	if !a1Applied {
		t.Error("Action was not applied")
	}
}

func TestGameLoop_AddAction_RealTick(t *testing.T) {
	if testing.Short() {
		t.Skip()
	}

	game := &model.Game{}
	gl, _ := newGameLoop(testutil.DiscardLogger, game)
	gl.tickInterval = time.Millisecond
	ctx, cancel := context.WithCancel(context.Background())
	timesApplied := 0

	gl.AddAction(actionFunc(func(_ *model.Game) ([]model.Event, error) {
		timesApplied++
		return nil, nil
	}))

	go func() {
		time.Sleep(gl.tickInterval * 4)
		cancel()
	}()

	gl.Run(ctx)

	if timesApplied != 1 {
		t.Errorf("Expected actions to be applied once, actual: %d", timesApplied)
	}
}
