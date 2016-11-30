package controller

import (
	"context"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/event"
	"github.com/verath/archipelago/lib/logutil"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/testing"
	"time"
)

const (
	DefaultGameTimeout time.Duration = 45 * time.Minute
)

type gameManager struct {
	log *logrus.Logger
}

func (gm *gameManager) RunGame(ctx context.Context, p1Conn, p2Conn network.PlayerConn) error {
	logEntry := logutil.ModuleEntryWithID(gm.log, "gameManager")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	// We don't want games to stay around forever
	gameCtx, cancel := context.WithTimeout(ctx, DefaultGameTimeout)
	defer cancel()

	game := testing.CreateSimpleGame()
	actionCh := make(chan action.Action, 0)
	eventCh := make(chan event.Event, 0)
	gameLoop := newGameLoop(gm.log, game)

	err := gameLoop.Run(gameCtx, actionCh, eventCh)

	if err != nil {
		return fmt.Errorf("gameManager RunGame: %v", err)
	}
	return nil
}

func newGameManager(log *logrus.Logger) *gameManager {
	return &gameManager{
		log: log,
	}
}
