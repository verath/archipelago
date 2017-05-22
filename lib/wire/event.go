package wire

import (
	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/wire/game"
)

// EncodeEventGameStart transforms a game model PlayerEventGameStart to its wire representation
func EncodeEventGameStart(evt *model.PlayerEventGameStart) *EventGameStart {
	return &EventGameStart{
		TickInterval: int64(evt.TickInterval),
		PlayerId:     string(evt.PlayerID),
	}
}

// EncodeEventGameTick transforms a game model PlayerEventTick to its wire representation
func EncodeEventGameTick(evt *model.PlayerEventTick) *EventGameTick {
	return &EventGameTick{
		Game: game.EncodeGame(evt.Game),
	}
}

// EncodeEventGameOver transforms a game model PlayerEventGameOver to its wire representation
func EncodeEventGameOver(evt *model.PlayerEventGameOver) *EventGameOver {
	return &EventGameOver{
		WinnerId: string(evt.WinnerID),
	}
}
