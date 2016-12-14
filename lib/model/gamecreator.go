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

func createIslands(p1, p2, pn *Player) ([]*Island, error) {
	islandData := []struct {
		Pos      Coordinate
		Size     IslandSize
		Strength int
		Player   *Player
	}{
		{Coordinate{0, 0}, IslandSizeMedium, 10, p1},
		{Coordinate{6, 6}, IslandSizeMedium, 10, p2},
		{Coordinate{4, 4}, IslandSizeMedium, 10, pn},
		{Coordinate{6, 2}, IslandSizeMedium, 10, pn},
		{Coordinate{2, 6}, IslandSizeMedium, 10, pn},
		{Coordinate{0, 3}, IslandSizeMedium, 10, pn},
		{Coordinate{3, 0}, IslandSizeMedium, 10, pn},
	}

	islands := make([]*Island, 0)
	for _, data := range islandData {
		island, err := NewIsland(data.Pos, data.Size, data.Strength, data.Player)
		if err != nil {
			return nil, fmt.Errorf("Error creating island (data: %v): %v", data, err)
		}
		islands = append(islands, island)
	}
	return islands, nil
}

// TODO: this function should be moved somewhere and made configurable
func CreateBasicGame() (*Game, error) {
	p1, p2, pn, err := createPlayers()
	if err != nil {
		return nil, fmt.Errorf("Error creating players: %v", err)
	}

	islands, err := createIslands(p1, p2, pn)
	if err != nil {
		return nil, fmt.Errorf("Error creating islands: %v", err)
	}

	gameBuilder := NewGameBuilder(Coordinate{7, 7}, p1, p2, pn)
	for _, island := range islands {
		gameBuilder.AddIsland(island)
	}
	return gameBuilder.Build()
}
