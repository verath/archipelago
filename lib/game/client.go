package game

import (
	"context"
)

// A client represents a (remote) player connection that can be
// written to and read from.
type client interface {
	// Disconnect disconnects the client.
	Disconnect()
	// DisconnectCh returns a channel that is closed when the client
	// is disconnected.
	DisconnectCh() <-chan struct{}
	// WriteMessage writes a message to the client.
	WriteMessage(ctx context.Context, msg []byte) error
	// ReadMessage reads a message from the client.
	ReadMessage(ctx context.Context) ([]byte, error)
}
