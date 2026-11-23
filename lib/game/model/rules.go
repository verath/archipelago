package model

// Rules holds the tunable rules of a game. The zero value is a game without
// garrisons.
type Rules struct {
	// StartGarrison is the garrison given to each player's starting island.
	StartGarrison int64
	// ReviveGarrison is the garrison given to the island a revived player
	// captures with their revival airplane.
	ReviveGarrison int64
}

// DefaultRules are the rules of games on the server.
var DefaultRules = Rules{StartGarrison: 20, ReviveGarrison: 20}
