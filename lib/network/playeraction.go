package network

import (
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/model"
)

type PlayerAction interface {
	ToAction(model.PlayerID) action.Action
}

type PlayerActionFunc func(model.PlayerID) action.Action

func (f PlayerActionFunc) ToAction(playerId model.PlayerID) action.Action {
	return f(playerId)
}
