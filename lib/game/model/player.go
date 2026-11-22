package model

import "time"

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
	// fogOfWar is the tiles where the player has Fog of War (limited)
	// vision, nil if not calculated. It is immutable, so copies of the
	// player share it.
	fogOfWar *FogOfWar
	// lastLaunchSeq is the highest PlayerActionLaunch.Seq processed for the
	// player.
	lastLaunchSeq uint32
	// unTimer is how long the player has been above the UN army limit since
	// the last UN airplane was sent against it, see Rules.UN.
	unTimer time.Duration
	// dominating is how long the player has held the share of islands for a
	// domination victory, see Rules.Domination.
	dominating time.Duration
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
		return p.fogOfWar != nil && p.fogOfWar.Contains(c)
	case PendingRevival:
		return true
	case Dead, LeftGame:
		return false
	}
	panic("unknown player state")
}

// FogOfWar returns the tiles where the player has fog of war vision, nil if
// not calculated.
func (p *Player) FogOfWar() *FogOfWar {
	return p.fogOfWar
}

// SetFogOfWar sets the tiles where the player has fog of war vision.
func (p *Player) SetFogOfWar(fogOfWar *FogOfWar) {
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

// UNTimer returns how long the player has been above the UN army limit since
// the last UN airplane was sent against it.
func (p *Player) UNTimer() time.Duration {
	return p.unTimer
}

// SetUNTimer sets how long the player has been above the UN army limit since
// the last UN airplane was sent against it.
func (p *Player) SetUNTimer(unTimer time.Duration) {
	p.unTimer = unTimer
}

// Dominating returns how long the player has held the share of islands for
// a domination victory, in a row.
func (p *Player) Dominating() time.Duration {
	return p.dominating
}

// SetDominating sets how long the player has held the share of islands for a
// domination victory.
func (p *Player) SetDominating(dominating time.Duration) {
	p.dominating = dominating
}

// Copy performs a deep copy of the Player, returning the copy.
func (p *Player) Copy() *Player {
	return &Player{
		id:            p.id,
		state:         p.state,
		fogOfWar:      p.fogOfWar, // Immutable, so safe to share.
		lastLaunchSeq: p.lastLaunchSeq,
		unTimer:       p.unTimer,
		dominating:    p.dominating,
	}
}
