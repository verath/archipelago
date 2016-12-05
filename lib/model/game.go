package model

import (
	"encoding/json"
	"errors"
	"fmt"
)

type Game struct {
	identifier

	size          Coordinate
	player1       *Player
	player2       *Player
	playerNeutral *Player
	islands       []*Island
	airplanes     []*Airplane
}

func coordToIslandIndex(size Coordinate, coord Coordinate) (idx int, ok bool) {
	idx = coord.X + (coord.Y * size.X)
	ok = (idx >= 0 && idx < (size.X*size.Y))
	return idx, ok
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

func (g *Game) Island(coord Coordinate) *Island {
	idx, _ := coordToIslandIndex(g.size, coord)
	return g.islands[idx]
}

func (g *Game) Islands() []*Island {
	// Our internal representation of islands has nil values
	// representing an empty "tile". These values are not
	// interesting when iterating islands
	// TODO: cache this slice of "real" islands?
	islands := make([]*Island, 0)
	for _, island := range g.islands {
		if island != nil {
			islands = append(islands, island)
		}
	}
	return islands
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

func (g *Game) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		ID            identifier
		Size          Coordinate
		Player1       *Player
		Player2       *Player
		PlayerNeutral *Player
		Islands       []*Island
		Airplanes     []*Airplane
	}{
		ID:            g.identifier,
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
		if island != nil {
			islandsCopy[i] = island.Copy()
		}
	}
	return &Game{
		identifier:    g.identifier,
		size:          g.size,
		player1:       g.player1.Copy(),
		player2:       g.player2.Copy(),
		playerNeutral: g.playerNeutral.Copy(),
		islands:       islandsCopy,
		airplanes:     airplanesCopy,
	}
}

func newGame(size Coordinate, player1, player2, playerNeutral *Player, islands []*Island, airplanes []*Airplane) (*Game, error) {
	identifier, err := newIdentifier()
	if err != nil {
		return nil, err
	}
	return &Game{
		identifier:    identifier,
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
	islandMap     map[Coordinate]*Island
	airplanes     []*Airplane
}

func NewGameBuilder(size Coordinate, player1, player2, playerNeutral *Player) *GameBuilder {
	return &GameBuilder{
		size:          size,
		player1:       player1,
		player2:       player2,
		playerNeutral: playerNeutral,
		islandMap:     make(map[Coordinate]*Island),
		airplanes:     make([]*Airplane, 0),
	}
}

func (gb *GameBuilder) AddIsland(coord Coordinate, island *Island) *GameBuilder {
	gb.islandMap[coord] = island
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
	// Transform: map[Coordinate]*Island -> []*Island
	islands := make([]*Island, gb.size.X*gb.size.Y)
	for coord, island := range gb.islandMap {
		idx, ok := coordToIslandIndex(gb.size, coord)
		if !ok {
			return nil, fmt.Errorf("Island out of bounds (coord: %v; size: %v)", coord, gb.size)
		}
		islands[idx] = island
	}
	return newGame(gb.size, gb.player1, gb.player2, gb.playerNeutral, islands, gb.airplanes)
}

func (gb *GameBuilder) BuildOrPanic() *Game {
	board, err := gb.Build()
	if err != nil {
		panic(err)
	}
	return board
}
