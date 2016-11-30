package event

import (
	stdtesting "testing"
	"github.com/verath/archipelago/lib/testing"
	"encoding/json"
)

func TestNewTickEvent(t *stdtesting.T) {
	game := testing.CreateEmptyGame()
	var evt Event = NewTickEvent(*game)
	_, err := json.Marshal(evt)
	if err != nil {
		t.Errorf("Expected no error when encoding as json, got: %v", err)
	}
	if evt.Name() != EventNameTick {
		t.Errorf("Expected name to be: %s. Actual: %s", EventNameTick, evt.Name())
	}
}
