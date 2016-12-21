package model

import (
	"fmt"
	"math/rand"
	"time"
)

func createPlayers() (p1, p2, pn *Player, err error) {
	p1, err = NewPlayer()
	if err != nil {
		err = fmt.Errorf("Error creating p1: %v", err)
		return
	}
	p2, err = NewPlayer()
	if err != nil {
		err = fmt.Errorf("Error creating p2: %v", err)
		return
	}
	pn, err = NewPlayer()
	if err != nil {
		err = fmt.Errorf("Error creating pn: %v", err)
		return
	}
	return
}

func createIslands(p1, p2, pn *Player, size Coordinate, gameRand *rand.Rand) ([]*Island, error) {
	type islandData struct {
		Size     IslandSize
		Strength int64
		Player   *Player
	}
	islandMap := make(map[Coordinate]islandData)

	// Randomize the neutral islands
	neutralSizes := []IslandSize{IslandSizeTiny, IslandSizeSmall, IslandSizeMedium}
	for x := 0; x < size.X; x++ {
		for y := 0; y < size.Y; y++ {
			if gameRand.Intn(100) >= 20 {
				continue
			}
			pos := Coordinate{x, y}
			size := neutralSizes[gameRand.Intn(len(neutralSizes))]
			strength := gameRand.Int63n(22) + 4 // 4-25
			islandMap[pos] = islandData{size, strength, pn}
		}
	}

	// Set top left to player 1 island, bottom right to player 2 island
	islandMap[Coordinate{0, 0}] = islandData{IslandSizeLarge, 20, p1}
	islandMap[Coordinate{size.X - 1, size.Y - 1}] = islandData{IslandSizeLarge, 20, p2}

	// Transform the map to a slice of islands
	islands := make([]*Island, 0)
	for pos, data := range islandMap {
		island, err := NewIsland(pos, data.Size, data.Strength, data.Player)
		if err != nil {
			return nil, fmt.Errorf("Error creating island (data: %v): %v", data, err)
		}
		islands = append(islands, island)
	}
	return islands, nil
}

func CreateBasicGame() (*Game, error) {
	seed := time.Now().UnixNano()
	gameRand := rand.New(rand.NewSource(seed))

	size := Coordinate{7, 7}

	p1, p2, pn, err := createPlayers()
	if err != nil {
		return nil, fmt.Errorf("Error creating players: %v", err)
	}

	islands, err := createIslands(p1, p2, pn, size, gameRand)
	if err != nil {
		return nil, fmt.Errorf("Error creating islands: %v", err)
	}

	gameBuilder := NewGameBuilder(size, p1, p2, pn)
	for _, island := range islands {
		gameBuilder.AddIsland(island)
	}
	return gameBuilder.Build()
}
