package model

// A leave action is an action posted when a player is leaving the game.
// The action results in a game over, with the other player as the winning
// player.
type leaveAction struct {
	// The PlayerID of the leaving player
	leaverID PlayerID
}

// Creates a new leave action, with the specified player as the player
// leaving the game.
func NewLeaveAction(leaverID PlayerID) Action {
	act := &leaveAction{}
	return act.ToAction(leaverID)
}

// We implement ToAction by setting the leaverID property and returning
// ourselves, as we already implement the Action interface.
func (a *leaveAction) ToAction(playerID PlayerID) Action {
	a.leaverID = playerID
	return a
}

// Applies the leave action, producing a GameOver event with the
// remaining player as the winner.
func (a *leaveAction) Apply(game *Game) ([]Event, error) {
	winner := game.Opponent(a.leaverID)
	if winner == nil {
		return nil, newIllegalActionError(nil, "Could not determine winenr")
	}

	gameOverEvent := NewEventGameOver(winner)
	return []Event{gameOverEvent}, nil
}
