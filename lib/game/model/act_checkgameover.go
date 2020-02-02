package model

// ActionCheckGameOver is an action for triggering a check for if
// the game is over.
type ActionCheckGameOver struct {
}

// Apply applies the ActionCheckGameOver to the game instance,
// returning a game over event if the game is over.
func (act *ActionCheckGameOver) Apply(game *Game) ([]Event, error) {
	if gameOver, winner := act.isGameOver(game); gameOver {
		return []Event{NewEventGameOver(winner)}, nil
	}
	return nil, nil
}

// isGameOver checks if the current game is over. A game is over when a
// player no longer controls any islands or airplanes. If the game is over,
// the winner is also returned. For a tie, the returned winner is nil.
func (act *ActionCheckGameOver) isGameOver(g *Game) (gameOver bool, winner *Player) {
	player1Alive := false
	player2Alive := false
	for _, airplane := range g.Airplanes() {
		if airplane.Owner().Equals(g.Player1()) {
			player1Alive = true
		} else if airplane.Owner().Equals(g.Player2()) {
			player2Alive = true
		}
		if player1Alive && player2Alive {
			return false, nil
		}
	}
	for _, island := range g.Islands() {
		if island.Owner().Equals(g.Player1()) {
			player1Alive = true
		} else if island.Owner().Equals(g.Player2()) {
			player2Alive = true
		}
		if player1Alive && player2Alive {
			return false, nil
		}
	}
	if player1Alive {
		return true, g.Player1()
	} else if player2Alive {
		return true, g.Player2()
	} else {
		return true, nil
	}
}
