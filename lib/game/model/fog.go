package model

// FogOfWar is the set of tiles of a game board where a player has fog of war
// applied (i.e. limited vision). It is a bitset with one bit per tile.
//
// A FogOfWar is immutable once generated, so it is safe to share, which makes
// copying a Player cheap.
type FogOfWar struct {
	size Coordinate
	// fog has bit y*size.X+x set if the tile (x, y) is in fog of war.
	fog []uint64
}

// Contains reports whether c is in fog of war. Coordinates outside the board
// are not.
func (f *FogOfWar) Contains(c Coordinate) bool {
	if !c.IsWithin(f.size) {
		return false
	}
	i := c.Y*f.size.X + c.X
	return f.fog[i/64]&(1<<(i%64)) != 0
}

// generateFogOfWar generates the FogOfWar for player in the given game g.
func generateFogOfWar(g *Game, player *Player) *FogOfWar {
	size := g.Size()
	numTiles := size.X * size.Y
	f := &FogOfWar{size: size, fog: make([]uint64, (numTiles+63)/64)}
	// Initially mark all game tiles as in FoW.
	for i := range f.fog {
		f.fog[i] = ^uint64(0)
	}
	if rem := numTiles % 64; rem != 0 {
		f.fog[len(f.fog)-1] = 1<<rem - 1
	}
	// clearArea clears FoW for tiles in a radius centered center.
	clearArea := func(center Coordinate, radius int) {
		xStart := max(center.X-radius, 0)
		xEnd := min(center.X+radius, size.X-1)
		yStart := max(center.Y-radius, 0)
		yEnd := min(center.Y+radius, size.Y-1)
		for y := yStart; y <= yEnd; y++ {
			for x := xStart; x <= xEnd; x++ {
				i := y*size.X + x
				f.fog[i/64] &^= 1 << (i % 64)
			}
		}
	}
	// Clear FoW from tiles around islands.
	for _, island := range g.Islands() {
		if island.IsOwnedBy(player.ID()) {
			if island.Size() == IslandSizeLarge {
				clearArea(island.Position(), 2)
			} else {
				clearArea(island.Position(), 1)
			}
		}
	}
	// Clear FoW from tiles around airplanes.
	for _, airplane := range g.Airplanes() {
		if airplane.IsOwnedBy(player.ID()) {
			clearArea(airplane.Position().ToCoordinate(), 1)
		}
	}
	return f
}
