package model

import (
	"encoding/json"
)

type Player struct {
	id PlayerID
}

func (p *Player) ID() PlayerID {
	return p.id
}

func (p *Player) Equals(other *Player) bool {
	return other != nil && p.id == other.id
}

func (p *Player) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		ID PlayerID `json:"id"`
	}{
		ID: p.id,
	})
}

func (p *Player) Copy() *Player {
	return &Player{
		id: p.id,
	}
}

func NewPlayer() (*Player, error) {
	id := PlayerID(NewModelID())
	return &Player{
		id: id,
	}, nil
}
