package model

// PlayerEventTick is the player-specific game tick event.
type PlayerEventTick struct {
	*EventTick
}

// EventTick is the game tick event.
type EventTick struct {
	// Game is the game instance associated with the tick event. The
	// game instance is shared between each PlayerEventTick created from
	// the same EventTick, and must not be modified.
	Game *Game
}

// ToPlayerEvent turn the EventTick into a PlayerEventTick.
func (evt *EventTick) ToPlayerEvent(playerID PlayerID) PlayerEvent {
	return &PlayerEventTick{EventTick: evt}
}

// playerEventMarker is the marker implementation of PlayerEvent.
func (evt *PlayerEventTick) playerEventMarker() {}
