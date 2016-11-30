package testing

import (
	"time"
	. "github.com/verath/archipelago/lib/model"
)

// Creates an empty 10x10 board
func CreateEmptyGame() *Game {
	p1, _ := NewPlayerWithId("player1", "1")
	p2, _ := NewPlayerWithId("player2", "2")
	board := NewBoard(Coordinate{9, 9})
	game, _ := NewGame(*p1, *p2, *board)
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
	p1Island, _ := NewIsland(p1, 10, 1.0 * time.Second)
	p2Island, _ := NewIsland(p2, 10, 1.0 * time.Second)
	neIsland, _ := NewIsland(nil, 10, 1.0 * time.Second)

	board := NewBoard(Coordinate{9, 9})
	board.AddIsland(Coordinate{0,0}, *p1Island)
	board.AddIsland(Coordinate{9,9}, *p2Island)
	board.AddIsland(Coordinate{4,4}, *neIsland)

	game, _ := NewGame(*p1, *p2, *board)
	return game
}
