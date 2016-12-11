package event

import (
	"encoding/json"
	"github.com/verath/archipelago/lib/model"
)

type Event interface {
	ToPlayerEvent(playerID model.PlayerID) PlayerEvent
}

type baseEvent struct {
	name string
	data interface{}
}

func (e *baseEvent) Name() string {
	return e.name
}

func (e *baseEvent) Data() interface{} {
	return e.data
}

func (e *baseEvent) ToPlayerEvent(playerID model.PlayerID) PlayerEvent {
	// Default implementation is to send the same event, no matter
	// the player id provided.
	return e
}

func (e *baseEvent) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		Name string
		Data interface{}
	}{
		Name: e.Name(),
		Data: e.Data(),
	})
}

func newEvent(name string, data interface{}) *baseEvent {
	return &baseEvent{
		name: name,
		data: data,
	}
}
