package model

type (
	// Event is a (partially) created event that is to be sent
	// to a player. As an event might depend on the player it is
	// sent to, an Event is always transformed into a PlayerEvent
	// for each player.
	Event interface {
		// Turns the event into a PlayerEvent for the specified
		// player.
		ToPlayerEvent(playerID PlayerID) PlayerEvent
	}

	// PlayerEvent is an event that is meant for a specific player. The
	// PlayerEvent is a marker interface used instead of an empty interface
	// to better convey the intention, and allow IDEs to find implementations.
	// It is still necessary for the PlayerEvent to be type switched before
	// it can be used.
	PlayerEvent interface {
		// PlayerEventMarker is a dummy method used as marker for
		// things that implement the PlayerEvent interface.
		PlayerEventMarker()
	}
)

// IsGameOverEvent tests if an event is a game over event.
func IsGameOverEvent(evt Event) bool {
	_, ok := evt.(*EventGameOver)
	return ok
}
