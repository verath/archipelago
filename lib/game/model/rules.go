package model

import "time"

// Rules holds the tunable rules of a game. The zero value is the standard
// game: no garrisons, no upkeep, no UN, no bounty and no domination victory.
type Rules struct {
	// StartGarrison is the garrison given to each player's starting island.
	StartGarrison int64
	// ReviveGarrison is the garrison given to the island a revived player
	// captures with their revival airplane.
	ReviveGarrison int64
	// Upkeep lists the upkeep tiers, ordered by increasing Army. A player
	// whose total army is at or above a tier's Army gets that tier's Growth
	// (the highest such tier applies). Below the first tier growth is
	// unchanged.
	Upkeep []UpkeepTier
	// UN, if set, makes the United Nations send neutral airplanes against
	// players whose army has grown too large.
	UN *UNRule
	// Bounty is the extra army a player gets on an island it takes from the
	// leader: the player with the most islands, if only one has the most.
	Bounty int64
	// Domination, if set, makes a player that holds a large enough share of
	// the islands for long enough win the game.
	Domination *DominationRule
}

// DominationRule configures the domination victory: a player that holds at
// least Share of all islands for Hold in a row wins.
type DominationRule struct {
	Share float64
	Hold  time.Duration
}

// UNRule configures the United Nations, which do not want a single
// superpower to own the archipelago. While a player's total army is above
// Army, the UN send a neutral airplane every Interval against one of the
// player's islands. An airplane that defeats the island's army makes the
// island neutral.
type UNRule struct {
	// Army is the total army, on islands and airplanes but not counting
	// garrisons, above which a player gets UN airplanes.
	Army int64
	// Interval is the time between two UN airplanes against a player.
	Interval time.Duration
	// Share is the strength of a UN airplane, as a share of the player's
	// army above Army.
	Share float64
}

// UpkeepTier is a step in the upkeep table, see Rules.Upkeep.
type UpkeepTier struct {
	// Army is the total army, on islands and airplanes but not counting
	// garrisons, at which the tier starts.
	Army int64
	// Growth is the fraction of the normal army growth that players in the
	// tier get, e.g. 0.7 for 70%.
	Growth float64
}

// GrowthFactor returns the fraction of the normal army growth that a player
// with the given total army gets.
func (r Rules) GrowthFactor(army int64) float64 {
	factor := 1.0
	for _, tier := range r.Upkeep {
		if army < tier.Army {
			break
		}
		factor = tier.Growth
	}
	return factor
}
