package model

import (
	"encoding/json"
	"time"
)

type Airplane struct {
	Identifier
	*army

	position    FloatCoordinate
	destination IslandID
	// Speed in tiles/nanosecond
	speed float64
}

const airplaneDefaultSpeed = 1 / float64(time.Second)

func (a *Airplane) Position() FloatCoordinate {
	return a.position
}

func (a *Airplane) SetPosition(position FloatCoordinate) {
	a.position = position
}

func (a *Airplane) Destination() IslandID {
	return a.destination
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
		ID          Identifier      `json:"id"`
		Army        *army           `json:"army"`
		Position    FloatCoordinate `json:"position"`
		Destination IslandID        `json:"destination"`
		Speed       float64         `json:"speed"`
	}{
		ID:          a.Identifier,
		Army:        a.army,
		Position:    a.position,
		Destination: a.destination,
		Speed:       speedMillis,
	})
}

func (a *Airplane) Copy() *Airplane {
	return &Airplane{
		Identifier:  a.Identifier,
		army:        a.army.Copy(),
		position:    a.position,
		destination: a.destination,
		speed:       a.speed,
	}
}

func NewAirplane(origin *Island, destination *Island, owner *Player, strength int) (*Airplane, error) {
	identifier, err := NewIdentifier()
	if err != nil {
		return nil, err
	}
	return &Airplane{
		Identifier:  identifier,
		army:        newArmy(owner, strength),
		position:    origin.Position().ToFloatCoordinate(),
		destination: destination.ID(),
		speed:       airplaneDefaultSpeed,
	}, nil
}
