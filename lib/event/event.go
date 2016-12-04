package event

import (
	"encoding/json"
	"time"
)

type Event interface {
	Name() string
	Timestamp() time.Time
	Data() interface{}
}

type event struct {
	name      string
	timestamp time.Time
	data      interface{}
}

func (e *event) Name() string {
	return e.name
}

func (e *event) Timestamp() time.Time {
	return e.timestamp
}

func (e *event) Data() interface{} {
	return e.data
}

func (e *event) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		Name      string
		Timestamp time.Time
		Data      interface{}
	}{
		Name:      e.Name(),
		Timestamp: e.Timestamp(),
		Data:      e.Data(),
	})
}

func newEvent(name string, data interface{}) *event {
	return &event{
		name:      name,
		timestamp: time.Now(),
		data:      data,
	}
}
