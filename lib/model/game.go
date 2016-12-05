package model

import (
	"encoding/json"
)

type Game struct {
	identifier
	*board

	player1       *Player
	player2       *Player
	playerNeutral *Player
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

func (g *Game) Airplanes() []*Airplane {
	return g.airplanes
}

func (g *Game) AddAirplane(airplane *Airplane) {
	g.airplanes = append(g.airplanes, airplane)
}

func (g *Game) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		ID            identifier
		board         *board
		Player1       *Player
		Player2       *Player
		playerNeutral *Player
		Airplanes     []*Airplane
	}{
		ID:            g.identifier,
		board:         g.board,
		Player1:       g.player1,
		Player2:       g.player2,
		playerNeutral: g.playerNeutral,
		Airplanes:     g.airplanes,
	})
}

func (g *Game) Copy() *Game {
	airplanesCopy := make([]*Airplane, len(g.airplanes))
	for i, airplane := range g.airplanes {
		airplanesCopy[i] = airplane.Copy()
	}
	return &Game{
		identifier:    g.identifier,
		board:         g.board.Copy(),
		player1:       g.player1.Copy(),
		player2:       g.player2.Copy(),
		playerNeutral: g.playerNeutral.Copy(),
		airplanes:     airplanesCopy,
	}
}

func NewGame(player1 *Player, player2 *Player, playerNeutral *Player, board *board) (*Game, error) {
	identifier, err := newIdentifier()
	if err != nil {
		return nil, err
	}
	return &Game{
		identifier:    identifier,
		board:         board,
		player1:       player1,
		player2:       player2,
		playerNeutral: playerNeutral,
		airplanes:     make([]*Airplane, 0),
	}, nil
}
