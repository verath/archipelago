package model

import (
	"encoding/json"
	"github.com/nu7hatch/gouuid"
)

type PlayerID string

type Player struct {
	name string
	id   PlayerID
}

func (p *Player) Name() string {
	return p.name
}

func (p *Player) SetName(name string) {
	p.name = name
}

func (p *Player) ID() PlayerID {
	return p.id
}

func (p *Player) Equals(other *Player) bool {
	if other == nil {
		return false
	}
	return p.id == other.id
}

func (p *Player) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		Name string
		ID   PlayerID
	}{
		Name: p.name,
		ID:   p.id,
	})
}

func (p *Player) Copy() *Player {
	return &Player{
		id:   p.id,
		name: p.name,
	}
}

func NewPlayer(name string) (*Player, error) {
	id, err := uuid.NewV4()
	if err != nil {
		return nil, err
	}
	return NewPlayerWithId(name, id.String())
}

func NewPlayerWithId(name, id string) (*Player, error) {
	return &Player{
		name: name,
		id:   PlayerID(id),
	}, nil
}
