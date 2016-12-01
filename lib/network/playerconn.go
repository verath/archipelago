package network

import (
	"github.com/verath/archipelago/lib/event"
)

type PlayerConn interface {
	ActionChannel() <-chan PlayerAction

	OnEvent(event.Event)

	// A channel that is closed to signal that the connection
	// represented by the PlayerConn has disconnected, and
	// that this PlayerConn instance will not send any more
	// actions.
	//
	// Note that the ActionChannel will also be closed on
	// disconnect, and that this channel is only necessary
	// when one only cares about the disconnection signal
	DisconnectChannel() <-chan interface{}
}
