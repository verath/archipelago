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
	arrivals := make([]*model.Airplane, 0)

	for _, airplane := range g.Airplanes() {
		speed := airplane.Speed()
		pos := airplane.Position()
		dir := airplane.Direction()
		// Our target is an island, look up its position
		dest := g.Island(airplane.Destination()).Position().ToFloatCoordinate()

		// Update the position
		pos.X += float64(delta) * speed * math.Cos(dir)
		pos.Y += float64(delta) * speed * math.Sin(dir)
		airplane.SetPosition(pos)

		// Re-calculate the direction. We do this to detect if we have
		// passed our target (=reached the island), and also to correct
		// any rounding errors
		newDir := math.Atan2(dest.Y-pos.Y, dest.X-pos.X)
		if math.Signbit(newDir) != math.Signbit(dir) {
			arrivals = append(arrivals, airplane)
		} else {
			airplane.SetDirection(dir)
		}
	}

	// Handle arrivals
	for _, airplane := range arrivals {
		target := g.Island(airplane.Destination())
		airplaneStr := airplane.Strength()
		targetStr := target.Strength()

		if target.IsOwnedBy(airplane.Owner()) {
			target.SetStrength(targetStr + airplaneStr)
		} else {
			if targetStr > airplaneStr {
				// If island str is greater, the the island remains
				// controlled by its previous owner
				target.SetStrength(targetStr - airplaneStr)
			} else if airplaneStr > targetStr {
				// If the airplane str is greater, then the airplane
				// owner takes control of the island
				target.SetStrength(airplaneStr - targetStr)
				target.SetOwner(airplane.Owner())
			} else {
				// If they are equal, the owner is set to the neutral player
				target.SetStrength(0)
				target.SetOwner(g.PlayerNeutral())
			}
		}

		g.RemoveAirplane(airplane)
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
