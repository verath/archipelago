package game

import "github.com/verath/archipelago/lib/game/model"

func NewGame(game *model.Game) *Game {
	airplanes := make([]*Airplane, 0)
	for _, airplane := range game.Airplanes() {
		airplanes = append(airplanes, NewAirplane(airplane))
	}
	islands := make([]*Island, 0)
	for _, island := range game.Islands() {
		islands = append(islands, NewIsland(island))
	}
	return &Game{
		Id:            string(game.ID()),
		Player1:       NewPlayer(game.Player1()),
		Player2:       NewPlayer(game.Player2()),
		PlayerNeutral: NewPlayer(game.PlayerNeutral()),
		Size:          NewCoordinate(game.Size()),
		Airplanes:     airplanes,
		Islands:       islands,
	}
}

func NewCoordinate(coordinate model.Coordinate) *Coordinate {
	return &Coordinate{X: int64(coordinate.X), Y: int64(coordinate.Y)}
}

func NewFloatCoordinate(coordinate model.FloatCoordinate) *FloatCoordinate {
	return &FloatCoordinate{X: coordinate.X, Y: coordinate.Y}
}

func NewPlayer(player *model.Player) *Player {
	return &Player{
		Id: string(player.ID()),
	}
}

func NewArmy(army *model.Army) *Army {
	return &Army{
		Strength: army.Strength(),
		Owner:    NewPlayer(army.Owner()),
	}
}

func NewAirplane(airplane *model.Airplane) *Airplane {
	return &Airplane{
		Id:        string(airplane.ID()),
		Army:      NewArmy(airplane.Army),
		Position:  NewFloatCoordinate(airplane.Position()),
		Direction: airplane.Direction(),
		Speed:     airplane.Speed(),
	}
}

func NewIsland(island *model.Island) *Island {
	return &Island{
		Id:       string(island.ID()),
		Army:     NewArmy(island.Army),
		Position: NewCoordinate(island.Position()),
		Size:     float64(island.Size()),
	}
}
