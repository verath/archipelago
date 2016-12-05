package testing

import (
	. "github.com/verath/archipelago/lib/model"
)

// Creates an empty 10x10 board
func CreateEmptyGame() *Game {
	p1, _ := NewPlayer("player1")
	p2, _ := NewPlayer("player2")
	pn, _ := NewPlayer("neutral")
	board := NewBoardBuilder().SetSize(Coordinate{10, 10}).BuildOrPanic()
	game, _ := NewGame(p1, p2, pn, board)
	return game
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
	p1Island, _ := NewIsland(p1, 10, IslandSizeMedium)
	p2Island, _ := NewIsland(p2, 10, IslandSizeMedium)
	neIsland, _ := NewIsland(pn, 10, IslandSizeMedium)

	board := NewBoardBuilder().
		SetSize(Coordinate{10, 10}).
		AddIsland(Coordinate{0, 0}, p1Island).
		AddIsland(Coordinate{9, 9}, p2Island).
		AddIsland(Coordinate{4, 4}, neIsland).
		BuildOrPanic()

	game, _ := NewGame(p1, p2, pn, board)
	return game
}
