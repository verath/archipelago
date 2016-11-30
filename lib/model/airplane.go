package model

import (
	"time"
)

type Airplane struct {
	army

	position    FloatCoordinate
	destination Coordinate
	// Speed in tiles/nanosecond
	speed float64
}

const airplaneDefaultSpeed = 1 / float64(time.Second)


func (a *Airplane) Position() *FloatCoordinate {
	return &a.position
}

func (a *Airplane) Destination() *Coordinate {
	return &a.destination
}

func (a *Airplane) Speed() float64 {
	return a.speed
}

func (a *Airplane) SetSpeed(speed float64) {
	a.speed = speed
}

func NewAirplane(origin, destination Coordinate, owner *player, strength int) (*Airplane, error) {
	army, err := newArmy(owner, strength)
	if err != nil {
		return nil, err
	}

	return &Airplane{
		army:        *army,
		position:    origin.ToFloatCoordinate(),
		destination: destination,
		speed:       airplaneDefaultSpeed,
	}, nil
}
