package model

type Game interface {
	Player(id PlayerID) *player
	Board() *board
	Airplanes() []*airplane
	AddAirplane(airplane *airplane)
}

type game struct {
	player1   player
	player2   player
	board     board
	airplanes []*airplane
}

func (g *game) Player(id PlayerID) *player {
	if g.player1.id == id {
		return &g.player1
	}
	if g.player2.id == id {
		return &g.player2
	}
	return nil
}

func (g *game) Board() *board {
	return &g.board
}

func (g *game) Airplanes() []*airplane {
	return g.airplanes
}

func (g *game) AddAirplane(airplane *airplane) {
	g.airplanes = append(g.airplanes, airplane)
}

func NewGame(player1 player, player2 player, board board) (*game, error) {
	return &game{
		player1:   player1,
		player2:   player2,
		board:     board,
		airplanes: make([]*airplane, 0),
	}, nil
}
