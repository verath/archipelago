package game

import (
	"context"
	"slices"
	"testing"
	"time"

	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/game/testutil"
)

// Test that a game start event is sent as the first event when
// the game controller is run.
func TestController_Run_BroadcastsGameStart(t *testing.T) {
	game := model.CreateDummyGameEmpty()
	p1, _ := game.Players()[0], game.Players()[1]
	gameLoop := newGameLoop(testutil.DiscardLogger, game)
	gameLoop.perTickActionsFunc = func(time.Duration) []model.Action { return nil }
	gameLoop.tickInterval = 1 * time.Nanosecond

	// Setup a mock client, testing if the first event received is a game
	// start event
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
	p := &player{id: p1.ID(), client: client}

	// Setup, run controller
	ctrl, err := newController(testutil.DiscardLogger, gameLoop, []*player{p})
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

// Test that playerEventLoop coalesces ticks queued while a write is blocked:
// of a run of queued ticks only the latest is written, and other events are
// written in order.
func TestController_PlayerEventLoop_CoalescesTicks(t *testing.T) {
	game := model.CreateDummyGameSimple()
	tick := func(ms int) model.Event {
		g := game.Copy()
		g.SetTime(time.Duration(ms) * time.Millisecond)
		return &model.EventTick{Game: g}
	}
	gameOver := &model.EventGameOver{WinnerID: "winner"}

	writingCh := make(chan struct{})
	unblockCh := make(chan struct{})
	var written []string
	client := &mockClient{
		WritePlayerEventFunc: func(ctx context.Context, evt model.PlayerEvent) error {
			if len(written) == 0 {
				// Block the first write until the other events are queued.
				close(writingCh)
				<-unblockCh
			}
			switch evt := evt.(type) {
			case *model.PlayerEventTick:
				written = append(written, "tick "+evt.Game.Time().String())
			case *model.PlayerEventGameOver:
				written = append(written, "gameOver")
			default:
				t.Errorf("unexpected event %T", evt)
			}
			return nil
		},
	}
	p := &player{id: game.Players()[0].ID(), client: client}
	ctrl := &controller{logger: testutil.DiscardLogger}

	eventCh := make(chan model.Event, eventQueueSize)
	errCh := make(chan error)
	go func() { errCh <- ctrl.playerEventLoop(context.Background(), p, eventCh) }()
	eventCh <- tick(0)
	<-writingCh
	for _, evt := range []model.Event{tick(1), tick(2), gameOver, tick(3), tick(4)} {
		eventCh <- evt
	}
	close(eventCh)
	close(unblockCh)
	if err := <-errCh; err != nil {
		t.Fatalf("expected no error from playerEventLoop, got: %+v", err)
	}

	want := []string{"tick 0s", "tick 2ms", "gameOver", "tick 4ms"}
	if !slices.Equal(written, want) {
		t.Errorf("written events = %q, want %q", written, want)
	}
}
