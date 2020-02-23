package game

import (
	"context"
	"testing"
	"time"

	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/game/testutil"
)

// Test that a game start event is sent as the first event when
// the game controller is run.
func TestController_Run_BroadcastsGameStart(t *testing.T) {
	game := model.CreateDummyGameEmpty()
	gameLoop, err := newGameLoop(testutil.DiscardLogger, game)
	if err != nil {
		t.Fatalf("expected no error creating game loop, got: %+v", err)
	}
	gameLoop.perTickActionsFunc = func(time.Duration) []model.Action { return nil }
	gameLoop.tickInterval = 1 * time.Nanosecond

	// Setup a mock player proxy, testing if the first event received
	// is a game start event
	readForeverFunc := func(ctx context.Context) (model.PlayerAction, error) {
		<-ctx.Done()
		return nil, ctx.Err()
	}
	gameStartedCh := make(chan bool)
	client := &mockClient{
		DisconnectFunc:       func() {},
		ReadPlayerActionFunc: readForeverFunc,
		WritePlayerEventFunc: func(ctx context.Context, evt model.PlayerEvent) error {
			_, gameStarted := evt.(*model.PlayerEventGameStart)
			gameStartedCh <- gameStarted
			<-ctx.Done()
			return ctx.Err()
		},
	}
	player, err := newPlayerProxy(game.Player1(), client)
	if err != nil {
		t.Fatalf("expected no error creating player proxy, got: %+v", err)
	}

	// Setup, run controller
	ctrl, err := newController(testutil.DiscardLogger, gameLoop, player)
	if err != nil {
		t.Fatalf("Expected no error, got: %+v", err)
	}
	ctx, cancel := context.WithCancel(context.Background())
	ctrlRunErrCh := make(chan error)
	go func() { ctrlRunErrCh <- ctrl.run(ctx) }()

	// Verify that we got a game started event
	select {
	case wasGameStarted := <-gameStartedCh:
		if !wasGameStarted {
			t.Error("First event was not game started")
		}
	case err := <-ctrlRunErrCh:
		t.Fatalf("Expected no error from run, got: %+v", err)
	}

	// Tear down, wait for controller to stop
	cancel()
	<-ctrlRunErrCh
}
