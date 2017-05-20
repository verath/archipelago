package wire

import (
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/game/model"
)

// DecodeActionGameLeave transforms an ActionGameLeave to its representation in the game model.
func DecodeActionGameLeave(act *ActionGameLeave) (*model.PlayerActionLeave, error) {
	if act == nil {
		return nil, errors.New("act cannot be nil")
	}
	return &model.PlayerActionLeave{}, nil
}

// DecodeActionGameLaunch transforms an ActionGameLaunch to its representation in the game model.
func DecodeActionGameLaunch(act *ActionGameLaunch) (*model.PlayerActionLaunch, error) {
	if act == nil {
		return nil, errors.New("act cannot be nil")
	}
	return &model.PlayerActionLaunch{
		From: model.IslandID(act.IslandIdFrom),
		To:   model.IslandID(act.IslandIdTo),
	}, nil
}
