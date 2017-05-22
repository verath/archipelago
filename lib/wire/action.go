package wire

import (
	"github.com/verath/archipelago/lib/game/model"
)

// DecodeActionGameLeave transforms an ActionGameLeave to its representation in the game model.
func DecodeActionGameLeave(act *ActionGameLeave) *model.PlayerActionLeave {
	return &model.PlayerActionLeave{}
}

// DecodeActionGameLaunch transforms an ActionGameLaunch to its representation in the game model.
func DecodeActionGameLaunch(act *ActionGameLaunch) *model.PlayerActionLaunch {
	return &model.PlayerActionLaunch{
		From: model.IslandID(act.FromId),
		To:   model.IslandID(act.ToId),
	}
}
