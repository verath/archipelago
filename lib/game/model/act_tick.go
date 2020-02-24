package model

import (
	"math"
	"time"

	"github.com/pkg/errors"
)

// ActionTick is an action that performs a tick (i.e. update)
// on the game instance.
type ActionTick struct {
	// Delta is the size of the time step that should be applied
	// to the game. Delta must be >= 0.
	Delta time.Duration
}

// Apply applies the ActionTick to the game instance.
func (ta *ActionTick) Apply(game *Game) ([]Event, error) {
	if ta.Delta < 0 {
		return nil, errors.New("Delta must be positive")
	}
	if err := ta.updateAirplanes(game, ta.Delta); err != nil {
		return nil, errors.Wrap(err, "Could not update airplanes")
	}
	if err := ta.updateIslands(game, ta.Delta); err != nil {
		return nil, errors.Wrap(err, "Could not update islands")
	}
	tickEvt := &EventTick{Game: game.Copy()}
	return []Event{tickEvt}, nil
}

func (ta *ActionTick) updateAirplanes(g *Game, delta time.Duration) error {
	var arrivals []*Airplane
	for _, airplane := range g.Airplanes() {
		speed := airplane.Speed()
		pos := airplane.Position()
		dir := airplane.Direction()
		// Our target is an island, look up its position
		target := g.Island(airplane.Destination()).Position().ToFloatCoordinate()
		dist := math.Hypot(pos.X-target.X, pos.Y-target.Y)
		movement := speed * float64(delta)

		// Check if we reached the destination. We add a small fraction to the
		// distance travelled this tick to account for rounding errors
		// TODO(2017-03-26): Is increasing this for rounding errors necessary?
		if dist <= movement*1.001 {
			arrivals = append(arrivals, airplane)
		} else {
			pos.X += movement * math.Cos(dir)
			pos.Y += movement * math.Sin(dir)
			airplane.SetPosition(pos)
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
				target.SetStrength(airplaneStr - targetStr + 1)
				target.SetGrowthRemainder(0)
				target.SetOwner(airplane.Owner())
			} else {
				// If they are equal, the owner is set to the neutral player
				target.SetStrength(0)
				target.SetGrowthRemainder(0)
				target.SetOwner(g.PlayerNeutral())
			}
		}

		g.RemoveAirplane(airplane)
	}
	return nil
}

func (ta *ActionTick) updateIslands(g *Game, delta time.Duration) error {
	for _, island := range g.Islands() {
		size := float64(island.Size())
		// Determine change for delta, based on island size.
		var change time.Duration
		if island.Owner().Equals(g.PlayerNeutral()) {
			// Armies on neutral islands decrease over time, scaled inversely
			// by island size.
			change = -1 * time.Duration((1-size)*float64(delta))
		} else {
			// Armies on player controller islands increase over time, scaled
			// by islands size.
			change = time.Duration(size * float64(delta))
		}
		// Calculate the whole number of added strength, storing the remaining
		// "fractions" as the growth remainder.
		remainder := island.GrowthRemainder()
		addedStrength := (remainder + change) / IslandGrowthInterval
		newRemainder := (remainder + change) % IslandGrowthInterval
		newStrength := island.Strength() + int64(addedStrength)
		// Limit incremented strength to IslandGrowthCap, decremented to 0.
		newStrengthOk := false
		if change > 0 {
			newStrengthOk = float64(newStrength) < IslandGrowthCap*size
		} else if change < 0 {
			newStrengthOk = newStrength >= 0
		}
		if newStrengthOk {
			island.SetStrength(newStrength)
		}
		island.SetGrowthRemainder(newRemainder)
	}
	return nil
}
