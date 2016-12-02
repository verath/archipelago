package controller

import (
	"context"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/logutil"
	"github.com/verath/archipelago/lib/model"
	"github.com/verath/archipelago/lib/network"
	"sync"
)

// The game coordinator is responsible for connecting players to
// a game. Once enough players has been found so that a game can
// be created, the game coordinator hands these players of to the
// game manager to start the game. The lifetime of the game
// coordinator is not tied to a single game but rather the entire
// lifetime of the game server.
type gameCoordinator struct {
	log *logrus.Logger
}

func (gc *gameCoordinator) startNewGame(ctx context.Context, p1Conn, p2Conn network.PlayerConn) error {
	game, err := model.CreateBasicGame()
	if err != nil {
		return fmt.Errorf("Error creating game: %v", err)
	}
	gm, err := newGameManager(gc.log, game, p1Conn, p2Conn)
	if err != nil {
		return fmt.Errorf("Error creating gameManager: %v", err)
	}
	return gm.RunGame(ctx)
}

// Waits for two player connections to be made. Accounts for if the
// first player connection disconnects before the second is made.
// However, the returned connections might still be disconnected
// by the time they are returned.
// TODO: waiting for any 2 connections is not great "match making"...
func (gc *gameCoordinator) waitForPlayers(ctx context.Context, playerConnCh <-chan network.PlayerConn) (network.PlayerConn, network.PlayerConn, error) {
	logEntry := logutil.ModuleEntry(gc.log, "gameCoordinator")
	for {
		logEntry.Debug("Waiting for player connections...")
		var p1Conn, p2Conn network.PlayerConn

		select {
		case <-ctx.Done():
			return nil, nil, ctx.Err()
		case p1Conn = <-playerConnCh:
			logEntry.Debug("p1Conn established")
		}

		select {
		case <-ctx.Done():
			return nil, nil, ctx.Err()
		case <-p1Conn.DisconnectChannel():
			logEntry.Debug("p1Conn disconnected, finding a new p1")
			continue
		case p2Conn = <-playerConnCh:
			logEntry.Debug("p2Conn established")
			return p1Conn, p2Conn, nil
		}
	}
}

func (gc *gameCoordinator) runLoop(ctx context.Context, playerConnCh <-chan network.PlayerConn) error {
	logEntry := logutil.ModuleEntry(gc.log, "gameCoordinator")
	ctx, cancel := context.WithCancel(ctx)
	var wg sync.WaitGroup

	for {
		wg.Add(1)
		p1Conn, p2Conn, err := gc.waitForPlayers(ctx, playerConnCh)
		if err != nil {
			wg.Done()
			break
		}
		logEntry.Info("Starting a new game")
		go func() {
			err := gc.startNewGame(ctx, p1Conn, p2Conn)
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

func (gc *gameCoordinator) Run(ctx context.Context, playerConnCh <-chan network.PlayerConn) error {
	// TODO: ensure not running
	logEntry := logutil.ModuleEntry(gc.log, "gameCoordinator")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	return gc.runLoop(ctx, playerConnCh)
}

func NewGameCoordinator(log *logrus.Logger) *gameCoordinator {
	return &gameCoordinator{
		log: log,
	}
}
