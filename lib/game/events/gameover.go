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

func NewGameOverEvent(player *model.Player) Event {
	return &gameOverEvent{player.ID()}
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
