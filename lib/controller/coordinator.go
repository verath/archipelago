package controller

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/logutil"
	"github.com/verath/archipelago/lib/network"
	"sync"
)

type playerConnCh <-chan network.PlayerConn

// The game coordinator is responsible for connecting players to
// a game. Once enough players has been found so that a game can
// be created, the game coordinator hands these players of to the
// game manager to start the game. The lifetime of the game
// coordinator is not tied to a single game but rather the entire
// lifetime of the game server.
type gameCoordinator struct {
	log         *logrus.Logger
	gameManager *gameManager
}

func (gc *gameCoordinator) waitForPlayers(ctx context.Context, playerCh playerConnCh) (network.PlayerConn, network.PlayerConn, error) {
	logEntry := logutil.ModuleEntry(gc.log, "gameCoordinator")

	// Wait for two player connections. Once we have 2 start a game for them.
	// TODO: this is obviously a fairly bad solution
	for {
		var p1Conn, p2Conn network.PlayerConn

		select {
		case <-ctx.Done():
			return nil, nil, ctx.Err()
		case p1Conn = <-playerCh:
			logEntry.Debug("p1Conn established")
		}

		select {
		case <-ctx.Done():
			return nil, nil, ctx.Err()
		case <-p1Conn.DisconnectChannel():
			logEntry.Debug("p1Conn disconnected, finding a new p1")
			continue
		case p2Conn = <-playerCh:
			logEntry.Debug("p2Conn established")
			return p1Conn, p2Conn, nil
		}
	}
}

func (gc *gameCoordinator) runLoop(ctx context.Context, playerCh playerConnCh) error {
	logEntry := logutil.ModuleEntry(gc.log, "gameCoordinator")
	ctx, cancel := context.WithCancel(ctx)
	var wg sync.WaitGroup

	for {
		wg.Add(1)
		p1Conn, p2Conn, err := gc.waitForPlayers(ctx, playerCh)
		if err != nil {
			wg.Done()
			break
		}
		logEntry.Info("Creating a new game")
		go func() {
			err := gc.gameManager.RunGame(ctx, p1Conn, p2Conn)
			if err != nil && err != context.Canceled {
				logEntry.WithError(err).Error("Game stopped with an error")
			}
			wg.Done()
		}()
	}

	cancel()
	wg.Wait()
	return nil
}

func (gc *gameCoordinator) Run(ctx context.Context, playerCh playerConnCh) error {
	logEntry := logutil.ModuleEntry(gc.log, "gameCoordinator")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	return gc.runLoop(ctx, playerCh)
}

func NewGameCoordinator(log *logrus.Logger) *gameCoordinator {
	gameManager := newGameManager(log)

	return &gameCoordinator{
		log:         log,
		gameManager: gameManager,
	}
}
