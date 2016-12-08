package network

import (
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/model"
)

// A player action is an action performed by a specific player.
// This is used so that the clients can send actions without
// knowing what player they represent (or rather, without us
// having to trust the client). The player is then set and the
// action is created.
type PlayerAction interface {

	// Takes a player id representing the player performing
	// the action and returns an Action.
	ToAction(model.PlayerID) action.Action
}

// Wrapper type for a function representing a PlayerAction.
type PlayerActionFunc func(model.PlayerID) action.Action

func (f PlayerActionFunc) ToAction(playerId model.PlayerID) action.Action {
	return f(playerId)
}
