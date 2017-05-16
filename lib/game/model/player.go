package model

// Player represents a player in the game model.
type Player struct {
	id PlayerID
}

// NewPlayer creates a new Player with a new generated ID.
func NewPlayer() (*Player, error) {
	id := PlayerID(NextModelID())
	return &Player{
		id: id,
	}, nil
}

// ID returns the PlayerID of the Player.
func (p *Player) ID() PlayerID {
	return p.id
}

// Equals compares two players for equality. Equality is determined
// by the ID of each player. Always returns false if other is nil.
func (p *Player) Equals(other *Player) bool {
	return other != nil && p.id == other.id
}

// Copy performs a deep copy of the Player, returning the copy.
func (p *Player) Copy() *Player {
	return &Player{
		id: p.id,
	}
}
