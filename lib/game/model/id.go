package model

import "github.com/verath/archipelago/lib/common"

type ModelID string

type AirplaneID ModelID
type GameID ModelID
type IslandID ModelID
type PlayerID ModelID

func NewModelID() ModelID {
	return ModelID(common.NextGlobalID())
}
