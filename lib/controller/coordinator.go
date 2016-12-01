package controller

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/network"
	"sync"
	"github.com/verath/archipelago/lib/logutil"
)

type playerConnCh <-chan network.PlayerConn

type gameCoordinator struct {
	log         *logrus.Logger
	gameManager *gameManager
}

func (gc *gameCoordinator) createGame(ctx context.Context, wg sync.WaitGroup, p1Conn, p2Conn network.PlayerConn) {
	logEntry := logutil.ModuleEntry(gc.log, "gameCoordinator")

	wg.Add(1)
	go func() {
		err := gc.gameManager.RunGame(ctx, p1Conn, p2Conn)
		if err != nil {
			logEntry.WithError(err).Error("error during RunGame")
		}
		wg.Done()
	}()
}

func (gc *gameCoordinator) runLoop(ctx context.Context, playerCh playerConnCh, wg sync.WaitGroup) error {
	logEntry := logutil.ModuleEntry(gc.log, "gameCoordinator")
	// Wait for two player connections. Once we have 2 start a game for them.
	// TODO: this is obviously a fairly bad solution
	for {
		var p1Conn, p2Conn network.PlayerConn
		select {
		case <-ctx.Done():
			return ctx.Err()
		case p1Conn = <-playerCh:
		}
		logEntry.Debug("p1Conn established")

		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-p1Conn.DisconnectChannel():
			// p1 disconnected, find new p1
			logEntry.Debug("p1Conn disconnected, finding a new p1")
			continue
		case p2Conn = <-playerCh:
		}

		logEntry.Debug("p2Conn established, creating a new game")
		gc.createGame(ctx, wg, p1Conn, p2Conn)
	}
}

func (gc *gameCoordinator) Run(ctx context.Context, playerCh playerConnCh) error {
	logEntry := logutil.ModuleEntry(gc.log, "gameCoordinator")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	var wg sync.WaitGroup
	ctx, cancel := context.WithCancel(ctx)

	err := gc.runLoop(ctx, playerCh, wg)
	cancel()
	wg.Wait()
	return err
}

func NewGameCoordinator(log *logrus.Logger) *gameCoordinator {
	gameManager := newGameManager(log)

	return &gameCoordinator{
		log:         log,
		gameManager: gameManager,
	}
}
