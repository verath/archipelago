package model

// army is a representation of an army owned by a player.
// The army struct is not used directly, but instead
// embedded in Islands and Airplanes.
type army struct {
	owner    *Player
	strength int64
}

// newArmy creates a new army with the provided owner and strength.
// The provided owner must not be nil, or the method will panic.
func newArmy(owner *Player, strength int64) *army {
	if owner == nil {
		panic("Owner cannot be nil!")
	}
	return &army{
		owner:    owner,
		strength: strength,
	}
}

// Owner returns the Player owning the army.
func (a *army) Owner() *Player {
	return a.owner
}

// SetOwner changes the owner of the army to the provided Player.
// The provided player must not be nil, or the method will panic.
func (a *army) SetOwner(owner *Player) {
	if owner == nil {
		panic("Owner cannot be nil!")
	}
	a.owner = owner
}

// Strength is a getter for the army strength.
func (a *army) Strength() int64 {
	return a.strength
}

// SetStrength is a setter for the army strength.
func (a *army) SetStrength(strength int64) {
	a.strength = strength
}

// IsOwnedBy tests if the owning Player equals the provided Player.
func (a *army) IsOwnedBy(player *Player) bool {
	return a.owner.Equals(player)
}

// Copy performs a deep copy of the army.
func (a *army) Copy() *army {
	return &army{
		owner:    a.owner.Copy(),
		strength: a.strength,
	}
}
