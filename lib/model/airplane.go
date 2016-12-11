package model

import (
	"encoding/json"
	"time"
)

type Airplane struct {
	identifier
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
	// No reason to have nanosecond precision on client side
	speedMillis := a.speed * float64(time.Millisecond)

	return json.Marshal(&struct {
		ID          identifier      `json:"id"`
		Army        *army           `json:"army"`
		Position    FloatCoordinate `json:"position"`
		Destination Coordinate      `json:"destination"`
		Speed       float64         `json:"speed"`
	}{
		ID:          a.identifier,
		Army:        a.army,
		Position:    a.position,
		Destination: a.destination,
		Speed:       speedMillis,
	})
}

func (a *Airplane) Copy() *Airplane {
	return &Airplane{
		identifier:  a.identifier,
		army:        a.army.Copy(),
		position:    a.position,
		destination: a.destination,
		speed:       a.speed,
	}
}

func NewAirplane(origin, destination Coordinate, owner *Player, strength int) (*Airplane, error) {
	identifier, err := newIdentifier()
	if err != nil {
		return nil, err
	}
	return &Airplane{
		identifier:  identifier,
		army:        newArmy(owner, strength),
		position:    origin.ToFloatCoordinate(),
		destination: destination,
		speed:       airplaneDefaultSpeed,
	}, nil
}
