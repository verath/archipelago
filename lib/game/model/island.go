package model

import (
	"encoding/json"
	"time"
)

// IslandSize is a type for size factors of an island, between 0.0 and 1.0.
type IslandSize float64

// Different sizes of islands. These should be preferred over creating
// custom IslandSize values.
const (
	IslandSizeTiny   IslandSize = 0.4
	IslandSizeSmall  IslandSize = 0.6
	IslandSizeMedium IslandSize = 0.8
	IslandSizeLarge  IslandSize = 1
)

// IslandGrowthInterval is the interval between army size growth, without
// factoring in the island size.
const IslandGrowthInterval = 2 * time.Second

// IslandGrowthCap is the army size where the island army stops growing,
// without factoring in the island size.
const IslandGrowthCap = 100.0

// Island represents an Island in the game. An Island has a fixed position
// and an army controlled by some player.
type Island struct {
	*army

	id       IslandID
	position Coordinate
	// The size of the island, between 0.0 and 1.0. The size is used
	// to determine the growth rate of the army on the island, as well
	// as the threshold of army size where the army no longer grows.
	size IslandSize
	// growthRemainder is set to the remaining time after a tick before
	// the army size would increase again. This is required as ticks
	// will not always coincide with the rate of growth.
	growthRemainder time.Duration
}

// NewIsland creates a new Island from the provided values, automatically
// choosing an ID.
func NewIsland(position Coordinate, size IslandSize, strength int64, owner *Player) (*Island, error) {
	id := IslandID(NextModelID())
	return NewIslandWithID(id, position, size, strength, owner)
}

// NewIslandWithID creats a new Island from the provided values.
func NewIslandWithID(id IslandID, position Coordinate, size IslandSize, strength int64, owner *Player) (*Island, error) {
	return &Island{
		army:     newArmy(owner, strength),
		id:       id,
		position: position,
		size:     size,
	}, nil
}

// ID returns the IslandID of the Island.
func (i *Island) ID() IslandID {
	return i.id
}

// Position returns the coordinates for the position of the Island
// within the game.
func (i *Island) Position() Coordinate {
	return i.position
}

// Size returns the IslandSize of the island.
func (i *Island) Size() IslandSize {
	return i.size
}

// GrowthRemainder returns the remaining time from the last growth
// until a new growth would take place.
func (i *Island) GrowthRemainder() time.Duration {
	return i.growthRemainder
}

// SetGrowthRemainder sets the remaining time before a new growth
// would have taken place.
func (i *Island) SetGrowthRemainder(growthRemainder time.Duration) {
	i.growthRemainder = growthRemainder
}

// MarshalJSON marshals the Island instance as JSON by recursively
// marshalling each sub-component of the Island.
func (i *Island) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		Army     *army      `json:"army"`
		ID       IslandID   `json:"id"`
		Position Coordinate `json:"position"`
		Size     float64    `json:"size"`
	}{
		Army:     i.army,
		ID:       i.id,
		Position: i.position,
		Size:     float64(i.size),
	})
}

// Copy performs a deep copy of the Island, returning the copy.
func (i *Island) Copy() *Island {
	return &Island{
		army:            i.army.Copy(),
		id:              i.id,
		position:        i.position,
		size:            i.size,
		growthRemainder: i.growthRemainder,
	}
}
