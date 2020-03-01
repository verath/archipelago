package model

import (
	"testing"
)

func TestActionLeave_Apply(t *testing.T) {
	game := CreateDummyGameSimple()
	p1, p2 := game.Players()[0], game.Players()[1]
	p1Island := game.Island("p1")
	p2Island := game.Island("p2")
	pnIsland := game.Island("pn")
	p1Airplane := NewAirplane(p1Island, p2Island, p1, 1)
	p2Airplane := NewAirplane(p2Island, p1Island, p2, 1)
	game.AddAirplane(p1Airplane)
	game.AddAirplane(p2Airplane)
	leaveAct := actionLeave{
		PlayerActionLeave: PlayerActionLeave{},
		playerID:          p1.ID(),
	}
	if _, err := leaveAct.Apply(game); err != nil {
		t.Fatalf("Unexpected error when applying action: %+v", err)
	}
	if !p1Airplane.IsOwnedBy(game.PlayerNeutral()) {
		t.Error("Expected p1Airplane to be owned by neutral player")
	}
	if !p2Airplane.IsOwnedBy(p2) {
		t.Error("Did not expect p2Airplane to change owner")
	}
	if !p1Island.IsOwnedBy(game.PlayerNeutral()) {
		t.Error("Expected p1Island to be owned by neutral player")
	}
	if !p2Island.IsOwnedBy(p2) {
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
	if err == nil {
		t.Errorf("Expected an error")
	} else {
		if _, ok := err.(*IllegalActionError); ok {
			t.Errorf("Did not expect an IllegalActionError")
		}
	}
}
