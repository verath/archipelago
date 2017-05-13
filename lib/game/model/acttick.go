package model

import (
	"github.com/pkg/errors"
	"math"
	"time"
)

type tickAction struct {
	delta time.Duration
}

func NewTickAction(delta time.Duration) (*tickAction, error) {
	ta := &tickAction{
		delta: delta,
	}
	return ta, nil
}

func (ta *tickAction) Apply(game *Game) ([]Event, error) {
	if ta.delta < 0 {
		return nil, errors.New("Delta must be positive")
	}
	if err := ta.updateAirplanes(game, ta.delta); err != nil {
		return nil, errors.Wrap(err, "Could not update airplanes")
	}
	if err := ta.updateIslands(game, ta.delta); err != nil {
		return nil, errors.Wrap(err, "Could not update islands")
	}

	if isGameOver, winner := ta.isGameOver(game); isGameOver {
		gameOverEvent := NewGameOverEvent(winner)
		return []Event{gameOverEvent}, nil
	}

	tickEvt, err := NewTickEvent(game)
	if err != nil {
		return nil, errors.Wrap(err, "Could not create tick event")
	}
	return []Event{tickEvt}, nil

}

func (ta *tickAction) updateAirplanes(g *Game, delta time.Duration) error {
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

func (ta *tickAction) updateIslands(g *Game, delta time.Duration) error {
	islandGrowthInterval := IslandGrowthInterval
	islandGrowthCap := IslandGrowthCap

	for _, island := range g.Islands() {
		if island.Owner().Equals(g.PlayerNeutral()) {
			// Neutral islands does not grow in strength
			continue
		}

		size := island.Size()
		if float64(island.Strength()) >= (islandGrowthCap * size) {
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
		addedStrength := (remainder + increment) / islandGrowthInterval
		remainder = (remainder + increment) % islandGrowthInterval
		newStrength := island.Strength() + int64(addedStrength)

		island.SetStrength(newStrength)
		island.SetGrowthRemainder(remainder)
	}
	return nil
}

// Checks if the current game is over. A game is over when a player
// no longer controls any islands or airplanes. If the game is over,
// the winner is also returned. For a tie, the returned player is nil.
func (ta *tickAction) isGameOver(g *Game) (bool, *Player) {
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
