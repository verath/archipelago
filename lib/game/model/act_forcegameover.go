package model

// ActionForceGameOver is an action for triggering an unconditional
// GameOver event with no winner.
type ActionForceGameOver struct {
}

// Apply unconditionally returns a game over event without a winner.
func (act *ActionForceGameOver) Apply(game *Game) ([]Event, error) {
	return []Event{NewEventGameOver(nil)}, nil
}
