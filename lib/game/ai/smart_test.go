package ai

import (
	"math/rand"
	"testing"

	"github.com/verath/archipelago/lib/game/model"
)

// smartGame builds a 9x9 game between p1 (us) and p2.
type smartGame struct {
	game       *model.Game
	p1, p2, pn *model.Player
}

func newSmartGame(islands func(p1, p2, pn *model.Player) []*model.Island) smartGame {
	p1, p2, pn := model.NewPlayer(), model.NewPlayer(), model.NewPlayer()
	b := model.NewGameBuilder(model.Coordinate{X: 9, Y: 9}, pn).AddPlayer(p1).AddPlayer(p2)
	for _, island := range islands(p1, p2, pn) {
		b.AddIsland(island)
	}
	return smartGame{b.BuildOrPanic(), p1, p2, pn}
}

func island(id string, x, y int, strength int64, owner *model.Player) *model.Island {
	return model.NewIslandWithID(model.IslandID(id), model.Coordinate{X: x, Y: y}, model.IslandSizeMedium, strength, owner.ID())
}

// next asks the strategy for an action as p1, and applies it.
func (g smartGame) next(t *testing.T, s *smartStrategy) *model.PlayerActionLaunch {
	t.Helper()
	act, err := s.NextAction(clientState{myPlayerID: g.p1.ID()}, g.game, rand.New(rand.NewSource(1)))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if act == nil {
		return nil
	}
	if _, err := act.ToAction(g.p1.ID()).Apply(g.game); err != nil {
		t.Fatalf("unexpected error applying %+v: %v", act, err)
	}
	return act.(*model.PlayerActionLaunch)
}

func TestSmartStrategy_Defends(t *testing.T) {
	g := newSmartGame(func(p1, p2, pn *model.Player) []*model.Island {
		return []*model.Island{
			island("weak", 0, 0, 10, p1),
			island("strong", 1, 0, 60, p1),
			island("enemy", 0, 4, 10, p2),
		}
	})
	// A strength 30 airplane is 3 tiles from "weak", "strong" is 1 tile away.
	attack := model.NewAirplane(model.Coordinate{X: 0, Y: 3}, g.game.Island("weak"), g.p2.ID(), 30)
	g.game.AddAirplane(attack)

	act := g.next(t, newSmartStrategy())
	if act == nil || act.From != "strong" || act.To != "weak" {
		t.Errorf("expected a launch strong -> weak, got %+v", act)
	}
}

func TestSmartStrategy_DoesNotDefendTooLate(t *testing.T) {
	g := newSmartGame(func(p1, p2, pn *model.Player) []*model.Island {
		return []*model.Island{
			island("weak", 0, 0, 10, p1),
			island("strong", 8, 8, 60, p1),
			island("enemy", 0, 4, 10, p2),
		}
	})
	attack := model.NewAirplane(model.Coordinate{X: 0, Y: 1}, g.game.Island("weak"), g.p2.ID(), 30)
	g.game.AddAirplane(attack)

	act := g.next(t, newSmartStrategy())
	if act != nil && act.To == "weak" {
		t.Errorf("expected no reinforcement that arrives too late, got %+v", act)
	}
}

func TestSmartStrategy_GathersArmyForAnAttack(t *testing.T) {
	g := newSmartGame(func(p1, p2, pn *model.Player) []*model.Island {
		return []*model.Island{
			island("a", 0, 0, 40, p1),
			island("b", 1, 0, 40, p1),
			island("c", 0, 1, 40, p1),
			island("target", 2, 2, 50, pn),
			island("enemy", 8, 8, 1000, p2),
		}
	})
	s := newSmartStrategy()
	var sent int64
	for i := 0; i < 10; i++ {
		act := g.next(t, s)
		if act == nil {
			break
		}
		if act.To != "target" {
			t.Fatalf("expected every launch to go to target, got %+v", act)
		}
	}
	for _, airplane := range g.game.Airplanes() {
		sent += airplane.Strength()
	}
	// No island has 50 to send alone; together they send enough with the
	// margin, and then stop.
	if sent <= 50 || sent > 80 {
		t.Errorf("expected a bit more than 50 sent to target, sent %d", sent)
	}
}

func TestSmartStrategy_DoesNotLaunchFromThreatenedIsland(t *testing.T) {
	g := newSmartGame(func(p1, p2, pn *model.Player) []*model.Island {
		return []*model.Island{
			island("home", 0, 0, 80, p1),
			island("target", 1, 0, 5, pn),
			island("enemy", 0, 4, 10, p2),
		}
	})
	// The attack is weaker than home, so home holds, but it shouldn't send
	// half of its army away now.
	g.game.AddAirplane(model.NewAirplane(model.Coordinate{X: 0, Y: 3}, g.game.Island("home"), g.p2.ID(), 60))

	if act := g.next(t, newSmartStrategy()); act != nil {
		t.Errorf("expected no launch from a threatened island, got %+v", act)
	}
}

func TestSmartStrategy_RemembersIslandsInFog(t *testing.T) {
	g := newSmartGame(func(p1, p2, pn *model.Player) []*model.Island {
		return []*model.Island{
			island("home", 0, 0, 20, p1),
			island("far", 8, 8, 90, p2),
		}
	})
	s := newSmartStrategy()
	s.remember(g.game)
	g.game.Island("far").SetStrength(-1) // Now in fog.
	turn := &smartTurn{game: g.game, me: g.p1.ID(), neutral: g.pn.ID()}
	if d := s.defence(turn, g.game.Island("far"), 0); d != 90 {
		t.Errorf("expected the remembered strength 90, got %d", d)
	}
}
