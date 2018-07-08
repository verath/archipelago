package game

import (
	"context"
	"testing"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/game/testutil"
)

// Test that a game start event is sent as the first event when
// the game controller is run.
func TestController_Run_BroadcastsGameStart(t *testing.T) {
	game := model.NewGameBuilder(model.Coordinate{X: 1, Y: 1}, &model.Player{}, &model.Player{}, &model.Player{}).BuildOrPanic()
	readForeverFunc := func(ctx context.Context) (model.PlayerAction, error) {
		<-ctx.Done()
		return nil, ctx.Err()
	}

	// Setup mock player clients, testing if the first event received
	// is a game start event
	numPlayers := 2
	players := make([]Client, numPlayers)
	gameStartedCh := make(chan bool)
	for i := 0; i < numPlayers; i++ {
		p := &mockClient{
			ReadPlayerActionFunc: readForeverFunc,
			WritePlayerEventFunc: func(ctx context.Context, evt model.PlayerEvent) error {
				_, gameStarted := evt.(*model.PlayerEventGameStart)
				gameStartedCh <- gameStarted
				<-ctx.Done()
				return ctx.Err()
			},
		}
		players[i] = p
	}

	// Setup, run controller
	ctrl, err := newController(testutil.DiscardLogger, game, players[0], players[1])
	if err != nil {
		t.Fatalf("Expected no error, got: %+v", err)
	}
	ctx, cancel := context.WithCancel(context.Background())
	ctrlRunErrCh := make(chan error)
	go func() { ctrlRunErrCh <- ctrl.run(ctx) }()

	// Verify that each player got a game started event
	for i := 0; i < numPlayers; i++ {
		select {
		case wasGameStarted := <-gameStartedCh:
			if !wasGameStarted {
				t.Errorf("[player %d]: First event was not game started", i)
			}
		case err := <-ctrlRunErrCh:
			t.Fatalf("Expected no error from run, got: %+v", err)
		}
	}

	// Tear down, wait for controller to stop
	cancel()
	err = <-ctrlRunErrCh
	if err != nil && errors.Cause(err) != context.Canceled {
		t.Fatalf("Expected no error from run, got: %+v", err)
	}
}
