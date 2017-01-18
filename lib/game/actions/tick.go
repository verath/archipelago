package actions

import (
	"errors"
	"github.com/verath/archipelago/lib/game/events"
	"github.com/verath/archipelago/lib/game/model"
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

func (ta *tickAction) Apply(game *model.Game) ([]events.Event, error) {
	if ta.delta < 0 {
		return nil, errors.New("delta must be positive")
	}
	if err := ta.updateAirplanes(game, ta.delta); err != nil {
		return nil, err
	}
	if err := ta.updateIslands(game, ta.delta); err != nil {
		return nil, err
	}

	if isGameOver, winner := ta.isGameOver(game); isGameOver {
		gameOverEvent := events.NewGameOverEvent(winner)
		return []events.Event{gameOverEvent}, nil
	} else {
		tickEvt, err := events.NewTickEvent(game)
		if err != nil {
			return nil, err
		}
		return []events.Event{tickEvt}, nil
	}
}

func (ta *tickAction) updateAirplanes(g *model.Game, delta time.Duration) error {
	arrivals := make([]*model.Airplane, 0)

	for _, airplane := range g.Airplanes() {
		speed := airplane.Speed()
		pos := airplane.Position()
		dir := airplane.Direction()
		// Our target is an island, look up its position
		target := g.Island(airplane.Destination()).Position().ToFloatCoordinate()

		newPos := pos
		newPos.X = pos.X + float64(delta)*speed*math.Cos(dir)
		newPos.Y = pos.Y + float64(delta)*speed*math.Sin(dir)

		// If the distance to the target increased, we have already reached it,
		// add us to arrivals.
		// TODO: This is not great hit-detection
		dist := math.Hypot(pos.X-target.X, pos.Y-target.Y)
		newDist := math.Hypot(newPos.X-target.X, newPos.Y-target.Y)
		if newDist > dist {
			arrivals = append(arrivals, airplane)
		} else {
			airplane.SetPosition(newPos)
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

func (ta *tickAction) updateIslands(g *model.Game, delta time.Duration) error {
	islandGrowthInterval := model.IslandGrowthInterval
	islandGrowthCap := model.IslandGrowthCap

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
func (ta *tickAction) isGameOver(g *model.Game) (bool, *model.Player) {
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
