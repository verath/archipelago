package action

import (
	"github.com/verath/archipelago/lib/event"
	. "github.com/verath/archipelago/lib/model"
	"github.com/verath/archipelago/lib/testing"
	stdtesting "testing"
	"time"
)

func TestNewTickAction(t *stdtesting.T) {
	ta, err := NewTickAction(1)
	if err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
	if ta == nil {
		t.Error("Expected a TickAction, got nil")
	}
}

func TestTickAction_Apply_Islands(t *stdtesting.T) {
	game := testing.CreateSimpleGame()

	i1 := game.Island("p1")
	i2 := game.Island("p2")
	in := game.Island("pn")
	i1.SetSize(1)
	i2.SetSize(2)

	// Tick for IslandGrowthInterval seconds
	ta, _ := NewTickAction(IslandGrowthInterval)
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

func TestTickAction_Apply_Airplanes(t *stdtesting.T) {
	game := testing.CreateSimpleGame()
	fromIsland := game.Island("p1")
	toIsland := game.Island("bottom-left")

	// Add an airplane from 0,0 -> 0,9, moving at a speed of one coordinate/sec
	airplane, _ := NewAirplane(fromIsland, toIsland, game.Player1(), 10)
	airplane.SetSpeed(1 / float64(time.Second))
	game.AddAirplane(airplane)

	// Tick for 1 second
	ta, _ := NewTickAction(1 * time.Second)
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}

	expectedPos := FloatCoordinate{X: 0, Y: 1}
	actualPos := game.Airplanes()[0].Position()
	if !testing.CoordsAlmostEqual(actualPos, expectedPos) {
		t.Errorf("Expected airplane pos to be %v was %v", expectedPos, actualPos)
	}
}

func TestTickAction_Apply_AddsTickEvent(t *stdtesting.T) {
	game := testing.CreateSimpleGame()

	ta, _ := NewTickAction(1 * time.Second)
	events, err := ta.Apply(game)
	if err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}

	if len(events) != 1 {
		t.Error("Expected exactly one event to have been created")
	}

	evt := events[0]
	if _, ok := evt.(*event.TickEventBuilder); !ok {
		t.Error("Expected a TickEventBuilder to have been created")
	}
}

func TestTickAction_Apply_EmptyGame(t *stdtesting.T) {
	game := testing.CreateEmptyGame()

	ta, _ := NewTickAction(1 * time.Second)
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
}
