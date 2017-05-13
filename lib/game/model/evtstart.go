package model

import "encoding/json"

// PlayerEventGameStart is the player-specific game start event.
type PlayerEventGameStart struct {
	// playerID is the playerID that the receiver represents.
	playerID PlayerID
}

// eventGameStart is the game start event.
type eventGameStart struct{}

// NewEventGameStart creates a new eventGameStart
func NewEventGameStart() *eventGameStart {
	return &eventGameStart{}
}

// ToPlayerEvent turns the eventGameStart into a player specific
// PlayerEventGameStart.
func (evt *eventGameStart) ToPlayerEvent(playerID PlayerID) PlayerEvent {
	return &PlayerEventGameStart{playerID}
}

// PlayerID returns the playerID of the event. This playerID
// should be considered the player that the receiver represents
// for all subsequent events for this particular game.
func (evt *PlayerEventGameStart) PlayerID() PlayerID {
	return evt.playerID
}

// MarshalJSON marshals the event as to a json byte array.
func (evt *PlayerEventGameStart) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		PlayerID PlayerID `json:"player_id"`
	}{
		PlayerID: evt.playerID,
	})
}

// playerEventMarker is the marker implementation of PlayerEvent.
func (evt *PlayerEventGameStart) playerEventMarker() {}
