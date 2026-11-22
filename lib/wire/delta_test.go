package wire

import (
	"fmt"
	"math"
	"math/rand"
	"sort"
	"testing"
	"time"

	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/wire/msg"
	"google.golang.org/protobuf/proto"
)

// replica is a reference implementation of a client: it applies
// snapshots and deltas to its copy of the game state.
type replica struct {
	seq      uint32
	gameTime uint32
	game     *msg.Game
	// airplaneTimes is the game time each airplane's position is at.
	airplaneTimes map[string]uint32
}

// apply applies a snapshot or delta, decoded from its wire bytes.
func (r *replica) apply(b []byte) error {
	env := &msg.EventEnvelope{}
	if err := proto.Unmarshal(b, env); err != nil {
		return err
	}
	switch evt := env.Event.(type) {
	case *msg.EventEnvelope_EventGameSnapshot:
		snap := evt.EventGameSnapshot
		r.seq, r.gameTime, r.game = snap.Seq, snap.GameTime, snap.Game
		r.airplaneTimes = make(map[string]uint32)
		for _, a := range r.game.Airplanes {
			r.airplaneTimes[a.Id] = snap.GameTime
		}
		return nil
	case *msg.EventEnvelope_EventGameDelta:
		return r.applyDelta(evt.EventGameDelta)
	default:
		return fmt.Errorf("unexpected event %T", env.Event)
	}
}

func (r *replica) applyDelta(d *msg.EventGameDelta) error {
	if r.game == nil {
		return fmt.Errorf("delta before snapshot")
	}
	if d.Seq != r.seq+1 {
		return fmt.Errorf("delta seq %d, want %d", d.Seq, r.seq+1)
	}
	r.seq, r.gameTime = d.Seq, d.GameTime
	for _, p := range d.Players {
		i := indexOf(len(r.game.Players), func(i int) bool { return r.game.Players[i].Id == p.Id })
		if i < 0 {
			return fmt.Errorf("unknown player %s", p.Id)
		}
		r.game.Players[i] = p
	}
	for _, u := range d.Islands {
		i := indexOf(len(r.game.Islands), func(i int) bool { return r.game.Islands[i].Id == u.Id })
		if i < 0 {
			return fmt.Errorf("unknown island %s", u.Id)
		}
		r.game.Islands[i].Army = u.Army
		r.game.Islands[i].Garrison = u.Garrison
	}
	// Removed before added, see the EventGameDelta docs.
	for _, id := range d.AirplanesRemoved {
		i := indexOf(len(r.game.Airplanes), func(i int) bool { return r.game.Airplanes[i].Id == id })
		if i < 0 {
			return fmt.Errorf("removed unknown airplane %s", id)
		}
		r.game.Airplanes = append(r.game.Airplanes[:i], r.game.Airplanes[i+1:]...)
		delete(r.airplaneTimes, id)
	}
	for _, a := range d.AirplanesAdded {
		if _, ok := r.airplaneTimes[a.Id]; ok {
			return fmt.Errorf("added known airplane %s", a.Id)
		}
		r.game.Airplanes = append(r.game.Airplanes, a)
		r.airplaneTimes[a.Id] = d.GameTime
	}
	for _, u := range d.AirplanesUpdated {
		i := indexOf(len(r.game.Airplanes), func(i int) bool { return r.game.Airplanes[i].Id == u.Id })
		if i < 0 {
			return fmt.Errorf("updated unknown airplane %s", u.Id)
		}
		r.game.Airplanes[i].Army = u.Army
	}
	return nil
}

// state returns the replica's game state with airplanes moved to gameTime.
func (r *replica) state() *msg.Game {
	g := proto.Clone(r.game).(*msg.Game)
	for _, a := range g.Airplanes {
		speed := float64(a.Speed)
		if speed == 0 {
			speed = model.AirplaneDefaultSpeed * float64(time.Millisecond)
		}
		dt := float64(r.gameTime - r.airplaneTimes[a.Id])
		dir := float64(a.Direction)
		a.Position = &msg.FloatCoordinate{
			X: float32(float64(a.Position.X) + speed*dt*math.Cos(dir)),
			Y: float32(float64(a.Position.Y) + speed*dt*math.Sin(dir)),
		}
	}
	return g
}

func indexOf(n int, pred func(int) bool) int {
	for i := 0; i < n; i++ {
		if pred(i) {
			return i
		}
	}
	return -1
}

// diffStates returns a description of how got differs from want, or "" if
// they are equal. Airplane positions may differ by a small epsilon, and the
// order of islands, players and airplanes doesn't matter.
func diffStates(got, want *msg.Game) string {
	got, want = normalize(got), normalize(want)
	if len(got.Airplanes) == len(want.Airplanes) {
		for i := range got.Airplanes {
			gp, wp := got.Airplanes[i].Position, want.Airplanes[i].Position
			if math.Hypot(float64(gp.X-wp.X), float64(gp.Y-wp.Y)) > 1e-3 {
				return fmt.Sprintf("airplane %s at %v, want %v", got.Airplanes[i].Id, gp, wp)
			}
			got.Airplanes[i].Position, want.Airplanes[i].Position = nil, nil
		}
	}
	if !proto.Equal(got, want) {
		return fmt.Sprintf("got:\n%v\nwant:\n%v", got, want)
	}
	return ""
}

func normalize(g *msg.Game) *msg.Game {
	g = proto.Clone(g).(*msg.Game)
	sort.Slice(g.Players, func(i, j int) bool { return g.Players[i].Id < g.Players[j].Id })
	sort.Slice(g.Islands, func(i, j int) bool { return g.Islands[i].Id < g.Islands[j].Id })
	sort.Slice(g.Airplanes, func(i, j int) bool { return g.Airplanes[i].Id < g.Airplanes[j].Id })
	return g
}

// newRandomGame creates a game like the real game creator does: a board
// with ~45% neutral islands and one large island with a garrison per player.
func newRandomGame(rng *rand.Rand, numPlayers int, size model.Coordinate) *model.Game {
	pn := model.NewPlayer()
	gb := model.NewGameBuilder(size, pn).SetRules(model.DefaultRules)
	players := make([]*model.Player, numPlayers)
	for i := range players {
		players[i] = model.NewPlayer()
		gb.AddPlayer(players[i])
	}
	perm := rng.Perm(size.X * size.Y)
	sizes := []model.IslandSize{model.IslandSizeTiny, model.IslandSizeSmall, model.IslandSizeMedium}
	for i, tile := range perm {
		pos := model.Coordinate{X: tile % size.X, Y: tile / size.X}
		var island *model.Island
		if i < numPlayers {
			island = model.NewIsland(pos, model.IslandSizeLarge, 20, players[i].ID())
			island.SetGarrison(model.DefaultRules.StartGarrison)
		} else if rng.Intn(100) < 45 {
			s := sizes[rng.Intn(len(sizes))]
			island = model.NewIsland(pos, s, rng.Int63n(int64(s*model.IslandGrowthCap))+10, pn.ID())
		} else {
			continue
		}
		gb.AddIsland(island)
	}
	return gb.BuildOrPanic()
}

// simulate plays a game with random launches and uneven tick lengths, like
// the game loop does, calling onTick with each tick's game state.
func simulate(rng *rand.Rand, game *model.Game, ticks int, onTick func(tick int, state *model.Game)) {
	seq := make(map[model.PlayerID]uint32)
	for tick := 0; tick < ticks; tick++ {
		for _, p := range game.Players() {
			if rng.Intn(5) != 0 {
				continue
			}
			var mine []*model.Island
			for _, island := range game.Islands() {
				if island.IsOwnedBy(p.ID()) {
					mine = append(mine, island)
				}
			}
			// Also launch from islands we don't own sometimes, i.e. illegal
			// launches, which must also be acknowledged.
			from := game.Islands()[rng.Intn(len(game.Islands()))]
			if len(mine) > 0 && rng.Intn(4) != 0 {
				from = mine[rng.Intn(len(mine))]
			}
			to := game.Islands()[rng.Intn(len(game.Islands()))]
			seq[p.ID()]++
			act := model.PlayerActionLaunch{From: from.ID(), To: to.ID(), Seq: seq[p.ID()]}
			act.ToAction(p.ID()).Apply(game)
		}
		delta := time.Duration(250+rng.Intn(200)) * time.Millisecond
		if tick == 0 {
			delta = 0
		}
		evts, err := (&model.ActionTick{Delta: delta}).Apply(game)
		if err != nil {
			panic(err)
		}
		onTick(tick, evts[0].(*model.EventTick).Game)
	}
}

// TestDeltaEncoder_Replay checks that applying the encoded snapshot and
// deltas gives the same state as encoding the full state, for each player
// in random games. One of the encoders only encodes every third tick, like
// it would for a client that is too slow to receive every tick.
func TestDeltaEncoder_Replay(t *testing.T) {
	for _, tc := range []struct {
		numPlayers int
		size       model.Coordinate
		seed       int64
		// ticks to simulate, 3 per second. Most of the test's time is spent
		// copying the game per player (like the server does), so the 10
		// player game is shorter.
		ticks int
	}{
		{2, model.Coordinate{X: 8, Y: 8}, 1, 2 * 60 * 3},
		{4, model.Coordinate{X: 8, Y: 8}, 2, 2 * 60 * 3},
		{10, model.Coordinate{X: 10, Y: 10}, 3, 60 * 3},
	} {
		t.Run(fmt.Sprintf("%dplayers", tc.numPlayers), func(t *testing.T) {
			t.Parallel()
			rng := rand.New(rand.NewSource(tc.seed))
			game := newRandomGame(rng, tc.numPlayers, tc.size)
			type viewer struct {
				id       model.PlayerID
				every    int
				encoder  deltaEncoder
				replica  replica
				messages int
			}
			var viewers []*viewer
			for _, p := range game.Players() {
				viewers = append(viewers, &viewer{id: p.ID(), every: 1})
			}
			viewers = append(viewers, &viewer{id: game.Players()[0].ID(), every: 3})

			var fullBytes, deltaBytes, deltas, snapshots int
			simulate(rng, game, tc.ticks, func(tick int, state *model.Game) {
				for _, v := range viewers {
					if tick%v.every != 0 {
						continue
					}
					evt := (&model.EventTick{Game: state}).ToPlayerEvent(v.id).(*model.PlayerEventTick)
					view := evt.Game
					b, err := proto.Marshal(v.encoder.encodeTick(evt))
					if err != nil {
						t.Fatalf("Marshal: %v", err)
					}
					if err := v.replica.apply(b); err != nil {
						t.Fatalf("tick %d, player %s: apply: %v", tick, v.id, err)
					}
					v.messages++
					if d := diffStates(v.replica.state(), msg.EncodeGame(view, v.id)); d != "" {
						t.Fatalf("tick %d, player %s: replica differs from state: %s", tick, v.id, d)
					}
					if v.every == 1 {
						// What sending the full state every tick would cost.
						full, _ := proto.Marshal(&msg.EventEnvelope{Event: &msg.EventEnvelope_EventGameSnapshot{
							EventGameSnapshot: &msg.EventGameSnapshot{Seq: v.replica.seq, GameTime: v.replica.gameTime, Game: msg.EncodeGame(view, v.id)},
						}})
						fullBytes += len(full)
						if v.messages == 1 {
							snapshots++
						} else {
							deltaBytes += len(b)
							deltas++
						}
					}
				}
			})
			for _, v := range viewers {
				if v.replica.seq != uint32(v.messages) {
					t.Errorf("player %s: seq = %d, want %d", v.id, v.replica.seq, v.messages)
				}
			}
			if snapshots != tc.numPlayers {
				t.Errorf("%d snapshots, want one per player (%d)", snapshots, tc.numPlayers)
			}
			ticks := deltas + snapshots
			avgFull, avgDelta := fullBytes/ticks, deltaBytes/deltas
			t.Logf("avg full state %d B, avg delta %d B (%.1f%%)", avgFull, avgDelta, 100*float64(avgDelta)/float64(avgFull))
			if avgDelta*5 > avgFull {
				t.Errorf("avg delta %d B is more than 20%% of avg full state %d B", avgDelta, avgFull)
			}
		})
	}
}

func testGame() *model.Game {
	return model.CreateDummyGameSimple()
}

// tick returns a tick event of the game for its first player, without fog of
// war applied, to test the encoding of exactly the given state.
func tick(game *model.Game) *model.PlayerEventTick {
	return &model.PlayerEventTick{PlayerID: game.Players()[0].ID(), Game: game.Copy()}
}

func mustDelta(t *testing.T, env *msg.EventEnvelope) *msg.EventGameDelta {
	t.Helper()
	d := env.GetEventGameDelta()
	if d == nil {
		t.Fatalf("got %T, want a delta", env.Event)
	}
	return d
}

func TestDeltaEncoder_SnapshotThenDeltas(t *testing.T) {
	game := testGame()
	game.SetTime(1500 * time.Millisecond)
	var e deltaEncoder

	snap := e.encodeTick(tick(game)).GetEventGameSnapshot()
	if snap == nil {
		t.Fatal("first message is not a snapshot")
	}
	if snap.Seq != 1 || snap.GameTime != 1500 {
		t.Errorf("snapshot seq, game_time = %d, %d; want 1, 1500", snap.Seq, snap.GameTime)
	}
	if !proto.Equal(snap.Game, msg.EncodeGame(game, game.Players()[0].ID())) {
		t.Errorf("snapshot game = %v, want the full state", snap.Game)
	}

	game.SetTime(1800 * time.Millisecond)
	d := mustDelta(t, e.encodeTick(tick(game)))
	if d.Seq != 2 || d.GameTime != 1800 {
		t.Errorf("delta seq, game_time = %d, %d; want 2, 1800", d.Seq, d.GameTime)
	}
	if len(d.Players)+len(d.Islands)+len(d.AirplanesAdded)+len(d.AirplanesUpdated)+len(d.AirplanesRemoved) != 0 {
		t.Errorf("delta of unchanged game = %v, want empty", d)
	}
}

func TestDeltaEncoder_Islands(t *testing.T) {
	game := testGame()
	var e deltaEncoder
	e.encodeTick(tick(game))

	// An island taken over by the neutral player, with strength 0, which
	// proto3 leaves out of the encoding.
	island := game.Island("p1")
	island.SetOwner(game.PlayerNeutral().ID())
	island.SetStrength(0)
	d := mustDelta(t, e.encodeTick(tick(game)))
	want := []*msg.IslandUpdate{{Id: "p1", Army: &msg.Army{OwnerId: string(game.PlayerNeutral().ID()), Strength: 0}}}
	if len(d.Islands) != 1 || !proto.Equal(d.Islands[0], want[0]) {
		t.Errorf("delta islands = %v, want %v", d.Islands, want)
	}
}

func TestDeltaEncoder_IslandGarrison(t *testing.T) {
	game := testGame()
	game.Island("p1").SetGarrison(20)
	var e deltaEncoder
	snap := e.encodeTick(tick(game)).GetEventGameSnapshot()
	for _, island := range snap.Game.Islands {
		if want := map[string]int32{"p1": 20}[island.Id]; island.Garrison != want {
			t.Errorf("snapshot island %s garrison = %d, want %d", island.Id, island.Garrison, want)
		}
	}

	// An attack absorbed by the garrison changes only the garrison.
	game.Island("p1").SetGarrison(5)
	d := mustDelta(t, e.encodeTick(tick(game)))
	want := &msg.IslandUpdate{Id: "p1", Army: msg.EncodeArmy(&game.Island("p1").Army), Garrison: 5}
	if len(d.Islands) != 1 || !proto.Equal(d.Islands[0], want) {
		t.Errorf("delta islands = %v, want [%v]", d.Islands, want)
	}
}

func TestDeltaEncoder_PlayersAndLaunchSeq(t *testing.T) {
	game := testGame()
	p1, p2 := game.Players()[0], game.Players()[1]
	var e deltaEncoder
	e.encodeTick(tick(game))

	p1.SetLastLaunchSeq(4)
	p2.SetState(model.LeftGame)
	d := mustDelta(t, e.encodeTick(tick(game)))
	want := map[string]*msg.Player{
		string(p1.ID()): {Id: string(p1.ID()), State: msg.PlayerState_ALIVE, LastLaunchSeq: 4},
		string(p2.ID()): {Id: string(p2.ID()), State: msg.PlayerState_LEFT_GAME},
	}
	if len(d.Players) != len(want) {
		t.Fatalf("delta players = %v, want %v", d.Players, want)
	}
	for _, p := range d.Players {
		if !proto.Equal(p, want[p.Id]) {
			t.Errorf("delta player = %v, want %v", p, want[p.Id])
		}
	}
}

func TestDeltaEncoder_Airplanes(t *testing.T) {
	game := testGame()
	p1 := game.Players()[0]
	var e deltaEncoder
	e.encodeTick(tick(game))

	// Added.
	act := model.PlayerActionLaunch{From: "p1", To: "p2", Seq: 1}
	if _, err := act.ToAction(p1.ID()).Apply(game); err != nil {
		t.Fatalf("launch: %v", err)
	}
	airplane := game.Airplanes()[0]
	d := mustDelta(t, e.encodeTick(tick(game)))
	if len(d.AirplanesAdded) != 1 || !proto.Equal(d.AirplanesAdded[0], msg.EncodeGame(game, p1.ID()).Airplanes[0]) {
		t.Fatalf("delta airplanes_added = %v, want the new airplane in full", d.AirplanesAdded)
	}
	if a := d.AirplanesAdded[0]; a.DestinationId != "p2" || a.LaunchSeq != 1 {
		t.Errorf("added airplane destination_id, launch_seq = %q, %d; want p2, 1", a.DestinationId, a.LaunchSeq)
	}

	// Moved: not in the delta.
	pos := airplane.Position()
	pos.X += 0.5
	airplane.SetPosition(pos)
	d = mustDelta(t, e.encodeTick(tick(game)))
	if len(d.AirplanesAdded)+len(d.AirplanesUpdated)+len(d.AirplanesRemoved) != 0 {
		t.Errorf("delta after moving = %v, want no airplanes", d)
	}

	// Strength hidden by fog of war: updated.
	airplane.SetStrength(-1)
	d = mustDelta(t, e.encodeTick(tick(game)))
	wantUpdate := &msg.AirplaneUpdate{Id: string(airplane.ID()), Army: &msg.Army{OwnerId: string(p1.ID()), Strength: -1}}
	if len(d.AirplanesUpdated) != 1 || !proto.Equal(d.AirplanesUpdated[0], wantUpdate) {
		t.Errorf("delta airplanes_updated = %v, want %v", d.AirplanesUpdated, wantUpdate)
	}

	// Changed flight: removed and added again.
	airplane.SetDirection(airplane.Direction() + 1)
	d = mustDelta(t, e.encodeTick(tick(game)))
	if len(d.AirplanesRemoved) != 1 || len(d.AirplanesAdded) != 1 ||
		d.AirplanesRemoved[0] != string(airplane.ID()) || d.AirplanesAdded[0].Id != string(airplane.ID()) {
		t.Errorf("delta after changing direction = %v, want the airplane removed and added", d)
	}

	// Removed.
	game.RemoveAirplane(airplane)
	d = mustDelta(t, e.encodeTick(tick(game)))
	if len(d.AirplanesRemoved) != 1 || d.AirplanesRemoved[0] != string(airplane.ID()) {
		t.Errorf("delta airplanes_removed = %v, want [%s]", d.AirplanesRemoved, airplane.ID())
	}
}

func TestDeltaEncoder_SnapshotWhenDeltaCantDescribeChange(t *testing.T) {
	var e deltaEncoder
	e.encodeTick(tick(testGame()))
	// A different game, i.e. other ids for everything.
	env := e.encodeTick(tick(testGame()))
	snap := env.GetEventGameSnapshot()
	if snap == nil {
		t.Fatalf("got %T, want a snapshot", env.Event)
	}
	if snap.Seq != 2 {
		t.Errorf("snapshot seq = %d, want 2", snap.Seq)
	}
}

func TestCanDelta(t *testing.T) {
	game := testGame()
	base := msg.EncodeGame(game, game.Players()[0].ID())
	for name, modify := range map[string]func(g *msg.Game){
		"game id":        func(g *msg.Game) { g.Id = "other" },
		"size":           func(g *msg.Game) { g.Size.X++ },
		"neutral player": func(g *msg.Game) { g.PlayerNeutral.Id = "other" },
		"player added":   func(g *msg.Game) { g.Players = append(g.Players, &msg.Player{Id: "other"}) },
		"player id":      func(g *msg.Game) { g.Players[0].Id = "other" },
		"island removed": func(g *msg.Game) { g.Islands = g.Islands[1:] },
		"island id":      func(g *msg.Game) { g.Islands[0].Id = "other" },
		"island moved":   func(g *msg.Game) { g.Islands[0].Position.X++ },
		"island size":    func(g *msg.Game) { g.Islands[0].Size = 0.1 },
	} {
		cur := proto.Clone(base).(*msg.Game)
		modify(cur)
		if canDelta(base, cur) {
			t.Errorf("canDelta after changing %s = true, want false", name)
		}
	}
	cur := proto.Clone(base).(*msg.Game)
	cur.Islands[0].Army.Strength++
	cur.Players[0].State = msg.PlayerState_DEAD
	if !canDelta(base, cur) {
		t.Error("canDelta after changing army and player state = false, want true")
	}
}

func TestDeltaEncoder_LeavingPlayersAirplanesBecomeNeutral(t *testing.T) {
	game := testGame()
	p1 := game.Players()[0]
	act := model.PlayerActionLaunch{From: "p1", To: "p2", Seq: 1}
	if _, err := act.ToAction(p1.ID()).Apply(game); err != nil {
		t.Fatalf("launch: %v", err)
	}
	airplane := game.Airplanes()[0]
	var e deltaEncoder
	view := func() *model.PlayerEventTick {
		return (&model.EventTick{Game: game.Copy()}).ToPlayerEvent(p1.ID()).(*model.PlayerEventTick)
	}
	e.encodeTick(view())

	// Leaving gives the player's airplanes to the neutral player, which also
	// clears their launch_seq in the player's view.
	leave := &model.PlayerActionLeave{}
	if _, err := leave.ToAction(p1.ID()).Apply(game); err != nil {
		t.Fatalf("leave: %v", err)
	}
	d := mustDelta(t, e.encodeTick(view()))
	if len(d.AirplanesAdded)+len(d.AirplanesRemoved) != 0 {
		t.Errorf("delta re-adds the airplane: added %v, removed %v", d.AirplanesAdded, d.AirplanesRemoved)
	}
	wantOwner := string(game.PlayerNeutral().ID())
	if len(d.AirplanesUpdated) != 1 || d.AirplanesUpdated[0].Id != string(airplane.ID()) ||
		d.AirplanesUpdated[0].Army.OwnerId != wantOwner {
		t.Errorf("delta airplanes_updated = %v, want the airplane owned by %s", d.AirplanesUpdated, wantOwner)
	}
}

func TestEncodeGame_AirplaneFields(t *testing.T) {
	game := testGame()
	p1, p2 := game.Players()[0], game.Players()[1]
	for i, act := range []model.PlayerActionLaunch{{From: "p1", To: "pn", Seq: 1}, {From: "p2", To: "pn", Seq: 2}} {
		if _, err := act.ToAction(game.Players()[i].ID()).Apply(game); err != nil {
			t.Fatalf("launch: %v", err)
		}
	}
	evt := (&model.EventTick{Game: game.Copy()}).ToPlayerEvent(p1.ID()).(*model.PlayerEventTick)
	defaultSpeed := float32(model.AirplaneDefaultSpeed * float64(time.Millisecond))
	for _, a := range msg.EncodeGame(evt.Game, p1.ID()).Airplanes {
		if a.Speed != defaultSpeed {
			t.Errorf("airplane %s: speed = %v, want the default speed %v set", a.Id, a.Speed, defaultSpeed)
		}
		switch a.Army.OwnerId {
		case string(p1.ID()):
			if a.DestinationId != "pn" || a.LaunchSeq != 1 {
				t.Errorf("own airplane: destination_id, launch_seq = %q, %d; want pn, 1", a.DestinationId, a.LaunchSeq)
			}
		case string(p2.ID()):
			if a.DestinationId != "" || a.LaunchSeq != 0 {
				t.Errorf("other's airplane: destination_id, launch_seq = %q, %d; want unset", a.DestinationId, a.LaunchSeq)
			}
		}
	}
}
