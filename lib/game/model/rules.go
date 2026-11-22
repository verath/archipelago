package model

// Rules holds the tunable rules of a game. The zero value is the standard
// game: no garrisons and no upkeep.
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
