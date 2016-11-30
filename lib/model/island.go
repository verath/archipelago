package model

import (
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

func NewIsland(owner *player, strength int, growthInterval time.Duration) (*Island, error) {
	army, err := newArmy(owner, strength)
	if err != nil {
		return nil, err
	}

	return &Island{
		army:           *army,
		growthInterval: growthInterval,
	}, nil
}
