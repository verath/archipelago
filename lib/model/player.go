package model

import (
	"github.com/nu7hatch/gouuid"
)

type PlayerID string

type player struct {
	name string
	id   PlayerID
}

func (p *player) Name() string {
	return p.name
}

func (p *player) SetName(name string) {
	p.name = name
}

func (p *player) ID() PlayerID {
	return p.id
}

func NewPlayer(name string) (*player, error) {
	id, err := uuid.NewV4()
	if err != nil {
		return nil, err
	}
	return NewPlayerWithId(name, id.String())
}

func NewPlayerWithId(name, id string) (*player, error) {
	return &player{
		name: name,
		id: PlayerID(id),
	}, nil
}
