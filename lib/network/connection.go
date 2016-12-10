package network

import (
	"context"
)

// A connection is an abstraction of a connection to a player
// that supports sending and receiving bytes of data.
type Connection interface {
	ReadMessage(ctx context.Context) ([]byte, error)

	WriteMessage(ctx context.Context, message []byte) error

	// Starts the connection and blocks until the connection is
	// disconnected. Canceling the context will force the connection
	// to shutdown. Run always returns a non-nil error
	Run(ctx context.Context) error
}
