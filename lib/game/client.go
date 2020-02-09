package game

import (
	"context"

	"github.com/verath/archipelago/lib/game/model"
)

// A Client represents a (remote) player connection that can be
// written to and read from.
type Client interface {
	// Disconnect disconnects the Client.
	Disconnect()
	// DisconnectCh returns a channel that is closed when the Client
	// is disconnected.
	DisconnectCh() <-chan struct{}
	// WritePlayerEvent writes a PlayerEvent to the Client. Blocks until the
	// event has been sucessfully written, an error occurs, or the context is
	// canceled.
	WritePlayerEvent(ctx context.Context, evt model.PlayerEvent) error
	// ReadPlayerAction reads a PlayerAction from the Client.
	ReadPlayerAction(ctx context.Context) (model.PlayerAction, error)
}
