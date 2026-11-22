package ai

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"math/rand"
	"sync"
	"time"

	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/model"
)

type clientState struct {
	// myPlayerID is the PlayerID that the client represents in the game model.
	myPlayerID model.PlayerID
}

// Client is an "ai" controlled client that listens for game events and
// produces actions in response. The actions are chosen by the selected
// strategy.
type Client struct {
	logger *slog.Logger

	stateMu sync.Mutex
	state   clientState
	bot     *Bot

	actionCh chan model.PlayerAction

	disconnectOnce sync.Once
	disconnectCh   chan struct{}
}

// NewClient creates a new AI Client using the provided strategy.
func NewClient(logger *slog.Logger, strategyCreator StrategyCreatorFunc) (*Client, error) {
	if strategyCreator == nil {
		panic("strategyCreator == nil")
	}
	logger = common.ModuleLogEntryWithID(logger, "ai/client")
	bot, err := NewBot(strategyCreator, rand.New(rand.NewSource(time.Now().UnixNano())))
	if err != nil {
		return nil, err
	}
	return &Client{
		logger:       logger,
		bot:          bot,
		actionCh:     make(chan model.PlayerAction, 1),
		disconnectCh: make(chan struct{}, 0),
	}, nil
}

// Disconnect disconnects the Client, closing the DisconnectCh and unblocking
// and Read calls.
func (c *Client) Disconnect() {
	c.disconnectOnce.Do(func() {
		c.logger.Debug("Disconnect")
		close(c.disconnectCh)
	})
}

// DisconnectCh returns a channel closed when the Client is disconnected. For
// the AI Client, this channel is only closed as a result of a call to
// Disconnect.
func (c *Client) DisconnectCh() <-chan struct{} {
	return c.disconnectCh
}

// WritePlayerEvent "writes" a player event to the AI Client, which will be
// used to produce new actions by the client.
func (c *Client) WritePlayerEvent(ctx context.Context, playerEvent model.PlayerEvent) error {
	switch evt := playerEvent.(type) {
	case *model.PlayerEventGameStart:
		return c.onGameStart(ctx, evt)
	case *model.PlayerEventTick:
		return c.onTick(ctx, evt)
	case *model.PlayerEventGameOver:
		return c.onGameOver(ctx, evt)
	default:
		return fmt.Errorf("unexpected playerEvent type %T", playerEvent)
	}
}

// ReadPlayerAction returns the next action that the AI Client wants to apply
// on the game.
func (c *Client) ReadPlayerAction(ctx context.Context) (model.PlayerAction, error) {
	select {
	case act := <-c.actionCh:
		return act, nil
	case <-ctx.Done():
		return nil, ctx.Err()
	case <-c.disconnectCh:
		return nil, errors.New("Disconnected")
	}
}

func (c *Client) onGameStart(ctx context.Context, evt *model.PlayerEventGameStart) error {
	c.stateMu.Lock()
	defer c.stateMu.Unlock()
	c.state.myPlayerID = evt.PlayerID
	c.logger.Debug("onGameStart", "myPlayerId", c.state.myPlayerID)
	return nil
}

func (c *Client) onGameOver(ctx context.Context, evt *model.PlayerEventGameOver) error {
	c.stateMu.Lock()
	defer c.stateMu.Unlock()
	c.state.myPlayerID = model.PlayerID(model.InvalidID)
	c.logger.Debug("onGameOver", "myPlayerId", c.state.myPlayerID)
	return nil
}

func (c *Client) onTick(ctx context.Context, evt *model.PlayerEventTick) error {
	c.stateMu.Lock()
	act, err := c.bot.NextAction(c.state.myPlayerID, evt.Game)
	c.stateMu.Unlock()
	if err != nil {
		// Not fatal for the client; log it and carry on. Debug level, as
		// this runs on every tick.
		c.logger.Debug("failed getting next action from strategy", "err", err)
	}
	if act != nil {
		select {
		case c.actionCh <- act:
		case <-ctx.Done():
			return ctx.Err()
		case <-c.disconnectCh:
			// Nobody reads actionCh after a disconnect, so don't block on it.
			return errors.New("Disconnected")
		}
	}
	return nil
}
