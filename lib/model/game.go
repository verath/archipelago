package model

import "encoding/json"

type Game struct {
	player1   player
	player2   player
	board     Board
	airplanes []*Airplane
}

func (g *Game) Player1() *player {
	return &g.player1
}

func (g *Game) Player2() *player {
	return &g.player2
}

func (g *Game) Player(id PlayerID) *player {
	if g.player1.id == id {
		return &g.player1
	}
	if g.player2.id == id {
		return &g.player2
	}
	return nil
}

func (g *Game) Board() *Board {
	return &g.board
}

func (g *Game) Airplanes() []*Airplane {
	return g.airplanes
}

func (g *Game) AddAirplane(airplane *Airplane) {
	g.airplanes = append(g.airplanes, airplane)
}

func (g *Game) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		Player1   player
		Player2   player
		Board     Board
		Airplanes []*Airplane
	}{
		Player1:   g.player1,
		Player2:   g.player2,
		Board:     g.board,
		Airplanes: g.airplanes,
	})
}

func NewGame(player1 player, player2 player, board Board) *Game {
	return &Game{
		player1:   player1,
		player2:   player2,
		board:     board,
		airplanes: make([]*Airplane, 0),
	}
}
