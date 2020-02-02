package model

// PlayerEventGameOver is the player-specific game over event.
// PlayerEventGameOver is only a thin wrapper around EventGameOver,
// as the game over event does not contain any player-specific
// properties.
type PlayerEventGameOver struct {
	*EventGameOver
}

// EventGameOver is the Event representing game over. The event
// is sent once the game is over. If the game had a winner, the
// player id of the winner is included in the event.
type EventGameOver struct {
	WinnerID PlayerID
}

// NewEventGameOver creates a new EventGameOver with the WinnerID of
// the specified player, or an empty WinnerID if winner is nil.
func NewEventGameOver(winner *Player) *EventGameOver {
	var winnerID PlayerID
	if winner != nil {
		winnerID = winner.ID()
	}
	return &EventGameOver{WinnerID: winnerID}
}

// ToPlayerEvent returns a PlayerEventGameOver wrapper around
// the EventGameOver, representing the event for the specified.
func (evt *EventGameOver) ToPlayerEvent(_ PlayerID) PlayerEvent {
	return &PlayerEventGameOver{evt}
}

// PlayerEventMarker is the marker implementation of PlayerEvent.
func (evt *PlayerEventGameOver) PlayerEventMarker() {}
