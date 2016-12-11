package event

import (
	"github.com/verath/archipelago/lib/model"
)

const EventNameTick = "tick"

type TickEvent struct {
	*baseEvent
}

type TickEventData *model.Game

func NewTickEvent(game *model.Game) *TickEvent {
	data := TickEventData(game.Copy())
	evt := newBaseEvent(EventNameTick, data)
	return &TickEvent{evt}
}
