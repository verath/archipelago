package network

// Connection handler is a handler that handles new connection.
type ConnectionHandler interface {
	// Handle the provided connection. Implementation
	// should not be blocking.
	HandleConnection(connection) error
}
