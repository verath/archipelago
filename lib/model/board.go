package model

import (
	"errors"
)

type board struct {
	size    Coordinate
	islands map[Coordinate]*island
}

func (b *board) Island(coord Coordinate) *island {
	if island, ok := b.islands[coord]; ok {
		return island
	}
	return nil
}

func (b *board) Islands() []*island {
	islands := make([]*island, 0, len(b.islands))
	for _, island := range b.islands {
		islands = append(islands, island)
	}
	return islands
}

func (b *board) AddIsland(coord Coordinate, island island) error {
	if !coord.IsWithin(b.size) {
		return errors.New("coord not within size")
	}
	b.islands[coord] = &island
	return nil
}

func NewBoard(size Coordinate) *board {
	return &board{
		size:    size,
		islands: make(map[Coordinate]*island),
	}
}
