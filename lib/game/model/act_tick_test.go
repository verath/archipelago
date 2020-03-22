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
	airplane := NewAirplane(fromIsland.Position(), toIsland, p1, 10)
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
	airplane := NewAirplane(fromIsland.Position(), toIsland, p1, 10)
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

func TestTickAction_Apply_Player_Revive(t *testing.T) {
	// GIVEN a game where p1 has no islands but there are islands controlled by
	// the neutral player.
	game := CreateDummyGameSimple()
	p1, p2 := game.Players()[0], game.Players()[1]
	game.Island("p1").SetOwner(p2)

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
		if airplane.Owner().Equals(p1) {
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
	game.Island("p1").SetOwner(pn)
	game.Island("p2").SetOwner(pn)

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
		if airplane.Owner().Equals(p1) {
			p1AirplaneTarget = game.Island(airplane.Destination())
		} else if airplane.Owner().Equals(p2) {
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
		island.SetOwner(p2)
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
