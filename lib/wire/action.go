package wire

import "github.com/verath/archipelago/lib/game/model"

// GameActionDecoder is an interface for something that can turn itself
// into a PlayerAction.
type GameActionDecoder interface {
	// ToGameAction returns a PlayerAction representing the
	// object itself.
	ToGameAction() model.PlayerAction
}

// ToGameAction is an implementation of the GameActionDecoder for the
// ActionGameLeave action.
func (ae *ActionEnvelope_ActionGameLeave) ToGameAction() model.PlayerAction {
	return &model.PlayerActionLeave{}
}

// ToGameAction is and implementation of the GameActionDecoder for the
// ActionGameLaunch action.
func (ae *ActionEnvelope_ActionGameLaunch) ToGameAction() model.PlayerAction {
	act := ae.ActionGameLaunch
	return &model.PlayerActionLaunch{
		From: model.IslandID(act.IslandIdFrom),
		To:   model.IslandID(act.IslandIdTo),
	}
}
