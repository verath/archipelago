package network

// ClientConnectListener is a listener for when new clients
// has connected.
type ClientConnectListener interface {

	// Called when a new client has connected. The client
	// provided is _not_ in a started state. This method
	// is called on a new goroutine, and may be called
	// by multiple goroutines simultaneously.
	OnClientConnected(client Client)
}
