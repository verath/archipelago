package testing

import (
	. "github.com/verath/archipelago/lib/model"
	"math"
)

// Creates an empty 9x9 board
func CreateEmptyGame() *Game {
	p1, _ := NewPlayer()
	p2, _ := NewPlayer()
	pn, _ := NewPlayer()
	return NewGameBuilder(Coordinate{9, 9}, p1, p2, pn).BuildOrPanic()
}

// Creates a 9x9 board with 3 island:
//  * (0,0) - player 1 island
//  * (8,8) - player 2 island
//  * (4,4) - neutral island
// All starting with a strength of 10 and a growth
// interval of 1/second
func CreateSimpleGame() *Game {
	p1, _ := NewPlayer()
	p2, _ := NewPlayer()
	pn, _ := NewPlayer()
	p1Island, _ := NewIslandWithID(IslandID("p1"), Coordinate{0, 0}, IslandSizeMedium, 10, p1)
	p2Island, _ := NewIslandWithID(IslandID("p2"), Coordinate{8, 8}, IslandSizeMedium, 10, p2)
	neIsland, _ := NewIslandWithID(IslandID("pn"), Coordinate{4, 4}, IslandSizeMedium, 10, pn)
	ne2Island, _ := NewIslandWithID(IslandID("bottom-left"), Coordinate{0, 8}, IslandSizeMedium, 10, pn)

	return NewGameBuilder(Coordinate{9, 9}, p1, p2, pn).
		AddIsland(p1Island).
		AddIsland(p2Island).
		AddIsland(neIsland).
		AddIsland(ne2Island).
		BuildOrPanic()
}

func CoordsWithin(c1, c2 FloatCoordinate, epsilon float64) bool {
	return math.Hypot(c1.X-c2.X, c1.Y-c2.Y) < epsilon
}

// Helper for testing if two float coordinates are almost the same
func CoordsAlmostEqual(c1, c2 FloatCoordinate) bool {
	return CoordsWithin(c1, c2, 0.001)
}
