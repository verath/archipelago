package events

import (
	"github.com/verath/archipelago/lib/game/model"
)

const (
	EventTypeTick  = "evt_tick"
	EventTypeStart = "evt_game_start"
)

type (
	// An event is a (partially) created event that is to be sent
	// to a player. As an event might depend on the player it is
	// sent to, an Event is always transformed into a PlayerEvent
	// for each player.
	Event interface {
		// Turns the event into a PlayerEvent for the specified
		// player.
		ToPlayerEvent(playerID model.PlayerID) PlayerEvent
	}

	// A player event is an event to be sent to a specific player.
	PlayerEvent interface {
		// Returns a string uniquely identifying the type of event.
		Type() string
		// Returns the data contained in the event.
		Data() interface{}
	}
)
