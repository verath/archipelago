package event

import "encoding/json"

type Event interface {
	Name() string
	Data() interface{}
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
