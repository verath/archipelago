package game

import (
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/game/model"
	"math/rand"
	"time"
)

func createPlayers() (p1, p2, pn *model.Player, err error) {
	p1, err = model.NewPlayer()
	if err != nil {
		err = errors.Wrap(err, "Error creating p1")
		return
	}
	p2, err = model.NewPlayer()
	if err != nil {
		err = errors.Wrap(err, "Error creating p2")
		return
	}
	pn, err = model.NewPlayer()
	if err != nil {
		err = errors.Wrap(err, "Error creating pn")
		return
	}
	return
}

func createIslands(p1, p2, pn *model.Player, size model.Coordinate, gameRand *rand.Rand) ([]*model.Island, error) {
	type islandData struct {
		Size     model.IslandSize
		Strength int64
		Player   *model.Player
	}
	islandMap := make(map[model.Coordinate]islandData)

	// Randomize the neutral islands
	neutralSizes := []model.IslandSize{model.IslandSizeTiny, model.IslandSizeSmall, model.IslandSizeMedium}
	for x := 0; x < size.X; x++ {
		for y := 0; y < size.Y; y++ {
			// 25% tiles should be islands.
			if gameRand.Intn(100) >= 25 {
				continue
			}
			pos := model.Coordinate{x, y}
			size := neutralSizes[gameRand.Intn(len(neutralSizes))]
			strength := gameRand.Int63n(22) + 4 // 4-25
			islandMap[pos] = islandData{size, strength, pn}
		}
	}

	// Set top left to player 1 island, bottom right to player 2 island
	islandMap[model.Coordinate{0, 0}] = islandData{model.IslandSizeLarge, 20, p1}
	islandMap[model.Coordinate{size.X - 1, size.Y - 1}] = islandData{model.IslandSizeLarge, 20, p2}

	// Transform the map to a slice of islands
	var islands []*model.Island
	for pos, data := range islandMap {
		island, err := model.NewIsland(pos, data.Size, data.Strength, data.Player)
		if err != nil {
			return nil, errors.Wrapf(err, "Error creating island (data: %v)", data)
		}
		islands = append(islands, island)
	}
	return islands, nil
}

// createBasicGame creates a new instance of a Game model.
func createBasicGame() (*model.Game, error) {
	seed := time.Now().UnixNano()
	gameRand := rand.New(rand.NewSource(seed))

	size := model.Coordinate{7, 7}

	p1, p2, pn, err := createPlayers()
	if err != nil {
		return nil, errors.Wrap(err, "Error creating players")
	}

	islands, err := createIslands(p1, p2, pn, size, gameRand)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating islands")
	}

	gameBuilder := model.NewGameBuilder(size, p1, p2, pn)
	for _, island := range islands {
		gameBuilder.AddIsland(island)
	}
	return gameBuilder.Build()
}
