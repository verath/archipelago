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
func (at *ActionTick) Apply(game *Game) ([]Event, error) {
	if at.Delta < 0 {
		return nil, errors.New("Delta must be positive")
	}
	at.updateAirplanes(game, at.Delta)
	at.updateIslands(game, at.Delta)
	at.updateFogOfWar(game, at.Delta)
	tickEvt := &EventTick{Game: game.Copy()}
	return []Event{tickEvt}, nil
}

func (*ActionTick) updateAirplanes(g *Game, delta time.Duration) {
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
}

func (*ActionTick) updateIslands(g *Game, delta time.Duration) {
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
}

func (*ActionTick) generateFogOfWar(g *Game, player *Player) map[Coordinate]struct{} {
	fogOfWarTiles := make(map[Coordinate]bool, g.Size().X*g.Size().Y)
	// clearArea clears FoW for tiles in a radius centered center.
	clearArea := func(center Coordinate, radius int) {
		xStart := center.X - radius
		xEnd := center.X + radius
		yStart := center.Y - radius
		yEnd := center.Y + radius
		for x := xStart; x <= xEnd; x++ {
			for y := yStart; y <= yEnd; y++ {
				c := Coordinate{X: x, Y: y}
				if _, ok := fogOfWarTiles[c]; ok {
					fogOfWarTiles[c] = false
				}
			}
		}
	}
	// Initially mark all game tiles as in FoW.
	for x := 0; x < g.Size().X; x++ {
		for y := 0; y < g.Size().Y; y++ {
			fogOfWarTiles[Coordinate{X: x, Y: y}] = true
		}
	}
	// Clear FoW from tiles around islands.
	for _, island := range g.Islands() {
		if island.IsOwnedBy(player) {
			if island.Size() == IslandSizeLarge {
				clearArea(island.Position(), 2)
			} else {
				clearArea(island.Position(), 1)
			}
		}
	}
	// Clear FoW from tiles around airplanes.
	for _, airplane := range g.Airplanes() {
		if airplane.IsOwnedBy(player) {
			clearArea(airplane.Position().ToCoordinate(), 1)
		}
	}
	// Translate tile map to set of unique coordinates.
	fogOfWar := make(map[Coordinate]struct{}, 0)
	for coordinate, isFog := range fogOfWarTiles {
		if isFog {
			fogOfWar[coordinate] = struct{}{}
		}
	}
	return fogOfWar
}

func (at *ActionTick) updateFogOfWar(g *Game, delta time.Duration) {
	for _, player := range g.Players() {
		var playerFogOfWar map[Coordinate]struct{}
		if player.IsAlive() {
			playerFogOfWar = at.generateFogOfWar(g, player)
		}
		player.SetFogOfWar(playerFogOfWar)
	}
}
