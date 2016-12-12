package model

import (
	"encoding/json"
)

// We wrap the identifier type in a PlayerID type to add
// stronger type-support when working with player ids.
type PlayerID Identifier

func (playerID PlayerID) Equals(otherID PlayerID) bool {
	return Identifier(playerID).Equals(Identifier(otherID))
}

type Player struct {
	Identifier

	name string
}

func (p *Player) ID() PlayerID {
	return PlayerID(p.Identifier)
}

func (p *Player) Name() string {
	return p.name
}

func (p *Player) Equals(other *Player) bool {
	return (other != nil && p.Identifier.Equals(other.Identifier))
}

func (p *Player) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		ID   Identifier `json:"id"`
		Name string     `json:"name"`
	}{
		ID:   p.Identifier,
		Name: p.name,
	})
}

func (p *Player) Copy() *Player {
	return &Player{
		Identifier: p.Identifier,
		name:       p.name,
	}
}

func NewPlayer(name string) (*Player, error) {
	identifier, err := NewIdentifier()
	if err != nil {
		return nil, err
	}
	return &Player{
		Identifier: identifier,
		name:       name,
	}, nil
}
