package event

import (
	"github.com/verath/archipelago/lib/model"
)

const EventNameTick = "tick"

type TickEvent struct {
	*event
}

type TickEventData *model.Game

func NewTickEvent(game model.Game) *TickEvent {
	data := TickEventData(&game)
	evt := newEvent(EventNameTick, data)
	return &TickEvent{evt}
}
