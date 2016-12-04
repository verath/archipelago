package model

import (
	"encoding/json"
)

// We wrap the identifier type in a PlayerID type to add
// stronger type-support when working with player ids.
type PlayerID identifier

func (playerID PlayerID) Equals(otherID PlayerID) bool {
	return identifier(playerID).Equals(identifier(otherID))
}

type Player struct {
	identifier

	name string
}

func (p *Player) Name() string {
	return p.name
}

func (p *Player) SetName(name string) {
	p.name = name
}

func (p *Player) ID() PlayerID {
	return PlayerID(p.identifier.ID())
}

func (p *Player) Equals(other *Player) bool {
	return (other != nil && p.identifier.Equals(other.identifier))
}

func (p *Player) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		ID   identifier
		Name string
	}{
		ID:   p.identifier,
		Name: p.name,
	})
}

func (p *Player) Copy() *Player {
	return &Player{
		identifier: p.identifier,
		name:       p.name,
	}
}

func NewPlayer(name string) (*Player, error) {
	identifier, err := newIdentifier()
	if err != nil {
		return nil, err
	}
	return &Player{
		identifier: identifier,
		name:       name,
	}, nil
}
