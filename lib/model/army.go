package model

import "encoding/json"

type army struct {
	owner    *player
	strength int
}

func (a *army) Owner() *player {
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
	var ownerId *PlayerID
	if a.owner != nil {
		ownerId = &a.owner.id
	}

	return json.Marshal(&struct {
		OwnerID  *PlayerID
		Strength int
	}{
		OwnerID:  ownerId,
		Strength: a.strength,
	})
}

func newArmy(owner *player, strength int) (*army, error) {
	return &army{
		owner:    owner,
		strength: strength,
	}, nil
}
