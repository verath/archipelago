package model

import "encoding/json"

type army struct {
	owner    *Player
	strength int64
}

func (a *army) Owner() *Player {
	return a.owner
}

func (a *army) SetOwner(owner *Player) {
	a.owner = owner
}

func (a *army) Strength() int64 {
	return a.strength
}

func (a *army) SetStrength(strength int64) {
	a.strength = strength
}

func (a *army) IsOwnedBy(player *Player) bool {
	return a.owner.Equals(player)
}

func (a *army) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		OwnerID  PlayerID `json:"owner_id"`
		Strength int64    `json:"strength"`
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

func newArmy(owner *Player, strength int64) *army {
	if owner == nil {
		panic("Owner cannot be nil!")
	}

	return &army{
		owner:    owner,
		strength: strength,
	}
}
