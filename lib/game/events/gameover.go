package events

import "github.com/verath/archipelago/lib/game/model"

type (
	// A game over event is an event created when the game is finished.
	gameOverEvent struct {
		winnerID model.PlayerID
	}

	gameOverPlayerEvent struct {
		data gameOverEventData
	}

	gameOverEventData struct {
		WinnerID model.PlayerID `json:"winner_id"`
		IsWinner bool           `json:"is_winner"`
	}
)

// Creates a new game over event, with the provided player as winner.
// If the winner is nil, then a game over event without a winner is
// created.
func NewGameOverEvent(winner *model.Player) Event {
	var winnerID model.PlayerID
	if winner != nil {
		winnerID = winner.ID()
	}
	return &gameOverEvent{winnerID}
}

func (event *gameOverEvent) ToPlayerEvent(id model.PlayerID) PlayerEvent {
	data := gameOverEventData{
		WinnerID: event.winnerID,
		IsWinner: event.winnerID == id,
	}
	return &gameOverPlayerEvent{data}
}

func (event *gameOverPlayerEvent) Type() string {
	return EventTypeGameOver
}

func (event *gameOverPlayerEvent) Data() interface{} {
	return event.data
}
