package ai

import (
	"errors"
	"math"
	"math/rand"

	"github.com/verath/archipelago/lib/game/model"
)

// A strategy is an "AI" strategy, or behavior. It controlls how the ai should
// act.
type strategy interface {
	// NextAction returns the next action to be performed, given the current
	// ai client state and game.
	// The returned action may be nil, to indicate that the strategy could not
	// determine a next action.
	NextAction(state clientState, game *model.Game) (model.PlayerAction, error)
}

// StrategyCreatorFunc is a function that returns an AI strategy, hiding the
// strategy interface.
type StrategyCreatorFunc func() (strategy, error)

// RandomStrategy launches airplanes at (mostly) random.
func RandomStrategy(minOriginStrength int64) StrategyCreatorFunc {
	return func() (strategy, error) {
		return newRandomStrategy(minOriginStrength)
	}
}

// OpportunisticStrategy tries to launch airplanes only to islands that it can
// conquer.
func OpportunisticStrategy() StrategyCreatorFunc {
	return func() (strategy, error) {
		return newOpportunisticStrategy()
	}
}

type randomStrategy struct {
	minOriginStrength int64
}

func newRandomStrategy(minOriginStrength int64) (*randomStrategy, error) {
	if minOriginStrength < 2 {
		return nil, errors.New("minOriginStrength must be >= 2")
	}
	return &randomStrategy{
		minOriginStrength: minOriginStrength,
	}, nil
}

func (s *randomStrategy) NextAction(state clientState, game *model.Game) (model.PlayerAction, error) {
	myPlayer := game.Player(state.myPlayerID)
	if myPlayer == nil {
		return nil, errors.New("myPlayer not found in game")
	}
	// Select random owned island with at least minOriginStrength.
	myIslands := filterIslands(game.Islands(), func(island *model.Island) bool {
		return island.IsOwnedBy(myPlayer) && island.Strength() >= s.minOriginStrength
	})
	if len(myIslands) == 0 {
		return nil, nil
	}
	originIsland := myIslands[rand.Intn(len(myIslands))]
	// Select random target island.
	otherIslands := islandsNotOwnedBy(game, myPlayer)
	if len(otherIslands) == 0 {
		return nil, nil
	}
	targetIsland := otherIslands[rand.Intn(len(otherIslands))]
	// Create the action.
	act := &model.PlayerActionLaunch{
		From: originIsland.ID(),
		To:   targetIsland.ID(),
	}
	return act, nil
}

type opportunisticStrategy struct {
	// failed is a counter for the number of consecutive time the strategy
	// failed to take action.
	failed int64
}

func newOpportunisticStrategy() (*opportunisticStrategy, error) {
	return &opportunisticStrategy{}, nil
}

func (s *opportunisticStrategy) NextAction(state clientState, game *model.Game) (act model.PlayerAction, err error) {
	myPlayer := game.Player(state.myPlayerID)
	if myPlayer == nil {
		return nil, errors.New("myPlayer not found in game")
	}

	// Select one of our islands.
	myIslands := filterIslands(game.Islands(), func(island *model.Island) bool {
		return island.IsOwnedBy(myPlayer) && island.Strength() >= 2
	})
	ownedRatio := float64(len(myIslands)) / float64(len(game.Islands()))
	if len(myIslands) == 0 {
		s.failed = 0
		return nil, nil
	}
	originIsland := myIslands[rand.Intn(len(myIslands))]

	// Target any other island "weaker" than this island.
	weakerIslands := filterIslands(game.Islands(), func(island *model.Island) bool {
		if island.ID() == originIsland.ID() {
			return false
		}
		islandStrength := island.Strength()
		// Island is in FoW, make a guess about its strength.
		if islandStrength < 0 {
			islandStrength = int64(40 * float64(island.Size()))
		}
		// Cap perceived island strength at the growth cap, otherwise we would
		// never attack a very large island.
		if islandStrength > model.IslandGrowthCap {
			islandStrength = model.IslandGrowthCap
		}
		// Punish by owner.
		if island.IsOwnedBy(game.PlayerNeutral()) {
			// Punish attacking neutral islands.
			islandStrength *= 2
		} else if island.IsOwnedBy(myPlayer) {
			// Punish reinforcing own islands.
			islandStrength *= 4
		}
		// Punish distance.
		distX := originIsland.Position().X - island.Position().X
		distY := originIsland.Position().Y - island.Position().Y
		islandStrength += int64(math.Hypot(float64(distX), float64(distY))+0.5) * 2
		// Reward any action if we are being passive, especially if controlling
		// many islands.
		islandStrength -= int64(float64(s.failed) * ownedRatio * 2)
		return islandStrength < originIsland.Strength()
	})
	if len(weakerIslands) == 0 {
		// Keep count of how many times we fail to perform an action.
		s.failed++
		return nil, nil
	}
	s.failed = 0
	targetIsland := weakerIslands[rand.Intn(len(weakerIslands))]

	// Create the action.
	act = &model.PlayerActionLaunch{
		From: originIsland.ID(),
		To:   targetIsland.ID(),
	}
	return act, nil
}

func filterIslands(islands []*model.Island, pred func(*model.Island) bool) []*model.Island {
	filteredIslands := make([]*model.Island, 0)
	for _, island := range islands {
		if pred(island) {
			filteredIslands = append(filteredIslands, island)
		}
	}
	return filteredIslands
}

func islandsNotOwnedBy(game *model.Game, player *model.Player) []*model.Island {
	return filterIslands(game.Islands(), func(island *model.Island) bool {
		return !island.IsOwnedBy(player)
	})
}
