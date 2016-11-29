package controller

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/testing"
	"sync"
	"time"
)

const (
	DefaultGameTimeout time.Duration = 45 * time.Minute
)

type playerConnCh <-chan network.PlayerConn

type gameCoordinator struct {
	log *logrus.Logger
}

func (gc *gameCoordinator) createGame(ctx context.Context, wg sync.WaitGroup, p1Conn, p2Conn network.PlayerConn) {
	logEntry := gc.log.WithField("module", "gc")

	wg.Add(1)
	go func() {
		defer wg.Done()

		// We don't want games to stay around forever
		gameCtx, cancel := context.WithTimeout(ctx, DefaultGameTimeout)
		defer cancel()

		game := testing.CreateSimpleGame()
		gameLoop := newGameLoop(gc.log, game)

		logEntry.Info("Starting new game")
		err := gameLoop.Run(gameCtx)
		if err != nil {
			logEntry.WithField("err", err).Error("Game stopped")
		} else {
			logEntry.Info("Game stopped")
		}
	}()
}

func (gc *gameCoordinator) runLoop(ctx context.Context, playerCh playerConnCh, wg sync.WaitGroup) error {
	// Wait for two player connections. Once we have 2 start a game for them.
	// TODO: this is obviously a fairly bad solution
	for {
		var p1Conn, p2Conn network.PlayerConn
		select {
		case <-ctx.Done():
			return ctx.Err()
		case p1Conn = <-playerCh:
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		case p2Conn = <-playerCh:
		}

		gc.createGame(ctx, wg, p1Conn, p2Conn)
	}
}

func (gc *gameCoordinator) Run(ctx context.Context, playerCh playerConnCh) (err error) {
	logEntry := gc.log.WithField("module", "gc")
	var wg sync.WaitGroup
	ctx, cancel := context.WithCancel(ctx)

	logEntry.Info("Starting...")
	err = gc.runLoop(ctx, playerCh, wg)
	if err != nil {
		logEntry.WithField("err", err).Error("runLoop finished, stopping...")
	} else {
		logEntry.Info("runLoop finished, stopping...")
	}
	cancel()
	wg.Wait()
	logEntry.Info("Stopped")
	return err
}

func NewGameCoordinator(log *logrus.Logger) *gameCoordinator {
	return &gameCoordinator{
		log: log,
	}
}
