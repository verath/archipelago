package event

import (
	"github.com/verath/archipelago/lib/model"
)

const EventNameTick = "tick"

type TickEventData *model.Game

type TickEventBuilder struct {
	*Event
}

func NewTickEventBuilder(game *model.Game) EventBuilder {
	data := TickEventData(game.Copy())
	evt := newEvent(EventNameTick, data)
	return &TickEventBuilder{evt}
}
