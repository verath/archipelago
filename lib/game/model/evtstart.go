package model

import "encoding/json"

// PlayerEventGameStart is the player-specific game start event.
type PlayerEventGameStart struct {
	// PlayerID is the PlayerID that the receiver represents, used for
	// all subsequent events for this particular game.
	PlayerID PlayerID
}

// EventGameStart is the game start event.
type EventGameStart struct{}

// ToPlayerEvent turns the EventGameStart into a player specific
// PlayerEventGameStart.
func (evt *EventGameStart) ToPlayerEvent(playerID PlayerID) PlayerEvent {
	return &PlayerEventGameStart{PlayerID: playerID}
}

// MarshalJSON marshals the event as to a json byte array.
func (evt *PlayerEventGameStart) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		PlayerID PlayerID `json:"player_id"`
	}{
		PlayerID: evt.PlayerID,
	})
}

// playerEventMarker is the marker implementation of PlayerEvent.
func (evt *PlayerEventGameStart) playerEventMarker() {}
