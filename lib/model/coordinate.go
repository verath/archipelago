package model

import "fmt"

type Coordinate struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type FloatCoordinate struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

// Checks if the coordinate is within a boundary, seen as a rectangle
// from (0,0) to the boundary x and y coordinates.
func (c Coordinate) IsWithin(boundary Coordinate) bool {
	return c.X < boundary.X && c.Y < boundary.Y
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
