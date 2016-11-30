package action

import (
	"github.com/verath/archipelago/lib/event"
	"github.com/verath/archipelago/lib/model"
)

type Action interface {
	Apply(*model.Game) ([]event.Event, error)
}

type ActionFunc func(*model.Game) ([]event.Event, error)

func (f ActionFunc) Apply(g *model.Game) ([]event.Event, error) {
	return f(g)
}
