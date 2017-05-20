package wire

import (
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/wire/game"
)

// EncodeEventGameStart transforms a game model PlayerEventGameStart to its wire representation
func EncodeEventGameStart(evt *model.PlayerEventGameStart) (*EventGameStart, error) {
	if evt == nil {
		return nil, errors.New("evt cannot be nil")
	}
	return &EventGameStart{
		PlayerId: string(evt.PlayerID),
	}, nil
}

// EncodeEventGameTick transforms a game model PlayerEventTick to its wire representation
func EncodeEventGameTick(evt *model.PlayerEventTick) (*EventGameTick, error) {
	if evt == nil {
		return nil, errors.New("evt cannot be nil")
	}
	return &EventGameTick{
		Game: game.EncodeGame(evt.Game),
	}, nil
}

// EncodeEventGameOver transforms a game model PlayerEventGameOver to its wire representation
func EncodeEventGameOver(evt *model.PlayerEventGameOver) (*EventGameOver, error) {
	if evt == nil {
		return nil, errors.New("evt cannot be nil")
	}
	return &EventGameOver{
		WinnerId: string(evt.WinnerID),
	}, nil
}
