package model

import "fmt"

type Coordinate struct {
	X, Y int
}

type FloatCoordinate struct {
	X, Y float64
}

// Checks if the coordinate is within a boundary, seen as a rectangle
// from (0,0) to the boundary x and y coordinates
func (c Coordinate) IsWithin(boundary Coordinate) bool {
	return c.X <= boundary.X && c.Y <= boundary.Y
}

func (c Coordinate) ToFloatCoordinate() FloatCoordinate {
	return FloatCoordinate{
		X: float64(c.X),
		Y: float64(c.Y),
	}
}

func (c Coordinate) String() string {
	return fmt.Sprintf("(%d, %d)", c.X, c.Y)
}

func (fc FloatCoordinate) ToCoordinate() Coordinate {
	return Coordinate{
		X: int(fc.X),
		Y: int(fc.Y),
	}
}

func (fc FloatCoordinate) String() string {
	return fmt.Sprintf("(%.2f, %.2f)", fc.X, fc.Y)
}
