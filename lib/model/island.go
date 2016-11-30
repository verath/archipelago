package model

import (
	"time"
	"encoding/json"
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
