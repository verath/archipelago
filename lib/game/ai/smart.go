package ai

import (
	"errors"
	"math"
	"math/rand"
	"slices"
	"time"

	"github.com/verath/archipelago/lib/game/model"
)

// SmartStrategy plays more like a person than the other strategies: it
// defends islands under attack, gathers army from several islands for an
// attack, remembers what it saw of islands now in fog of war, and moves army
// from islands that stopped growing towards where it is needed.
func SmartStrategy() StrategyCreatorFunc {
	return func() (strategy, error) {
		return newSmartStrategy(), nil
	}
}

const (
	// smartMinLaunch is the smallest island strength the smart strategy
	// launches from, so that launches send at least half of it.
	smartMinLaunch = 4
	// smartMargin is the share of extra army the smart strategy sends on top
	// of what it expects to need, for the estimates being off.
	smartMargin = 0.15
	// smartMarginFlat is extra army sent on top of smartMargin.
	smartMarginFlat = 3
	// smartUnknownPlane is the guessed strength of a hostile airplane whose
	// strength the strategy has never seen.
	smartUnknownPlane = 20
	// smartReach is how much further than its closest island the strategy
	// draws army from for an attack, in tiles.
	smartReach = 3.0
	// smartStageAt is the share of the growth cap from which an island is
	// considered full, and its army better used elsewhere.
	smartStageAt = 0.9
	// smartRayWidth is how far, in tiles, an island may be from the line an
	// airplane flies along to be one it may be flying to.
	smartRayWidth = 0.3
)

// seenIsland is what the strategy last saw of an island outside fog of war.
type seenIsland struct {
	owner    model.PlayerID
	strength int64
	time     time.Duration
}

type smartStrategy struct {
	// target is the island being attacked, "" if none.
	target model.IslandID
	// seen is the last seen state of each island.
	seen map[model.IslandID]seenIsland
	// planes is the last seen strength of each airplane in the air.
	planes map[model.AirplaneID]int64
}

func newSmartStrategy() *smartStrategy {
	return &smartStrategy{
		seen:   map[model.IslandID]seenIsland{},
		planes: map[model.AirplaneID]int64{},
	}
}

// smartTurn holds what a single NextAction call works with.
type smartTurn struct {
	game    *model.Game
	me      model.PlayerID
	neutral model.PlayerID
	rng     *rand.Rand
	mine    []*model.Island
	// threats are the islands of ours that hostile airplanes are flying to.
	threats map[model.IslandID]threat
}

// threat is the attacks that may be coming for an island of ours. Like a
// person, the strategy doesn't know where other players' airplanes are
// going, only where they are heading: an airplane is a threat to each of the
// islands ahead of it on its line, an equal share to each.
type threat struct {
	// expected is the hostile army expected to arrive: each airplane's
	// strength times the share of it that may be for the island.
	expected float64
	// deficit is by how much the island is expected to lose, <= 0 if it is
	// expected to hold.
	deficit int64
	// first is when the first hostile airplane that may be coming would
	// arrive.
	first time.Duration
}

// possibleTarget is an island an airplane may be flying to.
type possibleTarget struct {
	island *model.Island
	// dist is how far ahead of the airplane the island is.
	dist float64
}

// possibleTargets returns the islands that an airplane may be flying to: the
// islands close to the line ahead of it.
func possibleTargets(game *model.Game, airplane *model.Airplane) []possibleTarget {
	pos := airplane.Position()
	dx, dy := math.Cos(airplane.Direction()), math.Sin(airplane.Direction())
	var targets []possibleTarget
	for _, island := range game.Islands() {
		c := island.Position().ToFloatCoordinate()
		vx, vy := c.X-pos.X, c.Y-pos.Y
		ahead := vx*dx + vy*dy
		if ahead <= 1e-6 {
			continue // Behind it, or the island it starts from.
		}
		if math.Abs(vx*dy-vy*dx) <= smartRayWidth {
			targets = append(targets, possibleTarget{island, ahead})
		}
	}
	return targets
}

func distance(a, b model.FloatCoordinate) float64 {
	return math.Hypot(a.X-b.X, a.Y-b.Y)
}

func islandDistance(a, b *model.Island) float64 {
	return distance(a.Position().ToFloatCoordinate(), b.Position().ToFloatCoordinate())
}

// flightTime is how long a launched airplane takes to fly the distance.
func flightTime(dist float64) time.Duration {
	return time.Duration(dist / model.AirplaneDefaultSpeed)
}

// growth is how much a player's island grows in d, ignoring upkeep.
func growth(island *model.Island, d time.Duration) int64 {
	return int64(float64(island.Size()) * float64(d) / float64(model.IslandGrowthInterval))
}

func (s *smartStrategy) NextAction(state clientState, game *model.Game, rng *rand.Rand) (model.PlayerAction, error) {
	if game.Player(state.myPlayerID) == nil {
		return nil, errors.New("myPlayer not found in game")
	}
	s.remember(game)
	t := &smartTurn{
		game:    game,
		me:      state.myPlayerID,
		neutral: game.PlayerNeutral().ID(),
		rng:     rng,
	}
	for _, island := range game.Islands() {
		if island.IsOwnedBy(t.me) {
			t.mine = append(t.mine, island)
		}
	}
	if len(t.mine) == 0 {
		return nil, nil
	}
	t.threats = s.threats(t)
	if act := s.defend(t); act != nil {
		return act, nil
	}
	if act := s.attack(t); act != nil {
		return act, nil
	}
	return s.stage(t), nil
}

// remember records what is visible of islands and airplanes.
func (s *smartStrategy) remember(game *model.Game) {
	for _, island := range game.Islands() {
		if island.Strength() >= 0 {
			s.seen[island.ID()] = seenIsland{island.Owner(), island.Strength(), game.Time()}
		}
	}
	planes := make(map[model.AirplaneID]int64, len(game.Airplanes()))
	for _, airplane := range game.Airplanes() {
		if airplane.Strength() >= 0 {
			planes[airplane.ID()] = airplane.Strength()
		} else if strength, ok := s.planes[airplane.ID()]; ok {
			planes[airplane.ID()] = strength
		}
	}
	s.planes = planes
}

// planeStrength returns the strength of an airplane, or a guess if it was
// never seen.
func (s *smartStrategy) planeStrength(airplane *model.Airplane) int64 {
	if airplane.Strength() >= 0 {
		return airplane.Strength()
	}
	if strength, ok := s.planes[airplane.ID()]; ok {
		return strength
	}
	return smartUnknownPlane
}

// defence estimates the army an attacker has to beat to take the island,
// garrison included, after flying for eta.
func (s *smartStrategy) defence(t *smartTurn, island *model.Island, eta time.Duration) int64 {
	strength := island.Strength()
	age := time.Duration(0)
	if strength < 0 {
		// In fog of war: what we last saw, if the owner is the same.
		if seen, ok := s.seen[island.ID()]; ok && seen.owner == island.Owner() {
			strength, age = seen.strength, t.game.Time()-seen.time
		} else {
			strength = int64(50 * float64(island.Size()))
		}
	}
	if !island.IsOwnedBy(t.neutral) {
		limit := int64(model.IslandGrowthCap * float64(island.Size()))
		if strength < limit {
			strength = min(limit, strength+growth(island, age+eta))
		}
	}
	return strength + island.Garrison()
}

// inFlight is the army of our airplanes flying to the island.
func (t *smartTurn) inFlight(island *model.Island) int64 {
	var strength int64
	for _, airplane := range t.game.Airplanes() {
		if airplane.IsOwnedBy(t.me) && airplane.Destination() == island.ID() {
			strength += airplane.Strength()
		}
	}
	return strength
}

// threats finds the islands of ours that hostile airplanes may be flying
// to, and by how much they are expected to lose.
func (s *smartStrategy) threats(t *smartTurn) map[model.IslandID]threat {
	threats := map[model.IslandID]threat{}
	for _, airplane := range t.game.Airplanes() {
		if airplane.IsOwnedBy(t.me) {
			continue
		}
		targets := possibleTargets(t.game, airplane)
		share := 1 / float64(len(targets))
		for _, target := range targets {
			if !target.island.IsOwnedBy(t.me) {
				continue
			}
			eta := time.Duration(target.dist / airplane.Speed())
			th, ok := threats[target.island.ID()]
			if !ok || eta < th.first {
				th.first = eta
			}
			th.expected += share * float64(s.planeStrength(airplane))
			threats[target.island.ID()] = th
		}
	}
	for id, th := range threats {
		island := t.game.Island(id)
		hold := island.Strength() + island.Garrison() + growth(island, th.first) + t.inFlight(island)
		// An attack equal to the defence makes the island neutral, so it
		// takes one more to hold it.
		th.deficit = int64(math.Ceil(th.expected)) - (hold - 1)
		threats[id] = th
	}
	return threats
}

// canLaunch is true if the island has army to spare: it is ours, strong
// enough, and still expected to hold against what may be coming for it after
// launching half of its army.
func (t *smartTurn) canLaunch(island *model.Island) bool {
	if !island.IsOwnedBy(t.me) || island.Strength() < smartMinLaunch {
		return false
	}
	th, threatened := t.threats[island.ID()]
	return !threatened || th.deficit+island.Strength()/2 <= 0
}

func launch(from, to *model.Island) model.PlayerAction {
	return &model.PlayerActionLaunch{From: from.ID(), To: to.ID()}
}

// defend sends army to an island of ours that is expected to be lost, if
// enough can get there in time.
func (s *smartStrategy) defend(t *smartTurn) model.PlayerAction {
	// The island that is most worth saving first: largest, then strongest.
	var ids []model.IslandID
	for id, th := range t.threats {
		if th.deficit > 0 {
			ids = append(ids, id)
		}
	}
	slices.SortFunc(ids, func(a, b model.IslandID) int {
		ia, ib := t.game.Island(a), t.game.Island(b)
		if ia.Size() != ib.Size() {
			return -cmpFloat(float64(ia.Size()), float64(ib.Size()))
		}
		return int(ib.Strength() - ia.Strength())
	})
	for _, id := range ids {
		island, th := t.game.Island(id), t.threats[id]
		// Islands that can get there in time, closest first.
		var helpers []*model.Island
		var help int64
		for _, from := range t.mine {
			if from == island || !t.canLaunch(from) || flightTime(islandDistance(from, island)) >= th.first {
				continue
			}
			helpers = append(helpers, from)
			help += from.Strength() / 2
		}
		if help < th.deficit {
			continue // Can't be saved.
		}
		slices.SortFunc(helpers, func(a, b *model.Island) int {
			return cmpFloat(islandDistance(a, island), islandDistance(b, island))
		})
		// The closest island that is enough on its own, else the
		// strongest; the rest follows on the next turns.
		best := helpers[0]
		for _, from := range helpers {
			if from.Strength()/2 >= th.deficit {
				return launch(from, island)
			}
			if from.Strength() > best.Strength() {
				best = from
			}
		}
		return launch(best, island)
	}
	return nil
}

func cmpFloat(a, b float64) int {
	switch {
	case a < b:
		return -1
	case a > b:
		return 1
	}
	return 0
}

// attackPlan is what it takes to attack an island.
type attackPlan struct {
	target *model.Island
	// need is the army still to send, <= 0 if what is on the way is
	// expected to be enough.
	need int64
	// origins are the islands to send it from, closest first, and available
	// what they can send in total.
	origins   []*model.Island
	available int64
}

// plan works out what it takes to attack the island.
func (s *smartStrategy) plan(t *smartTurn, target *model.Island) attackPlan {
	p := attackPlan{target: target}
	closest := math.Inf(1)
	for _, from := range t.mine {
		if t.canLaunch(from) {
			closest = min(closest, islandDistance(from, target))
		}
	}
	if math.IsInf(closest, 1) {
		// Nothing to send from.
		p.need = math.MaxInt64
		return p
	}
	for _, from := range t.mine {
		if t.canLaunch(from) && islandDistance(from, target) <= closest+smartReach {
			p.origins = append(p.origins, from)
			p.available += from.Strength() / 2
		}
	}
	slices.SortFunc(p.origins, func(a, b *model.Island) int {
		return cmpFloat(islandDistance(a, target), islandDistance(b, target))
	})
	// Enough to beat the defence with a margin, less what is already on the
	// way.
	defence := s.defence(t, target, flightTime(closest+smartReach/2))
	p.need = defence + int64(smartMargin*float64(defence)) + smartMarginFlat - t.inFlight(target)
	return p
}

// value is how much the island is worth having.
func value(island *model.Island) float64 {
	return float64(island.Size())
}

// attack continues the attack on the current target, or picks a new one.
func (s *smartStrategy) attack(t *smartTurn) model.PlayerAction {
	if target := t.game.Island(s.target); target != nil && !target.IsOwnedBy(t.me) {
		p := s.plan(t, target)
		if p.need > 0 && p.available >= p.need {
			return s.send(p)
		}
		if p.need > 0 {
			// Not enough any more; what is in the air goes on, but we look
			// for something else.
			s.target = ""
		}
		// Else enough is on the way: pick the next target alongside.
	}
	s.target = ""
	var best *attackPlan
	bestScore := 0.0
	for _, island := range t.game.Islands() {
		if island.IsOwnedBy(t.me) {
			continue
		}
		p := s.plan(t, island)
		if p.need <= 0 || p.available < p.need {
			continue
		}
		dist := islandDistance(p.origins[0], island)
		// Cheap, close and large islands first, with some noise so bots
		// don't all play alike.
		score := value(island) / float64(p.need+int64(3*dist)+1) * (0.8 + 0.4*t.rng.Float64())
		if best == nil || score > bestScore {
			best, bestScore = &p, score
		}
	}
	if best == nil {
		return nil
	}
	s.target = best.target.ID()
	return s.send(*best)
}

// send launches the next airplane of an attack: from the closest origin
// that alone sends what is still needed, else from the strongest.
func (s *smartStrategy) send(p attackPlan) model.PlayerAction {
	best := p.origins[0]
	for _, from := range p.origins {
		if from.Strength()/2 >= p.need {
			return launch(from, p.target)
		}
		if from.Strength() > best.Strength() {
			best = from
		}
	}
	return launch(best, p.target)
}

// stage moves army from a full island, which no longer grows, to our island
// closest to the cheapest island we don't own, so it is at hand for an
// attack.
func (s *smartStrategy) stage(t *smartTurn) model.PlayerAction {
	var full []*model.Island
	for _, island := range t.mine {
		if t.canLaunch(island) && float64(island.Strength()) >= smartStageAt*model.IslandGrowthCap*float64(island.Size()) {
			full = append(full, island)
		}
	}
	if len(full) == 0 {
		return nil
	}
	var cheapest *model.Island
	var cheapestDefence int64
	for _, island := range t.game.Islands() {
		if island.IsOwnedBy(t.me) {
			continue
		}
		defence := s.defence(t, island, 0)
		if cheapest == nil || defence < cheapestDefence {
			cheapest, cheapestDefence = island, defence
		}
	}
	if cheapest == nil {
		return nil
	}
	stage := t.mine[0]
	for _, island := range t.mine {
		if islandDistance(island, cheapest) < islandDistance(stage, cheapest) {
			stage = island
		}
	}
	from := full[t.rng.Intn(len(full))]
	if from == stage {
		return nil
	}
	return launch(from, stage)
}
