package model

import (
	"testing"
	"time"
)

// arrive lands an airplane of the given owner and strength on the island
// with one tick.
func arrive(t *testing.T, game *Game, island *Island, owner PlayerID, strength int64) *Airplane {
	t.Helper()
	airplane := NewAirplane(island.Position(), island, owner, strength)
	game.AddAirplane(airplane)
	if _, err := (&ActionTick{Delta: time.Millisecond}).Apply(game); err != nil {
		t.Fatalf("unexpected tick error: %v", err)
	}
	if len(game.Airplanes()) != 0 {
		t.Fatal("expected the airplane to have arrived")
	}
	return airplane
}

func TestTickAction_Apply_Garrison_AbsorbsAttack(t *testing.T) {
	game := CreateDummyGameSimple()
	p1, p2 := game.Players()[0], game.Players()[1]
	island := game.Island("p2")
	island.SetGarrison(15)

	arrive(t, game, island, p1.ID(), 12)

	if island.Garrison() != 3 {
		t.Errorf("expected garrison 3, was %d", island.Garrison())
	}
	if island.Strength() != 10 || !island.IsOwnedBy(p2.ID()) {
		t.Errorf("expected army untouched (10, p2), was (%d, %s)", island.Strength(), island.Owner())
	}
}

func TestTickAction_Apply_Garrison_AbsorbsPartOfAttack(t *testing.T) {
	game := CreateDummyGameSimple()
	p1 := game.Players()[0]
	island := game.Island("p2")
	island.SetGarrison(5)

	// 5 absorbed by the garrison, 10 vs the army of 10 makes it neutral.
	arrive(t, game, island, p1.ID(), 15)
	if !island.IsOwnedBy(game.PlayerNeutral().ID()) || island.Strength() != 0 || island.Garrison() != 0 {
		t.Errorf("expected neutral island with no army or garrison, was (%s, %d, %d)",
			island.Owner(), island.Strength(), island.Garrison())
	}
}

func TestTickAction_Apply_Garrison_NotAgainstOwner(t *testing.T) {
	game := CreateDummyGameSimple()
	p2 := game.Players()[1]
	island := game.Island("p2")
	island.SetGarrison(5)

	arrive(t, game, island, p2.ID(), 4)
	if island.Strength() != 14 || island.Garrison() != 5 {
		t.Errorf("expected reinforced army 14 and garrison 5, was (%d, %d)", island.Strength(), island.Garrison())
	}
}

func TestTickAction_Apply_Garrison_DoesNotGrow(t *testing.T) {
	game := CreateDummyGameSimple()
	island := game.Island("p1")
	island.SetGarrison(5)
	if _, err := (&ActionTick{Delta: 10 * IslandGrowthInterval}).Apply(game); err != nil {
		t.Fatalf("unexpected tick error: %v", err)
	}
	if island.Garrison() != 5 {
		t.Errorf("expected garrison to stay 5, was %d", island.Garrison())
	}
}

func TestTickAction_Apply_Capture_TakesAirplaneGarrison(t *testing.T) {
	game := CreateDummyGameSimple()
	p1 := game.Players()[0]
	island := game.Island("pn")

	airplane := NewAirplane(island.Position(), island, p1.ID(), 25)
	airplane.SetGarrison(20)
	game.AddAirplane(airplane)
	if _, err := (&ActionTick{Delta: time.Millisecond}).Apply(game); err != nil {
		t.Fatalf("unexpected tick error: %v", err)
	}
	if !island.IsOwnedBy(p1.ID()) || island.Strength() != 15 || island.Garrison() != 20 {
		t.Errorf("expected (p1, 15, garrison 20), was (%s, %d, %d)", island.Owner(), island.Strength(), island.Garrison())
	}
}

func TestTickAction_Apply_Player_Revive_Garrison(t *testing.T) {
	game := CreateDummyGameSimple()
	game.rules = Rules{ReviveGarrison: 20}
	p1 := game.Players()[0]
	game.Island("p1").SetOwner(game.PlayerNeutral().ID())

	// Alive -> PendingRevival -> Alive, with a revival airplane.
	for i := 0; i < 2; i++ {
		if _, err := (&ActionTick{Delta: 0}).Apply(game); err != nil {
			t.Fatalf("unexpected tick error: %v", err)
		}
	}
	if len(game.Airplanes()) != 1 || game.Airplanes()[0].Garrison() != 20 {
		t.Fatal("expected a revival airplane carrying a garrison of 20")
	}
	if p1.State() != Alive {
		t.Fatal("expected p1 to be revived")
	}
}
