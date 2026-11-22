package sim

import (
	"reflect"
	"testing"
	"time"

	"github.com/verath/archipelago/lib/game/model"
)

// testConfig plays short games, to keep the tests fast also with -race.
func testConfig(rules model.Rules) Config {
	return Config{
		Rules:   rules,
		Bots:    []BotKind{BotOpportunistic, BotOpportunistic, BotRandom, BotOpportunistic},
		MaxTime: 3 * time.Minute,
		Tick:    100 * time.Millisecond,
	}
}

func TestRun_IsDeterministic(t *testing.T) {
	cfg := testConfig(model.Rules{StartGarrison: 20, ReviveGarrison: 20,
		Upkeep: []model.UpkeepTier{{Army: 100, Growth: 0.7}}})
	a, err := Run(cfg, 42)
	if err != nil {
		t.Fatal(err)
	}
	b, err := Run(cfg, 42)
	if err != nil {
		t.Fatal(err)
	}
	if !reflect.DeepEqual(a, b) {
		t.Error("two runs with the same seed and config differ")
	}
}

func TestRun_RecordsTheGame(t *testing.T) {
	res, err := Run(testConfig(model.Rules{}), 1)
	if err != nil {
		t.Fatal(err)
	}
	if !res.TimedOut && res.Winner == -1 {
		t.Error("expected a winner or a timeout")
	}
	if len(res.Captures) == 0 {
		t.Error("expected some islands to change owner")
	}
	if len(res.Samples) < int(res.Duration/SampleInterval) {
		t.Errorf("expected a sample every %v, got %d in %v", SampleInterval, len(res.Samples), res.Duration)
	}
	sum := Summarize("test", []*Result{res})
	if sum.Games != 1 || sum.Seats != 4 {
		t.Errorf("unexpected summary: %+v", sum)
	}
}
