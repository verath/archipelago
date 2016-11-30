package model

import (
	"encoding/json"
	"time"
)

type Island struct {
	army
	growthInterval  time.Duration
	growthRemainder time.Duration
}

func (i *Island) GrowthInterval() time.Duration {
	return i.growthInterval
}

func (i *Island) GrowthRemainder() time.Duration {
	return i.growthRemainder
}

func (i *Island) SetGrowthRemainder(growthRemainder time.Duration) {
	i.growthRemainder = growthRemainder
}

func (i *Island) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		Army army
	}{
		Army: i.army,
	})
}

func NewIsland(owner *player, strength int, growthInterval time.Duration) *Island {
	return &Island{
		army:           newArmy(owner, strength),
		growthInterval: growthInterval,
	}
}
