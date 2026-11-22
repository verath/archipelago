package sim

import (
	"testing"
	"time"

	"github.com/verath/archipelago/lib/game/model"
)

func BenchmarkRun(b *testing.B) {
	cfg := testConfig(model.Rules{})
	cfg.MaxTime = 30 * time.Minute
	for i := 0; i < b.N; i++ {
		if _, err := Run(cfg, int64(i)); err != nil {
			b.Fatal(err)
		}
	}
}
