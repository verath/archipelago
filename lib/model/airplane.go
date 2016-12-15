package model

import (
	"encoding/json"
	"math"
	"time"
)

type Airplane struct {
	Identifier
	*army

	destination IslandID

	position  FloatCoordinate
	direction float64
	// Speed in tiles/nanosecond
	speed float64
}

const airplaneDefaultSpeed = 1 / float64(2*time.Second)

func (a *Airplane) Destination() IslandID {
	return a.destination
}

func (a *Airplane) Position() FloatCoordinate {
	return a.position
}

func (a *Airplane) SetPosition(position FloatCoordinate) {
	a.position = position
}

func (a *Airplane) Direction() float64 {
	return a.direction
}

func (a *Airplane) SetDirection(direction float64) {
	a.direction = direction
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
		Destination IslandID        `json:"-"`
		Position    FloatCoordinate `json:"position"`
		Direction   float64         `json:"direction"`
		Speed       float64         `json:"speed"`
	}{
		ID:          a.Identifier,
		Army:        a.army,
		Destination: a.destination,
		Position:    a.position,
		Direction:   a.direction,
		Speed:       speedMillis,
	})
}

func (a *Airplane) Copy() *Airplane {
	return &Airplane{
		Identifier:  a.Identifier,
		army:        a.army.Copy(),
		destination: a.destination,
		position:    a.position,
		direction:   a.direction,
		speed:       a.speed,
	}
}

func NewAirplane(origin *Island, destination *Island, owner *Player, strength int64) (*Airplane, error) {
	identifier, err := NewIdentifier()
	if err != nil {
		return nil, err
	}

	// Calculate the bearing of the airplane
	originPos := origin.Position().ToFloatCoordinate()
	destPos := destination.Position().ToFloatCoordinate()
	direction := math.Atan2(destPos.Y-originPos.Y, destPos.X-originPos.X)

	return &Airplane{
		Identifier:  identifier,
		army:        newArmy(owner, strength),
		destination: destination.ID(),
		position:    originPos,
		direction:   direction,
		speed:       airplaneDefaultSpeed,
	}, nil
}
