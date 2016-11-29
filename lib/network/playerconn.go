package network

import (
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/event"
)

type PlayerConn interface {
	ActionChannel() <-chan action.Action
	OnEvent(event.Event)
}
