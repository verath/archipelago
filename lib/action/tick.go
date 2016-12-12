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
		// Our target is an island, look up its position
		dest := g.Island(airplane.Destination()).Position().ToFloatCoordinate()

		thrust := speed * float64(delta)
		dx := dest.X - pos.X
		dy := dest.Y - pos.Y
		dist := math.Sqrt(dx*dx + dy*dy)

		moveX := thrust * (dx / dist)
		moveY := thrust * (dy / dist)

		pos.X += moveX
		pos.Y += moveY
		airplane.SetPosition(pos)
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

func (ta *tickAction) Apply(game *model.Game) ([]event.EventBuilder, error) {
	if ta.delta < 0 {
		return nil, errors.New("delta must be positive")
	}
	if err := updateAirplanes(game, ta.delta); err != nil {
		return nil, err
	}
	if err := updateIslands(game, ta.delta); err != nil {
		return nil, err
	}

	tickEvtBuilder := event.NewTickEventBuilder(game)
	return []event.EventBuilder{tickEvtBuilder}, nil
}

func NewTickAction(delta time.Duration) (*tickAction, error) {
	ta := &tickAction{
		delta: delta,
	}
	return ta, nil
}
