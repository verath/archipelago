package game

import (
	"context"
	"errors"
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
	eventCh := make(chan model.Event, eventQueueSize)
	p := &player{id: game.Players()[0].ID(), client: client, events: eventCh}
	ctrl := &controller{logger: testutil.DiscardLogger}

	errCh := make(chan error)
	go func() { errCh <- ctrl.playerEventLoop(context.Background(), p) }()
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

// newDisconnectableMockClient returns a mockClient whose reads block until
// it is disconnected (then they fail) or the context is canceled, and whose
// writes call write.
func newDisconnectableMockClient(write func(evt model.PlayerEvent) error) *mockClient {
	client := newConnectedMockClient()
	client.ReadPlayerActionFunc = func(ctx context.Context) (model.PlayerAction, error) {
		select {
		case <-client.DisconnectCh():
			return nil, errors.New("disconnected")
		case <-ctx.Done():
			return nil, ctx.Err()
		}
	}
	client.WritePlayerEventFunc = func(ctx context.Context, evt model.PlayerEvent) error {
		return write(evt)
	}
	return client
}

// Test that a player whose write fails is disconnected, while the others
// play on and get all events, up to the game over.
func TestController_Run_WriteErrorDisconnectsPlayer(t *testing.T) {
	game := model.CreateDummyGameEmpty()
	gameLoop := newGameLoop(testutil.DiscardLogger, game)
	gameLoop.perTickActionsFunc = func(time.Duration) []model.Action { return nil }
	gameLoop.tickInterval = time.Millisecond

	failing := newDisconnectableMockClient(func(model.PlayerEvent) error {
		return errors.New("write failed")
	})
	written := make(chan model.PlayerEvent, 10)
	playing := newDisconnectableMockClient(func(evt model.PlayerEvent) error {
		written <- evt
		return nil
	})
	ctrl, err := newController(testutil.DiscardLogger, gameLoop, []*player{
		{id: game.Players()[0].ID(), client: failing},
		{id: game.Players()[1].ID(), client: playing},
	})
	if err != nil {
		t.Fatalf("Expected no error, got: %+v", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	runErrCh := make(chan error)
	go func() { runErrCh <- ctrl.run(ctx) }()

	select {
	case evt := <-written:
		if _, ok := evt.(*model.PlayerEventGameStart); !ok {
			t.Fatalf("first event %T, want game start", evt)
		}
	case <-ctx.Done():
		t.Fatal("no game start written")
	}
	select {
	case <-failing.DisconnectCh():
	case <-ctx.Done():
		t.Fatal("player whose write failed was not disconnected")
	}
	gameLoop.AddAction(&model.ActionForceGameOver{})
	if err := <-runErrCh; err != nil {
		t.Fatalf("Expected no error from run, got: %+v", err)
	}
	// run returns once the remaining events have been written.
	close(written)
	var last model.PlayerEvent
	for evt := range written {
		last = evt
	}
	if _, ok := last.(*model.PlayerEventGameOver); !ok {
		t.Errorf("last event %T, want game over", last)
	}
}

// Test that broadcast disconnects a player whose queue is full, without
// blocking, and still queues the event for the others.
func TestController_Broadcast_DisconnectsSlowPlayer(t *testing.T) {
	game := model.CreateDummyGameEmpty()
	slow, other := newConnectedMockClient(), newConnectedMockClient()
	ctrl, err := newController(testutil.DiscardLogger, newGameLoop(testutil.DiscardLogger, game), []*player{
		{id: game.Players()[0].ID(), client: slow},
		{id: game.Players()[1].ID(), client: other},
	})
	if err != nil {
		t.Fatalf("Expected no error, got: %+v", err)
	}
	for range eventQueueSize {
		ctrl.players[0].events <- &model.EventTick{}
	}
	evt := &model.EventTick{}
	ctrl.broadcast(evt)

	select {
	case <-slow.DisconnectCh():
	default:
		t.Error("player with a full queue was not disconnected")
	}
	select {
	case <-other.DisconnectCh():
		t.Error("player with room in its queue was disconnected")
	default:
	}
	if got := <-ctrl.players[1].events; got != evt {
		t.Errorf("queued event %v, want %v", got, evt)
	}
}
