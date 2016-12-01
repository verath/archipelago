package model

import "encoding/json"

type army struct {
	owner    *Player
	strength int
}

func (a *army) Owner() *Player {
	return a.owner
}

func (a *army) Strength() int {
	return a.strength
}

func (a *army) SetStrength(strength int) {
	a.strength = strength
}

func (a *army) IsOwnedBy(id PlayerID) bool {
	return a.owner != nil && a.owner.id == id
}

func (a *army) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		OwnerID  PlayerID
		Strength int
	}{
		OwnerID:  a.owner.id,
		Strength: a.strength,
	})
}

func (a *army) Copy() *army {
	return &army{
		owner:    a.owner.Copy(),
		strength: a.strength,
	}
}

func newArmy(owner *Player, strength int) *army {
	if owner == nil {
		panic("Owner cannot be nil!")
	}

	return &army{
		owner:    owner,
		strength: strength,
	}
}
