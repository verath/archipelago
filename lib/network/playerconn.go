package network

import (
	"github.com/verath/archipelago/lib/event"
)

type PlayerConn interface {
	ActionChannel() <-chan PlayerAction
	OnEvent(event.Event)
}
