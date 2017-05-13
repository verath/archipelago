package model

import (
	"testing"
)

func newLaunchAction(from, to IslandID, ownerID PlayerID) *launchAction {
	return &launchAction{
		From:    from,
		To:      to,
		ownerID: ownerID,
	}
}

func TestLaunchAction_Apply(t *testing.T) {
	game := CreateDummyGameSimple()
	fromIsland := game.Island("p1")
	toIsland := game.Island("p2")

	t.Log("Launching airplane from our island to enemy island...")

	la := newLaunchAction(fromIsland.ID(), toIsland.ID(), game.Player1().ID())
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

func TestLaunchAction_Apply_DifferentOwner(t *testing.T) {
	game := CreateDummyGameSimple()
	fromIsland := game.Island("p1")
	toIsland := game.Island("p2")

	t.Log("Launching airplane from enemy controlled island...")
	la := newLaunchAction(fromIsland.ID(), toIsland.ID(), game.Player2().ID())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}

	t.Log("Launching airplane from neutral controlled island...")
	la = newLaunchAction(fromIsland.ID(), toIsland.ID(), game.Player2().ID())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}
}

func TestLaunchAction_Apply_NonExistingIslands(t *testing.T) {
	game := CreateDummyGameSimple()
	fromIsland := game.Island("p1")
	toIsland := game.Island("p2")

	t.Log("Launching airplane from non-existing island...")
	la := newLaunchAction("-", toIsland.ID(), game.Player1().ID())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}

	t.Log("Launching airplane to non-existing island...")
	la = newLaunchAction(fromIsland.ID(), "-", game.Player1().ID())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}
}

func TestLaunchAction_Apply_NoIslandArmy(t *testing.T) {
	game := CreateDummyGameSimple()
	fromIsland := game.Island("p1")
	toIsland := game.Island("p2")

	t.Log("Launching airplane from island with strength < 2...")
	fromIsland.SetStrength(1)
	la := newLaunchAction(fromIsland.ID(), toIsland.ID(), game.Player1().ID())
	if _, err := la.Apply(game); err == nil {
		t.Error("Expected an error, got nil")
	}
}
