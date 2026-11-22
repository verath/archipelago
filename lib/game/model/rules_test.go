package model

import (
	"testing"
	"time"
)

func TestRules_GrowthFactor(t *testing.T) {
	rules := Rules{Upkeep: []UpkeepTier{{Army: 100, Growth: 0.7}, {Army: 200, Growth: 0.4}}}
	tests := []struct {
		army int64
		want float64
	}{
		{0, 1}, {99, 1}, {100, 0.7}, {199, 0.7}, {200, 0.4}, {1000, 0.4},
	}
	for _, test := range tests {
		if got := rules.GrowthFactor(test.army); got != test.want {
			t.Errorf("GrowthFactor(%d) = %v, want %v", test.army, got, test.want)
		}
	}
	if got := (Rules{}).GrowthFactor(1000); got != 1 {
		t.Errorf("GrowthFactor without upkeep = %v, want 1", got)
	}
}

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

func TestTickAction_Apply_Upkeep(t *testing.T) {
	game := CreateDummyGameSimple()
	game.rules = Rules{Upkeep: []UpkeepTier{{Army: 50, Growth: 0.5}}}
	i1 := game.Island("p1")
	i2 := game.Island("p2")
	i1.size = 1
	i2.size = 1
	i2.SetStrength(60)

	// p1 (army 10) grows normally, p2 (army 60) at half the rate.
	if _, err := (&ActionTick{Delta: 4 * IslandGrowthInterval}).Apply(game); err != nil {
		t.Fatalf("unexpected tick error: %v", err)
	}
	if i1.Strength() != 14 {
		t.Errorf("expected p1 island to grow to 14, was %d", i1.Strength())
	}
	if i2.Strength() != 62 {
		t.Errorf("expected p2 island to grow to 62, was %d", i2.Strength())
	}
}

func TestTickAction_Apply_UN(t *testing.T) {
	game := CreateDummyGameSimple()
	game.rules = Rules{UN: &UNRule{Army: 50, Interval: 10 * time.Second, Share: 0.5}}
	p1 := game.Players()[0]
	game.Island("p1").SetStrength(30)
	big := game.Island("p2")
	big.SetStrength(80)

	tick := func(d time.Duration) {
		t.Helper()
		if _, err := (&ActionTick{Delta: d}).Apply(game); err != nil {
			t.Fatalf("unexpected tick error: %v", err)
		}
	}
	tick(9 * time.Second)
	if len(game.Airplanes()) != 0 {
		t.Fatal("expected no UN airplane before the interval passed")
	}
	if p1.UNTimer() != 0 {
		t.Errorf("expected no UN timer for p1 below the limit, was %v", p1.UNTimer())
	}
	tick(time.Second)
	if len(game.Airplanes()) != 1 {
		t.Fatalf("expected one UN airplane, got %d", len(game.Airplanes()))
	}
	airplane := game.Airplanes()[0]
	if !airplane.IsOwnedBy(game.PlayerNeutral().ID()) || airplane.Destination() != big.ID() {
		t.Errorf("expected a neutral airplane to p2's island, got owner %s to %s", airplane.Owner(), airplane.Destination())
	}
	// p2's island is at its growth cap of 80, so half of the 30 above the
	// limit.
	if airplane.Strength() != 15 {
		t.Errorf("expected UN airplane strength 15, was %d", airplane.Strength())
	}
	if game.UNCount() != 1 {
		t.Errorf("expected UNCount 1, was %d", game.UNCount())
	}
}

func TestTickAction_Apply_UN_MakesIslandNeutral(t *testing.T) {
	game := CreateDummyGameSimple()
	island := game.Island("p2")
	arrive(t, game, island, game.PlayerNeutral().ID(), 15)
	if !island.IsOwnedBy(game.PlayerNeutral().ID()) || island.Strength() != 5 {
		t.Errorf("expected island to be neutral with 5, was (%s, %d)", island.Owner(), island.Strength())
	}
}

func TestEventTick_ToPlayerEvent_HidesOtherPlayersDestinations(t *testing.T) {
	game := CreateDummyGameSimple()
	p1, p2 := game.Players()[0], game.Players()[1]
	own := NewAirplane(Coordinate{X: 0, Y: 0}, game.Island("pn"), p1.ID(), 5)
	other := NewAirplane(Coordinate{X: 8, Y: 8}, game.Island("p1"), p2.ID(), 5)
	other.SetGarrison(20)
	game.AddAirplane(own)
	game.AddAirplane(other)

	view := (&EventTick{Game: game.Copy()}).ToPlayerEvent(p1.ID()).(*PlayerEventTick).Game
	for _, airplane := range view.Airplanes() {
		switch airplane.ID() {
		case own.ID():
			if airplane.Destination() != "pn" {
				t.Errorf("own airplane: destination %q, want pn", airplane.Destination())
			}
		case other.ID():
			if airplane.Destination() != IslandID(InvalidID) || airplane.Garrison() != 0 {
				t.Errorf("other's airplane: destination %q, garrison %d; want hidden",
					airplane.Destination(), airplane.Garrison())
			}
		}
	}
	if other.Destination() != "p1" {
		t.Error("the view changed the game's airplane")
	}
}

func TestTickAction_Apply_Bounty(t *testing.T) {
	game := CreateDummyGameSimple()
	game.rules = Rules{Bounty: 10}
	p1, p2 := game.Players()[0], game.Players()[1]
	// p2 leads with two islands to one.
	game.Island("pn").SetOwner(p2.ID())
	arrive(t, game, game.Island("p2"), p1.ID(), 15)
	if island := game.Island("p2"); !island.IsOwnedBy(p1.ID()) || island.Strength() != 15 {
		t.Errorf("expected p1 to take the leader's island with 5 + a bounty of 10, got (%s, %d)",
			island.Owner(), island.Strength())
	}
	// Now p1 and p2 have two islands each: nobody leads, no bounty.
	arrive(t, game, game.Island("pn"), p1.ID(), 15)
	if island := game.Island("pn"); !island.IsOwnedBy(p1.ID()) || island.Strength() != 5 {
		t.Errorf("expected p1 to take the island with 5 and no bounty, got (%s, %d)", island.Owner(), island.Strength())
	}
}

func TestDomination(t *testing.T) {
	game := CreateDummyGameSimple()
	game.rules = Rules{Domination: &DominationRule{Share: 0.75, Hold: 10 * time.Second}}
	p1 := game.Players()[0]
	tick := func(d time.Duration) {
		t.Helper()
		if _, err := (&ActionTick{Delta: d}).Apply(game); err != nil {
			t.Fatal(err)
		}
	}
	// 2 of 4 islands is not enough.
	game.Island("pn").SetOwner(p1.ID())
	tick(20 * time.Second)
	if over, _ := isGameOver(game); over {
		t.Fatal("expected no domination with half of the islands")
	}
	// 3 of 4 is, once held for 10 s.
	game.Island("bottom-left").SetOwner(p1.ID())
	tick(5 * time.Second)
	if over, _ := isGameOver(game); over {
		t.Fatal("expected no domination before it was held for 10 s")
	}
	tick(5 * time.Second)
	if over, winner := isGameOver(game); !over || winner != p1 {
		t.Errorf("expected p1 to win by domination, got over=%v winner=%v", over, winner)
	}
}
