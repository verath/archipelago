package model

import "github.com/verath/archipelago/lib/common"

// ID is the type used as ID for all models.
type ID string

// InvalidID represents an invalid model ID, guaranteed to never match the
// ID of any entry.
const InvalidID = ID("INVALID_ID")

// Distinct types for various entries in the game model. Each
// entry is given a separate type of ID, to avoid issues with
// trying to find an entity of one type with the id of another.
type (
	// GameID is the id type for games.
	GameID ID
	// PlayerID is the id type for players.
	PlayerID ID
	// IslandID is the id type for Islands.
	IslandID ID
	// AirplaneID is the id type for Airplanes.
	AirplaneID ID
)

// NextModelID returns a unique id.
func NextModelID() ID {
	return ID(common.NextGlobalID())
}
