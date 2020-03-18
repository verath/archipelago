package model

// Player represents a player in the game model.
type Player struct {
	id PlayerID
	// alive is set false when the player is no longer alive in the game. Used
	// to short-circuit logic that only applies to alive players.
	alive bool
	// hasLeft is set true if the player leaves the game.
	hasLeft bool
	// fogOfWar is a set of coordinates for tiles where the player has Fog of
	// War (limited) vision.
	fogOfWar map[Coordinate]struct{}
}

// NewPlayer creates a new Player with a new generated ID.
func NewPlayer() (*Player, error) {
	id := PlayerID(NextModelID())
	return &Player{
		id:       id,
		alive:    true,
		fogOfWar: nil,
	}, nil
}

// ID returns the PlayerID of the Player.
func (p *Player) ID() PlayerID {
	return p.id
}

// IsAlive returns the alive state of the player, i.e. if the player is still
// alive in the game.
func (p *Player) IsAlive() bool {
	return p.alive
}

// SetAlive sets the alive state of the player.
func (p *Player) SetAlive(alive bool) {
	p.alive = alive
}

// HasLeft returns true if the player has left the game.
func (p *Player) HasLeft() bool {
	return p.hasLeft
}

// SetHasLeft sets the flag for if the player has left the game.
func (p *Player) SetHasLeft(hasLeft bool) {
	p.hasLeft = hasLeft
}

// IsInFogOfWar tests if the given Coordinate is in fog of war for the player.
func (p *Player) IsInFogOfWar(c Coordinate) bool {
	_, inFoW := p.fogOfWar[c]
	return inFoW
}

// FogOfWar returns the set of coordinates where the player has fog of war
// vision.
func (p *Player) FogOfWar() map[Coordinate]struct{} {
	return p.fogOfWar
}

// SetFogOfWar sets the coordinates where the player has fog of war vision.
func (p *Player) SetFogOfWar(fogOfWar map[Coordinate]struct{}) {
	p.fogOfWar = fogOfWar
}

// Equals compares two players for equality. Equality is determined
// by the ID of each player. Always returns false if other is nil.
func (p *Player) Equals(other *Player) bool {
	return other != nil && p.id == other.id
}

// Copy performs a deep copy of the Player, returning the copy.
func (p *Player) Copy() *Player {
	fogOfWar := make(map[Coordinate]struct{}, len(p.fogOfWar))
	for c, v := range p.fogOfWar {
		fogOfWar[c] = v
	}
	return &Player{
		id:       p.id,
		alive:    p.alive,
		fogOfWar: fogOfWar,
	}
}
