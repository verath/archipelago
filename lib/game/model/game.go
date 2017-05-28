package model

import (
	"github.com/pkg/errors"
)

// Game represents a game instance, and acts as a container
// for other game models associated to the same game instance.
type Game struct {
	id            GameID
	size          Coordinate
	player1       *Player
	player2       *Player
	playerNeutral *Player
	islands       []*Island
	airplanes     []*Airplane
}

// ID is a getter for the id of the game.
func (g *Game) ID() GameID {
	return g.id
}

// Size is a getter for the size of the game.
func (g *Game) Size() Coordinate {
	return g.size
}

// Player1 is a getter for the Player model representing player 1.
func (g *Game) Player1() *Player {
	return g.player1
}

// Player2 is a getter for the Player model representing player 2.
func (g *Game) Player2() *Player {
	return g.player2
}

// PlayerNeutral is a getter for the Player model representing the neutral
// player.
func (g *Game) PlayerNeutral() *Player {
	return g.playerNeutral
}

// Player returns a player by PlayerID, or nil if a player with the given
// id could not be found in the game instance.
func (g *Game) Player(id PlayerID) *Player {
	if g.player1.id == id {
		return g.player1
	}
	if g.player2.id == id {
		return g.player2
	}
	if g.playerNeutral.id == id {
		return g.playerNeutral
	}
	return nil
}

// Opponent takes a player id and returns the opponent of that player. I.e.
// given the id for player1, player2 is returned. Returns nil if id is not
// associated with either player1 or player2.
func (g *Game) Opponent(id PlayerID) *Player {
	if g.player1.id == id {
		return g.player2
	}
	if g.player2.id == id {
		return g.player1
	}
	return nil
}

// Island returns an island by IslandID, or nil if an island with the given
// id could not be found in the game instance.
func (g *Game) Island(id IslandID) *Island {
	for _, island := range g.islands {
		if island.id == id {
			return island
		}
	}
	return nil
}

// Islands returns all the islands in the game instance.
func (g *Game) Islands() []*Island {
	return g.islands
}

// Airplanes returns all the airplanes in the game instance.
func (g *Game) Airplanes() []*Airplane {
	return g.airplanes
}

// AddAirplane adds an airplane to the game instance. The method
// panics if the airplane being added is nil.
func (g *Game) AddAirplane(airplane *Airplane) {
	if airplane == nil {
		panic("AddAirplane: airplane cannot be nil")
	}
	g.airplanes = append(g.airplanes, airplane)
}

// RemoveAirplane removes an airplane from the game instance. The method
// panics if the airplane being removed is nil. The method is a no-op
// if the airplane is not found in the game instance.
func (g *Game) RemoveAirplane(airplane *Airplane) {
	if airplane == nil {
		panic("RemoveAirplane: airplane cannot be nil")
	}
	airplanesLen := len(g.airplanes)
	for i := 0; i < airplanesLen; i++ {
		if g.airplanes[i] == airplane {
			g.airplanes[i] = g.airplanes[airplanesLen-1]
			g.airplanes[airplanesLen-1] = nil
			g.airplanes = g.airplanes[:airplanesLen-1]
			break
		}
	}
}

// Copy performs a deep copy of the game, returning the copy.
func (g *Game) Copy() *Game {
	airplanesCopy := make([]*Airplane, len(g.airplanes))
	for i, airplane := range g.airplanes {
		airplanesCopy[i] = airplane.Copy()
	}
	islandsCopy := make([]*Island, len(g.islands))
	for i, island := range g.islands {
		islandsCopy[i] = island.Copy()
	}
	return &Game{
		id:            g.id,
		size:          g.size,
		player1:       g.player1.Copy(),
		player2:       g.player2.Copy(),
		playerNeutral: g.playerNeutral.Copy(),
		islands:       islandsCopy,
		airplanes:     airplanesCopy,
	}
}

// newGame constructs a new game from the given parameters. Use GameBuilder to
// perform validation on the parameters before creation.
func newGame(size Coordinate, player1, player2, playerNeutral *Player, islands []*Island, airplanes []*Airplane) (*Game, error) {
	id := GameID(NextModelID())
	return &Game{
		id:            id,
		size:          size,
		player1:       player1,
		player2:       player2,
		playerNeutral: playerNeutral,
		islands:       islands,
		airplanes:     airplanes,
	}, nil
}

// GameBuilder implements a builder patter for creating a new Game instance.
type GameBuilder struct {
	size          Coordinate
	player1       *Player
	player2       *Player
	playerNeutral *Player
	islands       []*Island
	airplanes     []*Airplane
}

// NewGameBuilder creates a new GameBuilder with initial values.
func NewGameBuilder(size Coordinate, player1, player2, playerNeutral *Player) *GameBuilder {
	return &GameBuilder{
		size:          size,
		player1:       player1,
		player2:       player2,
		playerNeutral: playerNeutral,
		islands:       make([]*Island, 0),
		airplanes:     make([]*Airplane, 0),
	}
}

// AddIsland adds an island to GameBuilder, to be later included in the game.
func (gb *GameBuilder) AddIsland(island *Island) *GameBuilder {
	gb.islands = append(gb.islands, island)
	return gb
}

// Build creates a game from the GameBuilder parameters, first validating
// that the provided parameters are valid.
func (gb *GameBuilder) Build() (*Game, error) {
	if gb.size.X <= 0 || gb.size.Y <= 0 {
		return nil, errors.New("Size must be >= (1,1)")
	}
	if gb.player1 == nil {
		return nil, errors.New("player1 cannot be nil")
	}
	if gb.player2 == nil {
		return nil, errors.New("player2 cannot be nil")
	}
	if gb.playerNeutral == nil {
		return nil, errors.New("playerNeutral cannot be nil")
	}
	// Make sure all islands are within the allowed bounds, and that
	// no islands has the same location
	for i, island := range gb.islands {
		if !island.position.IsWithin(gb.size) {
			return nil, errors.Errorf("Island out of bounds (coord: %v; size: %v)",
				island.position, gb.size)
		}

		for j, other := range gb.islands {
			if i != j && island.position == other.position {
				return nil, errors.Errorf("Islands has same position (coord: %v)",
					island.position)
			}
		}
	}
	return newGame(gb.size, gb.player1, gb.player2, gb.playerNeutral, gb.islands, gb.airplanes)
}

// BuildOrPanic calls Build and panics if Build returns an error.
func (gb *GameBuilder) BuildOrPanic() *Game {
	game, err := gb.Build()
	if err != nil {
		panic(err)
	}
	return game
}
