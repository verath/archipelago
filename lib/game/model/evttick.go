package model

import "encoding/json"

// PlayerEventTick is the player-specific game tick event.
type PlayerEventTick struct {
	eventTick *eventTick
}

// eventTick is the game tick event.
type eventTick struct {
	game *Game
}

// NewEventTick creates a new tick event from the give game. The game
// is copied before being stored.
func NewEventTick(game *Game) *eventTick {
	gameCpy := game.Copy()
	return &eventTick{gameCpy}
}

// ToPlayerEvent turn the eventTick into a PlayerEventTick.
func (evt *eventTick) ToPlayerEvent(playerID PlayerID) PlayerEvent {
	return &PlayerEventTick{evt}
}

// Game returns the game instance associated with the tick event. The
// game instance is shared between each PlayerEventTick created from
// the same eventTick, and must therefore not be modified.
func (evt *PlayerEventTick) Game() *Game {
	return evt.eventTick.game
}

// MarshalJSON marshals the event as to a json byte array.
func (evt *PlayerEventTick) MarshalJSON() ([]byte, error) {
	return json.Marshal(evt.eventTick.game)
}

// playerEventMarker is the marker implementation of PlayerEvent.
func (evt *PlayerEventTick) playerEventMarker() {}
