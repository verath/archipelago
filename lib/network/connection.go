package network

import "context"

// Connection is an abstraction of a connection to a peer that
// supports sending and receiving byte slices.
type Connection interface {
	// Reads a message from the connection. If ReadMessage returns
	// an error, it is assumed that the connection will never
	// return a message again.  Only one goroutine may call
	// ReadMessage method at the same time.
	ReadMessage(ctx context.Context) ([]byte, error)

	// Writes a message to the connection. Only one goroutine
	// may call this method at once.
	WriteMessage(ctx context.Context, message []byte) error

	// Shutdown attempts to cleanly close the connection.
	Shutdown(ctx context.Context) error

	// Closes the connection. This method must unblock any current
	// reader or writers.
	Close() error
}
