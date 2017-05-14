package model

import (
	"encoding/json"
)

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

// MarshalJSON marshals the Player instance as JSON by recursively
// marshalling each sub-component of the Player.
func (p *Player) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		ID PlayerID `json:"id"`
	}{
		ID: p.id,
	})
}

// Copy performs a deep copy of the Player, returning the copy.
func (p *Player) Copy() *Player {
	return &Player{
		id: p.id,
	}
}
