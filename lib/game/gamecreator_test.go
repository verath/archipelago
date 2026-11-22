package game

import (
	"testing"

	"github.com/verath/archipelago/lib/game/model"
)

func TestCreateBasicGame_StartingIslandsHaveAGarrison(t *testing.T) {
	game, err := createBasicGame(4)
	if err != nil {
		t.Fatal(err)
	}
	if game.Rules() != model.DefaultRules {
		t.Errorf("expected the default rules, got %+v", game.Rules())
	}
	starts := 0
	for _, island := range game.Islands() {
		if island.IsOwnedBy(game.PlayerNeutral().ID()) {
			if island.Garrison() != 0 {
				t.Errorf("neutral island %s has garrison %d, want 0", island.ID(), island.Garrison())
			}
			continue
		}
		starts++
		if island.Garrison() != model.DefaultRules.StartGarrison {
			t.Errorf("starting island %s has garrison %d, want %d", island.ID(), island.Garrison(), model.DefaultRules.StartGarrison)
		}
	}
	if starts != 4 {
		t.Errorf("expected 4 starting islands, got %d", starts)
	}
}
