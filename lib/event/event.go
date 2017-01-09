package event

import (
	"encoding/json"
	"github.com/verath/archipelago/lib/model"
	"sync"
	"github.com/verath/archipelago/lib/network"
)

type EventBuilder interface {
	Build(model.PlayerID) *Event
}

type EventBuilderFunc func(model.PlayerID) *Event

func (f EventBuilderFunc) Build(playerID model.PlayerID) *Event {
	return f(playerID)
}

type Event struct {
	name string
	data interface{}

	jsonMu   sync.Mutex
	jsonData []byte
}

func (e *Event) Build(playerID model.PlayerID) *Event {
	return e
}

func (e *Event) MarshalJSON() ([]byte, error) {
	// Default implementation is to do the json encoding only once,
	// an return the cached encoding afterwards.
	e.jsonMu.Lock()
	defer e.jsonMu.Unlock()
	if e.jsonData == nil {
		data, err := json.Marshal(&struct {
			Name string      `json:"name"`
			Data interface{} `json:"data"`
		}{
			Name: e.name,
			Data: e.data,
		})
		if err != nil {
			return nil, err
		}
		e.jsonData = data
	}
	return e.jsonData, nil
}

func newEvent(name string, data interface{}) *Event {
	return &Event{
		name: name,
		data: data,
	}
}
