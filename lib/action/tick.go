package action

import (
	"errors"
	"github.com/verath/archipelago/lib/event"
	"github.com/verath/archipelago/lib/model"
	"math"
	"time"
)

type tickAction struct {
	delta time.Duration
}

func updateAirplanes(g *model.Game, delta time.Duration) error {
	for _, airplane := range g.Airplanes() {
		speed := airplane.Speed()
		pos := airplane.Position()
		dest := airplane.Destination().ToFloatCoordinate()

		thrust := speed * float64(delta)
		dx := dest.X - pos.X
		dy := dest.Y - pos.Y
		dist := math.Sqrt(dx*dx + dy*dy)

		moveX := thrust * (dx / dist)
		moveY := thrust * (dy / dist)

		airplane.Position().X += moveX
		airplane.Position().Y += moveY
	}
	return nil
}

func updateIslands(g *model.Game, delta time.Duration) error {
	growthInterval := model.IslandGrowthInterval
	for _, island := range g.Islands() {
		if island.Owner().Equals(g.PlayerNeutral()) {
			// Neutral islands does not grow in strength
			continue
		}

		// The larger the island the more it grows per tick
		// TODO: Should not be linear growth?
		size := island.Size()
		increment := time.Duration(size * float64(delta))

		// Calculate the whole number of added strength, storing
		// the remaining "fractions" as the growth remainder. Note
		// that we are doing calculations on time.Duration(=int64)
		// here, but the reasoning stays the same.
		remainder := island.GrowthRemainder()
		addedStrength := (remainder + increment) / growthInterval
		remainder = (remainder + increment) % growthInterval

		// TODO: limit max strength depending on island size
		island.SetStrength(island.Strength() + int(addedStrength))
		island.SetGrowthRemainder(remainder)
	}
	return nil
}

func (a *tickAction) Apply(g *model.Game) ([]event.Event, error) {
	if err := updateAirplanes(g, a.delta); err != nil {
		return nil, err
	}
	if err := updateIslands(g, a.delta); err != nil {
		return nil, err
	}

	tickEvent := event.NewTickEvent(g)
	return []event.Event{tickEvent}, nil
}

func NewTickAction(delta time.Duration) (*tickAction, error) {
	if delta < 0 {
		return nil, errors.New("delta must be positive")
	}
	ta := &tickAction{
		delta: delta,
	}
	return ta, nil
}
