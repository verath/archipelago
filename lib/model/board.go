package model

import (
	"encoding/json"
	"errors"
)

type Board struct {
	size    Coordinate
	islands map[Coordinate]*Island
}

func (b *Board) Island(coord Coordinate) *Island {
	if island, ok := b.islands[coord]; ok {
		return island
	}
	return nil
}

func (b *Board) Islands() []*Island {
	islands := make([]*Island, 0, len(b.islands))
	for _, island := range b.islands {
		islands = append(islands, island)
	}
	return islands
}

func (b *Board) AddIsland(coord Coordinate, island Island) error {
	if !coord.IsWithin(b.size) {
		return errors.New("coord not within size")
	}
	b.islands[coord] = &island
	return nil
}

func (b *Board) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		Size Coordinate
	}{
		Size: b.size,
	})
}

func NewBoard(size Coordinate) *Board {
	return &Board{
		size:    size,
		islands: make(map[Coordinate]*Island),
	}
}
