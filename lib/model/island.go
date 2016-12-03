package model

import (
	"encoding/json"
	"time"
)

type Island struct {
	*army
	size            float64
	growthRemainder time.Duration
}

const (
	IslandSizeSmall  = 0.5
	IslandSizeMedium = 1.0
	IslandSizeLarge  = 2.0
)

// Time interval between army size growth, without accounting for
// size of the island.
const IslandGrowthInterval = 10 * time.Second

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
		Army *army
		Size float64
	}{
		Army: i.army,
		Size: i.size,
	})
}

func (i *Island) Copy() *Island {
	return &Island{
		army:            i.army.Copy(),
		size:            i.size,
		growthRemainder: i.growthRemainder,
	}
}

func NewIsland(owner *Player, strength int, size float64) *Island {
	return &Island{
		army: newArmy(owner, strength),
		size: size,
	}
}
