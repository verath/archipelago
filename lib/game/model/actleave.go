package model

// actionLeave wraps a PlayerActionLeave, also providing
// the PlayerID of the player that created the action.
type actionLeave struct {
	PlayerActionLeave
	playerID PlayerID
}

// PlayerActionLeave is a player action for leaving the game. The
// action results in the leaving player losing the game.
type PlayerActionLeave struct{}

// ToAction returns a new leave action associated with the provided
// playerID
func (act PlayerActionLeave) ToAction(playerID PlayerID) Action {
	return &actionLeave{
		PlayerActionLeave: act,
		playerID:          playerID,
	}
}

// Applies the leave action, producing a GameOver event with the
// remaining player as the winner.
func (a *actionLeave) Apply(game *Game) ([]Event, error) {
	winner := game.Opponent(a.playerID)
	if winner == nil {
		return nil, newIllegalActionError(game.Player(a.playerID),
			"Could not determine winner")
	}
	gameOverEvent := NewEventGameOver(winner)
	return []Event{gameOverEvent}, nil
}
