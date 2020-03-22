package model

import (
	"github.com/pkg/errors"
)

// Game represents a game instance, and acts as a container
// for other game models associated to the same game instance.
type Game struct {
	id   GameID
	size Coordinate

	reviveCount int

	// playerNeutral is a special Player that owns everything not
	// owned by any other Player.
	playerNeutral *Player
	players       []*Player
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

// ReviveCount returns how many times players have been revived this game.
func (g *Game) ReviveCount() int {
	return g.reviveCount
}

// SetReviveCount sets how many times players have been revivied this game.
func (g *Game) SetReviveCount(reviveCount int) {
	g.reviveCount = reviveCount
}

// PlayerNeutral is a getter for the Player model representing the neutral
// player.
func (g *Game) PlayerNeutral() *Player {
	return g.playerNeutral
}

// Player returns a player by PlayerID, or nil if a player with the given
// id could not be found in the game instance.
// Does not include the neutral player.
func (g *Game) Player(id PlayerID) *Player {
	for _, p := range g.players {
		if p.id == id {
			return p
		}
	}
	return nil
}

// Players returns the players of the game instance.
// Does not include the neutral player.
func (g *Game) Players() []*Player {
	return g.players
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
	playersCopy := make([]*Player, len(g.players))
	for i, player := range g.players {
		playersCopy[i] = player.Copy()
	}
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
		playerNeutral: g.playerNeutral.Copy(),
		players:       playersCopy,
		islands:       islandsCopy,
		airplanes:     airplanesCopy,
	}
}

// newGame constructs a new game from the given parameters. Use GameBuilder to
// perform validation on the parameters before creation.
func newGame(size Coordinate, playerNeutral *Player, players []*Player, islands []*Island, airplanes []*Airplane) (*Game, error) {
	id := GameID(NextModelID())
	return &Game{
		id:            id,
		size:          size,
		playerNeutral: playerNeutral,
		players:       players,
		islands:       islands,
		airplanes:     airplanes,
	}, nil
}

// GameBuilder implements a builder patter for creating a new Game instance.
type GameBuilder struct {
	size          Coordinate
	playerNeutral *Player
	players       []*Player
	islands       []*Island
	airplanes     []*Airplane
}

// NewGameBuilder creates a new GameBuilder with initial values.
// NewGameBuilder panics if size is < (1, 1), or if playerNeutral is nil.
func NewGameBuilder(size Coordinate, playerNeutral *Player) *GameBuilder {
	if size.X <= 0 || size.Y <= 0 {
		panic("size < (1, 1)")
	}
	if playerNeutral == nil {
		panic("playerNeutral was nil")
	}
	return &GameBuilder{
		size:          size,
		playerNeutral: playerNeutral,
		players:       make([]*Player, 0),
		islands:       make([]*Island, 0),
		airplanes:     make([]*Airplane, 0),
	}
}

// AddPlayer adds a player to GameBuilder, to be later included in the game.
// AddPlayer panics if player is nil.
func (gb *GameBuilder) AddPlayer(player *Player) *GameBuilder {
	if player == nil {
		panic("player was nil")
	}
	gb.players = append(gb.players, player)
	return gb
}

// AddIsland adds an island to GameBuilder, to be later included in the game.
// AddIsland panics if island is nil.
func (gb *GameBuilder) AddIsland(island *Island) *GameBuilder {
	if island == nil {
		panic("island was nil")
	}
	gb.islands = append(gb.islands, island)
	return gb
}

// Build creates a game from the GameBuilder parameters, first validating
// that the provided parameters are valid.
func (gb *GameBuilder) Build() (*Game, error) {
	// Validate players:
	//  - Must be at least 2 players (+ the neutral player).
	//  - All players must have a unique id.
	if len(gb.players) < 2 {
		return nil, errors.New("game must have at least 2 players")
	}
	playerIDs := make(map[PlayerID]struct{})
	playerIDs[gb.playerNeutral.ID()] = struct{}{}
	for _, p := range gb.players {
		if _, ok := playerIDs[p.ID()]; ok {
			return nil, errors.New("playerID duplicated")
		}
		playerIDs[p.ID()] = struct{}{}
	}
	// Validate islands:
	//  - Position is within game bounds.
	//  - Unique position.
	//  - Owning player exists.
	for i, island := range gb.islands {
		if !island.position.IsWithin(gb.size) {
			return nil, errors.Errorf("Island out of bounds (coord: %v; size: %v)", island.position, gb.size)
		}
		for j, other := range gb.islands {
			if i != j && island.position == other.position {
				return nil, errors.Errorf("Islands has same position (coord: %v)", island.position)
			}
		}
		if _, ok := playerIDs[island.Owner().ID()]; !ok {
			return nil, errors.New("island owner did not exist")
		}
	}
	return newGame(gb.size, gb.playerNeutral, gb.players, gb.islands, gb.airplanes)
}

// BuildOrPanic calls Build and panics if Build returns an error.
func (gb *GameBuilder) BuildOrPanic() *Game {
	game, err := gb.Build()
	if err != nil {
		panic(err)
	}
	return game
}
