package model

import "github.com/verath/archipelago/lib/id"

type ModelID string

type AirplaneID ModelID
type GameID ModelID
type IslandID ModelID
type PlayerID ModelID

func NewModelID() ModelID {
	return ModelID(id.NextGlobalID())
}
