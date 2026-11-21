package model

// A PlayerState represents the current exclusive state of a Player.
// During a game a Player transitions between PlayerStates:
//
//	Alive <-> PendingRevival -> Dead
//	|             v             |
//	---------> LeftGame <--------
type PlayerState int

const (
	// Alive is when still alive in the game.
	Alive PlayerState = iota
	// PendingRevival is when dead, but may be revived.
	PendingRevival
	// Dead is when dead and will remain dead.
	Dead
	// LeftGame is when the Player has left the game.
	LeftGame
)

// Player represents a player in the game model.
type Player struct {
	id    PlayerID
	state PlayerState
	// fogOfWar is a set of coordinates for tiles where the player has Fog of
	// War (limited) vision.
	fogOfWar map[Coordinate]struct{}
	// lastLaunchSeq is the highest PlayerActionLaunch.Seq processed for the
	// player.
	lastLaunchSeq uint32
}

// NewPlayer creates a new Player with a new generated ID.
func NewPlayer() *Player {
	id := PlayerID(NextModelID())
	return &Player{
		id:       id,
		state:    Alive,
		fogOfWar: nil,
	}
}

// ID returns the PlayerID of the Player.
func (p *Player) ID() PlayerID {
	return p.id
}

// State returns the current state of the player.
func (p *Player) State() PlayerState {
	return p.state
}

// SetState sets the current state of the player.
func (p *Player) SetState(state PlayerState) {
	p.state = state
}

// IsInFogOfWar tests if the given Coordinate is in fog of war for the player.
func (p *Player) IsInFogOfWar(c Coordinate) bool {
	switch p.state {
	case Alive:
		_, inFoW := p.fogOfWar[c]
		return inFoW
	case PendingRevival:
		return true
	case Dead, LeftGame:
		return false
	}
	panic("unknown player state")
}

// FogOfWar returns the set of coordinates where the player has fog of war
// vision.
func (p *Player) FogOfWar() map[Coordinate]struct{} {
	return p.fogOfWar
}

// SetFogOfWar sets the coordinates where the player has fog of war vision.
func (p *Player) SetFogOfWar(fogOfWar map[Coordinate]struct{}) {
	p.fogOfWar = fogOfWar
}

// LastLaunchSeq returns the highest PlayerActionLaunch.Seq processed for the
// player, whether the launch succeeded or not. 0 if none.
func (p *Player) LastLaunchSeq() uint32 {
	return p.lastLaunchSeq
}

// SetLastLaunchSeq sets the highest PlayerActionLaunch.Seq processed.
func (p *Player) SetLastLaunchSeq(seq uint32) {
	p.lastLaunchSeq = seq
}

// Equals compares two players for equality. Equality is determined
// by the ID of each player. Always returns false if other is nil.
func (p *Player) Equals(other *Player) bool {
	return other != nil && p.id == other.id
}

// Copy performs a deep copy of the Player, returning the copy.
func (p *Player) Copy() *Player {
	fogOfWar := make(map[Coordinate]struct{}, len(p.fogOfWar))
	for c, v := range p.fogOfWar {
		fogOfWar[c] = v
	}
	return &Player{
		id:            p.id,
		state:         p.state,
		fogOfWar:      fogOfWar,
		lastLaunchSeq: p.lastLaunchSeq,
	}
}
