package ai

import (
	"slices"
	"time"

	"github.com/verath/archipelago/lib/game/model"
)

// The smart strategy can look ahead: it plays out a few candidate launches
// on a copy of its view of the game, and picks the one that leaves it best
// off. This is an experiment, see SmartConfig.Lookahead.

const (
	// lookaheadStep is the time step of the ticks played out.
	lookaheadStep = 500 * time.Millisecond
	// lookaheadIncome is how many seconds of income an island is worth, in
	// army, when comparing how well off players are.
	lookaheadIncome = 60
)

// alternatives returns launches for up to k of the attacks the strategy
// could make now, the most promising first. Unlike attack, it changes
// nothing in the strategy.
func (s *smartStrategy) alternatives(t *smartTurn, k int) []*model.PlayerActionLaunch {
	type scored struct {
		plan  attackPlan
		score float64
	}
	var plans []scored
	for _, island := range t.game.Islands() {
		if island.IsOwnedBy(t.me) {
			continue
		}
		p := s.plan(t, island)
		if p.need <= 0 || p.available < p.need {
			continue
		}
		dist := islandDistance(p.origins[0], island)
		plans = append(plans, scored{p, t.value(island) / float64(p.need+int64(3*dist)+1)})
	}
	slices.SortFunc(plans, func(a, b scored) int { return cmpFloat(b.score, a.score) })
	var launches []*model.PlayerActionLaunch
	for _, p := range plans[:min(k, len(plans))] {
		launches = append(launches, s.send(p.plan))
	}
	return launches
}

// world returns the strategy's best guess of the actual game, from its view:
// islands and airplanes in fog of war get their estimated army, and other
// players' airplanes the island they most likely fly to.
func (s *smartStrategy) world(t *smartTurn) *model.Game {
	w := t.game.Copy()
	for _, island := range w.Islands() {
		if island.Strength() < 0 {
			island.SetStrength(max(0, s.defence(t, island, 0)-island.Garrison()))
		}
	}
	for _, airplane := range slices.Clone(w.Airplanes()) {
		if airplane.Strength() < 0 {
			airplane.SetStrength(s.planeStrength(airplane))
		}
		if airplane.IsOwnedBy(t.me) {
			continue
		}
		// The closest island ahead of it.
		targets := possibleTargets(w, airplane)
		if len(targets) == 0 {
			w.RemoveAirplane(airplane)
			continue
		}
		best := targets[0]
		for _, target := range targets {
			if target.dist < best.dist {
				best = target
			}
		}
		airplane.SetDestination(best.island.ID())
	}
	return w
}

// worth is how well off the player is in the game: its army, plus its
// islands' income for lookaheadIncome seconds.
func worth(g *model.Game, player model.PlayerID) float64 {
	var w float64
	for _, island := range g.Islands() {
		if island.IsOwnedBy(player) {
			w += float64(island.Strength()) + lookaheadIncome*float64(island.Size())/islandGrowthSeconds
		}
	}
	for _, airplane := range g.Airplanes() {
		if airplane.IsOwnedBy(player) {
			w += float64(airplane.Strength())
		}
	}
	return w
}

// islandGrowthSeconds is model.IslandGrowthInterval in seconds.
var islandGrowthSeconds = model.IslandGrowthInterval.Seconds()

// rollout plays out the launch, or nothing for nil, on a copy of the world
// for the lookahead time, and returns how well off we are compared with the
// best off other player. Other players launch nothing new.
func (s *smartStrategy) rollout(t *smartTurn, world *model.Game, act *model.PlayerActionLaunch) float64 {
	g := world.Copy()
	if act != nil {
		if _, err := act.ToAction(t.me).Apply(g); err != nil {
			return -1e18
		}
	}
	tick := &model.ActionTick{Delta: lookaheadStep}
	for elapsed := time.Duration(0); elapsed < s.cur.Lookahead; elapsed += lookaheadStep {
		if _, err := tick.Apply(g); err != nil {
			return -1e18
		}
	}
	best := 0.0
	for _, p := range g.Players() {
		if p.ID() != t.me {
			best = max(best, worth(g, p.ID()))
		}
	}
	return worth(g, t.me) - best
}

// lookahead picks, out of the planned launch and a few alternatives, the
// one that plays out best.
func (s *smartStrategy) lookahead(t *smartTurn, planned *model.PlayerActionLaunch) *model.PlayerActionLaunch {
	candidates := []*model.PlayerActionLaunch{planned, nil}
	if d := s.defend(t); d != nil {
		candidates = append(candidates, d)
	}
	if st := s.stage(t); st != nil {
		candidates = append(candidates, st)
	}
	candidates = append(candidates, s.alternatives(t, smartLookaheadAlternatives)...)
	world := s.world(t)
	best, bestValue := planned, s.rollout(t, world, planned)
	for _, act := range candidates[1:] {
		if act != nil && planned != nil && *act == *planned {
			continue
		}
		if v := s.rollout(t, world, act); v > bestValue {
			best, bestValue = act, v
		}
	}
	if best != planned {
		// Follow up on the alternative instead of the plan.
		s.scouting = nil
		s.target = ""
		if best != nil && !t.game.Island(best.To).IsOwnedBy(t.me) {
			s.target = best.To
		}
	}
	return best
}

// smartLookaheadAlternatives is the number of alternative attacks the
// lookahead plays out.
const smartLookaheadAlternatives = 5
