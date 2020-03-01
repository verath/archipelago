package game

import "github.com/verath/archipelago/lib/game/model"

// EncodeGame transforms a game model Game to its wire representation
func EncodeGame(game *model.Game) *Game {
	airplanes := make([]*Airplane, 0)
	for _, airplane := range game.Airplanes() {
		airplanes = append(airplanes, EncodeAirplane(airplane))
	}
	islands := make([]*Island, 0)
	for _, island := range game.Islands() {
		islands = append(islands, EncodeIsland(island))
	}
	if len(game.Players()) != 2 {
		// FIXME
		panic("can only encode games with exactly 2 players")
	}
	return &Game{
		Id:            string(game.ID()),
		Player1:       EncodePlayer(game.Players()[0]),
		Player2:       EncodePlayer(game.Players()[1]),
		PlayerNeutral: EncodePlayer(game.PlayerNeutral()),
		Size:          EncodeCoordinate(game.Size()),
		Airplanes:     airplanes,
		Islands:       islands,
	}
}

// EncodeCoordinate transforms a game model Coordinate to its wire representation
func EncodeCoordinate(coordinate model.Coordinate) *Coordinate {
	return &Coordinate{X: int64(coordinate.X), Y: int64(coordinate.Y)}
}

// EncodeFloatCoordinate transforms a game model FloatCoordinate to its wire representation
func EncodeFloatCoordinate(coordinate model.FloatCoordinate) *FloatCoordinate {
	return &FloatCoordinate{X: coordinate.X, Y: coordinate.Y}
}

// EncodePlayer transforms a game model Player to its wire representation
func EncodePlayer(player *model.Player) *Player {
	return &Player{
		Id: string(player.ID()),
	}
}

// EncodeArmy transforms a game model Army to its wire representation
func EncodeArmy(army *model.Army) *Army {
	return &Army{
		Strength: army.Strength(),
		OwnerId:  string(army.Owner().ID()),
	}
}

// EncodeAirplane transforms a game model Airplane to its wire representation
func EncodeAirplane(airplane *model.Airplane) *Airplane {
	return &Airplane{
		Id:        string(airplane.ID()),
		Army:      EncodeArmy(airplane.Army),
		Position:  EncodeFloatCoordinate(airplane.Position()),
		Direction: airplane.Direction(),
		Speed:     airplane.Speed(),
	}
}

// EncodeIsland transforms a game model Island to its wire representation
func EncodeIsland(island *model.Island) *Island {
	return &Island{
		Id:       string(island.ID()),
		Army:     EncodeArmy(island.Army),
		Position: EncodeCoordinate(island.Position()),
		Size:     float64(island.Size()),
	}
}
