package model

// actionLaunch wraps a PlayerActionLaunch, also providing
// the PlayerID of the player that created the action.
type actionLaunch struct {
	PlayerActionLaunch
	playerID PlayerID
}

// PlayerActionLaunch is a player action for launching an
// airplane from an island to another island.
type PlayerActionLaunch struct {
	From IslandID
	To   IslandID
}

// ToAction transforms the PlayerActionLaunch, and a PlayerID, to
// a new Action. The returned action copies the PlayerActionLaunch
// struct values.
func (act PlayerActionLaunch) ToAction(playerID PlayerID) Action {
	return &actionLaunch{
		PlayerActionLaunch: act,
		playerID:           playerID,
	}
}

// Apply applies the launch action to a game instance.
func (act *actionLaunch) Apply(g *Game) ([]Event, error) {
	fromIsland := g.Island(act.From)
	toIsland := g.Island(act.To)
	owningPlayer := g.Player(act.playerID)
	if owningPlayer == nil {
		return nil, newIllegalActionError(owningPlayer, "owning player does not exist")
	}
	if fromIsland == nil {
		return nil, newIllegalActionError(owningPlayer, "from island does not exist")
	}
	if toIsland == nil {
		return nil, newIllegalActionError(owningPlayer, "to island does not exist")
	}
	if fromIsland.ID() == toIsland.ID() {
		return nil, newIllegalActionError(owningPlayer, "fromIsland == toIsland")
	}
	// The errors below might happen due to client being behind the server state,
	// as such we treat them as invalid actions rather than illegal actions.
	if !fromIsland.IsOwnedBy(owningPlayer) {
		return nil, newInvalidActionError(owningPlayer, "fromIsland is not owned by sending player")
	}
	if fromIsland.Strength() < 2 {
		return nil, newInvalidActionError(owningPlayer, "from island strength < 2")
	}
	// Launch an airplane with half the army of the island
	islandStr := fromIsland.Strength()
	airplaneStr := islandStr / 2
	fromIsland.SetStrength(islandStr - airplaneStr)
	airplane := NewAirplane(fromIsland, toIsland, owningPlayer, airplaneStr)
	g.AddAirplane(airplane)
	return nil, nil
}
