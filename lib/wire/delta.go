package wire

import (
	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/wire/msg"
	"google.golang.org/protobuf/proto"
)

// deltaEncoder encodes game ticks for a single client: an
// EventGameSnapshot with the full state first, then an EventGameDelta with
// only what changed since the previous message.
//
// The delta is computed between the wire state last sent to the client and
// the current one, both already filtered for the client's player (fog of
// war). That makes it correct whatever changed and however many ticks are
// between two encoded states, so ticks may be skipped.
//
// A deltaEncoder relies on the client receiving every message it encodes, in
// order (which a websocket connection guarantees until it breaks): encodeTick
// considers a state sent once encoded. So to skip ticks, skip calling
// encodeTick, never drop an encoded message. It is not safe for concurrent
// use.
type deltaEncoder struct {
	// prev is the state last encoded, nil if none yet.
	prev *msg.Game
	// seq is the sequence number of the last encoded message.
	seq uint32
}

// encodeTick encodes the tick's player-specific game state, as a snapshot if
// it is the first state (or a delta can't describe the change), otherwise as
// a delta.
func (e *deltaEncoder) encodeTick(evt *model.PlayerEventTick) *msg.EventEnvelope {
	cur := msg.EncodeGame(evt.Game, evt.PlayerID)
	gameTime := msg.EncodeGameTime(evt.Game.Time())
	e.seq++
	prev := e.prev
	e.prev = cur
	if prev == nil || !canDelta(prev, cur) {
		return &msg.EventEnvelope{Event: &msg.EventEnvelope_EventGameSnapshot{
			EventGameSnapshot: &msg.EventGameSnapshot{Seq: e.seq, GameTime: gameTime, Game: cur},
		}}
	}
	delta := diffGame(prev, cur)
	delta.Seq = e.seq
	delta.GameTime = gameTime
	return &msg.EventEnvelope{Event: &msg.EventEnvelope_EventGameDelta{EventGameDelta: delta}}
}

// canDelta reports whether an EventGameDelta can describe the change from
// prev to cur. It can't if anything that a delta assumes is fixed changed:
// the game, its size, the neutral player, the set of players or islands, or
// an island's position or size. None of these change during a game today.
func canDelta(prev, cur *msg.Game) bool {
	if prev.Id != cur.Id ||
		!proto.Equal(prev.Size, cur.Size) ||
		!proto.Equal(prev.PlayerNeutral, cur.PlayerNeutral) ||
		len(prev.Players) != len(cur.Players) ||
		len(prev.Islands) != len(cur.Islands) {
		return false
	}
	prevPlayers := make(map[string]struct{}, len(prev.Players))
	for _, p := range prev.Players {
		prevPlayers[p.Id] = struct{}{}
	}
	for _, p := range cur.Players {
		if _, ok := prevPlayers[p.Id]; !ok {
			return false
		}
	}
	prevIslands := islandsByID(prev.Islands)
	for _, island := range cur.Islands {
		p, ok := prevIslands[island.Id]
		if !ok || p.Size != island.Size || !proto.Equal(p.Position, island.Position) {
			return false
		}
	}
	return true
}

// diffGame returns the delta from prev to cur, without Seq and GameTime. It
// assumes canDelta(prev, cur).
func diffGame(prev, cur *msg.Game) *msg.EventGameDelta {
	delta := &msg.EventGameDelta{}

	prevPlayers := make(map[string]*msg.Player, len(prev.Players))
	for _, p := range prev.Players {
		prevPlayers[p.Id] = p
	}
	for _, p := range cur.Players {
		if !proto.Equal(prevPlayers[p.Id], p) {
			delta.Players = append(delta.Players, p)
		}
	}

	prevIslands := islandsByID(prev.Islands)
	for _, island := range cur.Islands {
		p := prevIslands[island.Id]
		if !armyEqual(p.Army, island.Army) || p.Garrison != island.Garrison {
			delta.Islands = append(delta.Islands, &msg.IslandUpdate{Id: island.Id, Army: island.Army, Garrison: island.Garrison})
		}
	}

	prevAirplanes := make(map[string]*msg.Airplane, len(prev.Airplanes))
	for _, a := range prev.Airplanes {
		prevAirplanes[a.Id] = a
	}
	curAirplanes := make(map[string]struct{}, len(cur.Airplanes))
	for _, a := range cur.Airplanes {
		curAirplanes[a.Id] = struct{}{}
		p, ok := prevAirplanes[a.Id]
		switch {
		case !ok:
			delta.AirplanesAdded = append(delta.AirplanesAdded, a)
		case !airplaneFlightEqual(p, a):
			// Not expected to happen: an airplane's flight is fixed once
			// launched. Re-add it to send its new flight in full; clients
			// apply removals before additions.
			delta.AirplanesRemoved = append(delta.AirplanesRemoved, a.Id)
			delta.AirplanesAdded = append(delta.AirplanesAdded, a)
		case !armyEqual(p.Army, a.Army):
			delta.AirplanesUpdated = append(delta.AirplanesUpdated, &msg.AirplaneUpdate{Id: a.Id, Army: a.Army})
		}
	}
	for _, a := range prev.Airplanes {
		if _, ok := curAirplanes[a.Id]; !ok {
			delta.AirplanesRemoved = append(delta.AirplanesRemoved, a.Id)
		}
	}
	return delta
}

func islandsByID(islands []*msg.Island) map[string]*msg.Island {
	m := make(map[string]*msg.Island, len(islands))
	for _, island := range islands {
		m[island.Id] = island
	}
	return m
}

func armyEqual(a, b *msg.Army) bool {
	return a.GetOwnerId() == b.GetOwnerId() && a.GetStrength() == b.GetStrength()
}

// airplaneFlightEqual reports whether a and b have the same flight, i.e. what
// a client needs to compute an airplane's position over time. The position
// itself changes every tick and is not compared. Neither are destination_id
// and launch_seq, which are only sent to the airplane's owner: they are
// cleared when a player leaves and their airplanes become neutral, and
// clients only use them when an airplane is added.
func airplaneFlightEqual(a, b *msg.Airplane) bool {
	return a.Direction == b.Direction && a.Speed == b.Speed
}
