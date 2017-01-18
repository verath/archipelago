package game

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/game/events"
	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/testing"
	"io/ioutil"
	stdtesting "testing"
	"time"
)

var log = &logrus.Logger{
	Out: ioutil.Discard,
}

// Type implementing the Action interface as a function
type actionFunc func(game *model.Game) ([]events.Event, error)

func (f actionFunc) Apply(g *model.Game) ([]events.Event, error) {
	return f(g)
}

func TestGameLoop_Start_Stop(t *stdtesting.T) {
	game := testing.CreateEmptyGame()
	gl, _ := newGameLoop(log, game)
	ctx, cancel := context.WithCancel(context.Background())

	go func() {
		time.Sleep(20 * time.Millisecond)
		cancel()
	}()
	gl.Run(ctx)
	// Note this test requires the timeout flag to be set
}

func TestGameLoop_AddAction(t *stdtesting.T) {
	game := testing.CreateEmptyGame()
	ctx := context.Background()
	gl, _ := newGameLoop(log, game)

	t.Log("Adding actions to game loop...")
	a1Applied := false
	a1 := actionFunc(func(g *model.Game) ([]events.Event, error) {
		a1Applied = true
		return nil, nil
	})

	t.Log("Tick 1: actions added")
	gl.AddAction(a1)
	gl.tick(ctx, 1 * time.Millisecond)
	if !a1Applied {
		t.Error("Action was not applied")
	}

	t.Log("Tick 2: without actions")
	a1Applied = false
	gl.tick(ctx, 1 * time.Millisecond)
	if a1Applied {
		t.Error("Action was applied twice")
	}

	t.Log("Tick 3: actions added")
	a1Applied = false
	gl.AddAction(a1)
	gl.tick(ctx, 1 * time.Millisecond)
	if !a1Applied {
		t.Error("Action was not applied")
	}
}

func TestGameLoop_AddAction_RealTick(t *stdtesting.T) {
	if stdtesting.Short() {
		t.Skip()
	}

	game := testing.CreateEmptyGame()

	gl, _ := newGameLoop(log, game)
	gl.tickInterval = time.Millisecond
	ctx, cancel := context.WithCancel(context.Background())
	timesApplied := 0

	gl.AddAction(actionFunc(func(g *model.Game) ([]events.Event, error) {
		timesApplied += 1
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
