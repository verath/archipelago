package model

<<<<<<< HEAD
// A leave action is an action posted when a player is leaving the game.
// The action results in a game over, with the other player as the winning
// player.
type leaveAction struct {
	// The PlayerID of the leaving player
	leaverID PlayerID
=======
// actionLeave wraps a PlayerActionLeave, also providing
// the PlayerID of the player that created the action.
type actionLeave struct {
	PlayerActionLeave
	playerID PlayerID
>>>>>>> master
}

// PlayerActionLeave is a player action for leaving
// the game. The action results in the leaving player
// losing the game.
type PlayerActionLeave struct{}

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
<<<<<<< HEAD

=======
>>>>>>> master
	gameOverEvent := NewEventGameOver(winner)
	return []Event{gameOverEvent}, nil
}
