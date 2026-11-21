package model

// CreateDummyGameEmpty creates an empty 9x9 board
func CreateDummyGameEmpty() *Game {
	p1 := NewPlayer()
	p2 := NewPlayer()
	pn := NewPlayer()
	return NewGameBuilder(Coordinate{9, 9}, pn).
		AddPlayer(p1).
		AddPlayer(p2).
		BuildOrPanic()
}

// CreateDummyGameSimple Creates a 9x9 board with 3 islands:
//   - (0,0) - player 1 island
//   - (8,8) - player 2 island
//   - (4,4) - neutral island
//   - (0,8) - neutral island
//
// All starting with a strength of 10 and a growth interval of 1/second
func CreateDummyGameSimple() *Game {
	p1 := NewPlayer()
	p2 := NewPlayer()
	pn := NewPlayer()
	p1Island := NewIslandWithID(IslandID("p1"), Coordinate{0, 0}, IslandSizeMedium, 10, p1.ID())
	p2Island := NewIslandWithID(IslandID("p2"), Coordinate{8, 8}, IslandSizeMedium, 10, p2.ID())
	neIsland := NewIslandWithID(IslandID("pn"), Coordinate{4, 4}, IslandSizeMedium, 10, pn.ID())
	ne2Island := NewIslandWithID(IslandID("bottom-left"), Coordinate{0, 8}, IslandSizeMedium, 10, pn.ID())

	return NewGameBuilder(Coordinate{9, 9}, pn).
		AddPlayer(p1).
		AddPlayer(p2).
		AddIsland(p1Island).
		AddIsland(p2Island).
		AddIsland(neIsland).
		AddIsland(ne2Island).
		BuildOrPanic()
}
