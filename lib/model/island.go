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
	Identifier
	*army

	position Coordinate

	// The size of the island, between 0.0 and 1.0.
	// The size factor is used to determine the growth rate of
	// the army on the island, as well as the threshold for army
	// size where the army no longer grows.
	size            float64
	growthRemainder time.Duration
}

// We wrap the identifier type in a PlayerID type to add
// stronger type-support when working with player ids.
type IslandID Identifier

func (islandID IslandID) Equals(otherID IslandID) bool {
	return Identifier(islandID).Equals(Identifier(otherID))
}

func (i *Island) ID() IslandID {
	return IslandID(i.Identifier)
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
		ID       Identifier `json:"id"`
		Army     *army      `json:"army"`
		Position Coordinate `json:"position"`
		Size     float64    `json:"size"`
	}{
		ID:       i.Identifier,
		Army:     i.army,
		Position: i.position,
		Size:     i.size,
	})
}

func (i *Island) Copy() *Island {
	return &Island{
		Identifier:      i.Identifier,
		army:            i.army.Copy(),
		position:        i.position,
		size:            i.size,
		growthRemainder: i.growthRemainder,
	}
}

func NewIsland(position Coordinate, size IslandSize, strength int64, owner *Player) (*Island, error) {
	identifier, err := NewIdentifier()
	if err != nil {
		return nil, err
	}
	return NewIslandWithID(identifier, position, size, strength, owner)
}

func NewIslandWithID(identifier Identifier, position Coordinate, size IslandSize, strength int64, owner *Player) (*Island, error) {
	return &Island{
		Identifier: identifier,
		army:       newArmy(owner, strength),
		position:   position,
		size:       float64(size),
	}, nil
}
