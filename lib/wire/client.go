package wire

import (
	"context"
)

// A Client represents a (remote) player connection where bytes can
// be read from and written to.
type Client interface {
	// Disconnect disconnects the Client.
	Disconnect()
	// DisconnectCh returns a channel that is closed when the Client
	// is disconnected.
	DisconnectCh() <-chan struct{}
	// WriteMessage writes a message represented by a byte slice to the Client.
	// WriteMessage should block until the message has been written, or the
	// context is cancelled.
	WriteMessage(ctx context.Context, msg []byte) error
	// ReadMessage reads a message represented by a byte slice from the Client.
	// ReadMessage should block until a message has been read, or the context
	// is cancelled.
	ReadMessage(ctx context.Context) ([]byte, error)
}
