package model

// ActionCheckGameOver is an action for triggering a check for if
// the game is over.
type ActionCheckGameOver struct {
}

// Apply applies the ActionCheckGameOver to the game instance,
// returning a game over event if the game is over.
func (act *ActionCheckGameOver) Apply(game *Game) ([]Event, error) {
	if gameOver, winner := isGameOver(game); gameOver {
		return []Event{NewEventGameOver(winner)}, nil
	}
	return nil, nil
}

// checkAlive returns true if player p is still alive in game g. An alive
// player has control of at least one island or airplane.
func checkAlive(g *Game, p *Player) bool {
	for _, island := range g.Islands() {
		if island.Owner().Equals(p) {
			return true
		}
	}
	for _, airplane := range g.Airplanes() {
		if airplane.Owner().Equals(p) {
			return true
		}
	}
	return false
}

// isGameOver checks if the current game is over. A game is over when less than
// two players are still alive.
// If only a single player is alive, then that player is returned as the
// winner.
// If no players are alive then nil is returned as winner.
func isGameOver(g *Game) (gameOver bool, winner *Player) {
	alivePlayers := make([]*Player, 0)
	for _, player := range g.Players() {
		if !player.IsAlive() {
			continue
		}
		if !checkAlive(g, player) {
			player.SetAlive(false)
			continue
		}
		alivePlayers = append(alivePlayers, player)
	}
	if len(alivePlayers) == 0 {
		return true, nil
	} else if len(alivePlayers) == 1 {
		return true, alivePlayers[0]
	} else {
		return false, nil
	}
}
