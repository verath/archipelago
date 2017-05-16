package wire

import (
	"context"
)

// A client represents a (remote) player connection where bytes can
// be read from and written to.
type client interface {
	// Disconnect disconnects the client.
	Disconnect()
	// DisconnectCh returns a channel that is closed when the client
	// is disconnected.
	DisconnectCh() <-chan struct{}
	// WriteMessage writes a message represented by a byte slice to the client.
	// WriteMessage should block until the message has been written, or the
	// context is cancelled.
	WriteMessage(ctx context.Context, msg []byte) error
	// ReadMessage reads a message represented by a byte slice from the client.
	// ReadMessage should block until a message has been read, or the context
	// is cancelled.
	ReadMessage(ctx context.Context) ([]byte, error)
}
