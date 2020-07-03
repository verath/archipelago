package model

// generateFogOfWar generates a set of Coordinates where player has fog of war
// applied (i.e. limited vision) in the given game g.
func generateFogOfWar(g *Game, player *Player) map[Coordinate]struct{} {
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
	fogOfWar := make(map[Coordinate]struct{})
	for coordinate, isFog := range fogOfWarTiles {
		if isFog {
			fogOfWar[coordinate] = struct{}{}
		}
	}
	return fogOfWar
}
