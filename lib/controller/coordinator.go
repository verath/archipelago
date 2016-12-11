package controller

import (
	"context"
	"errors"
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
type GameCoordinator struct {
	log        *logrus.Logger
	clientPool *network.ClientPool
}

func (gc *GameCoordinator) startNewGame(ctx context.Context, p1Client, p2Client *network.Client) error {
	defer func() {
		// TODO: we probably don't want to disconnect clients after
		// each game. Instead should probably be added back to the
		// client pool, if they are still connected.
		p1Client.Disconnect()
		p2Client.Disconnect()
	}()

	game, err := model.CreateBasicGame()
	if err != nil {
		return fmt.Errorf("Error creating game: %v", err)
	}

	gm, err := newGameManager(gc.log, game, p1Client, p2Client)
	if err != nil {
		return fmt.Errorf("Error creating gameManager: %v", err)
	}

	return gm.RunGame(ctx)
}

// Waits for two player connections to be made.
// TODO: waiting for any 2 connections is not great "match making"...
func (gc *GameCoordinator) waitForPlayers(ctx context.Context, logEntry *logrus.Entry) (*network.Client, *network.Client, error) {
	clientCh := gc.clientPool.GetCh()

	for {
		var p1Client, p2Client *network.Client
		var ok bool

		logEntry.Debug("Waiting for player connections...")
		select {
		case <-ctx.Done():
			return nil, nil, ctx.Err()
		case p1Client = <-clientCh:
		}

		logEntry.Debug("p1Client established")
		// TODO: Listen for p1Client disconnect
		select {
		case <-ctx.Done():
			return nil, nil, ctx.Err()
		case p2Client, ok = <-clientCh:
			if !ok {
				return nil, nil, errors.New("clientCh closed")
			}
			logEntry.Debug("p2Conn established")
			return p1Client, p2Client, nil
		}
	}
}

func (gc *GameCoordinator) runLoop(ctx context.Context) error {
	logEntry := logutil.ModuleEntry(gc.log, "gameCoordinator")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	ctx, cancel := context.WithCancel(ctx)
	var gamesWG sync.WaitGroup

	var p1Client, p2Client *network.Client
	var err error
	for {
		p1Client, p2Client, err = gc.waitForPlayers(ctx, logEntry)
		if err != nil {
			break
		}

		gamesWG.Add(1)
		logEntry.Info("Starting a new game")
		go func() {
			err := gc.startNewGame(ctx, p1Client, p2Client)
			if err != nil && err != context.Canceled {
				logEntry.WithError(err).Error("Game stopped with an error")
			}
			gamesWG.Done()
		}()
	}

	logEntry.Debug("cancelling")
	cancel()
	logEntry.Debug("waiting for gamesWG")
	gamesWG.Wait()
	return err
}

func (gc *GameCoordinator) Run(ctx context.Context) error {
	return gc.runLoop(ctx)
}

func NewGameCoordinator(log *logrus.Logger, clientPool *network.ClientPool) (*GameCoordinator, error) {
	return &GameCoordinator{
		log:        log,
		clientPool: clientPool,
	}, nil
}
