package event

import "encoding/json"

type Event interface {
	Name() string
	Data() interface{}
}

type event struct {
	name string
	data interface{}
}

func (e *event) Name() string {
	return e.name
}

func (e *event) Data() interface{} {
	return e.data
}

func (e *event) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		Name string
		Data interface{}
	}{
		Name: e.Name(),
		Data: e.Data(),
	})
}

func newEvent(name string, data interface{}) *event {
	return &event{
		name: name,
		data: data,
	}
}
