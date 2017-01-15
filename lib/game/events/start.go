package events

import "github.com/verath/archipelago/lib/game/model"

type (
	gameStartEvent struct{}

	gameStartPlayerEvent struct {
		data gameStartEventData
	}

	gameStartEventData struct {
		PlayerID model.PlayerID `json:"player_id"`
	}
)

func NewGameStartEvent() Event {
	return &gameStartEvent{}
}

func (event *gameStartEvent) ToPlayerEvent(playerID model.PlayerID) PlayerEvent {
	data := gameStartEventData{playerID}
	return &gameStartPlayerEvent{data}
}

func (event *gameStartPlayerEvent) Type() string {
	return EventTypeStart
}

func (event *gameStartPlayerEvent) Data() interface{} {
	return event.data
}
