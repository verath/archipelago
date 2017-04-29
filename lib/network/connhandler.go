package network

// ConnectionHandler is a handler that handles new Connections.
type ConnectionHandler interface {
	// Handle the provided connection. The method must be called on a separate
	// go routine.
	HandleConnection(connection Connection)
}

// ConnectionHandlerFunc is a type for implementing the ConnectionHandler interface
// was a function.
type ConnectionHandlerFunc func(connection Connection)

// HandleConnection calls the function itself.
func (f ConnectionHandlerFunc) HandleConnection(connection Connection) {
	f(connection)
}
