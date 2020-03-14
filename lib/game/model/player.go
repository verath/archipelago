package model

// Player represents a player in the game model.
type Player struct {
	id PlayerID
	// alive is set false when the player is no longer alive in the game. Used
	// to short-circuit logic that only applies to alive players.
	alive bool
}

// NewPlayer creates a new Player with a new generated ID.
func NewPlayer() (*Player, error) {
	id := PlayerID(NextModelID())
	return &Player{
		id:    id,
		alive: true,
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

// Equals compares two players for equality. Equality is determined
// by the ID of each player. Always returns false if other is nil.
func (p *Player) Equals(other *Player) bool {
	return other != nil && p.id == other.id
}

// Copy performs a deep copy of the Player, returning the copy.
func (p *Player) Copy() *Player {
	return &Player{
		id:    p.id,
		alive: p.alive,
	}
}
