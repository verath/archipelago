package ai

import (
	"errors"
	"fmt"
	"math"
	"math/rand"
	"slices"
	"strconv"
	"time"

	"github.com/verath/archipelago/lib/game/model"
)

// SmartStrategy plays more like a person than the other strategies: it
// defends islands under attack, gathers army from several islands for an
// attack, remembers what it saw of islands now in fog of war, and moves army
// from islands that stopped growing towards where it is needed.
func SmartStrategy() StrategyCreatorFunc {
	return SmartStrategyWith(DefaultSmartConfig)
}

// SmartStrategyWith is SmartStrategy with the given config.
func SmartStrategyWith(cfg SmartConfig) StrategyCreatorFunc {
	return func() (strategy, error) {
		s := newSmartStrategy()
		s.cfg = cfg
		return s, nil
	}
}

// SmartConfig holds the tunable settings of SmartStrategy.
type SmartConfig struct {
	// Margin is the share of extra army sent on top of what an attack is
	// expected to need, for the estimates being off, and MarginFlat a flat
	// amount on top of that.
	Margin     float64
	MarginFlat int64
	// Reach is how much further than its closest island, in tiles, the
	// strategy draws army from for an attack.
	Reach float64
	// PlayerValue is how much more an island of another player is worth
	// than a neutral one: taking it also costs that player. LeaderValue is
	// how much more again an island of the leading player is worth: unless
	// someone stops the leader, the leader wins.
	PlayerValue, LeaderValue float64
	// Exposure is the distance, in tiles, within which an enemy island is a
	// danger to an island: it could attack it.
	Exposure float64
	// Hold is the share of its exposure that an attack also sends, to hold
	// the island once taken. Keep is the share of its exposure an island
	// keeps when launching.
	Hold, Keep float64
	// MaxOrigins is the most islands an attack is sent from.
	MaxOrigins int
	// MinLaunch is the smallest island strength the strategy launches from,
	// except to move army to where it is needed. Launches send half of it.
	MinLaunch int64
	// Misjudge is the standard deviation of the strategy's error in judging
	// how strong an island is, as a share of its strength.
	Misjudge float64
	// Unseen is the share of the growth cap that the strategy assumes a
	// neutral island it never saw started with, on top of the 10 all start
	// with. Their actual start is between 0 and 1.
	Unseen float64
}

// DefaultSmartConfig is the config of SmartStrategy.
var DefaultSmartConfig = SmartConfig{
	Margin:      0.15,
	MarginFlat:  3,
	Reach:       3,
	PlayerValue: 1.3,
	LeaderValue: 1.5,
	Exposure:    3.5,
	Hold:        1,
	Keep:        1,
	MaxOrigins:  10,
	MinLaunch:   4,
	Misjudge:    0.1,
	Unseen:      0.5,
}

// Set sets the setting named key, the field name in lower case, to value.
func (c *SmartConfig) Set(key, value string) error {
	fields := map[string]*float64{
		"margin": &c.Margin, "reach": &c.Reach, "playervalue": &c.PlayerValue,
		"leadervalue": &c.LeaderValue, "exposure": &c.Exposure, "hold": &c.Hold,
		"keep": &c.Keep, "misjudge": &c.Misjudge, "unseen": &c.Unseen,
	}
	ints := map[string]*int64{"marginflat": &c.MarginFlat, "minlaunch": &c.MinLaunch}
	if field, ok := ints[key]; ok {
		v, err := strconv.ParseInt(value, 10, 64)
		*field = v
		return err
	}
	if key == "maxorigins" {
		v, err := strconv.Atoi(value)
		c.MaxOrigins = v
		return err
	}
	field, ok := fields[key]
	if !ok {
		return fmt.Errorf("unknown smart setting %q", key)
	}
	v, err := strconv.ParseFloat(value, 64)
	*field = v
	return err
}

const (
	// smartUnknownPlane is the guessed strength of a hostile airplane whose
	// strength the strategy has never seen.
	smartUnknownPlane = 20
	// smartStageAt is the share of the growth cap from which an island is
	// considered full, and its army better used elsewhere.
	smartStageAt = 0.9
	// smartRayWidth is how far, in tiles, an island may be from the line an
	// airplane flies along to be one it may be flying to.
	smartRayWidth = 0.3
	// smartMisjudgeFor is how long the strategy sticks to a misjudgement of
	// an island before taking a fresh look.
	smartMisjudgeFor = 10 * time.Second
)

// seenIsland is what the strategy last saw of an island outside fog of war.
type seenIsland struct {
	owner    model.PlayerID
	strength int64
	time     time.Duration
}

// pendingLaunch is a launch the strategy made that its view of the game does
// not show yet.
type pendingLaunch struct {
	seq      uint32
	from, to model.IslandID
}

// misjudgement is the strategy's error in judging an island's strength.
type misjudgement struct {
	factor float64
	until  time.Duration
}

type smartStrategy struct {
	cfg SmartConfig
	// target is the island being attacked, "" if none.
	target model.IslandID
	// seen is the last seen state of each island.
	seen map[model.IslandID]seenIsland
	// planes is the last seen strength of each airplane in the air.
	planes map[model.AirplaneID]int64
	// known are the airplanes in the air at the last turn.
	known map[model.AirplaneID]bool
	// seq is the Seq of the last launch.
	seq uint32
	// pending are the launches not yet in the view of the game, by
	// increasing seq.
	pending []pendingLaunch
	// misjudged is the current misjudgement of each island.
	misjudged map[model.IslandID]misjudgement
}

func newSmartStrategy() *smartStrategy {
	return &smartStrategy{
		cfg:       DefaultSmartConfig,
		seen:      map[model.IslandID]seenIsland{},
		planes:    map[model.AirplaneID]int64{},
		misjudged: map[model.IslandID]misjudgement{},
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
	// leader is the other player with the most islands.
	leader model.PlayerID
	// exposures caches exposure.
	exposures map[model.IslandID]int64
	cfg       *SmartConfig
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

// neutralDecay is how much army a neutral island loses in d.
func neutralDecay(island *model.Island, d time.Duration) int64 {
	return int64((1 - float64(island.Size())) * float64(d) / float64(model.IslandGrowthInterval))
}

// growth is how much a player's island grows in d, ignoring upkeep.
func growth(island *model.Island, d time.Duration) int64 {
	return int64(float64(island.Size()) * float64(d) / float64(model.IslandGrowthInterval))
}

func (s *smartStrategy) NextAction(state clientState, game *model.Game, rng *rand.Rand) (model.PlayerAction, error) {
	myPlayer := game.Player(state.myPlayerID)
	if myPlayer == nil {
		return nil, errors.New("myPlayer not found in game")
	}
	s.remember(game)
	game = s.withPending(game, myPlayer)
	t := &smartTurn{
		cfg:     &s.cfg,
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
	t.leader = leader(game, t.me, t.neutral)
	t.threats = s.threats(t)
	act := s.defend(t)
	if act == nil {
		act = s.attack(t)
	}
	if act == nil {
		act = s.stage(t)
	}
	if act == nil {
		return nil, nil
	}
	s.seq++
	act.Seq = s.seq
	s.pending = append(s.pending, pendingLaunch{s.seq, act.From, act.To})
	return act, nil
}

// withPending returns the game as it will be once the launches that the game
// does not show yet are made, so the strategy doesn't make them again. The
// view lags behind for the time it takes the game to process a launch, and
// for the bot's reaction time.
func (s *smartStrategy) withPending(game *model.Game, myPlayer *model.Player) *model.Game {
	last := myPlayer.LastLaunchSeq()
	for len(s.pending) > 0 && s.pending[0].seq <= last {
		s.pending = s.pending[1:]
	}
	if len(s.pending) == 0 {
		return game
	}
	game = game.Copy()
	for _, p := range s.pending {
		from, to := game.Island(p.from), game.Island(p.to)
		if from == nil || to == nil || !from.IsOwnedBy(myPlayer.ID()) || from.Strength() < 2 {
			continue
		}
		strength := from.Strength() / 2
		from.SetStrength(from.Strength() - strength)
		game.AddAirplane(model.NewAirplane(from.Position(), to, myPlayer.ID(), strength))
	}
	return game
}

// leader returns the other player with the most islands, or "" if no other
// player has any.
func leader(game *model.Game, me, neutral model.PlayerID) model.PlayerID {
	counts := map[model.PlayerID]int{}
	for _, island := range game.Islands() {
		counts[island.Owner()]++
	}
	var best model.PlayerID
	for _, p := range game.Players() {
		if p.ID() != me && counts[p.ID()] > counts[best] {
			best = p.ID()
		}
	}
	return best
}

// remember records what is visible of islands and airplanes.
func (s *smartStrategy) remember(game *model.Game) {
	for _, island := range game.Islands() {
		if island.Strength() >= 0 {
			s.seen[island.ID()] = seenIsland{island.Owner(), island.Strength(), game.Time()}
		}
	}
	planes := make(map[model.AirplaneID]int64, len(game.Airplanes()))
	known := make(map[model.AirplaneID]bool, len(game.Airplanes()))
	for _, airplane := range game.Airplanes() {
		known[airplane.ID()] = true
		if airplane.Strength() >= 0 {
			planes[airplane.ID()] = airplane.Strength()
		} else if strength, ok := s.planes[airplane.ID()]; ok {
			planes[airplane.ID()] = strength
		}
		if !s.known[airplane.ID()] {
			s.launchedFrom(game, airplane)
		}
	}
	s.planes, s.known = planes, known
}

// launchedFrom updates what the strategy remembers of the island a new
// airplane took off from, if that island is in fog of war: like a person
// seeing an airplane leave it, the strategy knows it sent half of its army.
func (s *smartStrategy) launchedFrom(game *model.Game, airplane *model.Airplane) {
	for _, island := range game.Islands() {
		if !island.IsOwnedBy(airplane.Owner()) || island.Strength() >= 0 ||
			distance(airplane.Position(), island.Position().ToFloatCoordinate()) > 0.5 {
			continue
		}
		seen, ok := s.seen[island.ID()]
		if !ok || seen.owner != island.Owner() {
			return
		}
		strength := seen.strength + growth(island, game.Time()-seen.time)
		s.seen[island.ID()] = seenIsland{island.Owner(), strength - strength/2, game.Time()}
		return
	}
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
		} else if island.IsOwnedBy(t.neutral) {
			// Never seen: neutral islands start with 10 to 10 + the growth
			// cap, and have been losing army since.
			strength, age = int64(10+s.cfg.Unseen*model.IslandGrowthCap*float64(island.Size())), t.game.Time()
		} else {
			strength = int64(50 * float64(island.Size()))
		}
	}
	if island.IsOwnedBy(t.neutral) {
		strength = max(0, strength-neutralDecay(island, age+eta))
	} else {
		limit := int64(model.IslandGrowthCap * float64(island.Size()))
		if strength < limit {
			strength = min(limit, strength+growth(island, age+eta))
		}
	}
	return int64(float64(strength)*s.misjudgement(t, island)) + island.Garrison()
}

// misjudgement returns the factor by which the strategy currently misjudges
// the strength of the island.
func (s *smartStrategy) misjudgement(t *smartTurn, island *model.Island) float64 {
	if t.rng == nil {
		return 1
	}
	m, ok := s.misjudged[island.ID()]
	if !ok || t.game.Time() >= m.until {
		m = misjudgement{
			factor: max(0.5, 1+s.cfg.Misjudge*t.rng.NormFloat64()),
			until:  t.game.Time() + smartMisjudgeFor,
		}
		s.misjudged[island.ID()] = m
	}
	return m.factor
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

// exposure is the army an island should hold to be safe from the enemy
// islands near it: the largest attack one of them could launch, which is half
// of its army. The garrison of the island counts towards it.
func (s *smartStrategy) exposure(t *smartTurn, island *model.Island) int64 {
	if e, ok := t.exposures[island.ID()]; ok {
		return e
	}
	var e int64
	for _, enemy := range t.game.Islands() {
		if enemy == island || enemy.IsOwnedBy(t.me) || enemy.IsOwnedBy(t.neutral) ||
			islandDistance(enemy, island) > s.cfg.Exposure {
			continue
		}
		e = max(e, (s.defence(t, enemy, 0)-enemy.Garrison())/2)
	}
	e = max(0, e-island.Garrison())
	if t.exposures == nil {
		t.exposures = map[model.IslandID]int64{}
	}
	t.exposures[island.ID()] = e
	return e
}

// canLaunch is true if the island has army to spare: it is ours, strong
// enough, still expected to hold against what may be coming for it after
// launching half of its army, and keeps enough to be safe from the enemy
// islands near it.
func (s *smartStrategy) canLaunch(t *smartTurn, island *model.Island) bool {
	if !island.IsOwnedBy(t.me) || island.Strength() < s.cfg.MinLaunch {
		return false
	}
	half := island.Strength() / 2
	if th, threatened := t.threats[island.ID()]; threatened && th.deficit+half > 0 {
		return false
	}
	return float64(island.Strength()-half) >= s.cfg.Keep*float64(s.exposure(t, island))
}

func launch(from, to *model.Island) *model.PlayerActionLaunch {
	return &model.PlayerActionLaunch{From: from.ID(), To: to.ID()}
}

// defend sends army to an island of ours that is expected to be lost, if
// enough can get there in time.
func (s *smartStrategy) defend(t *smartTurn) *model.PlayerActionLaunch {
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
			if from == island || !s.canLaunch(t, from) || flightTime(islandDistance(from, island)) >= th.first {
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
	// origins are the islands to send it from, strongest first, and
	// available what they can send in total.
	origins   []*model.Island
	available int64
}

// plan works out what it takes to attack the island.
func (s *smartStrategy) plan(t *smartTurn, target *model.Island) attackPlan {
	p := attackPlan{target: target}
	closest := math.Inf(1)
	for _, from := range t.mine {
		if s.canLaunch(t, from) {
			closest = min(closest, islandDistance(from, target))
		}
	}
	if math.IsInf(closest, 1) {
		// Nothing to send from.
		p.need = math.MaxInt64
		return p
	}
	var candidates []*model.Island
	for _, from := range t.mine {
		if s.canLaunch(t, from) && islandDistance(from, target) <= closest+s.cfg.Reach {
			candidates = append(candidates, from)
		}
	}
	slices.SortFunc(candidates, func(a, b *model.Island) int { return int(b.Strength() - a.Strength()) })
	// Enough to beat the defence with a margin, and then to hold the island
	// against the enemy islands near it, less what is already on the way.
	defence := s.defence(t, target, flightTime(closest+s.cfg.Reach/2))
	p.need = defence + int64(s.cfg.Margin*float64(defence)) + s.cfg.MarginFlat +
		int64(s.cfg.Hold*float64(s.exposure(t, target))) - t.inFlight(target)
	// Like a person, send a few large airplanes from strong islands rather
	// than many small ones from all of them.
	for _, from := range candidates {
		if p.available >= p.need || len(p.origins) >= s.cfg.MaxOrigins {
			break
		}
		p.origins = append(p.origins, from)
		p.available += from.Strength() / 2
	}
	return p
}

// value is how much the island is worth taking.
func (t *smartTurn) value(island *model.Island) float64 {
	v := float64(island.Size())
	if !island.IsOwnedBy(t.neutral) {
		v *= t.cfg.PlayerValue
		if island.IsOwnedBy(t.leader) {
			v *= t.cfg.LeaderValue
		}
	}
	return v
}

// attack continues the attack on the current target, or picks a new one.
func (s *smartStrategy) attack(t *smartTurn) *model.PlayerActionLaunch {
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
		score := t.value(island) / float64(p.need+int64(3*dist)+1) * (0.8 + 0.4*t.rng.Float64())
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
func (s *smartStrategy) send(p attackPlan) *model.PlayerActionLaunch {
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
func (s *smartStrategy) stage(t *smartTurn) *model.PlayerActionLaunch {
	var full []*model.Island
	for _, island := range t.mine {
		if s.canLaunch(t, island) && float64(island.Strength()) >= smartStageAt*model.IslandGrowthCap*float64(island.Size()) {
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
