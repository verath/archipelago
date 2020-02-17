package game

import (
	"context"

	"github.com/verath/archipelago/lib/game/model"
)

// mockClient is a mock implementation of the Client interface,
// that for each method forwards calls to the Func defined in the struct.
type mockClient struct {
	DisconnectFunc       func()
	DisconnectChFunc     func() <-chan struct{}
	WritePlayerEventFunc func(ctx context.Context, evt model.PlayerEvent) error
	ReadPlayerActionFunc func(ctx context.Context) (model.PlayerAction, error)
}

func (c *mockClient) Disconnect() {
	if c.DisconnectFunc == nil {
		panic("mockClient: DisconnectFunc == nil")
	}
	c.DisconnectFunc()
}
func (c *mockClient) DisconnectCh() <-chan struct{} {
	if c.DisconnectChFunc == nil {
		panic("mockClient: DisconnectChFunc == nil")
	}
	return c.DisconnectChFunc()
}
func (c *mockClient) WritePlayerEvent(ctx context.Context, evt model.PlayerEvent) error {
	if c.WritePlayerEventFunc == nil {
		panic("mockClient: WritePlayerEventFunc == nil")
	}
	return c.WritePlayerEventFunc(ctx, evt)
}
func (c *mockClient) ReadPlayerAction(ctx context.Context) (model.PlayerAction, error) {
	if c.ReadPlayerActionFunc == nil {
		panic("mockClient: ReadPlayerActionFunc == nil")
	}
	return c.ReadPlayerActionFunc(ctx)
}
