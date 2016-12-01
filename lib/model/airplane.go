package model

import (
	"encoding/json"
	"time"
)

type Airplane struct {
	*army

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

func (a *Airplane) MarshalJSON() ([]byte, error) {
	// TODO: include speed?
	return json.Marshal(&struct {
		Army        *army
		Position    FloatCoordinate
		Destination Coordinate
	}{
		Army:        a.army,
		Position:    a.position,
		Destination: a.destination,
	})
}

func (a *Airplane) Copy() *Airplane {
	return &Airplane{
		army:        a.army.Copy(),
		position:    a.position,
		destination: a.destination,
		speed:       a.speed,
	}
}

func NewAirplane(origin, destination Coordinate, owner *Player, strength int) *Airplane {
	return &Airplane{
		army:        newArmy(owner, strength),
		position:    origin.ToFloatCoordinate(),
		destination: destination,
		speed:       airplaneDefaultSpeed,
	}
}
