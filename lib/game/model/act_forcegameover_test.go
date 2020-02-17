package model

import (
	"testing"
)

func TestActionForceGameOver_Apply(t *testing.T) {
	game := CreateDummyGameSimple()
	act := &ActionForceGameOver{}
	evts, err := act.Apply(game)
	if err != nil {
		t.Fatalf("expected no error, got: %+v", err)
	}
	if len(evts) != 1 {
		t.Fatalf("expected exactly one event, got: %+v", evts)
	}
	evt := evts[0]
	evtGameOver, ok := evt.(*EventGameOver)
	if !ok {
		t.Fatalf("expected EventGameOver, got: %T", evt)
	}
	if evtGameOver.WinnerID != PlayerID(InvalidID) {
		t.Fatalf("expected WinnerID to be InvalidID, was: %v", evtGameOver.WinnerID)
	}
}
