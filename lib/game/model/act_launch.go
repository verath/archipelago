package model

import "errors"

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
	// Seq is an optional (0 if not set) sequence number chosen by the client,
	// increasing with each launch. It is recorded as the player's
	// LastLaunchSeq when the action is applied, whether the launch succeeds
	// or not, and as the LaunchSeq of the launched airplane.
	Seq uint32
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
func (act *actionLaunch) Apply(game *Game) ([]Event, error) {
	fromIsland := game.Island(act.From)
	toIsland := game.Island(act.To)
	owningPlayer := game.Player(act.playerID)
	if owningPlayer == nil {
		return nil, errors.New("Owning player does not exist")
	}
	// Record that the launch was processed before checking if it is legal, so
	// the client also learns about rejected launches.
	if act.Seq > owningPlayer.LastLaunchSeq() {
		owningPlayer.SetLastLaunchSeq(act.Seq)
	}
	if fromIsland == nil {
		return nil, NewIllegalActionError(errors.New("From island does not exist"))
	}
	if toIsland == nil {
		return nil, NewIllegalActionError(errors.New("To island does not exist"))
	}
	if fromIsland.ID() == toIsland.ID() {
		return nil, NewIllegalActionError(errors.New("fromIsland == toIsland"))
	}
	if !fromIsland.IsOwnedBy(owningPlayer.ID()) {
		return nil, NewIllegalActionError(errors.New("fromIsland is not owned by sending player"))
	}
	if fromIsland.Strength() < 2 {
		return nil, NewIllegalActionError(errors.New("from island strength < 2"))
	}
	// Launch an airplane with half the army of the island
	islandStr := fromIsland.Strength()
	airplaneStr := islandStr / 2
	fromIsland.SetStrength(islandStr - airplaneStr)
	airplane := NewAirplane(fromIsland.Position(), toIsland, owningPlayer.ID(), airplaneStr)
	airplane.SetLaunchSeq(act.Seq)
	game.AddAirplane(airplane)
	return nil, nil
}
