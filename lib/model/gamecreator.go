package model

import (
	"fmt"
)

func createPlayers() (p1, p2, pn *Player, err error) {
	p1, err = NewPlayer("player1")
	if err != nil {
		err = fmt.Errorf("Error creating p1: %v", err)
		return
	}
	p2, err = NewPlayer("player2")
	if err != nil {
		err = fmt.Errorf("Error creating p2: %v", err)
		return
	}
	pn, err = NewPlayer("neutral")
	if err != nil {
		err = fmt.Errorf("Error creating pn: %v", err)
		return
	}
	return
}

func createIslands(p1, p2, pn *Player) (p1Island, p2Island, neIsland *Island, err error) {
	p1Island, err = NewIsland(p1, 10, IslandSizeMedium)
	if err != nil {
		err = fmt.Errorf("Error creating p1Island: %v", err)
		return
	}
	p2Island, err = NewIsland(p2, 10, IslandSizeMedium)
	if err != nil {
		err = fmt.Errorf("Error creating p2Island: %v", err)
		return
	}
	neIsland, err = NewIsland(pn, 10, IslandSizeMedium)
	if err != nil {
		err = fmt.Errorf("Error creating neIsland: %v", err)
		return
	}
	return
}

// TODO: this function should be moved somewhere and made configurable
func CreateBasicGame() (*Game, error) {
	p1, p2, pn, err := createPlayers()
	if err != nil {
		return nil, fmt.Errorf("Error creating players: %v", err)
	}

	p1Island, p2Island, neIsland, err := createIslands(p1, p2, pn)
	if err != nil {
		return nil, fmt.Errorf("Error creating islands: %v", err)
	}

	board := NewBoard(Coordinate{10, 10})
	board.SetIsland(Coordinate{0, 0}, p1Island)
	board.SetIsland(Coordinate{9, 9}, p2Island)
	board.SetIsland(Coordinate{4, 4}, neIsland)

	return NewGame(p1, p2, pn, board)
}
