package model

import (
	"fmt"
	"math"
)

// Coordinate is an (x, y) coordinate, representing a position on
// the game "board".
type Coordinate struct {
	X int
	Y int
}

// FloatCoordinate is an (x, y) coordinate, approximately representing
// a position on the game "board".
type FloatCoordinate struct {
	X float64
	Y float64
}

// IsWithin determines if the coordinate is within a boundary, seen as a rectangle
// from (0,0) to the boundary x and y coordinates.
func (c Coordinate) IsWithin(boundary Coordinate) bool {
	return c.X >= 0 && c.X < boundary.X && c.Y >= 0 && c.Y < boundary.Y
}

// ToFloatCoordinate returns a FloatCoordinate representation of the Coordinate.
func (c Coordinate) ToFloatCoordinate() FloatCoordinate {
	return FloatCoordinate{
		X: float64(c.X),
		Y: float64(c.Y),
	}
}

// String represents the string representation of a Coordinate.
func (c Coordinate) String() string {
	return fmt.Sprintf("(%d, %d)", c.X, c.Y)
}

// ToCoordinate returns a Coordinate representation of the FloatCoordinate. The
// Coordinate values are rounded to the nearest int away from zero.
func (fc FloatCoordinate) ToCoordinate() Coordinate {
	return Coordinate{
		X: int(math.Round(fc.X)),
		Y: int(math.Round(fc.Y)),
	}
}

// String represents the string representation of a FloatCoordinate.
func (fc FloatCoordinate) String() string {
	return fmt.Sprintf("(%.2f, %.2f)", fc.X, fc.Y)
}
