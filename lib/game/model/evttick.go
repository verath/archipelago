package model

import (
	"encoding/json"
	"github.com/pkg/errors"
)

type tickEvent struct {
	// Data is stored as a precomputed json string, to avoid having
	// to marshal the game multiple times.
	data *json.RawMessage
}

func NewTickEvent(game *Game) (Event, error) {
	data, err := json.Marshal(game)
	if err != nil {
		return nil, errors.Wrap(err, "Failed marshaling game to JSON")
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

func (event *tickEvent) ToPlayerEvent(playerID PlayerID) PlayerEvent {
	return event
}
