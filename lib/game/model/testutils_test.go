package model

// CreateDummyGameEmpty creates an empty 9x9 board
func CreateDummyGameEmpty() *Game {
	p1, _ := NewPlayer()
	p2, _ := NewPlayer()
	pn, _ := NewPlayer()
	return NewGameBuilder(Coordinate{9, 9}, p1, p2, pn).BuildOrPanic()
}

// CreateDummyGameSimple Creates a 9x9 board with 3 islands:
//  * (0,0) - player 1 island
//  * (8,8) - player 2 island
//  * (4,4) - neutral island
// All starting with a strength of 10 and a growth interval of 1/second
func CreateDummyGameSimple() *Game {
	p1, _ := NewPlayer()
	p2, _ := NewPlayer()
	pn, _ := NewPlayer()
	p1Island, _ := NewIslandWithID(IslandID("p1"), Coordinate{0, 0}, IslandSizeMedium, 10, p1)
	p2Island, _ := NewIslandWithID(IslandID("p2"), Coordinate{8, 8}, IslandSizeMedium, 10, p2)
	neIsland, _ := NewIslandWithID(IslandID("pn"), Coordinate{4, 4}, IslandSizeMedium, 10, pn)
	ne2Island, _ := NewIslandWithID(IslandID("bottom-left"), Coordinate{0, 8}, IslandSizeMedium, 10, pn)

	return NewGameBuilder(Coordinate{9, 9}, p1, p2, pn).
		AddIsland(p1Island).
		AddIsland(p2Island).
		AddIsland(neIsland).
		AddIsland(ne2Island).
		BuildOrPanic()
}
