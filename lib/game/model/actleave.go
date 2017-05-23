package model

// actionLeave wraps a PlayerActionLeave, also providing
// the PlayerID of the player that created the action.
type actionLeave struct {
	PlayerActionLeave
	playerID PlayerID
}

// PlayerActionLeave is a player action for leaving the game. The action
// results in the neutral player taking ownership of any airplanes and
// islands currently owned by the leaving player.
type PlayerActionLeave struct{}

// ToAction returns a new leave action associated with the provided
// playerID
func (act PlayerActionLeave) ToAction(playerID PlayerID) Action {
	return &actionLeave{
		PlayerActionLeave: act,
		playerID:          playerID,
	}
}

// Applies the leave action, giving ownership of all airplanes and islands
// owned by the leaving player to the neutral player.
func (a *actionLeave) Apply(game *Game) ([]Event, error) {
	leavingPlayer := game.Player(a.playerID)
	neutralPlayer := game.PlayerNeutral()
	if leavingPlayer == nil {
		return nil, newIllegalActionError(nil, "leavingPlayer was nil")
	}
	// Set ownership of leaving player's islands to neutral player
	for _, island := range game.Islands() {
		if island.IsOwnedBy(leavingPlayer) {
			island.SetOwner(neutralPlayer)
		}
	}
	// Set ownership of leaving player's airplanes to neutral player
	for _, airplane := range game.Airplanes() {
		if airplane.IsOwnedBy(leavingPlayer) {
			airplane.SetOwner(neutralPlayer)
		}
	}
	return nil, nil
}
