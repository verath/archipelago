package event

import (
	"encoding/json"
	"github.com/verath/archipelago/lib/testing"
	stdtesting "testing"
)

func TestNewTickEvent(t *stdtesting.T) {
	game := testing.CreateEmptyGame()
	evt := NewTickEventBuilder(game)
	_, err := json.Marshal(evt)
	if err != nil {
		t.Errorf("Expected no error when encoding as json, got: %v", err)
	}
}
