package model

import (
	"time"
)

type airplane struct {
	army

	position    FloatCoordinate
	destination Coordinate
	// Speed in tiles/nanosecond
	speed float64
}

const airplaneDefaultSpeed = 1 / float64(time.Second)


func (a *airplane) Position() *FloatCoordinate {
	return &a.position
}

func (a *airplane) Destination() *Coordinate {
	return &a.destination
}

func (a *airplane) Speed() float64 {
	return a.speed
}

func (a *airplane) SetSpeed(speed float64) {
	a.speed = speed
}

func NewAirplane(origin, destination Coordinate, owner *player, strength int) (*airplane, error) {
	army, err := newArmy(owner, strength)
	if err != nil {
		return nil, err
	}

	return &airplane{
		army:        *army,
		position:    origin.ToFloatCoordinate(),
		destination: destination,
		speed:       airplaneDefaultSpeed,
	}, nil
}
