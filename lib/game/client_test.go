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
	c.DisconnectFunc()
}
func (c *mockClient) DisconnectCh() <-chan struct{} {
	return c.DisconnectChFunc()
}
func (c *mockClient) WritePlayerEvent(ctx context.Context, evt model.PlayerEvent) error {
	return c.WritePlayerEventFunc(ctx, evt)
}
func (c *mockClient) ReadPlayerAction(ctx context.Context) (model.PlayerAction, error) {
	return c.ReadPlayerActionFunc(ctx)
}
