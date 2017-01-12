package network

import "context"

// A connection is an abstraction of a connection to a peer that
// supports sending and receiving text messages, represented as
// byte slices.
type connection interface {
	// Reads a message from the connection. This method must
	// be continuously polled in order to detect connection
	// state changes. If ReadMessage returns an error, it is
	// assumed that the connection will never return a message
	// again and should be considered disconnected. Only one
	// goroutine may call this method at once.
	ReadMessage() ([]byte, error)

	// Writes a message to the connection. Only one goroutine
	// may call this method at once.
	WriteMessage(message []byte) error

	// Shutdown attempts to cleanly close the connection. If
	// the provided context expires before Shutdown is complete,
	// then the context's error is returned.
	Shutdown(ctx context.Context) error

	// Closes the connection. This method must unblock any current
	// reader or writers.
	Close() error
}
