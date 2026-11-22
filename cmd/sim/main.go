// Command sim plays many headless games between AI players for each of a few
// rule variants, and prints a table comparing them.
//
//	go run ./cmd/sim -games 500
//	go run ./cmd/sim -games 500 \
//	    -variant 'baseline:' \
//	    -variant 'garrison: start=20 revive=20' \
//	    -variant 'upkeep: upkeep=100@0.7,200@0.4'
//
// A variant is "name:" followed by space separated settings:
//
//	start=N    garrison of each player's starting island
//	revive=N   garrison of the island a revived player captures
//	upkeep=A@G,...  upkeep tiers: from total army A, growth is G of normal
//	           (G as 0.7 or 70%)
//	un=A@S/I   United Nations: above a total army of A, a neutral airplane
//	           every I (e.g. 10s) with S (0.2 or 20%) of the army above A
//	smart.K=V  a setting of the smart AI, see ai.SmartConfig (e.g.
//	           smart.hold=0.5)
//	pace.K=V   the pace of the smart AI, see ai.Pace (e.g. pace.rate=3,
//	           pace.reaction=200ms); pace.live= and pace.human= start from
//	           ai.LivePace or ai.HumanPace (the default)
//
// Every variant plays the same seeds, so they are compared on the same maps.
package main

import (
	"bufio"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"os"
	"runtime"
	"slices"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/verath/archipelago/lib/game/ai"
	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/game/sim"
)

// defaultVariants are played when no -variant flag is given.
var defaultVariants = []string{
	"baseline:",
	"garrison: start=20 revive=20",
	"upkeep: upkeep=100@0.7,200@0.4",
	"both: start=20 revive=20 upkeep=100@0.7,200@0.4",
}

type variant struct {
	name  string
	rules model.Rules
	smart ai.SmartConfig
	pace  ai.Pace
}

type variantFlags []string

func (v *variantFlags) String() string     { return strings.Join(*v, "; ") }
func (v *variantFlags) Set(s string) error { *v = append(*v, s); return nil }

func parseVariant(s string) (variant, error) {
	name, settings, ok := strings.Cut(s, ":")
	if !ok || strings.TrimSpace(name) == "" {
		return variant{}, fmt.Errorf("variant %q: want \"name: settings\"", s)
	}
	v := variant{name: strings.TrimSpace(name), smart: ai.DefaultSmartConfig, pace: ai.HumanPace}
	for _, setting := range strings.Fields(settings) {
		key, value, ok := strings.Cut(setting, "=")
		if !ok {
			return variant{}, fmt.Errorf("variant %q: setting %q: want key=value", s, setting)
		}
		var err error
		if smartKey, ok := strings.CutPrefix(key, "smart."); ok {
			if err := v.smart.Set(smartKey, value); err != nil {
				return variant{}, fmt.Errorf("variant %q: %w", s, err)
			}
			continue
		}
		if paceKey, ok := strings.CutPrefix(key, "pace."); ok {
			if paceKey == "live" || paceKey == "human" {
				v.pace = map[string]ai.Pace{"live": ai.LivePace, "human": ai.HumanPace}[paceKey]
			} else if err := v.pace.Set(paceKey, value); err != nil {
				return variant{}, fmt.Errorf("variant %q: %w", s, err)
			}
			continue
		}
		switch key {
		case "start":
			v.rules.StartGarrison, err = strconv.ParseInt(value, 10, 64)
		case "revive":
			v.rules.ReviveGarrison, err = strconv.ParseInt(value, 10, 64)
		case "upkeep":
			v.rules.Upkeep, err = parseUpkeep(value)
		case "un":
			v.rules.UN, err = parseUN(value)
		default:
			err = errors.New("unknown setting")
		}
		if err != nil {
			return variant{}, fmt.Errorf("variant %q: setting %q: %w", s, setting, err)
		}
	}
	return v, nil
}

// parseFraction parses 0.7 or 70% as 0.7.
func parseFraction(s string) (float64, error) {
	scale := 1.0
	if strings.HasSuffix(s, "%") {
		s, scale = strings.TrimSuffix(s, "%"), 0.01
	}
	f, err := strconv.ParseFloat(s, 64)
	return f * scale, err
}

func parseUN(s string) (*model.UNRule, error) {
	army, rest, ok1 := strings.Cut(s, "@")
	share, interval, ok2 := strings.Cut(rest, "/")
	if !ok1 || !ok2 {
		return nil, fmt.Errorf("%q: want ARMY@SHARE/INTERVAL", s)
	}
	var un model.UNRule
	var err error
	if un.Army, err = strconv.ParseInt(army, 10, 64); err != nil {
		return nil, err
	}
	if un.Share, err = parseFraction(share); err != nil {
		return nil, err
	}
	if un.Interval, err = time.ParseDuration(interval); err != nil {
		return nil, err
	}
	if un.Interval <= 0 {
		return nil, errors.New("interval must be > 0")
	}
	return &un, nil
}

func parseUpkeep(s string) ([]model.UpkeepTier, error) {
	var tiers []model.UpkeepTier
	for _, tier := range strings.Split(s, ",") {
		army, growth, ok := strings.Cut(tier, "@")
		if !ok {
			return nil, fmt.Errorf("tier %q: want ARMY@GROWTH", tier)
		}
		a, err := strconv.ParseInt(army, 10, 64)
		if err != nil {
			return nil, err
		}
		g, err := parseFraction(growth)
		if err != nil {
			return nil, err
		}
		if len(tiers) > 0 && a <= tiers[len(tiers)-1].Army {
			return nil, errors.New("tiers must be in increasing army order")
		}
		tiers = append(tiers, model.UpkeepTier{Army: a, Growth: g})
	}
	return tiers, nil
}

func parseBots(s string) ([]sim.BotKind, error) {
	var bots []sim.BotKind
	for _, b := range strings.Split(s, ",") {
		kind := sim.BotKind(strings.TrimSpace(b))
		if !slices.Contains(sim.BotKinds, kind) {
			return nil, fmt.Errorf("unknown bot %q, want one of %v", b, sim.BotKinds)
		}
		bots = append(bots, kind)
	}
	return bots, nil
}

// rotations returns how many times each map is played with rotate: once
// with each seat rotation, unless all the bots are the same.
func rotations(bots []sim.BotKind, rotate bool) int {
	if !rotate {
		return 1
	}
	for _, bot := range bots {
		if bot != bots[0] {
			return len(bots)
		}
	}
	return 1
}

// runVariant plays the games of a variant on parallel goroutines, returning
// the results in seed order. Each map is played rots times, rotating which
// bot sits in which seat, so that every bot gets every starting position.
func runVariant(cfg sim.Config, firstSeed int64, maps, rots, parallel int) ([]*sim.Result, error) {
	games := maps * rots
	results := make([]*sim.Result, games)
	errs := make([]error, games)
	next := make(chan int)
	var wg sync.WaitGroup
	for w := 0; w < parallel; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for i := range next {
				c := cfg
				r := i % rots
				c.Bots = append(slices.Clone(cfg.Bots[r:]), cfg.Bots[:r]...)
				results[i], errs[i] = sim.Run(c, firstSeed+int64(i/rots))
			}
		}()
	}
	for i := 0; i < games; i++ {
		next <- i
	}
	close(next)
	wg.Wait()
	return results, errors.Join(errs...)
}

// jsonLine is a line of the -json output.
type jsonLine struct {
	Variant string `json:"variant"`
	*sim.Result
}

// summarizeFile summarizes the game records of a -json file, per variant in
// the order they first appear.
func summarizeFile(path string) ([]*sim.Summary, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	var names []string
	results := map[string][]*sim.Result{}
	dec := json.NewDecoder(f)
	for dec.More() {
		var line jsonLine
		if err := dec.Decode(&line); err != nil {
			return nil, fmt.Errorf("%s: %w", path, err)
		}
		if _, ok := results[line.Variant]; !ok {
			names = append(names, line.Variant)
		}
		results[line.Variant] = append(results[line.Variant], line.Result)
	}
	var sums []*sim.Summary
	for _, name := range names {
		sums = append(sums, sim.Summarize(name, results[name]))
	}
	return sums, nil
}

func main() {
	var variantSpecs variantFlags
	games := flag.Int("games", 200, "maps to play per variant")
	rotate := flag.Bool("rotate", true, "play each map once per seat rotation, so that every bot gets "+
		"every starting position (when the bots differ)")
	seed := flag.Int64("seed", 1, "seed of the first game; game i plays seed+i")
	botsFlag := flag.String("bots", "smart,smart,smart,smart", "the AI in each seat: smart, opp (opportunistic, "+
		"as in live games) or rand (random, as in live games)")
	maxTime := flag.Duration("max", 30*time.Minute, "game time after which a game is stopped as timed out")
	tick := flag.Duration("tick", 100*time.Millisecond, "game time step of a tick")
	parallel := flag.Int("parallel", runtime.NumCPU(), "games played in parallel")
	jsonPath := flag.String("json", "", "if set, write every game's record to this file as JSON lines")
	summarize := flag.String("summarize", "", "if set, play nothing: print the table for the game records in this "+
		"file, as written by -json")
	flag.Var(&variantSpecs, "variant", "a rule variant to play, repeatable (see the package doc); "+
		"defaults to baseline, garrison, upkeep and both")
	flag.Parse()

	if *summarize != "" {
		sums, err := summarizeFile(*summarize)
		if err == nil {
			err = sim.WriteTable(os.Stdout, sums)
		}
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		return
	}
	if len(variantSpecs) == 0 {
		variantSpecs = defaultVariants
	}
	var variants []variant
	for _, spec := range variantSpecs {
		v, err := parseVariant(spec)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(2)
		}
		variants = append(variants, v)
	}
	bots, err := parseBots(*botsFlag)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(2)
	}

	var jsonOut *bufio.Writer
	if *jsonPath != "" {
		f, err := os.Create(*jsonPath)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		defer f.Close()
		jsonOut = bufio.NewWriter(f)
		defer jsonOut.Flush()
	}

	var sums []*sim.Summary
	for _, v := range variants {
		start := time.Now()
		cfg := sim.Config{Rules: v.rules, Bots: bots, MaxTime: *maxTime, Tick: *tick, Smart: v.smart, SmartPace: v.pace}
		results, err := runVariant(cfg, *seed, *games, rotations(bots, *rotate), *parallel)
		if err != nil {
			fmt.Fprintf(os.Stderr, "variant %s: %v\n", v.name, err)
			os.Exit(1)
		}
		fmt.Fprintf(os.Stderr, "%s: %d games in %v\n", v.name, len(results), time.Since(start).Round(time.Millisecond))
		if jsonOut != nil {
			enc := json.NewEncoder(jsonOut)
			for _, res := range results {
				if err := enc.Encode(jsonLine{v.name, res}); err != nil {
					fmt.Fprintln(os.Stderr, err)
					os.Exit(1)
				}
			}
		}
		sums = append(sums, sim.Summarize(v.name, results))
	}
	if err := sim.WriteTable(os.Stdout, sums); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
