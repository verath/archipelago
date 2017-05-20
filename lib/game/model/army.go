package model

// Army is a representation of an Army owned by a player.
// The Army struct is not used directly, but instead
// embedded in Islands and Airplanes.
type Army struct {
	owner    *Player
	strength int64
}

// NewArmy creates a new Army with the provided owner and strength.
// The provided owner must not be nil, or the method will panic.
func NewArmy(owner *Player, strength int64) *Army {
	if owner == nil {
		panic("Owner cannot be nil!")
	}
	return &Army{
		owner:    owner,
		strength: strength,
	}
}

// Owner returns the Player owning the Army.
func (a *Army) Owner() *Player {
	return a.owner
}

// SetOwner changes the owner of the Army to the provided Player.
// The provided player must not be nil, or the method will panic.
func (a *Army) SetOwner(owner *Player) {
	if owner == nil {
		panic("Owner cannot be nil!")
	}
	a.owner = owner
}

// Strength is a getter for the Army strength.
func (a *Army) Strength() int64 {
	return a.strength
}

// SetStrength is a setter for the Army strength.
func (a *Army) SetStrength(strength int64) {
	a.strength = strength
}

// IsOwnedBy tests if the owning Player equals the provided Player.
func (a *Army) IsOwnedBy(player *Player) bool {
	return a.owner.Equals(player)
}

// Copy performs a deep copy of the Army.
func (a *Army) Copy() *Army {
	return &Army{
		owner:    a.owner.Copy(),
		strength: a.strength,
	}
}
