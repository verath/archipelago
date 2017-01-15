package events

import (
	"encoding/json"
	"github.com/verath/archipelago/lib/testing"
	stdtesting "testing"
)

func TestNewTickEvent(t *stdtesting.T) {
	game := testing.CreateEmptyGame()
	evt, err := NewTickEvent(game)
	if err != nil {
		t.Fatalf("Expected no error when creating tick event, got: %v", err)
	}

	playerEvt := evt.ToPlayerEvent("")
	if playerEvt.Type() != EventTypeTick {
		t.Errorf("Expected type to be %s, was: %s", EventTypeTick, playerEvt.Type())
	}
	_, err = json.Marshal(playerEvt.Data())
	if err != nil {
		t.Fatalf("Expected no error when encoding data as json, got: %v", err)
	}
}
