package model

import "testing"

// TestGenerateFogOfWar compares generateFogOfWar against a direct check of
// every tile: a tile is clear if it is within 2 tiles (large islands) or 1
// tile (other islands, airplanes) of something the player owns.
func TestGenerateFogOfWar(t *testing.T) {
	for _, size := range []Coordinate{{X: 8, Y: 8}, {X: 9, Y: 9}, {X: 13, Y: 7}, {X: 9, Y: 3}} {
		pn := NewPlayer()
		p1 := NewPlayer()
		p2 := NewPlayer()
		far := Coordinate{X: size.X - 1, Y: size.Y - 1}
		large := NewIsland(Coordinate{X: 0, Y: 0}, IslandSizeLarge, 10, p1.ID())
		medium := NewIsland(far, IslandSizeMedium, 10, p1.ID())
		other := NewIsland(Coordinate{X: size.X / 2, Y: 0}, IslandSizeMedium, 10, p2.ID())
		g := NewGameBuilder(size, pn).
			AddPlayer(p1).AddPlayer(p2).
			AddIsland(large).AddIsland(medium).AddIsland(other).
			BuildOrPanic()
		// An airplane partly outside the board, as when reviving.
		airplane := NewAirplane(Coordinate{X: size.X / 2, Y: size.Y}, other, p1.ID(), 1)
		g.AddAirplane(airplane)

		fog := generateFogOfWar(g, p1)
		within := func(a, b Coordinate, r int) bool {
			return abs(a.X-b.X) <= r && abs(a.Y-b.Y) <= r
		}
		for x := -3; x < size.X+3; x++ {
			for y := -3; y < size.Y+3; y++ {
				c := Coordinate{X: x, Y: y}
				want := c.IsWithin(size) &&
					!within(c, large.Position(), 2) &&
					!within(c, medium.Position(), 1) &&
					!within(c, airplane.Position().ToCoordinate(), 1)
				if got := fog.Contains(c); got != want {
					t.Errorf("size %v: Contains(%v) = %v, want %v", size, c, got, want)
				}
			}
		}
	}
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
