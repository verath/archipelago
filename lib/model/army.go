package model

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

func newArmy(owner *player, strength int) (*army, error) {
	return &army{
		owner:    owner,
		strength: strength,
	}, nil
}
