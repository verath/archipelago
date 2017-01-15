package events

import (
	"encoding/json"
	"fmt"
	"github.com/verath/archipelago/lib/game/model"
)

type tickEvent struct {
	// Data is stored as a precomputed json string, to avoid having
	// to marshal the game multiple times.
	data *json.RawMessage
}

func NewTickEvent(game *model.Game) (Event, error) {
	data, err := json.Marshal(game)
	if err != nil {
		return nil, fmt.Errorf("Failed marshaling game to JSON: %v", err)
	}
	rawData := json.RawMessage(data)
	return &tickEvent{data: &rawData}, nil
}

func (event *tickEvent) Type() string {
	return EventTypeTick
}

func (event *tickEvent) Data() interface{} {
	return event.data
}

func (event *tickEvent) ToPlayerEvent(playerID model.PlayerID) PlayerEvent {
	return event
}
