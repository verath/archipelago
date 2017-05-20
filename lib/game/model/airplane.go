package model

import (
	"math"
	"time"
)

const airplaneDefaultSpeed = 1 / float64(2*time.Second)

// Airplane represents an airplane in the game model. An Airplane
// is sent from one island to another, transporting an army to
// the destination.
type Airplane struct {
	*Army

	id AirplaneID
	// destination is the target island of the airplane.
	destination IslandID
	// position is the current position of the airplane
	position FloatCoordinate
	// direction is the heading of the airplane, i.e. in what direction
	// the speed should be applied to move the airplane forward.
	direction float64
	// speed is the speed of the airplane, measured in tiles/nanosecond
	speed float64
}

// NewAirplane creates a new Airplane, starting at the origin Island, targeting
// the destination Island. The Army contained on the Airplane is set to the
// provided strength, owned by the owner.
func NewAirplane(origin *Island, destination *Island, owner *Player, strength int64) *Airplane {
	id := AirplaneID(NextModelID())
	// Calculate the bearing of the airplane
	originPos := origin.Position().ToFloatCoordinate()
	destPos := destination.Position().ToFloatCoordinate()
	direction := math.Atan2(destPos.Y-originPos.Y, destPos.X-originPos.X)
	return &Airplane{
		Army:        NewArmy(owner, strength),
		id:          id,
		destination: destination.id,
		position:    originPos,
		direction:   direction,
		speed:       airplaneDefaultSpeed,
	}
}

// ID is a getter for the id of the airplane.
func (a *Airplane) ID() AirplaneID {
	return a.id
}

// Destination returns the IslandID of the airplane's target island.
func (a *Airplane) Destination() IslandID {
	return a.destination
}

// Position returns the current position of the airplane.
func (a *Airplane) Position() FloatCoordinate {
	return a.position
}

// SetPosition is a setter for the position of the airplane.
func (a *Airplane) SetPosition(position FloatCoordinate) {
	a.position = position
}

// Direction returns the current direction of the airplane.
func (a *Airplane) Direction() float64 {
	return a.direction
}

// SetDirection is a setter for the direction of the airplane.
func (a *Airplane) SetDirection(direction float64) {
	a.direction = direction
}

// Speed returns the speed of the airplane. Speed is measured in game tiles / nanosecond.
func (a *Airplane) Speed() float64 {
	return a.speed
}

// SetSpeed is a setter for the speed of the airplane.
func (a *Airplane) SetSpeed(speed float64) {
	a.speed = speed
}

// Copy performs a deep copy of the airplane.
func (a *Airplane) Copy() *Airplane {
	return &Airplane{
		Army:        a.Army.Copy(),
		id:          a.id,
		destination: a.destination,
		position:    a.position,
		direction:   a.direction,
		speed:       a.speed,
	}
}
