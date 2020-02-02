package model

import "time"

// PlayerEventGameStart is the player-specific game start event.
type PlayerEventGameStart struct {
	*EventGameStart
	// PlayerID is the PlayerID that the receiver represents, used for
	// all subsequent events for this particular game.
	PlayerID PlayerID
}

// EventGameStart is the game start event.
type EventGameStart struct {
	// TickInterval is the (approximate) time between each
	// tick of the game on the server side
	TickInterval time.Duration
}

// ToPlayerEvent turns the EventGameStart into a player specific
// PlayerEventGameStart.
func (evt *EventGameStart) ToPlayerEvent(playerID PlayerID) PlayerEvent {
	return &PlayerEventGameStart{
		EventGameStart: evt,
		PlayerID:       playerID,
	}
}

// PlayerEventMarker is the marker implementation of PlayerEvent.
func (evt *PlayerEventGameStart) PlayerEventMarker() {}
