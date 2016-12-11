package controller

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/event"
	"github.com/verath/archipelago/lib/model"
	"github.com/verath/archipelago/lib/testing"
	"io/ioutil"
	stdtesting "testing"
	"time"
)

var log = &logrus.Logger{
	Out: ioutil.Discard,
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
}

func TestGameLoop_AddAction(t *stdtesting.T) {
	game := testing.CreateEmptyGame()
	gl, _ := newGameLoop(log, game)

	t.Log("Adding action to game loop...")
	a1Applied := false
	a1 := action.ActionFunc(func(g *model.Game) ([]event.Event, error) {
		a1Applied = true
		return nil, nil
	})

	t.Log("Tick 1: action added")
	gl.addAction(a1)
	gl.tick(1 * time.Millisecond)
	if !a1Applied {
		t.Error("Action was not applied")
	}

	t.Log("Tick 2: without action")
	a1Applied = false
	gl.tick(1 * time.Millisecond)
	if a1Applied {
		t.Error("Action was applied twice")
	}

	t.Log("Tick 3: action added")
	a1Applied = false
	gl.addAction(a1)
	gl.tick(1 * time.Millisecond)
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

	gl.addAction(action.ActionFunc(func(g *model.Game) ([]event.Event, error) {
		timesApplied += 1
		return []event.Event{}, nil
	}))

	go func() {
		time.Sleep(gl.tickInterval * 4)
		cancel()
	}()

	gl.Run(ctx)

	if timesApplied != 1 {
		t.Errorf("Expected action to be applied once, actual: %d", timesApplied)
	}
}
