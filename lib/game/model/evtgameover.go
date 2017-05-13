package model

import "encoding/json"

// PlayerEventGameOver is the player-specific game over event.
// PlayerEventGameOver is only a thin wrapper around eventGameOver,
// as the game over event does not contain any player-specific
// properties.
type PlayerEventGameOver struct {
	eventGameOver *eventGameOver
}

// eventGameOver is the Event representing game over. The event
// is sent once the game is over. If the game had a winner, the
// player id of the winner is included in the event.
type eventGameOver struct {
	winnerID PlayerID
}

// NewEventGameOver creates a new eventGameOver with the winnerID of
// the specified player, or an empty winnerID if winner is nil.
func NewEventGameOver(winner *Player) *eventGameOver {
	var winnerID PlayerID
	if winner != nil {
		winnerID = winner.ID()
	}
	return &eventGameOver{winnerID: winnerID}
}

// ToPlayerEvent returns a PlayerEventGameOver wrapper around
// the eventGameOver, representing the event for the specified.
func (evt *eventGameOver) ToPlayerEvent(_ PlayerID) PlayerEvent {
	return &PlayerEventGameOver{evt}
}

// WinnerID returns the PlayerID of the winner of the game.
// For games without a winner, WinnerID returns the empty
// string.
func (evt *PlayerEventGameOver) WinnerID() PlayerID {
	return evt.eventGameOver.winnerID
}

// MarshalJSON marshals the event as to a json byte array.
func (evt *PlayerEventGameOver) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		WinnerID PlayerID `json:"winner_id"`
	}{
		WinnerID: evt.eventGameOver.winnerID,
	})
}

// playerEventMarker is the marker implementation of PlayerEvent.
func (evt *PlayerEventGameOver) playerEventMarker() {}
