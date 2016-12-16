package controller

import (
	"context"
	"errors"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/model"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/util"
	"sync"
)

// The game coordinator is responsible for connecting players to
// a game. Once enough players has been found so that a game can
// be created, the game coordinator creates and starts a new game
// manager with the given players.
//
// The lifetime of the game coordinator is not tied to a single
// game but rather the entire lifetime of the game server.
type GameCoordinator struct {
	logEntry   *logrus.Entry
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

	gameLoop, err := newGameLoop(gc.logEntry.Logger, game)
	if err != nil {
		return fmt.Errorf("Error creating gameLoop: %v", err)
	}

	p1Proxy, err := newPlayerProxy(game.Player1(), p1Client)
	if err != nil {
		return fmt.Errorf("Error creating player1 proxy: %v", err)
	}

	p2Proxy, err := newPlayerProxy(game.Player2(), p2Client)
	if err != nil {
		return fmt.Errorf("Error creating player2 proxy: %v", err)
	}

	gm, err := newGameManager(gc.logEntry.Logger, gameLoop, p1Proxy, p2Proxy)
	if err != nil {
		return fmt.Errorf("Error creating gameManager: %v", err)
	}

	return gm.Run(ctx)
}

// Waits for two player connections to be made.
// TODO: waiting for any 2 connections is not great "match making"...
func (gc *GameCoordinator) waitForPlayers(ctx context.Context) (*network.Client, *network.Client, error) {
	clientCh := gc.clientPool.GetCh()

	for {
		var p1Client, p2Client *network.Client
		var ok bool

		gc.logEntry.Debug("Waiting for player connections...")
		select {
		case <-ctx.Done():
			return nil, nil, ctx.Err()
		case p1Client = <-clientCh:
		}

		gc.logEntry.Debug("p1Client established")
		// TODO: Listen for p1Client disconnect
		select {
		case <-ctx.Done():
			return nil, nil, ctx.Err()
		case p2Client, ok = <-clientCh:
			if !ok {
				return nil, nil, errors.New("clientCh closed")
			}
			gc.logEntry.Debug("p2Conn established")
			return p1Client, p2Client, nil
		}
	}
}

// runLoop runs the main "loop" of the game coordinator. The loop waits for
// two players, creates a new games for these players, and wait for another
// pair of players. This method blocks until the context is cancelled or
// an error occurs. Always returns a non-nil error.
func (gc *GameCoordinator) runLoop(ctx context.Context) error {
	ctx, cancel := context.WithCancel(ctx)
	var gamesWG sync.WaitGroup
	defer func() {
		// Before we return control, signal to all spawned games to
		// quit and wait until they do.
		cancel()
		gamesWG.Wait()
	}()

	for {
		p1Client, p2Client, err := gc.waitForPlayers(ctx)
		if err != nil {
			return fmt.Errorf("Error waiting for players: %v", err)
		}

		gc.logEntry.Debug("Starting a new game")
		gamesWG.Add(1)
		go func() {
			defer gamesWG.Done()
			err := gc.startNewGame(ctx, p1Client, p2Client)
			if err != nil && err != context.Canceled {
				// Note that coordinator does not quit when a game
				// stops with an error.
				// TODO: perhaps we should, at least for some types of errors?
				gc.logEntry.WithError(err).Error("Game stopped with an error")
			}
		}()
	}
}

func (gc *GameCoordinator) Run(ctx context.Context) error {
	gc.logEntry.Info("Starting")
	defer gc.logEntry.Info("Stopped")

	return util.RunWithContext(ctx,
		gc.clientPool.Run,
		gc.runLoop,
	)
}

func NewGameCoordinator(log *logrus.Logger, clientPool *network.ClientPool) (*GameCoordinator, error) {
	logEntry := util.ModuleLogEntry(log, "gameCoordinator")

	return &GameCoordinator{
		logEntry:   logEntry,
		clientPool: clientPool,
	}, nil
}
