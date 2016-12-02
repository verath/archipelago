package model

import (
	"fmt"
	"time"
)

func createPlayers() (p1 *Player, p2 *Player, pn *Player, err error) {
	p1, err = NewPlayer("player1")
	if err != nil {
		err = fmt.Errorf("Error creating p1: %v", err)
	}
	p2, err = NewPlayer("player2")
	if err != nil {
		err = fmt.Errorf("Error creating p2: %v", err)
	}
	pn, err = NewPlayer("neutral")
	if err != nil {
		err = fmt.Errorf("Error creating pn: %v", err)
	}
	return
}

// TODO: this function should be moved somewhere and made configurable
func CreateBasicGame() (*Game, error) {
	p1, p2, pn, err := createPlayers()
	if err != nil {
		return nil, fmt.Errorf("Error creating players: %v", err)
	}

	p1Island := NewIsland(p1, 10, 5.0*time.Second)
	p2Island := NewIsland(p2, 10, 5.0*time.Second)
	neIsland := NewIsland(pn, 10, 5.0*time.Second)

	board := NewBoard(Coordinate{10, 10})
	board.SetIsland(Coordinate{0, 0}, p1Island)
	board.SetIsland(Coordinate{9, 9}, p2Island)
	board.SetIsland(Coordinate{4, 4}, neIsland)

	game := NewGame(p1, p2, pn, board)
	return game, nil
}
