package event

import (
	"encoding/json"
	"github.com/verath/archipelago/lib/model"
	"sync"
)

type Event interface {
	ToPlayerEvent(playerID model.PlayerID) PlayerEvent
}

type baseEvent struct {
	name string
	data interface{}

	jsonMu   sync.Mutex
	jsonData []byte
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
	// Default implementation is to do the json encoding only once,
	// an return the cached encoding afterwards.
	e.jsonMu.Lock()
	defer e.jsonMu.Unlock()
	if e.jsonData == nil {
		data, err := json.Marshal(&struct {
			Name string
			Data interface{}
		}{
			Name: e.Name(),
			Data: e.Data(),
		})
		if err != nil {
			return nil, err
		}
		e.jsonData = data
	}
	return e.jsonData, nil
}

func newBaseEvent(name string, data interface{}) *baseEvent {
	return &baseEvent{
		name: name,
		data: data,
	}
}
