package model

import (
	"github.com/pkg/errors"
	"math"
	"time"
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
	if gameOver, winner := ta.isGameOver(game); gameOver {
		return []Event{NewEventGameOver(winner)}, nil
	}
	return []Event{NewEventTick(game)}, nil
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
				target.SetStrength(airplaneStr - targetStr)
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
		if island.Owner().Equals(g.PlayerNeutral()) {
			// Neutral islands does not grow in strength
			continue
		}
		size := island.Size()
		if float64(island.Strength()) >= (IslandGrowthCap * size) {
			continue
		}
		// Account for the island size. We do this by scaling the
		// time delta by the size factor of the island. I.e. a size
		// factor of 0.5 means the "time will move" at half the pace
		// for that island.
		increment := time.Duration(size * float64(delta))
		// Calculate the whole number of added strength, storing
		// the remaining "fractions" as the growth remainder. Note
		// that we are doing calculations on time.Duration(=int64)
		// here, but the reasoning stays the same.
		remainder := island.GrowthRemainder()
		addedStrength := (remainder + increment) / IslandGrowthInterval
		remainder = (remainder + increment) % IslandGrowthInterval
		newStrength := island.Strength() + int64(addedStrength)
		island.SetStrength(newStrength)
		island.SetGrowthRemainder(remainder)
	}
	return nil
}

// isGameOver checks if the current game is over. A game is over when a
// player no longer controls any islands or airplanes. If the game is over,
// the winner is also returned. For a tie, the returned player is nil.
func (ta *ActionTick) isGameOver(g *Game) (gameOver bool, winner *Player) {
	player1Alive := false
	player2Alive := false
	for _, airplane := range g.Airplanes() {
		if airplane.Owner().Equals(g.Player1()) {
			player1Alive = true
		} else if airplane.Owner().Equals(g.Player2()) {
			player2Alive = true
		}
		if player1Alive && player2Alive {
			return false, nil
		}
	}
	for _, island := range g.Islands() {
		if island.Owner().Equals(g.Player1()) {
			player1Alive = true
		} else if island.Owner().Equals(g.Player2()) {
			player2Alive = true
		}
		if player1Alive && player2Alive {
			return false, nil
		}
	}
	if player1Alive {
		return true, g.Player1()
	} else if player2Alive {
		return true, g.Player2()
	} else {
		return true, nil
	}
}
