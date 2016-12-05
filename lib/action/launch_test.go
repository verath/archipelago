package action

import (
	. "github.com/verath/archipelago/lib/model"
	"github.com/verath/archipelago/lib/testing"
	stdtesting "testing"
)

func TestNewLaunchAction(t *stdtesting.T) {
	player, _ := NewPlayer("")
	la, err := NewLaunchAction(Coordinate{}, Coordinate{1, 1}, player)
	if err != nil {
		t.Errorf("Expected no error got: %v", err)
	}
	if la == nil {
		t.Error("Expected a launch action got: nil")
	}
}

func TestNewLaunchAction_SameFromToCoords(t *stdtesting.T) {
	player, _ := NewPlayer("")
	_, err := NewLaunchAction(Coordinate{1, 1}, Coordinate{1, 1}, player)
	if err == nil {
		t.Error("Expected an error got: nil")
	}
}

func TestLaunchAction_Apply(t *stdtesting.T) {
	game := testing.CreateSimpleGame()

	t.Log("Launching airplane from our island to enemy island...")

	la, _ := NewLaunchAction(Coordinate{0, 0}, Coordinate{9, 9}, game.Player1())
	if _, err := la.Apply(game); err != nil {
		t.Errorf("Expected no error got: %v", err)
	}

	if numPlanes := len(game.Airplanes()); numPlanes != 1 {
		t.Errorf("Expected num airplanes == 1, was: %v", numPlanes)
	}

	fromIsland := game.Island(Coordinate{0, 0})
	if fromIsland.Strength() != 5 {
		t.Errorf("Expected from island to have a strength of 5, was: %d",
			fromIsland.Strength())
	}

	airplane := game.Airplanes()[0]
	if airplane.Strength() != 5 {
		t.Errorf("Expected airplane to have a strength of 5, was: %d",
			airplane.Strength())
	}
}

func TestLaunchAction_Apply_DifferentOwner(t *stdtesting.T) {
	game := testing.CreateSimpleGame()

	t.Log("Launching airplane from enemy controlled island...")
	la, _ := NewLaunchAction(Coordinate{0, 0}, Coordinate{9, 9}, game.Player2())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}

	t.Log("Launching airplane from neutral controlled island...")
	la, _ = NewLaunchAction(Coordinate{4, 4}, Coordinate{9, 9}, game.Player2())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}
}

func TestLaunchAction_Apply_NonExistingIslands(t *stdtesting.T) {
	game := testing.CreateSimpleGame()

	t.Log("Launching airplane from non-existing island...")
	la, _ := NewLaunchAction(Coordinate{1, 1}, Coordinate{9, 9}, game.Player1())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}

	t.Log("Launching airplane to non-existing island...")
	la, _ = NewLaunchAction(Coordinate{0, 0}, Coordinate{1, 1}, game.Player1())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}
}

func TestLaunchAction_Apply_NoIslandArmy(t *stdtesting.T) {
	game := testing.CreateSimpleGame()

	t.Log("Launching airplane from island with strength < 2...")
	game.Island(Coordinate{0, 0}).SetStrength(1)
	la, _ := NewLaunchAction(Coordinate{0, 0}, Coordinate{9, 9}, game.Player1())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}
}
