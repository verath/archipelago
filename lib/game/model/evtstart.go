package model

type (
	gameStartEvent struct{}

	gameStartPlayerEvent struct {
		data gameStartEventData
	}

	gameStartEventData struct {
		PlayerID PlayerID `json:"player_id"`
	}
)

func NewGameStartEvent() Event {
	return &gameStartEvent{}
}

func (event *gameStartEvent) ToPlayerEvent(playerID PlayerID) PlayerEvent {
	data := gameStartEventData{playerID}
	return &gameStartPlayerEvent{data}
}

func (event *gameStartPlayerEvent) Type() string {
	return EventTypeStart
}

func (event *gameStartPlayerEvent) Data() interface{} {
	return event.data
}
