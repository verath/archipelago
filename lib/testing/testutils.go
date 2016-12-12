package testing

import (
	. "github.com/verath/archipelago/lib/model"
)

// Creates an empty 10x10 board
func CreateEmptyGame() *Game {
	p1, _ := NewPlayer("player1")
	p2, _ := NewPlayer("player2")
	pn, _ := NewPlayer("neutral")
	return NewGameBuilder(Coordinate{10, 10}, p1, p2, pn).BuildOrPanic()
}

// Creates a 10x10 board with 3 island:
//  * (0,0) - player 1 island
//  * (9,9) - player 2 island
//  * (4,4) - neutral island
// All starting with a strength of 10 and a growth
// interval of 1/second
func CreateSimpleGame() *Game {
	p1, _ := NewPlayer("player1")
	p2, _ := NewPlayer("player2")
	pn, _ := NewPlayer("neutral")
	p1Island, _ := NewIslandWithID(Identifier("p1"), Coordinate{0, 0}, IslandSizeMedium, p1, 10)
	p2Island, _ := NewIslandWithID(Identifier("p2"), Coordinate{9, 9}, IslandSizeMedium, p2, 10)
	neIsland, _ := NewIslandWithID(Identifier("pn"), Coordinate{4, 4}, IslandSizeMedium, pn, 10)
	ne2Island, _ := NewIslandWithID(Identifier("bottom-left"), Coordinate{0, 9}, IslandSizeMedium, pn, 10)

	return NewGameBuilder(Coordinate{10, 10}, p1, p2, pn).
		AddIsland(p1Island).
		AddIsland(p2Island).
		AddIsland(neIsland).
		AddIsland(ne2Island).
		BuildOrPanic()
}
