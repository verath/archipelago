package model

import (
	"encoding/json"
	"time"
)

type IslandSize float64

const (
	IslandSizeSmall  IslandSize = 0.5
	IslandSizeMedium IslandSize = 1.0
	IslandSizeLarge  IslandSize = 1.5
)

// Time interval between army size growth, without accounting for
// size of the island.
const IslandGrowthInterval = 5 * time.Second

type Island struct {
	Identifier
	*army

	position        Coordinate
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

func NewIsland(position Coordinate, size IslandSize, strength int, owner *Player) (*Island, error) {
	identifier, err := NewIdentifier()
	if err != nil {
		return nil, err
	}
	return NewIslandWithID(identifier, position, size, strength, owner)
}

func NewIslandWithID(identifier Identifier, position Coordinate, size IslandSize, strength int, owner *Player) (*Island, error) {
	return &Island{
		Identifier: identifier,
		army:       newArmy(owner, strength),
		position:   position,
		size:       float64(size),
	}, nil
}
