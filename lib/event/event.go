package event

type Event interface {
	Type() string
}

type event struct {
	evtType string
}

func (e *event) Type() string {
	return e.evtType
}

func NewEvent(evtType string) (Event, error) {
	return &event{evtType: evtType}, nil
}
