package model

import (
	"testing"
	"time"
)

func TestTickAction_Apply_Islands(t *testing.T) {
	game := CreateDummyGameSimple()

	i1 := game.Island("p1")
	i2 := game.Island("p2")
	in := game.Island("pn")
	i1.size = 1
	i2.size = 2

	// Tick for IslandGrowthInterval seconds
	ta := ActionTick{IslandGrowthInterval}
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
	if i1.Strength() != 11 {
		t.Errorf("Expected island strength of player island size 1.0 to be 11, was %d", i1.Strength())
	}

	if i2.Strength() != 12 {
		t.Errorf("Expected island strength of player island size 2.0 to be 12, was %d", i2.Strength())
	}

	if in.Strength() != 10 {
		t.Errorf("Expected island strength of neutral to remain 10, was %d", in.Strength())
	}
}

func TestTickAction_Apply_Airplanes(t *testing.T) {
	game := CreateDummyGameSimple()
	p1, _ := game.Players()[0], game.Players()[1]
	fromIsland := game.Island("p1")
	toIsland := game.Island("bottom-left")

	// Add an airplane from 0,0 -> 0,8, moving at a speed of one coordinate/sec
	airplane := NewAirplane(fromIsland.Position(), toIsland, p1.ID(), 10)
	airplane.SetSpeed(1 / float64(time.Second))
	game.AddAirplane(airplane)

	// Tick for 1 second
	ta := ActionTick{1 * time.Second}
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}

	expectedPos := Coordinate{X: 0, Y: 1}
	actualPos := game.Airplanes()[0].Position().ToCoordinate()
	if actualPos != expectedPos {
		t.Errorf("Expected airplane pos to be %v was %v", expectedPos, actualPos)
	}
}

func TestTickAction_Apply_Airplane_Arrival(t *testing.T) {
	game := CreateDummyGameSimple()
	p1, _ := game.Players()[0], game.Players()[1]
	fromIsland := game.Island("p1")
	toIsland := game.Island("bottom-left")

	// Add an airplane from 0,0 -> 0,8, moving at a speed of one coordinate/sec
	airplane := NewAirplane(fromIsland.Position(), toIsland, p1.ID(), 10)
	airplane.SetSpeed(1 / float64(time.Second))
	game.AddAirplane(airplane)

	// Tick for 1 second
	ta := ActionTick{1 * time.Second}
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
	// Expect airplane not to have reached the island
	if len(game.Airplanes()) != 1 {
		t.Error("Expected airplane not to have reached destination")
	}

	// Tick for another 7 second (8 sec total)
	ta = ActionTick{7 * time.Second}
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
	// Expect airplane to have reached the island
	if len(game.Airplanes()) != 0 {
		t.Error("Expected airplane to have reached destination")
	}
}

func TestTickAction_Apply_AddsTickEvent(t *testing.T) {
	game := CreateDummyGameSimple()
	ta := ActionTick{1 * time.Second}
	evts, err := ta.Apply(game)
	if err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
	if len(evts) != 1 {
		t.Error("Expected exactly one event to have been created")
	}
	evt := evts[0]
	if _, ok := evt.(*EventTick); !ok {
		t.Errorf("Expected a EventTick to have been created, got: %T", evt)
	}
}

func TestTickAction_Apply_EmptyGame(t *testing.T) {
	game := CreateDummyGameEmpty()

	ta := ActionTick{1 * time.Second}
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
}

func TestTickAction_Apply_FogOfWar(t *testing.T) {
	// GIVEN
	game := CreateDummyGameSimple()
	i1 := game.Island("p1")
	i2 := game.Island("p2")
	p1 := game.Players()[0]
	// WHEN
	ta := ActionTick{1 * time.Second}
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
	// THEN i1 (owned by p1) is not in FoW, but i2 (not owned by p1) is in FoW.
	if p1.IsInFogOfWar(i1.Position()) {
		t.Error("i1 was in FoW")
	}
	if !p1.IsInFogOfWar(i2.Position()) {
		t.Error("i2 was not in FoW")
	}
}

func TestTickAction_Apply_FogOfWar_PerPlayer(t *testing.T) {
	// GIVEN a game where p1 and p2 each own an island in opposite corners,
	// out of sight of each other.
	game := CreateDummyGameSimple()
	i1 := game.Island("p1")
	i2 := game.Island("p2")
	p1, p2 := game.Players()[0], game.Players()[1]
	// WHEN
	ta := ActionTick{1 * time.Second}
	evts, err := ta.Apply(game)
	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}
	// THEN each player sees its own island but not the other's.
	if p1.IsInFogOfWar(i1.Position()) || !p1.IsInFogOfWar(i2.Position()) {
		t.Error("p1 should see i1 but not i2")
	}
	if p2.IsInFogOfWar(i2.Position()) || !p2.IsInFogOfWar(i1.Position()) {
		t.Error("p2 should see i2 but not i1")
	}
	// AND the tick event is filtered differently for each player: the
	// strength of an island in a player's fog of war is hidden (-1).
	tickEvt := evts[0]
	for _, tc := range []struct {
		player         *Player
		visible, foggy IslandID
	}{
		{p1, i1.ID(), i2.ID()},
		{p2, i2.ID(), i1.ID()},
	} {
		playerGame := tickEvt.ToPlayerEvent(tc.player.ID()).(*PlayerEventTick).Game
		if s := playerGame.Island(tc.visible).Strength(); s < 0 {
			t.Errorf("player %v: island %v should be visible, got strength %d", tc.player.ID(), tc.visible, s)
		}
		if s := playerGame.Island(tc.foggy).Strength(); s != -1 {
			t.Errorf("player %v: island %v should be hidden, got strength %d", tc.player.ID(), tc.foggy, s)
		}
	}
	// AND filtering for one player does not affect the other players or the
	// game itself.
	if p1.FogOfWar() == nil || p2.FogOfWar() == nil {
		t.Error("filtering a player event cleared a player's fog of war in the game")
	}
	if i1.Strength() < 0 || i2.Strength() < 0 {
		t.Error("filtering a player event hid an island's strength in the game")
	}
}

func TestTickAction_Apply_Player_Revive(t *testing.T) {
	// GIVEN a game where p1 has no islands but there are islands controlled by
	// the neutral player.
	game := CreateDummyGameSimple()
	p1, p2 := game.Players()[0], game.Players()[1]
	game.Island("p1").SetOwner(p2.ID())

	// WHEN applied twice (Alive-[1]->PendingRevival-[2]->Alive)
	ta := ActionTick{1 * time.Second}
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
	// THEN p1 state is Alive and p1 has control of an airplane.
	if p1.State() != Alive {
		t.Fatalf("Expected state to be Alive, was %d", p1.State())
	}
	p1HasAirplane := false
	for _, airplane := range game.Airplanes() {
		if airplane.IsOwnedBy(p1.ID()) {
			p1HasAirplane = true
			break
		}
	}
	if !p1HasAirplane {
		t.Fatal("p1 revived without an airplane.")
	}
}

func TestTickAction_Apply_Player_Revive_Unique_Island(t *testing.T) {
	// GIVEN a game where both p1 and p2 has no islands, but there are islands
	// controlled by the neutral player.
	game := CreateDummyGameSimple()
	p1, p2 := game.Players()[0], game.Players()[1]
	pn := game.PlayerNeutral()
	game.Island("p1").SetOwner(pn.ID())
	game.Island("p2").SetOwner(pn.ID())

	// WHEN applied twice (Alive-[1]->PendingRevival-[2]->Alive)
	ta := ActionTick{1 * time.Second}
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
	// THEN both p1 and p2 has control of a new airplane, and both airplanes
	// targets a different island.
	var p1AirplaneTarget *Island
	var p2AirplaneTarget *Island
	for _, airplane := range game.Airplanes() {
		if airplane.IsOwnedBy(p1.ID()) {
			p1AirplaneTarget = game.Island(airplane.Destination())
		} else if airplane.IsOwnedBy(p2.ID()) {
			p2AirplaneTarget = game.Island(airplane.Destination())
		}
	}
	if p1AirplaneTarget.ID() == p2AirplaneTarget.ID() {
		t.Fatal("p1 airplane targets same island as p2 airplane")
	}
}

func TestTickAction_Apply_Player_Die(t *testing.T) {
	// GIVEN a game where all islands are controlled by p2.
	game := CreateDummyGameSimple()
	p1, p2 := game.Players()[0], game.Players()[1]
	for _, island := range game.Islands() {
		island.SetOwner(p2.ID())
	}
	// WHEN tick applied twice (Alive-[1]->PendingRevival-[2]->Dead).
	ta := ActionTick{1 * time.Second}
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
	// THEN p1 state is Dead.
	if p1.State() != Dead {
		t.Fatalf("Expected state to be Dead, was %d", p1.State())
	}
}

// createBenchGame creates an 8x8 game, the size games are created with, with
// four players that each own an island and have an airplane in flight.
func createBenchGame() *Game {
	pn := NewPlayer()
	b := NewGameBuilder(Coordinate{X: 8, Y: 8}, pn)
	neutral := NewIsland(Coordinate{X: 4, Y: 4}, IslandSizeLarge, 10, pn.ID())
	b.AddIsland(neutral)
	corners := []Coordinate{{X: 0, Y: 0}, {X: 7, Y: 0}, {X: 0, Y: 7}, {X: 7, Y: 7}}
	var airplanes []*Airplane
	for _, c := range corners {
		p := NewPlayer()
		island := NewIsland(c, IslandSizeMedium, 10, p.ID())
		b.AddPlayer(p).AddIsland(island)
		airplanes = append(airplanes, NewAirplane(c, neutral, p.ID(), 1))
	}
	g := b.BuildOrPanic()
	for _, a := range airplanes {
		g.AddAirplane(a)
	}
	return g
}

// BenchmarkTick measures a game tick, including filtering the tick event for
// each player.
func BenchmarkTick(b *testing.B) {
	g := createBenchGame()
	// A zero delta keeps the game state, and so the work per tick, the same
	// across iterations.
	ta := &ActionTick{Delta: 0}
	b.ReportAllocs()
	for b.Loop() {
		evts, err := ta.Apply(g)
		if err != nil {
			b.Fatal(err)
		}
		for _, p := range g.Players() {
			evts[0].ToPlayerEvent(p.ID())
		}
	}
}
