package ai

import (
	"context"
	"math/rand"
	"sync"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game/model"
	"golang.org/x/time/rate"
)

const (
	// clientActionLimitRate is the rate limit bucket refill rate [token/s], limiting
	// the number of actions the client is allowed to take per second on average.
	clientActionLimitRate = rate.Limit(1)

	// clientActionLimitBurst is the rate limit bucket size, limiting the burst number
	// number of actions that the client is allowed to take.
	clientActionLimitBurst = 10
)

type clientState struct {
	// myPlayerID is the PlayerID that the client represents in the game model.
	myPlayerID model.PlayerID
}

// Client is an "ai" controlled client that listens for game events and
// produces actions in response. The actions are chosen by the selected
// strategy.
type Client struct {
	logEntry *logrus.Entry

	strategy strategy

	stateMu sync.Mutex
	state   clientState

	limiter *rate.Limiter

	actionCh chan model.PlayerAction

	disconnectOnce sync.Once
	disconnectCh   chan struct{}
}

// NewClient creates a new AI Client using the provided strategy.
func NewClient(log *logrus.Logger, strategyCreator StrategyCreatorFunc) (*Client, error) {
	if strategyCreator == nil {
		panic("strategyCreator == nil")
	}
	logEntry := common.ModuleLogEntryWithID(log, "ai/client")
	strategy, err := strategyCreator()
	if err != nil {
		return nil, errors.Wrap(err, "failed creating strategy")
	}
	return &Client{
		logEntry:     logEntry,
		strategy:     strategy,
		limiter:      rate.NewLimiter(clientActionLimitRate, clientActionLimitBurst),
		actionCh:     make(chan model.PlayerAction, 1),
		disconnectCh: make(chan struct{}, 0),
	}, nil
}

// Disconnect disconnects the Client, closing the DisconnectCh and unblocking
// and Read calls.
func (c *Client) Disconnect() {
	c.disconnectOnce.Do(func() {
		c.logEntry.Debug("Disconnect")
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
		return errors.Errorf("unexpected playerEvent type %T", playerEvent)
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
	c.logEntry.WithField("myPlayerId", c.state.myPlayerID).Debug("onGameStart")
	return nil
}

func (c *Client) onGameOver(ctx context.Context, evt *model.PlayerEventGameOver) error {
	c.stateMu.Lock()
	defer c.stateMu.Unlock()
	c.state.myPlayerID = model.PlayerID(model.InvalidID)
	c.logEntry.WithField("myPlayerId", c.state.myPlayerID).Debug("onGameOver")
	return nil
}

func (c *Client) onTick(ctx context.Context, evt *model.PlayerEventTick) error {
	// Rate limit and add 50% do nothing, do prevent multiple instances to
	// perform actions as the same time.
	if !c.limiter.Allow() || rand.Intn(10) < 5 {
		return nil
	}
	// Delegate to strategy to perform next action.
	// TODO: This somewhat locks the strategy to the tick rate, probably
	// not ideal...
	c.stateMu.Lock()
	defer c.stateMu.Unlock()
	act, err := c.strategy.NextAction(c.state, evt.Game)
	if err != nil {
		errors.Wrap(err, "failed getting next action from strategy")
	}
	if act != nil {
		select {
		case c.actionCh <- act:
		case <-ctx.Done():
			return ctx.Err()
		}
	}
	return nil
}
