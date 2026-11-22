package game

import (
	"cmp"
	"math/rand"
	"slices"
	"time"

	"github.com/verath/archipelago/lib/game/model"
)

func createPlayers(numPlayers int) ([]*model.Player, *model.Player) {
	playerNeutral := model.NewPlayer()
	players := make([]*model.Player, numPlayers)
	for i := 0; i < numPlayers; i++ {
		players[i] = model.NewPlayer()
	}
	return players, playerNeutral
}

func createIslands(players []*model.Player, playerNeutral *model.Player, size model.Coordinate, rules model.Rules, gameRand *rand.Rand) []*model.Island {
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
			pos := model.Coordinate{X: x, Y: y}
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
		pos := model.Coordinate{X: x, Y: y}
		islandMap[pos] = islandData{model.IslandSizeLarge, 20, players[i], 0}
	}
	// Transform the map to a slice of islands. The islands are sorted by
	// position, so that a seed always gives the same game.
	positions := make([]model.Coordinate, 0, len(islandMap))
	for pos := range islandMap {
		positions = append(positions, pos)
	}
	slices.SortFunc(positions, func(a, b model.Coordinate) int {
		return cmp.Or(cmp.Compare(a.Y, b.Y), cmp.Compare(a.X, b.X))
	})
	var islands []*model.Island
	for _, pos := range positions {
		data := islandMap[pos]
		island := model.NewIsland(pos, data.Size, data.Strength, data.Player.ID())
		island.SetGrowthRemainder(data.GrowthRemainder)
		if data.Player != playerNeutral {
			island.SetGarrison(rules.StartGarrison)
			island.SetShieldUntil(rules.Shield)
		}
		islands = append(islands, island)
	}
	return islands
}

// createBasicGame creates a new instance of a Game model with numPlayers
// players, using the standard rules and a random map.
func createBasicGame(numPlayers int) (*model.Game, error) {
	return CreateGame(numPlayers, time.Now().UnixNano(), model.Rules{})
}

// CreateGame creates a new instance of a Game model with numPlayers players
// and the given rules. The map is generated from seed, so the same seed and
// number of players always give the same map.
func CreateGame(numPlayers int, seed int64, rules model.Rules) (*model.Game, error) {
	size := model.Coordinate{X: 8, Y: 8}
	if numPlayers > 5 {
		size.X += 2
		size.Y += 2
	}
	players, playerNeutral := createPlayers(numPlayers)
	gameRand := rand.New(rand.NewSource(seed))
	islands := createIslands(players, playerNeutral, size, rules, gameRand)
	gameBuilder := model.NewGameBuilder(size, playerNeutral).SetRules(rules)
	for _, player := range players {
		gameBuilder.AddPlayer(player)
	}
	for _, island := range islands {
		gameBuilder.AddIsland(island)
	}
	return gameBuilder.Build()
}
