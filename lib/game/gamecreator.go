package game

import (
	"math/rand"
	"time"

	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/game/model"
)

func createPlayers(numPlayers int) ([]*model.Player, *model.Player, error) {
	playerNeutral, err := model.NewPlayer()
	if err != nil {
		return nil, nil, errors.Wrap(err, "error creating playerNeutral")
	}
	players := make([]*model.Player, numPlayers)
	for i := 0; i < numPlayers; i++ {
		players[i], err = model.NewPlayer()
		if err != nil {
			return nil, nil, errors.Wrap(err, "error creating player")
		}
	}
	return players, playerNeutral, nil
}

func createIslands(players []*model.Player, playerNeutral *model.Player, size model.Coordinate, gameRand *rand.Rand) ([]*model.Island, error) {
	type islandData struct {
		Size            model.IslandSize
		Strength        int64
		Player          *model.Player
		GrowthRemainder time.Duration
	}
	islandMap := make(map[model.Coordinate]islandData)
	// Randomize the neutral islands
	neutralSizes := []model.IslandSize{model.IslandSizeTiny, model.IslandSizeSmall, model.IslandSizeMedium}
	for x := 0; x < size.X; x++ {
		for y := 0; y < size.Y; y++ {
			// 45% tiles should be islands.
			if gameRand.Intn(100) >= 45 {
				continue
			}
			pos := model.Coordinate{x, y}
			size := neutralSizes[gameRand.Intn(len(neutralSizes))]
			strength := gameRand.Int63n(int64(size*model.IslandGrowthCap)) + 10
			growthRemainder := time.Millisecond * time.Duration(gameRand.Int63n(1000))
			islandMap[pos] = islandData{size, strength, playerNeutral, growthRemainder}
		}
	}
	// Randomize player island positions.
	// TODO: Evenly distribute on board, prevent close positions.
	boardPerm := gameRand.Perm(size.X * size.Y)
	for i := range players {
		x, y := boardPerm[i]%size.X, boardPerm[i]/size.X
		pos := model.Coordinate{x, y}
		islandMap[pos] = islandData{model.IslandSizeLarge, 20, players[i], 0}
	}
	// Transform the map to a slice of islands.
	var islands []*model.Island
	for pos, data := range islandMap {
		island, err := model.NewIsland(pos, data.Size, data.Strength, data.Player)
		if err != nil {
			return nil, errors.Wrapf(err, "Error creating island (data: %v)", data)
		}
		island.SetGrowthRemainder(data.GrowthRemainder)
		islands = append(islands, island)
	}
	return islands, nil
}

// createBasicGame creates a new instance of a Game model with numPlayers
// players.
func createBasicGame(numPlayers int) (*model.Game, error) {
	size := model.Coordinate{7, 7}
	if numPlayers > 5 {
		size.X += 2
		size.Y += 2
	}
	players, playerNeutral, err := createPlayers(numPlayers)
	if err != nil {
		return nil, errors.Wrap(err, "error creating players")
	}
	seed := time.Now().UnixNano()
	gameRand := rand.New(rand.NewSource(seed))
	islands, err := createIslands(players, playerNeutral, size, gameRand)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating islands")
	}
	gameBuilder := model.NewGameBuilder(size, playerNeutral)
	for _, player := range players {
		gameBuilder.AddPlayer(player)
	}
	for _, island := range islands {
		gameBuilder.AddIsland(island)
	}
	return gameBuilder.Build()
}
