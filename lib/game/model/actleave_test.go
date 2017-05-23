package model

import (
	"testing"
)

func TestActionLeave_Apply(t *testing.T) {
	game := CreateDummyGameSimple()
	p1Island := game.Island("p1")
	p2Island := game.Island("p2")
	pnIsland := game.Island("pn")
	p1Airplane := NewAirplane(p1Island, p2Island, game.Player1(), 1)
	p2Airplane := NewAirplane(p2Island, p1Island, game.Player2(), 1)
	game.AddAirplane(p1Airplane)
	game.AddAirplane(p2Airplane)
	leaveAct := actionLeave{
		PlayerActionLeave: PlayerActionLeave{},
		playerID:          game.Player1().ID(),
	}
	if _, err := leaveAct.Apply(game); err != nil {
		t.Fatalf("Unexpected error when applying action: %+v", err)
	}
	if !p1Airplane.IsOwnedBy(game.PlayerNeutral()) {
		t.Error("Expected p1Airplane to be owned by neutral player")
	}
	if !p2Airplane.IsOwnedBy(game.Player2()) {
		t.Error("Did not expect p2Airplane to change owner")
	}
	if !p1Island.IsOwnedBy(game.PlayerNeutral()) {
		t.Error("Expected p1Island to be owned by neutral player")
	}
	if !p2Island.IsOwnedBy(game.Player2()) {
		t.Error("Did not expect p2Island to change owner")
	}
	if !pnIsland.IsOwnedBy(game.PlayerNeutral()) {
		t.Error("Did not expect pnIsland to change owner")
	}
}

func TestActionLeave_Apply_InvalidPlayerId(t *testing.T) {
	// Leave action with invalid playerID should return a fatal error
	game := CreateDummyGameEmpty()
	leaveAct := actionLeave{
		PlayerActionLeave: PlayerActionLeave{},
		playerID:          "INVALID",
	}
	_, err := leaveAct.Apply(game)
	if actErr, ok := err.(ActionError); ok {
		if !actErr.IsFatal() {
			t.Errorf("Expected a fatal ActionError, got: %+v", actErr)
		}
	} else {
		t.Errorf("Expected an error")
	}
}
