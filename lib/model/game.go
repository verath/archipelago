package model

import "encoding/json"

type Game struct {
	player1       *Player
	player2       *Player
	playerNeutral *Player
	board         *Board
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

func (g *Game) Board() *Board {
	return g.board
}

func (g *Game) Airplanes() []*Airplane {
	return g.airplanes
}

func (g *Game) AddAirplane(airplane *Airplane) {
	g.airplanes = append(g.airplanes, airplane)
}

func (g *Game) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		Player1       *Player
		Player2       *Player
		playerNeutral *Player
		Board         *Board
		Airplanes     []*Airplane
	}{
		Player1:       g.player1,
		Player2:       g.player2,
		playerNeutral: g.playerNeutral,
		Board:         g.board,
		Airplanes:     g.airplanes,
	})
}

func (g *Game) Copy() *Game {
	airplanesCopy := make([]*Airplane, len(g.airplanes))
	for i, airplane := range g.airplanes {
		airplanesCopy[i] = airplane.Copy()
	}
	return &Game{
		player1:       g.player1.Copy(),
		player2:       g.player2.Copy(),
		playerNeutral: g.playerNeutral.Copy(),
		board:         g.board.Copy(),
		airplanes:     airplanesCopy,
	}
}

func NewGame(player1 *Player, player2 *Player, playerNeutral *Player, board *Board) *Game {
	return &Game{
		player1:       player1,
		player2:       player2,
		playerNeutral: playerNeutral,
		board:         board,
		airplanes:     make([]*Airplane, 0),
	}
}
