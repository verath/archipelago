package wire

import (
	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/wire/game"
)

// NewEventGameStart translates a model.PlayerEventGameStart to an EventGameStart message.
func NewEventGameStart(evt *model.PlayerEventGameStart) *EventGameStart {
	return &EventGameStart{
		PlayerId: string(evt.PlayerID),
	}
}

// NewEventGameTick translates a model.PlayerEventTick to a EventGameTick message.
func NewEventGameTick(evt *model.PlayerEventTick) *EventGameTick {
	return &EventGameTick{
		Game: game.NewGame(evt.Game),
	}
}

// NewEventGameOver translates a model.PlayerEventGameOver to an EventGameOver message.
func NewEventGameOver(evt *model.PlayerEventGameOver) *EventGameOver {
	return &EventGameOver{
		PlayerIdWinner: string(evt.WinnerID),
	}
}
