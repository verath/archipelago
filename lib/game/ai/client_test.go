package ai

import (
	"context"
	"math/rand"
	"testing"
	"time"

	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/game/testutil"
	"golang.org/x/time/rate"
)

// alwaysLaunchStrategy is a strategy that always returns an action.
type alwaysLaunchStrategy struct{}

func (alwaysLaunchStrategy) NextAction(clientState, *model.Game, *rand.Rand) (model.PlayerAction, error) {
	return &model.PlayerActionLaunch{}, nil
}

func TestClient_WritePlayerEvent_DoesNotBlockAfterDisconnect(t *testing.T) {
	client, err := NewClient(testutil.DiscardLogger, func() (strategy, error) {
		return alwaysLaunchStrategy{}, nil
	})
	if err != nil {
		t.Fatalf("unexpected error creating client: %v", err)
	}
	client.bot.limiter = rate.NewLimiter(rate.Inf, 1)
	// Fill actionCh, as if the action reader stopped before reading it.
	client.actionCh <- &model.PlayerActionLaunch{}
	client.Disconnect()

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	evt := &model.PlayerEventTick{Game: model.CreateDummyGameEmpty()}
	// onTick skips half of the ticks at random, so write enough events that
	// at least one of them produces an action.
	for i := 0; i < 100; i++ {
		err := client.WritePlayerEvent(ctx, evt)
		if ctx.Err() != nil {
			t.Fatal("WritePlayerEvent blocked after Disconnect")
		}
		if err != nil {
			return
		}
	}
	t.Fatal("expected an error from WritePlayerEvent after Disconnect")
}
