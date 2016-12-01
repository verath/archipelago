package model

import (
	"encoding/json"
)

type Board struct {
	size    Coordinate
	islands []*Island
}

func (b *Board) coordToIndex(coord Coordinate) int {
	return coord.X + (coord.Y * b.size.X)
}

func (b *Board) indexOk(idx int) bool {
	return idx >= 0 && idx < (b.size.X*b.size.Y)
}

func (b *Board) Island(coord Coordinate) *Island {
	idx := b.coordToIndex(coord)
	if !b.indexOk(idx) {
		panic("Accessing island at coordinate outside size")
	}
	return b.islands[idx]
}

func (b *Board) Islands() []*Island {
	islands := make([]*Island, 0)
	for _, island := range b.islands {
		if island != nil {
			islands = append(islands, island)
		}
	}
	return islands
}

func (b *Board) SetIsland(coord Coordinate, island *Island) {
	idx := b.coordToIndex(coord)
	if !b.indexOk(idx) {
		// This should in all cases be due to us creating a bad
		// map, we panic rather than error to quickly fail
		panic("Adding island to coordinate outside size")
	}
	b.islands[idx] = island
}

func (b *Board) Copy() *Board {
	islandsCopy := make([]*Island, len(b.islands))
	for i, island := range b.islands {
		if island != nil {
			islandsCopy[i] = island.Copy()
		}
	}
	return &Board{
		size:    b.size,
		islands: islandsCopy,
	}
}

func (b *Board) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		Size    Coordinate
		Islands []*Island
	}{
		Size:    b.size,
		Islands: b.islands,
	})
}

func NewBoard(size Coordinate) *Board {
	if size.X <= 0 || size.Y <= 0 {
		panic("Size of board cannot be <= 0")
	}
	return &Board{
		size:    size,
		islands: make([]*Island, size.X*size.Y),
	}
}
