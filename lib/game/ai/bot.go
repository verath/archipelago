package ai

import (
	"fmt"
	"math/rand"
	"strconv"
	"time"

	"github.com/verath/archipelago/lib/game/model"
	"golang.org/x/time/rate"
)

// Pace is how fast a Bot plays: how often it may act, and how quickly it
// reacts to what happens in the game.
type Pace struct {
	// Rate is the number of actions per second the bot may take on average.
	Rate rate.Limit
	// Burst is the number of actions the bot may take in a quick burst.
	Burst int
	// Skip is the chance that the bot passes on a tick it could act on.
	Skip float64
	// Decisions, if true, makes every tick the bot decides on count against
	// Rate, whether it acts or not. Otherwise only actions do.
	Decisions bool
	// Reaction is how old the view of the game the bot acts on is, the time
	// it takes the bot to take in what happened.
	Reaction time.Duration
}

// Set sets the setting named key, the field name in lower case, to value:
// a number, a duration for reaction, or true or false for decisions.
func (p *Pace) Set(key, value string) error {
	var err error
	switch key {
	case "rate":
		var v float64
		v, err = strconv.ParseFloat(value, 64)
		p.Rate = rate.Limit(v)
	case "burst":
		p.Burst, err = strconv.Atoi(value)
	case "skip":
		p.Skip, err = strconv.ParseFloat(value, 64)
	case "decisions":
		p.Decisions, err = strconv.ParseBool(value)
	case "reaction":
		p.Reaction, err = time.ParseDuration(value)
	default:
		return fmt.Errorf("unknown pace setting %q", key)
	}
	return err
}

// LivePace is the pace of the AIs in live games: at most one decision per
// second on average, half of the ticks skipped, and an instant reaction.
var LivePace = Pace{Rate: 1, Burst: 10, Skip: 0.5, Decisions: true}

// HumanPace is roughly how fast a person plays: about two launches per second
// on average, several in a quick burst, reacting to what happens after about
// 0.4 s.
var HumanPace = Pace{Rate: 2, Burst: 6, Reaction: 400 * time.Millisecond}

// botEpoch is the wall clock time that game time 0 maps to for the rate
// limiter, which works on time.Time.
var botEpoch = time.Unix(0, 0)

// A Bot decides the actions of an AI player, one game tick at a time. It is
// driven by game time rather than the wall clock, so it plays the same in a
// live game as in a simulation that runs faster than real time. A Bot is not
// safe for concurrent use.
type Bot struct {
	strategy strategy
	pace     Pace
	limiter  *rate.Limiter
	rng      *rand.Rand
	// views are the views of the game that the bot was given and has not
	// yet acted on, oldest first, for its reaction time.
	views []*model.Game
}

// NewBot creates a Bot playing with the strategy at the pace, taking its
// randomness from rng.
func NewBot(strategyCreator StrategyCreatorFunc, pace Pace, rng *rand.Rand) (*Bot, error) {
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
		pace:     pace,
		limiter:  rate.NewLimiter(pace.Rate, pace.Burst),
		rng:      rng,
	}, nil
}

// NextAction returns the action that the bot, playing as playerID, wants to
// take after a tick resulting in game. game is the player's view of the game,
// with fog of war applied; the bot keeps it, for acting on it later. Returns
// nil if the bot does not want to act.
func (b *Bot) NextAction(playerID model.PlayerID, game *model.Game) (model.PlayerAction, error) {
	now := botEpoch.Add(game.Time())
	// Act on the newest view that is at least the reaction time old.
	b.views = append(b.views, game)
	i := -1
	for j, view := range b.views {
		if view.Time() <= game.Time()-b.pace.Reaction {
			i = j
		}
	}
	if i < 0 {
		return nil, nil
	}
	view := b.views[i]
	b.views = b.views[i+1:]

	if b.pace.Decisions {
		if !b.limiter.AllowN(now, 1) {
			return nil, nil
		}
	} else if b.limiter.TokensAt(now) < 1 {
		return nil, nil
	}
	if b.pace.Skip > 0 && b.rng.Float64() < b.pace.Skip {
		return nil, nil
	}
	act, err := b.strategy.NextAction(clientState{myPlayerID: playerID}, view, b.rng)
	if act != nil && !b.pace.Decisions {
		b.limiter.AllowN(now, 1)
	}
	return act, err
}
