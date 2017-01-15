package model

import (
	"encoding/json"
	"time"
)

// A size factor of an island, between 0.0 and 1.0.
type IslandSize float64

const (
	IslandSizeTiny   IslandSize = 0.4
	IslandSizeSmall  IslandSize = 0.6
	IslandSizeMedium IslandSize = 0.8
	IslandSizeLarge  IslandSize = 1
)

// Time interval between army size growth, without factoring in
// the island size.
const IslandGrowthInterval = (2 * time.Second)

// The army size where the island army stops growing, without
// factoring in the island size.
const IslandGrowthCap = 100.0

type Island struct {
	*army

	id       IslandID
	position Coordinate
	// The size of the island, between 0.0 and 1.0.
	// The size factor is used to determine the growth rate of
	// the army on the island, as well as the threshold for army
	// size where the army no longer grows.
	size            float64
	growthRemainder time.Duration
}

func (i *Island) ID() IslandID {
	return i.id
}

func (i *Island) Position() Coordinate {
	return i.position
}

func (i *Island) Size() float64 {
	return i.size
}

func (i *Island) SetSize(size float64) {
	i.size = size
}

func (i *Island) GrowthRemainder() time.Duration {
	return i.growthRemainder
}

func (i *Island) SetGrowthRemainder(growthRemainder time.Duration) {
	i.growthRemainder = growthRemainder
}

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
		Size:     i.size,
	})
}

func (i *Island) Copy() *Island {
	return &Island{
		army:            i.army.Copy(),
		id:              i.id,
		position:        i.position,
		size:            i.size,
		growthRemainder: i.growthRemainder,
	}
}

func NewIsland(position Coordinate, size IslandSize, strength int64, owner *Player) (*Island, error) {
	id := IslandID(NewModelID())
	return NewIslandWithID(id, position, size, strength, owner)
}

func NewIslandWithID(id IslandID, position Coordinate, size IslandSize, strength int64, owner *Player) (*Island, error) {
	return &Island{
		army:     newArmy(owner, strength),
		id:       id,
		position: position,
		size:     float64(size),
	}, nil
}
