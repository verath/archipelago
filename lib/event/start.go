package event

import "github.com/verath/archipelago/lib/model"

const GameStartEventName = "game_start"

type GameStartEventData struct {
	PlayerID model.PlayerID `json:"player_id"`
}

func gameCreatedBuilderFunc(playerID model.PlayerID) *Event {
	data := &GameStartEventData{PlayerID: playerID}
	return newEvent(GameStartEventName, data)
}

func NewGameStartEventBuilder() EventBuilder {
	return EventBuilderFunc(gameCreatedBuilderFunc)
}
