package ai

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/verath/archipelago/lib/game/model"
	"golang.org/x/time/rate"
)

const (
	// botActionLimitRate is the rate limit bucket refill rate [token/s], limiting
	// the number of actions the bot is allowed to take per second on average.
	botActionLimitRate = rate.Limit(1)

	// botActionLimitBurst is the rate limit bucket size, limiting the burst
	// number of actions that the bot is allowed to take.
	botActionLimitBurst = 10
)

// botEpoch is the wall clock time that game time 0 maps to for the rate
// limiter, which works on time.Time.
var botEpoch = time.Unix(0, 0)

// A Bot decides the actions of an AI player, one game tick at a time. It is
// driven by game time rather than the wall clock, so it plays the same in a
// live game as in a simulation that runs faster than real time. A Bot is not
// safe for concurrent use.
type Bot struct {
	strategy strategy
	limiter  *rate.Limiter
	rng      *rand.Rand
}

// NewBot creates a Bot playing with the strategy, taking its randomness from
// rng.
func NewBot(strategyCreator StrategyCreatorFunc, rng *rand.Rand) (*Bot, error) {
	if strategyCreator == nil {
		panic("strategyCreator == nil")
	}
	if rng == nil {
		panic("rng == nil")
	}
	strategy, err := strategyCreator()
	if err != nil {
		return nil, fmt.Errorf("failed creating strategy: %w", err)
	}
	return &Bot{
		strategy: strategy,
		limiter:  rate.NewLimiter(botActionLimitRate, botActionLimitBurst),
		rng:      rng,
	}, nil
}

// NextAction returns the action that the bot, playing as playerID, wants to
// take after a tick resulting in game. game is the player's view of the game,
// with fog of war applied. Returns nil if the bot does not want to act.
func (b *Bot) NextAction(playerID model.PlayerID, game *model.Game) (model.PlayerAction, error) {
	// Rate limit and add 50% do nothing, to prevent multiple instances from
	// performing actions at the same time.
	if !b.limiter.AllowN(botEpoch.Add(game.Time()), 1) || b.rng.Intn(10) < 5 {
		return nil, nil
	}
	// TODO: This somewhat locks the strategy to the tick rate, probably
	// not ideal...
	return b.strategy.NextAction(clientState{myPlayerID: playerID}, game, b.rng)
}
