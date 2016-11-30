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
	actionsCh := make(chan action.Action, 0)
	eventsCh := make(chan event.Event, 0)
	gl := newGameLoop(log, game)
	ctx, cancel := context.WithCancel(context.Background())

	go func() {
		time.Sleep(20 * time.Millisecond)
		cancel()
	}()
	gl.Run(ctx, actionsCh, eventsCh)
	close(actionsCh)
	close(eventsCh)
}

func TestGameLoop_AddAction(t *stdtesting.T) {
	game := testing.CreateEmptyGame()
	gl := newGameLoop(log, game)

	t.Log("Adding action to game loop...")
	a1Applied := false
	a1 := action.ActionFunc(func(g model.Game) ([]event.Event, error) {
		a1Applied = true
		return []event.Event{}, nil
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
	actionsCh := make(chan action.Action, 1)
	eventsCh := make(chan event.Event, 0)

	gl := newGameLoop(log, game)
	ctx, cancel := context.WithCancel(context.Background())
	timesApplied := 0

	actionsCh <- action.ActionFunc(func(g model.Game) ([]event.Event, error) {
		timesApplied += 1
		return []event.Event{}, nil
	})

	go func() {
		time.Sleep(gl.tickInterval * 4)
		cancel()
	}()

	gl.Run(ctx, actionsCh, eventsCh)

	if timesApplied != 1 {
		t.Errorf("Expected action to be applied once, actual: %d", timesApplied)
	}
}
