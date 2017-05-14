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
	i1.SetSize(1)
	i2.SetSize(2)

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
	fromIsland := game.Island("p1")
	toIsland := game.Island("bottom-left")

	// Add an airplane from 0,0 -> 0,8, moving at a speed of one coordinate/sec
	airplane := NewAirplane(fromIsland, toIsland, game.Player1(), 10)
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
	fromIsland := game.Island("p1")
	toIsland := game.Island("bottom-left")

	// Add an airplane from 0,0 -> 0,8, moving at a speed of one coordinate/sec
	airplane := NewAirplane(fromIsland, toIsland, game.Player1(), 10)
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
	if _, ok := evt.(*eventTick); !ok {
		t.Errorf("Expected a eventTick to have been created, got: %T", evt)
	}
}

func TestTickAction_Apply_EmptyGame(t *testing.T) {
	game := CreateDummyGameEmpty()

	ta := ActionTick{1 * time.Second}
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
}
