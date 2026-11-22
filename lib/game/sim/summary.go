package sim

import (
	"fmt"
	"io"
	"slices"
	"strings"
	"text/tabwriter"
	"time"
)

// Checkpoints are the game times at which Summarize looks at who is leading.
var Checkpoints = []time.Duration{1 * time.Minute, 2 * time.Minute, 3 * time.Minute, 5 * time.Minute}

// EarlyGame is the game time that the early game metrics look at.
const EarlyGame = 2 * time.Minute

// Summary is the aggregate of many simulated games of a variant.
type Summary struct {
	Name     string
	Games    int
	TimedOut int
	// Durations are the durations of the games that had a winner.
	Durations []time.Duration

	// Running is, per checkpoint, the number of games that were still
	// running, had a single player owning the most islands, and ended with
	// a winner. Games that timed out are left out, as nobody won them.
	Running []int
	// LeaderWon is, per checkpoint, how many of the Running games were won
	// by the player leading at the checkpoint.
	LeaderWon []int
	// LeadChanges is the number of times the leader changed, over all games.
	LeadChanges int

	// FirstAttack is the time of the first capture of a player's island by
	// another player, in the games where there was one.
	FirstAttack []time.Duration
	// FirstElimination is the time a player was first eliminated, in the
	// games where one was.
	FirstElimination []time.Duration
	// EarlyNeutral and EarlyPvP count captures in the early game of neutral
	// islands and of other players' islands.
	EarlyNeutral, EarlyPvP int
	// EarlyStartsLost is the number of starting islands lost to another
	// player in the early game.
	EarlyStartsLost int
	// Seats is the number of players over all games.
	Seats int

	// Revivals is the number of revivals. RevivedWon counts revivals whose
	// player went on to win, RevivedGrew those reaching 3 or more islands,
	// RevivedSurvived1m those surviving at least a minute.
	Revivals, RevivedWon, RevivedGrew, RevivedSurvived1m int

	// Dominations is the number of games won by domination.
	Dominations int
	// UNPlanes is the number of UN airplanes sent. Neutralized is the number
	// of player islands that became neutral, mostly to UN airplanes.
	UNPlanes, Neutralized int

	// PeakArmy is the largest army of any player in each game.
	PeakArmy []int64
	// WinsByBot counts wins and seats per bot kind.
	WinsByBot, SeatsByBot map[BotKind]int
	// LaunchesByBot, AttacksByBot and CapturesByBot count launches, attack
	// launches and captures of islands per bot kind, and MinutesByBot the
	// minutes played by them.
	LaunchesByBot, AttacksByBot, CapturesByBot map[BotKind]int
	MinutesByBot                               map[BotKind]float64
}

// leader returns the index of the player with the most islands, or -1 if
// there is a tie.
func leader(s Sample) int {
	best, bestIslands, tie := -1, 0, false
	for i, islands := range s.Islands {
		switch {
		case islands > bestIslands:
			best, bestIslands, tie = i, islands, false
		case islands == bestIslands:
			tie = true
		}
	}
	if tie || best == -1 {
		return -1
	}
	return best
}

// sampleAt returns the last sample at or before t.
func sampleAt(res *Result, t time.Duration) (Sample, bool) {
	var found Sample
	ok := false
	for _, s := range res.Samples {
		if s.Time > t {
			break
		}
		found, ok = s, true
	}
	return found, ok
}

// Summarize aggregates the results of games of one variant.
func Summarize(name string, results []*Result) *Summary {
	sum := &Summary{
		Name:          name,
		Running:       make([]int, len(Checkpoints)),
		LeaderWon:     make([]int, len(Checkpoints)),
		WinsByBot:     map[BotKind]int{},
		SeatsByBot:    map[BotKind]int{},
		LaunchesByBot: map[BotKind]int{},
		AttacksByBot:  map[BotKind]int{},
		CapturesByBot: map[BotKind]int{},
		MinutesByBot:  map[BotKind]float64{},
	}
	for _, res := range results {
		sum.Games++
		sum.Seats += len(res.Bots)
		for i, bot := range res.Bots {
			sum.SeatsByBot[bot]++
			if res.Winner == i {
				sum.WinsByBot[bot]++
			}
			if len(res.Launches) > i {
				sum.LaunchesByBot[bot] += res.Launches[i]
				sum.AttacksByBot[bot] += res.Attacks[i]
			}
		}
		for _, life := range res.Lives {
			sum.MinutesByBot[res.Bots[life.Player]] += (life.End - life.Start).Minutes()
		}
		for _, c := range res.Captures {
			if c.To != Neutral {
				sum.CapturesByBot[res.Bots[c.To]]++
			}
		}
		if res.TimedOut {
			sum.TimedOut++
		} else {
			sum.Durations = append(sum.Durations, res.Duration)
		}

		for ci, cp := range Checkpoints {
			if res.TimedOut || res.Duration <= cp {
				continue
			}
			s, ok := sampleAt(res, cp)
			if !ok {
				continue
			}
			if l := leader(s); l != -1 {
				sum.Running[ci]++
				if res.Winner == l {
					sum.LeaderWon[ci]++
				}
			}
		}
		prev := -1
		for _, s := range res.Samples {
			l := leader(s)
			if l == -1 {
				continue
			}
			if prev != -1 && l != prev {
				sum.LeadChanges++
			}
			prev = l
		}

		sum.UNPlanes += res.UNPlanes
		if res.Domination {
			sum.Dominations++
		}
		firstAttack := time.Duration(-1)
		for _, c := range res.Captures {
			if c.From != Neutral && c.To == Neutral {
				sum.Neutralized++
			}
			pvp := c.From != Neutral && c.To != Neutral
			if pvp && firstAttack < 0 {
				firstAttack = c.Time
			}
			if c.Time > EarlyGame {
				continue
			}
			if c.From == Neutral {
				sum.EarlyNeutral++
			} else if pvp {
				sum.EarlyPvP++
				if c.Start {
					sum.EarlyStartsLost++
				}
			}
		}
		if firstAttack >= 0 {
			sum.FirstAttack = append(sum.FirstAttack, firstAttack)
		}

		firstElimination := time.Duration(-1)
		var peak int64
		for _, life := range res.Lives {
			peak = max(peak, life.PeakArmy)
			if life.Eliminated && (firstElimination < 0 || life.End < firstElimination) {
				firstElimination = life.End
			}
			if !life.Revived {
				continue
			}
			sum.Revivals++
			if res.Winner == life.Player && !life.Eliminated {
				sum.RevivedWon++
			}
			if life.MaxIslands >= 3 {
				sum.RevivedGrew++
			}
			if life.End-life.Start >= time.Minute {
				sum.RevivedSurvived1m++
			}
		}
		if firstElimination >= 0 {
			sum.FirstElimination = append(sum.FirstElimination, firstElimination)
		}
		sum.PeakArmy = append(sum.PeakArmy, peak)
	}
	return sum
}

func pct(n, of int) string {
	if of == 0 {
		return "-"
	}
	return fmt.Sprintf("%.0f%% (%d)", 100*float64(n)/float64(of), of)
}

func perGame(n, games int) string {
	if games == 0 {
		return "-"
	}
	return fmt.Sprintf("%.2f", float64(n)/float64(games))
}

func quantile[T int64 | time.Duration](values []T, q float64) (T, bool) {
	if len(values) == 0 {
		return 0, false
	}
	sorted := slices.Clone(values)
	slices.Sort(sorted)
	return sorted[int(q*float64(len(sorted)-1)+0.5)], true
}

func durations(values []time.Duration, of int) string {
	p50, ok := quantile(values, 0.5)
	if !ok {
		return "-"
	}
	p10, _ := quantile(values, 0.1)
	p90, _ := quantile(values, 0.9)
	r := func(d time.Duration) string { return d.Round(time.Second).String() }
	s := fmt.Sprintf("%s [%s–%s]", r(p50), r(p10), r(p90))
	if of > 0 && len(values) != of {
		s += fmt.Sprintf(" n=%d", len(values))
	}
	return s
}

// WriteTable writes the summaries side by side, one column per summary.
func WriteTable(w io.Writer, sums []*Summary) error {
	tw := tabwriter.NewWriter(w, 0, 0, 3, ' ', 0)
	row := func(label string, f func(s *Summary) string) {
		cells := []string{label}
		for _, s := range sums {
			cells = append(cells, f(s))
		}
		fmt.Fprintln(tw, strings.Join(cells, "\t")+"\t")
	}
	section := func(label string) {
		fmt.Fprintln(tw, label+strings.Repeat("\t", len(sums)+1))
	}

	row("", func(s *Summary) string { return s.Name })
	row("games", func(s *Summary) string { return fmt.Sprint(s.Games) })
	row("timed out", func(s *Summary) string { return pct(s.TimedOut, s.Games) })
	row("duration p50 [p10–p90]", func(s *Summary) string { return durations(s.Durations, 0) })
	row("won by domination", func(s *Summary) string { return pct(s.Dominations, s.Games) })

	section("snowball, of games with a winner (lower = more comebacks)")
	for ci, cp := range Checkpoints {
		row(fmt.Sprintf("  leader at %v wins", cp), func(s *Summary) string { return pct(s.LeaderWon[ci], s.Running[ci]) })
	}
	row("  lead changes / game", func(s *Summary) string { return perGame(s.LeadChanges, s.Games) })

	section(fmt.Sprintf("early game (first %v)", EarlyGame))
	row("  neutral captures / game", func(s *Summary) string { return perGame(s.EarlyNeutral, s.Games) })
	row("  player captures / game", func(s *Summary) string { return perGame(s.EarlyPvP, s.Games) })
	row("  start islands lost", func(s *Summary) string { return pct(s.EarlyStartsLost, s.Seats) })
	row("  first player capture", func(s *Summary) string { return durations(s.FirstAttack, s.Games) })
	row("  first elimination", func(s *Summary) string { return durations(s.FirstElimination, s.Games) })

	section("revivals")
	row("  revivals / game", func(s *Summary) string { return perGame(s.Revivals, s.Games) })
	row("  revived, reached 3+ islands", func(s *Summary) string { return pct(s.RevivedGrew, s.Revivals) })
	row("  revived, survived 1m+", func(s *Summary) string { return pct(s.RevivedSurvived1m, s.Revivals) })
	row("  revived, won", func(s *Summary) string { return pct(s.RevivedWon, s.Revivals) })

	section("army")
	row("  UN airplanes / game", func(s *Summary) string { return perGame(s.UNPlanes, s.Games) })
	row("  player islands made neutral / game", func(s *Summary) string { return perGame(s.Neutralized, s.Games) })
	row("  peak army p50 [p10–p90]", func(s *Summary) string {
		p50, ok := quantile(s.PeakArmy, 0.5)
		if !ok {
			return "-"
		}
		p10, _ := quantile(s.PeakArmy, 0.1)
		p90, _ := quantile(s.PeakArmy, 0.9)
		return fmt.Sprintf("%d [%d–%d]", p50, p10, p90)
	})
	section("bots")
	for _, bot := range BotKinds {
		row(fmt.Sprintf("  %s: win rate per seat", bot), func(s *Summary) string { return pct(s.WinsByBot[bot], s.SeatsByBot[bot]) })
		row(fmt.Sprintf("  %s: launches / minute alive", bot), func(s *Summary) string {
			if s.MinutesByBot[bot] == 0 {
				return "-"
			}
			return fmt.Sprintf("%.1f", float64(s.LaunchesByBot[bot])/s.MinutesByBot[bot])
		})
		row(fmt.Sprintf("  %s: captures / attack launch", bot), func(s *Summary) string {
			if s.AttacksByBot[bot] == 0 {
				return "-"
			}
			return fmt.Sprintf("%.2f", float64(s.CapturesByBot[bot])/float64(s.AttacksByBot[bot]))
		})
	}
	return tw.Flush()
}
