package model

// PlayerEventTick is the player-specific game tick event.
type PlayerEventTick struct {
	// Game is a player-specific copy of the game instance at the time of
	// this tick event.
	Game *Game
}

// EventTick is the game tick event.
type EventTick struct {
	// Game is a copy of the game instance at the time of this tick event.
	Game *Game
}

// ToPlayerEvent turn the EventTick into a PlayerEventTick.
func (evt *EventTick) ToPlayerEvent(playerID PlayerID) PlayerEvent {
	game := evt.Game.Copy()
	evt.applyFogOfWar(game, game.Player(playerID))
	return &PlayerEventTick{Game: game}
}

func (*EventTick) applyFogOfWar(g *Game, player *Player) {
	for _, island := range g.Islands() {
		if player.IsInFogOfWar(island.Position()) {
			island.SetStrength(-1)
		}
	}
	for _, airplane := range g.Airplanes() {
		if player.IsInFogOfWar(airplane.Position().ToCoordinate()) {
			airplane.SetStrength(-1)
		}
	}
	// Clear fog of war data for other players.
	for _, p := range g.Players() {
		if !p.Equals(player) {
			p.SetFogOfWar(nil)
		}
	}
}

// PlayerEventMarker is the marker implementation of PlayerEvent.
func (evt *PlayerEventTick) PlayerEventMarker() {}
