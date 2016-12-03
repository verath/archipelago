package testing

import (
	. "github.com/verath/archipelago/lib/model"
)

// Creates an empty 10x10 board
func CreateEmptyGame() *Game {
	p1, _ := NewPlayerWithId("player1", "1")
	p2, _ := NewPlayerWithId("player2", "2")
	pn, _ := NewPlayerWithId("neutral", "-1")
	board := NewBoard(Coordinate{10, 10})
	game := NewGame(p1, p2, pn, board)
	return game
}

// Creates a 10x10 board with 3 island:
//  * (0,0) - player 1 island
//  * (9,9) - player 2 island
//  * (4,4) - neutral island
// All starting with a strength of 10 and a growth
// interval of 1/second
func CreateSimpleGame() *Game {
	p1, _ := NewPlayerWithId("player1", "1")
	p2, _ := NewPlayerWithId("player2", "2")
	pn, _ := NewPlayerWithId("neutral", "-1")
	p1Island := NewIsland(p1, 10, IslandSizeMedium)
	p2Island := NewIsland(p2, 10, IslandSizeMedium)
	neIsland := NewIsland(pn, 10, IslandSizeMedium)

	board := NewBoard(Coordinate{10, 10})
	board.SetIsland(Coordinate{0, 0}, p1Island)
	board.SetIsland(Coordinate{9, 9}, p2Island)
	board.SetIsland(Coordinate{4, 4}, neIsland)

	game := NewGame(p1, p2, pn, board)
	return game
}
