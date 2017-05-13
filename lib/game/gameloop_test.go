package game

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/game/model"
	"io/ioutil"
	"testing"
	"time"
)

var log = &logrus.Logger{
	Out: ioutil.Discard,
}

// Type implementing the Action interface as a function
type actionFunc func(game *model.Game) ([]model.Event, error)

func (f actionFunc) Apply(g *model.Game) ([]model.Event, error) {
	return f(g)
}

func TestGameLoop_Start_Stop(t *testing.T) {
	game := &model.Game{}
	gl, _ := newGameLoop(log, game)
	ctx, cancel := context.WithCancel(context.Background())

	go func() {
		time.Sleep(20 * time.Millisecond)
		cancel()
	}()
	gl.Run(ctx)
	// Note this test requires the timeout flag to be set
}

func TestGameLoop_ApplyAction(t *testing.T) {
	game := &model.Game{}
	ctx := context.Background()
	cancelledCtx, cancel := context.WithCancel(ctx)
	cancel()
	gl, _ := newGameLoop(log, game)

	t.Log("Adding actions to game loop...")
	a1Applied := false
	a1 := actionFunc(func(_ *model.Game) ([]model.Event, error) {
		a1Applied = true
		return nil, nil
	})

	t.Log("Tick 1: actions added")
	gl.ApplyAction(cancelledCtx, a1)
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
	gl.ApplyAction(cancelledCtx, a1)
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
	gl, _ := newGameLoop(log, game)
	gl.tickInterval = time.Millisecond
	cancelledCtx, cancel := context.WithCancel(context.Background())
	cancel()
	ctx, cancel := context.WithCancel(context.Background())
	timesApplied := 0

	gl.ApplyAction(cancelledCtx, actionFunc(func(_ *model.Game) ([]model.Event, error) {
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
