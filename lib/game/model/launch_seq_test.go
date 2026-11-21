package model

import (
	"testing"
	"time"
)

func newLaunchActionWithSeq(from, to IslandID, playerID PlayerID, seq uint32) *actionLaunch {
	playerAction := PlayerActionLaunch{From: from, To: to, Seq: seq}
	return &actionLaunch{PlayerActionLaunch: playerAction, playerID: playerID}
}

func TestLaunchAction_Apply_RecordsSeq(t *testing.T) {
	game := CreateDummyGameSimple()
	p1 := game.Players()[0]

	if _, err := newLaunchActionWithSeq("p1", "p2", p1.ID(), 3).Apply(game); err != nil {
		t.Fatalf("Apply: %v", err)
	}
	if got := p1.LastLaunchSeq(); got != 3 {
		t.Errorf("LastLaunchSeq() = %d, want 3", got)
	}
	if got := game.Airplanes()[0].LaunchSeq(); got != 3 {
		t.Errorf("airplane LaunchSeq() = %d, want 3", got)
	}
}

func TestLaunchAction_Apply_RecordsSeqOfIllegalLaunch(t *testing.T) {
	game := CreateDummyGameSimple()
	p1 := game.Players()[0]

	// p2 is not p1's island.
	_, err := newLaunchActionWithSeq("p2", "p1", p1.ID(), 7).Apply(game)
	if _, ok := err.(*IllegalActionError); !ok {
		t.Fatalf("Apply err = %v, want an IllegalActionError", err)
	}
	if got := p1.LastLaunchSeq(); got != 7 {
		t.Errorf("LastLaunchSeq() = %d, want 7", got)
	}
}

func TestLaunchAction_Apply_SeqNeverDecreases(t *testing.T) {
	game := CreateDummyGameSimple()
	p1 := game.Players()[0]

	newLaunchActionWithSeq("p1", "p2", p1.ID(), 5).Apply(game)
	// No seq (0, e.g. an AI player) and an older seq keep the latest seq.
	newLaunchActionWithSeq("p1", "p2", p1.ID(), 0).Apply(game)
	newLaunchActionWithSeq("p1", "p2", p1.ID(), 4).Apply(game)
	if got := p1.LastLaunchSeq(); got != 5 {
		t.Errorf("LastLaunchSeq() = %d, want 5", got)
	}
}

func TestEventTick_ToPlayerEvent_HidesOtherPlayersLaunchSeqs(t *testing.T) {
	game := CreateDummyGameSimple()
	p1, p2 := game.Players()[0], game.Players()[1]
	newLaunchActionWithSeq("p1", "pn", p1.ID(), 1).Apply(game)
	newLaunchActionWithSeq("p2", "pn", p2.ID(), 2).Apply(game)

	evt := (&EventTick{Game: game.Copy()}).ToPlayerEvent(p1.ID()).(*PlayerEventTick)

	if got := evt.Game.Player(p1.ID()).LastLaunchSeq(); got != 1 {
		t.Errorf("own LastLaunchSeq() = %d, want 1", got)
	}
	if got := evt.Game.Player(p2.ID()).LastLaunchSeq(); got != 0 {
		t.Errorf("other player's LastLaunchSeq() = %d, want 0", got)
	}
	for _, airplane := range evt.Game.Airplanes() {
		want := uint32(0)
		if airplane.IsOwnedBy(p1.ID()) {
			want = 1
		}
		if got := airplane.LaunchSeq(); got != want {
			t.Errorf("airplane owned by %s: LaunchSeq() = %d, want %d", airplane.Owner(), got, want)
		}
	}
	// The original game is not modified.
	if got := game.Player(p2.ID()).LastLaunchSeq(); got != 2 {
		t.Errorf("game's p2 LastLaunchSeq() = %d, want 2", got)
	}
}

func TestTickAction_Apply_AdvancesGameTime(t *testing.T) {
	game := CreateDummyGameSimple()
	for _, delta := range []time.Duration{0, 300 * time.Millisecond, 350 * time.Millisecond} {
		if _, err := (&ActionTick{Delta: delta}).Apply(game); err != nil {
			t.Fatalf("Apply: %v", err)
		}
	}
	if got, want := game.Time(), 650*time.Millisecond; got != want {
		t.Errorf("Time() = %v, want %v", got, want)
	}
}

func TestGame_Copy_CopiesTimeAndSeqs(t *testing.T) {
	game := CreateDummyGameSimple()
	p1 := game.Players()[0]
	newLaunchActionWithSeq("p1", "p2", p1.ID(), 9).Apply(game)
	game.SetTime(time.Minute)
	game.SetReviveCount(2)

	c := game.Copy()
	if c.Time() != time.Minute || c.ReviveCount() != 2 {
		t.Errorf("Copy: Time(), ReviveCount() = %v, %d; want 1m0s, 2", c.Time(), c.ReviveCount())
	}
	if got := c.Player(p1.ID()).LastLaunchSeq(); got != 9 {
		t.Errorf("Copy: LastLaunchSeq() = %d, want 9", got)
	}
	if got := c.Airplanes()[0].LaunchSeq(); got != 9 {
		t.Errorf("Copy: airplane LaunchSeq() = %d, want 9", got)
	}
}
