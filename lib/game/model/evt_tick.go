package model

// PlayerEventTick is the player-specific game tick event.
type PlayerEventTick struct {
	// PlayerID is the player the event is for.
	PlayerID PlayerID
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
	return &PlayerEventTick{PlayerID: playerID, Game: game}
}

func (*EventTick) applyFogOfWar(g *Game, player *Player) {
	for _, island := range g.Islands() {
		if player.IsInFogOfWar(island.Position()) {
			island.SetStrength(-1)
		}
	}
	for _, airplane := range g.Airplanes() {
		airplaneCoord := airplane.position.ToCoordinate()
		if !airplaneCoord.IsWithin(g.Size()) || player.IsInFogOfWar(airplaneCoord) {
			airplane.SetStrength(-1)
		}
	}
	// Clear fog of war data and launch seqs of other players, they are only
	// meaningful to the player itself.
	for _, p := range g.Players() {
		if p != player {
			p.SetFogOfWar(nil)
			p.SetLastLaunchSeq(0)
		}
	}
	for _, airplane := range g.Airplanes() {
		if !airplane.IsOwnedBy(player.ID()) {
			airplane.SetLaunchSeq(0)
		}
	}
}

// PlayerEventMarker is the marker implementation of PlayerEvent.
func (evt *PlayerEventTick) PlayerEventMarker() {}
