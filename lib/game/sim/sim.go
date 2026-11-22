// Package sim runs headless games between AI players, faster than real time,
// and records what happened in them. It is used to compare rule variants.
package sim

import (
	"errors"
	"fmt"
	"math/rand"
	"time"

	"github.com/verath/archipelago/lib/game"
	"github.com/verath/archipelago/lib/game/ai"
	"github.com/verath/archipelago/lib/game/model"
)

// BotKind is the kind of AI playing a seat in a simulated game.
type BotKind string

const (
	// BotOpportunistic plays with ai.OpportunisticStrategy.
	BotOpportunistic BotKind = "opp"
	// BotRandom plays with ai.RandomStrategy, with a random minimum origin
	// strength like in live games.
	BotRandom BotKind = "rand"
	// BotSmart plays with ai.SmartStrategy, at ai.HumanPace.
	BotSmart BotKind = "smart"
)

// BotKinds are all the kinds of bots.
var BotKinds = []BotKind{BotOpportunistic, BotRandom, BotSmart}

// Neutral is the player index used for the neutral player in a Result.
const Neutral = -1

// SampleInterval is the game time between two Samples.
const SampleInterval = 5 * time.Second

// Config configures simulated games.
type Config struct {
	// Rules are the rules of the game.
	Rules model.Rules
	// Bots are the AI players, one per seat.
	Bots []BotKind
	// MaxTime is the game time after which a game is stopped without a
	// winner.
	MaxTime time.Duration
	// Tick is the game time step of each tick. Live games tick 10 times per
	// second.
	Tick time.Duration
	// Smart is the config of the BotSmart bots. The zero value means
	// ai.DefaultSmartConfig.
	Smart ai.SmartConfig
	// SmartPace is the pace of the BotSmart bots. The zero value means
	// ai.HumanPace.
	SmartPace ai.Pace
}

// Result is the record of a simulated game. Players are referred to by their
// index in Config.Bots, or Neutral.
type Result struct {
	Seed int64 `json:"seed"`
	// Winner is the index of the winning player, or -1 if none.
	Winner   int           `json:"winner"`
	Duration time.Duration `json:"duration"`
	TimedOut bool          `json:"timedOut"`
	// Bots are the kinds of AI in each seat.
	Bots []BotKind `json:"bots"`
	// Islands is the number of islands on the map.
	Islands  int       `json:"islands"`
	Samples  []Sample  `json:"samples"`
	Captures []Capture `json:"captures"`
	Lives    []Life    `json:"lives"`
	// Domination is true if the winner won by domination, see
	// model.Rules.Domination, with other players still alive.
	Domination bool `json:"domination"`
	// UNPlanes is the number of UN airplanes sent, see model.Rules.UN.
	UNPlanes int `json:"unPlanes"`
	// Launches is the number of launches of each player, and Attacks how
	// many of them went to an island the player did not own at the time.
	Launches []int `json:"launches"`
	Attacks  []int `json:"attacks"`
}

// Sample is a snapshot of each player's territory and army.
type Sample struct {
	Time time.Duration `json:"time"`
	// Islands is the number of islands of each player.
	Islands []int `json:"islands"`
	// Army is the total army, on islands and airplanes but not counting
	// garrisons, of each player.
	Army []int64 `json:"army"`
}

// Capture is an island changing owner.
type Capture struct {
	Time   time.Duration `json:"time"`
	Island int           `json:"island"`
	From   int           `json:"from"`
	To     int           `json:"to"`
	// Start is true if the island was the starting island of From.
	Start bool `json:"start"`
	// Before is the army of the island, and Garrison its garrison, before
	// the tick in which it was taken.
	Before   int64 `json:"before"`
	Garrison int64 `json:"garrison"`
}

// Life is a period during which a player was alive: from the start of the
// game or a revival, until eliminated or the end of the game.
type Life struct {
	Player  int           `json:"player"`
	Revived bool          `json:"revived"`
	Start   time.Duration `json:"start"`
	End     time.Duration `json:"end"`
	// Eliminated is true if the life ended with the player losing all
	// islands and airplanes, rather than with the end of the game.
	Eliminated bool `json:"eliminated"`
	// MaxIslands is the most islands the player had during the life.
	MaxIslands int `json:"maxIslands"`
	// PeakArmy is the largest total army of the player during the life.
	PeakArmy int64 `json:"peakArmy"`
}

type queuedAction struct {
	player model.PlayerID
	action model.PlayerAction
}

// Run plays a game to the end, or to cfg.MaxTime, and returns its record. The
// map and the AIs' randomness both come from seed, so the same seed and
// config always play the same game.
func Run(cfg Config, seed int64) (*Result, error) {
	if len(cfg.Bots) < 2 {
		return nil, errors.New("need at least 2 bots")
	}
	if cfg.Tick <= 0 || cfg.MaxTime <= 0 {
		return nil, errors.New("Tick and MaxTime must be > 0")
	}
	g, err := game.CreateGame(len(cfg.Bots), seed, cfg.Rules)
	if err != nil {
		return nil, fmt.Errorf("creating game: %w", err)
	}
	rng := rand.New(rand.NewSource(seed ^ 0x5eed))
	bots := make([]*ai.Bot, len(cfg.Bots))
	for i, kind := range cfg.Bots {
		var creator ai.StrategyCreatorFunc
		pace := ai.LivePace
		switch kind {
		case BotOpportunistic:
			creator = ai.OpportunisticStrategy()
		case BotRandom:
			creator = ai.RandomStrategy(rng.Int63n(30) + 2)
		case BotSmart:
			smart := cfg.Smart
			if smart == (ai.SmartConfig{}) {
				smart = ai.DefaultSmartConfig
			}
			pace = cfg.SmartPace
			if pace == (ai.Pace{}) {
				pace = ai.HumanPace
			}
			creator = ai.SmartStrategyWith(smart)
		default:
			return nil, fmt.Errorf("unknown bot kind %q", kind)
		}
		bots[i], err = ai.NewBot(creator, pace, rand.New(rand.NewSource(rng.Int63())))
		if err != nil {
			return nil, err
		}
	}

	r := newRecorder(g, seed, cfg.Bots)
	var queued []queuedAction
	tick := &model.ActionTick{Delta: cfg.Tick}
	for {
		// Like the game loop: the actions queued since the last tick, then
		// the tick, then the game over check.
		rng.Shuffle(len(queued), func(i, j int) { queued[i], queued[j] = queued[j], queued[i] })
		for _, q := range queued {
			before := len(g.Airplanes())
			_, err := q.action.ToAction(q.player).Apply(g)
			var illegal *model.IllegalActionError
			if err != nil && !errors.As(err, &illegal) {
				return nil, fmt.Errorf("applying action: %w", err)
			}
			if len(g.Airplanes()) > before {
				r.launched(g, q.player, g.Airplanes()[len(g.Airplanes())-1])
			}
		}
		queued = queued[:0]
		evts, err := tick.Apply(g)
		if err != nil {
			return nil, fmt.Errorf("applying tick: %w", err)
		}
		r.afterTick(g)
		overEvts, err := (&model.ActionCheckGameOver{}).Apply(g)
		if err != nil {
			return nil, fmt.Errorf("checking game over: %w", err)
		}
		if len(overEvts) > 0 {
			over := overEvts[0].(*model.EventGameOver)
			return r.finish(g, r.index[over.WinnerID], false), nil
		}
		if g.Time() >= cfg.MaxTime {
			return r.finish(g, -1, true), nil
		}
		tickEvt := evts[0].(*model.EventTick)
		for i, p := range g.Players() {
			if p.State() != model.Alive {
				continue
			}
			view := tickEvt.ToPlayerEvent(p.ID()).(*model.PlayerEventTick).Game
			act, err := bots[i].NextAction(p.ID(), view)
			if err != nil {
				continue
			}
			if act != nil {
				queued = append(queued, queuedAction{p.ID(), act})
			}
		}
	}
}

// recorder builds a Result while a game is played.
type recorder struct {
	res *Result
	// index maps player ids to player indexes, the neutral player and
	// InvalidID to Neutral.
	index      map[model.PlayerID]int
	owners     []int
	strengths  []int64 // army of each island after the last tick
	garrisons  []int64 // garrison of each island after the last tick
	starts     []int   // the starting island of each player
	states     []model.PlayerState
	lives      []int // index in res.Lives of each player's current life, -1 if none
	nextSample time.Duration
}

func newRecorder(g *model.Game, seed int64, bots []BotKind) *recorder {
	r := &recorder{
		res: &Result{
			Seed:     seed,
			Bots:     bots,
			Islands:  len(g.Islands()),
			Launches: make([]int, len(g.Players())),
			Attacks:  make([]int, len(g.Players())),
		},
		index: map[model.PlayerID]int{
			g.PlayerNeutral().ID():          Neutral,
			model.PlayerID(model.InvalidID): Neutral,
		},
		owners:    make([]int, len(g.Islands())),
		strengths: make([]int64, len(g.Islands())),
		garrisons: make([]int64, len(g.Islands())),
		starts:    make([]int, len(g.Players())),
		states:    make([]model.PlayerState, len(g.Players())),
		lives:     make([]int, len(g.Players())),
	}
	for i, p := range g.Players() {
		r.index[p.ID()] = i
		r.states[i] = p.State()
		r.lives[i] = len(r.res.Lives)
		r.res.Lives = append(r.res.Lives, Life{Player: i})
	}
	for i, island := range g.Islands() {
		r.owners[i] = r.index[island.Owner()]
		r.strengths[i], r.garrisons[i] = island.Strength(), island.Garrison()
		if r.owners[i] != Neutral {
			r.starts[r.owners[i]] = i
		}
	}
	r.updateLives(g)
	r.sample(g)
	return r
}

// territory returns the islands and army of each player.
func (r *recorder) territory(g *model.Game) ([]int, []int64) {
	islands := make([]int, len(g.Players()))
	army := make([]int64, len(g.Players()))
	for _, island := range g.Islands() {
		if i := r.index[island.Owner()]; i != Neutral {
			islands[i]++
			army[i] += island.Strength()
		}
	}
	for _, airplane := range g.Airplanes() {
		if i := r.index[airplane.Owner()]; i != Neutral {
			army[i] += airplane.Strength()
		}
	}
	return islands, army
}

// launched records a launch of the player.
func (r *recorder) launched(g *model.Game, player model.PlayerID, airplane *model.Airplane) {
	i := r.index[player]
	r.res.Launches[i]++
	if !g.Island(airplane.Destination()).IsOwnedBy(player) {
		r.res.Attacks[i]++
	}
}

func (r *recorder) sample(g *model.Game) {
	islands, army := r.territory(g)
	r.res.Samples = append(r.res.Samples, Sample{Time: g.Time(), Islands: islands, Army: army})
	r.nextSample += SampleInterval
}

func (r *recorder) updateLives(g *model.Game) {
	islands, army := r.territory(g)
	for i, li := range r.lives {
		if li < 0 {
			continue
		}
		life := &r.res.Lives[li]
		life.MaxIslands = max(life.MaxIslands, islands[i])
		life.PeakArmy = max(life.PeakArmy, army[i])
	}
}

func (r *recorder) afterTick(g *model.Game) {
	now := g.Time()
	for i, island := range g.Islands() {
		owner := r.index[island.Owner()]
		before, garrison := r.strengths[i], r.garrisons[i]
		r.strengths[i], r.garrisons[i] = island.Strength(), island.Garrison()
		if owner == r.owners[i] {
			continue
		}
		from := r.owners[i]
		r.res.Captures = append(r.res.Captures, Capture{
			Time:     now,
			Island:   i,
			From:     from,
			To:       owner,
			Start:    from != Neutral && r.starts[from] == i,
			Before:   before,
			Garrison: garrison,
		})
		r.owners[i] = owner
	}
	for i, p := range g.Players() {
		prev, state := r.states[i], p.State()
		r.states[i] = state
		if prev == state {
			continue
		}
		if prev == model.Alive && r.lives[i] >= 0 {
			life := &r.res.Lives[r.lives[i]]
			life.End = now
			life.Eliminated = true
			r.lives[i] = -1
		}
		if state == model.Alive {
			r.lives[i] = len(r.res.Lives)
			r.res.Lives = append(r.res.Lives, Life{Player: i, Revived: true, Start: now})
		}
	}
	r.updateLives(g)
	if now >= r.nextSample {
		r.sample(g)
	}
}

func (r *recorder) finish(g *model.Game, winner int, timedOut bool) *Result {
	for _, li := range r.lives {
		if li >= 0 {
			r.res.Lives[li].End = g.Time()
		}
	}
	r.res.Winner = winner
	r.res.Duration = g.Time()
	r.res.TimedOut = timedOut
	r.res.UNPlanes = g.UNCount()
	if winner >= 0 {
		for i, p := range g.Players() {
			if i != winner && p.State() == model.Alive {
				r.res.Domination = true
			}
		}
	}
	return r.res
}
