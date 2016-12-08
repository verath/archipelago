package network

import "context"

// A connection is an abstraction of a connection to a player
// that supports sending and receiving bytes of data.
type Connection interface {

	// Returns the send channel. Messages on the send channel will
	// be written to the underlying connection. If the send channel
	// is closed, the connection will shutdown.
	SendCh() chan<- []byte

	// Returns the receive channel, where messages received from the
	// underlying connection is written. The receive channel is closed
	// if the connection is disconnected.
	ReceiveCh() <-chan []byte

	// Starts the connection and blocks until the connection is
	// disconnected. Canceling the context will force the connection
	// to shutdown. Run always returns a non-nil error
	Run(ctx context.Context) error
}
