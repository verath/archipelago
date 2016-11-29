package model

import (
	"time"
)

type island struct {
	army
	growthInterval  time.Duration
	growthRemainder time.Duration
}

func (i *island) GrowthInterval() time.Duration {
	return i.growthInterval
}

func (i *island) GrowthRemainder() time.Duration {
	return i.growthRemainder
}

func (i *island) SetGrowthRemainder(growthRemainder time.Duration) {
	i.growthRemainder = growthRemainder
}

func NewIsland(owner *player, strength int, growthInterval time.Duration) (*island, error) {
	army, err := newArmy(owner, strength)
	if err != nil {
		return nil, err
	}

	return &island{
		army:           *army,
		growthInterval: growthInterval,
	}, nil
}
