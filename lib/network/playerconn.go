package network

import (
	"github.com/verath/archipelago/lib/event"
)

type PlayerConn interface {
	// A channel that is closed to signal that PlayerConn
	// connection has disconnected, and that no more actions
	// will be sent.
	DisconnectChannel() <-chan interface{}

	// Registers a channel to be forwarded all PlayerActions
	// from this PlayerConn. The channel will be closed if the
	// PlayerConn is disconnected.
	AddActionListener(chan<- PlayerAction)

	// Deregisters a channel from the PlayerConn. If the channel
	// was not registered, this method is a no-op.
	RemoveActionListener(chan<- PlayerAction)

	OnEvent(event.Event)
}
