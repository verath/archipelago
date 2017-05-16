package game

import (
	"context"
	"github.com/verath/archipelago/lib/game/model"
)

// A client represents a (remote) player connection that can be
// written to and read from.
type client interface {
	// Disconnect disconnects the client.
	Disconnect()
	// DisconnectCh returns a channel that is closed when the client
	// is disconnected.
	DisconnectCh() <-chan struct{}
	// WritePlayerEvent writes a PlayerEvent to the client.
	WritePlayerEvent(ctx context.Context, evt model.PlayerEvent) error
	// ReadPlayerAction reads a PlayerAction from the client.
	ReadPlayerAction(ctx context.Context) (model.PlayerAction, error)
}
