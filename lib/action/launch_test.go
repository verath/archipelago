package action

import (
	"github.com/verath/archipelago/lib/testing"
	stdtesting "testing"
)

func TestNewLaunchAction(t *stdtesting.T) {
	game := testing.CreateSimpleGame()
	fromIsland := game.Island("p1")
	toIsland := game.Island("p2")

	la, err := newLaunchAction(fromIsland.ID(), toIsland.ID(), game.Player1().ID())
	if err != nil {
		t.Errorf("Expected no error got: %v", err)
	}
	if la == nil {
		t.Error("Expected a launch action got: nil")
	}
}

func TestLaunchAction_Apply(t *stdtesting.T) {
	game := testing.CreateSimpleGame()
	fromIsland := game.Island("p1")
	toIsland := game.Island("p2")

	t.Log("Launching airplane from our island to enemy island...")

	la, _ := newLaunchAction(fromIsland.ID(), toIsland.ID(), game.Player1().ID())
	if _, err := la.Apply(game); err != nil {
		t.Errorf("Expected no error got: %v", err)
	}

	if numPlanes := len(game.Airplanes()); numPlanes != 1 {
		t.Errorf("Expected num airplanes == 1, was: %v", numPlanes)
	}

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
	fromIsland := game.Island("p1")
	toIsland := game.Island("p2")

	t.Log("Launching airplane from enemy controlled island...")
	la, _ := newLaunchAction(fromIsland.ID(), toIsland.ID(), game.Player2().ID())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}

	t.Log("Launching airplane from neutral controlled island...")
	la, _ = newLaunchAction(fromIsland.ID(), toIsland.ID(), game.Player2().ID())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}
}

func TestLaunchAction_Apply_NonExistingIslands(t *stdtesting.T) {
	game := testing.CreateSimpleGame()
	fromIsland := game.Island("p1")
	toIsland := game.Island("p2")

	t.Log("Launching airplane from non-existing island...")
	la, _ := newLaunchAction("-", toIsland.ID(), game.Player1().ID())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}

	t.Log("Launching airplane to non-existing island...")
	la, _ = newLaunchAction(fromIsland.ID(), "-", game.Player1().ID())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}
}

func TestLaunchAction_Apply_NoIslandArmy(t *stdtesting.T) {
	game := testing.CreateSimpleGame()
	fromIsland := game.Island("p1")
	toIsland := game.Island("p2")

	t.Log("Launching airplane from island with strength < 2...")
	fromIsland.SetStrength(1)
	la, _ := newLaunchAction(fromIsland.ID(), toIsland.ID(), game.Player1().ID())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}
}
