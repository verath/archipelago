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

func TestNewTickAction_NegativeDelta(t *stdtesting.T) {
	_, err := NewTickAction(-1)
	if err == nil {
		t.Error("Expected an error, got nil")
	}
}

func TestTickAction_Apply_Islands(t *stdtesting.T) {
	game := testing.CreateSimpleGame()

	i1 := game.Board().Island(Coordinate{0, 0})
	i2 := game.Board().Island(Coordinate{9, 9})
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

	ni := game.Board().Island(Coordinate{4, 4})
	if ni.Strength() != 10 {
		t.Errorf("Expected island strength of neutral to remain 10, was %d", ni.Strength())
	}
}

func TestTickAction_Apply_Airplanes(t *stdtesting.T) {
	game := testing.CreateSimpleGame()

	// Add an airplane from 0,0 -> 0,9, moving at a speed of one coordinate/sec
	airplane, _ := NewAirplane(Coordinate{0, 0}, Coordinate{0, 9}, game.Player1(), 10)
	airplane.SetSpeed(1 / float64(time.Second))
	game.AddAirplane(airplane)

	// Tick for 1 second
	ta, _ := NewTickAction(1 * time.Second)
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}

	expectedPos := FloatCoordinate{X: 0, Y: 1}
	actualPos := *game.Airplanes()[0].Position()
	if actualPos != expectedPos {
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
	if _, ok := evt.(*event.TickEvent); !ok {
		t.Error("Expected a TickEvent to have been created")
	}
}

func TestTickAction_Apply_EmptyGame(t *stdtesting.T) {
	game := testing.CreateEmptyGame()

	ta, _ := NewTickAction(1 * time.Second)
	if _, err := ta.Apply(game); err != nil {
		t.Errorf("Expected no error, got: %v", err)
	}
}
