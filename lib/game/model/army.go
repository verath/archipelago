package model

// Army is a representation of an Army owned by a player.
// The Army struct is not used directly, but instead
// embedded in Islands and Airplanes.
type Army struct {
	owner    PlayerID
	strength int64
}

// NewArmy creates a new Army with the provided owner and strength.
func NewArmy(owner PlayerID, strength int64) Army {
	return Army{
		owner:    owner,
		strength: strength,
	}
}

// Owner returns the PlayerID of the Player owning the Army.
func (a *Army) Owner() PlayerID {
	return a.owner
}

// SetOwner changes the owner of the Army to the Player with the
// provided PlayerID.
func (a *Army) SetOwner(owner PlayerID) {
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

// IsOwnedBy tests if the Army is owned by the Player with the provided
// PlayerID.
func (a *Army) IsOwnedBy(player PlayerID) bool {
	return a.owner == player
}
