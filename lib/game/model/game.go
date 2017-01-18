package model

import (
	"encoding/json"
	"errors"
	"fmt"
)

type Game struct {
	id            GameID
	size          Coordinate
	player1       *Player
	player2       *Player
	playerNeutral *Player
	islands       []*Island
	airplanes     []*Airplane
}

func (g *Game) Player1() *Player {
	return g.player1
}

func (g *Game) Player2() *Player {
	return g.player2
}

func (g *Game) PlayerNeutral() *Player {
	return g.playerNeutral
}

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

// Takes a player id and returns the opponent of that player. I.e.
// given the id for player1, player2 is returned. Returns nil
// if the id does not point to either player1 or player2
func (g *Game) Opponent(id PlayerID) *Player {
	if g.player1.id == id {
		return g.player2
	}
	if g.player2.id == id {
		return g.player1
	}
	return nil
}

// Returns an island by id, or nil if the island does not exist.
func (g *Game) Island(id IslandID) *Island {
	for _, island := range g.islands {
		if island.id == id {
			return island
		}
	}
	return nil
}

func (g *Game) Islands() []*Island {
	return g.islands
}

func (g *Game) Airplanes() []*Airplane {
	return g.airplanes
}

func (g *Game) AddAirplane(airplane *Airplane) {
	if airplane == nil {
		panic("AddAirplane: airplane cannot be nil")
	}
	g.airplanes = append(g.airplanes, airplane)
}

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

func (g *Game) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		ID            GameID      `json:"id"`
		Size          Coordinate  `json:"size"`
		Player1       *Player     `json:"player1"`
		Player2       *Player     `json:"player2"`
		PlayerNeutral *Player     `json:"player_neutral"`
		Islands       []*Island   `json:"islands"`
		Airplanes     []*Airplane `json:"airplanes"`
	}{
		ID:            g.id,
		Size:          g.size,
		Player1:       g.player1,
		Player2:       g.player2,
		PlayerNeutral: g.playerNeutral,
		Islands:       g.islands,
		Airplanes:     g.airplanes,
	})
}

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

func newGame(size Coordinate, player1, player2, playerNeutral *Player, islands []*Island, airplanes []*Airplane) (*Game, error) {
	id := GameID(NewModelID())
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

type GameBuilder struct {
	size          Coordinate
	player1       *Player
	player2       *Player
	playerNeutral *Player
	islands       []*Island
	airplanes     []*Airplane
}

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

func (gb *GameBuilder) AddIsland(island *Island) *GameBuilder {
	gb.islands = append(gb.islands, island)
	return gb
}

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
			return nil, fmt.Errorf("Island out of bounds (coord: %v; size: %v)", island.position, gb.size)
		}

		for j, other := range gb.islands {
			if i != j && island.position == other.position {
				return nil, fmt.Errorf("Islands has same position (coord: %v)", island.position)
			}
		}
	}
	return newGame(gb.size, gb.player1, gb.player2, gb.playerNeutral, gb.islands, gb.airplanes)
}

func (gb *GameBuilder) BuildOrPanic() *Game {
	board, err := gb.Build()
	if err != nil {
		panic(err)
	}
	return board
}
