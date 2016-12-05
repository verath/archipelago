package model

import (
	"encoding/json"
	"errors"
	"fmt"
)

type board struct {
	size    Coordinate
	islands []*Island
}

func coordToIslandIndex(size Coordinate, coord Coordinate) (idx int, ok bool) {
	idx = coord.X + (coord.Y * size.X)
	ok = (idx >= 0 && idx < (size.X*size.Y))
	return idx, ok
}

func (b *board) Island(coord Coordinate) *Island {
	idx, _ := coordToIslandIndex(b.size, coord)
	return b.islands[idx]
}

func (b *board) Islands() []*Island {
	// Our internal representation of islands has nil values
	// representing an empty "tile". These values are not
	// interesting when iterating islands
	// TODO: cache this slice of "real" islands?
	islands := make([]*Island, 0)
	for _, island := range b.islands {
		if island != nil {
			islands = append(islands, island)
		}
	}
	return islands
}

func (b *board) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		Size    Coordinate
		Islands []*Island
	}{
		Size:    b.size,
		Islands: b.islands,
	})
}

func (b *board) Copy() *board {
	islandsCopy := make([]*Island, len(b.islands))
	for i, island := range b.islands {
		if island != nil {
			islandsCopy[i] = island.Copy()
		}
	}
	return &board{
		size:    b.size,
		islands: islandsCopy,
	}
}

func newBoard(size Coordinate, islands []*Island) (*board, error) {
	return &board{
		size:    size,
		islands: islands,
	}, nil
}

type BoardBuilder struct {
	size    Coordinate
	islands map[Coordinate]*Island
}

func NewBoardBuilder() *BoardBuilder {
	return &BoardBuilder{
		islands: make(map[Coordinate]*Island),
	}
}

func (bb *BoardBuilder) SetSize(size Coordinate) *BoardBuilder {
	bb.size = size
	return bb
}

func (bb *BoardBuilder) AddIsland(coord Coordinate, island *Island) *BoardBuilder {
	bb.islands[coord] = island
	return bb
}

func (bb *BoardBuilder) Build() (*board, error) {
	if bb.size.X <= 0 || bb.size.Y <= 0 {
		return nil, errors.New("Size must be >= (1,1)")
	}
	// map of islands -> slice
	islands := make([]*Island, bb.size.X*bb.size.Y)
	for coord, island := range bb.islands {
		idx, ok := coordToIslandIndex(bb.size, coord)
		if !ok {
			return nil, fmt.Errorf("Island out of bounds (coord: %v; size: %v)", coord, bb.size)
		}
		islands[idx] = island
	}
	return newBoard(bb.size, islands)
}

func (bb *BoardBuilder) BuildOrPanic() *board {
	board, err := bb.Build()
	if err != nil {
		panic(err)
	}
	return board
}
