package model

import (
	"errors"
	"math"
	"time"
)

// ActionTick is an action that performs a tick (i.e. update)
// on the game instance.
type ActionTick struct {
	// Delta is the size of the time step that should be applied
	// to the game. Delta must be >= 0.
	Delta time.Duration
}

// Apply applies the ActionTick to the game instance.
func (at *ActionTick) Apply(game *Game) ([]Event, error) {
	if at.Delta < 0 {
		return nil, errors.New("Delta must be positive")
	}
	at.updateAirplanes(game, at.Delta)
	at.updateIslands(game, at.Delta)
	at.updateUN(game, at.Delta)
	at.updatePlayers(game, at.Delta)
	game.SetTime(game.Time() + at.Delta)
	tickEvt := &EventTick{Game: game.Copy()}
	return []Event{tickEvt}, nil
}

// leader returns the player with the most islands, or "" if no single
// player has the most.
func leader(g *Game) PlayerID {
	counts := map[PlayerID]int{}
	for _, island := range g.Islands() {
		counts[island.Owner()]++
	}
	var best PlayerID
	tie := false
	for _, p := range g.Players() {
		switch c := counts[p.ID()]; {
		case c > counts[best]:
			best, tie = p.ID(), false
		case c == counts[best] && c > 0:
			tie = true
		}
	}
	if tie {
		return ""
	}
	return best
}

func (*ActionTick) updateAirplanes(g *Game, delta time.Duration) {
	var arrivals []*Airplane
	// The leader for the bounty is who leads before this tick's arrivals.
	var bountyOn PlayerID
	if g.Rules().Bounty > 0 {
		bountyOn = leader(g)
	}
	for _, airplane := range g.Airplanes() {
		speed := airplane.Speed()
		pos := airplane.Position()
		dir := airplane.Direction()
		// Our target is an island, look up its position
		target := g.Island(airplane.Destination()).Position().ToFloatCoordinate()
		dist := math.Hypot(pos.X-target.X, pos.Y-target.Y)
		movement := speed * float64(delta)

		// Check if we reached the destination. We add a small fraction to the
		// distance travelled this tick to account for rounding errors
		// TODO(2017-03-26): Is increasing this for rounding errors necessary?
		if dist <= movement*1.001 {
			arrivals = append(arrivals, airplane)
		} else {
			pos.X += movement * math.Cos(dir)
			pos.Y += movement * math.Sin(dir)
			airplane.SetPosition(pos)
		}
	}
	// Handle arrivals
	for _, airplane := range arrivals {
		target := g.Island(airplane.Destination())
		airplaneStr := airplane.Strength()
		targetStr := target.Strength()

		if target.Owner() == airplane.Owner() {
			target.SetStrength(targetStr + airplaneStr)
		} else if target.Garrison() >= airplaneStr {
			// The garrison absorbs the whole attack, the army is untouched.
			target.SetGarrison(target.Garrison() - airplaneStr)
		} else {
			// The garrison absorbs what it can, the army fights the rest.
			airplaneStr -= target.Garrison()
			target.SetGarrison(0)
			if targetStr > airplaneStr {
				// If island str is greater, the the island remains
				// controlled by its previous owner
				target.SetStrength(targetStr - airplaneStr)
			} else if airplaneStr > targetStr {
				// If the airplane str is greater, then the airplane
				// owner takes control of the island
				strength := airplaneStr - targetStr
				if bountyOn != "" && target.IsOwnedBy(bountyOn) {
					strength += g.Rules().Bounty
				}
				target.SetStrength(strength)
				target.SetGrowthRemainder(0)
				target.SetOwner(airplane.Owner())
				target.SetGarrison(airplane.Garrison())
			} else {
				// If they are equal, the owner is set to the neutral player
				target.SetStrength(0)
				target.SetGrowthRemainder(0)
				target.SetOwner(g.PlayerNeutral().ID())
			}
		}

		g.RemoveAirplane(airplane)
	}
}

// armies returns the total army, on islands and airplanes but not counting
// garrisons, of each player that owns any.
func armies(g *Game) map[PlayerID]int64 {
	armies := make(map[PlayerID]int64)
	for _, island := range g.Islands() {
		armies[island.Owner()] += island.Strength()
	}
	for _, airplane := range g.Airplanes() {
		armies[airplane.Owner()] += airplane.Strength()
	}
	return armies
}

// growthFactors returns the upkeep growth factor of each player that owns any
// army, or nil if the game has no upkeep.
func growthFactors(g *Game) map[PlayerID]float64 {
	rules := g.Rules()
	if len(rules.Upkeep) == 0 {
		return nil
	}
	armies := armies(g)
	factors := make(map[PlayerID]float64, len(armies))
	for owner, army := range armies {
		factors[owner] = rules.GrowthFactor(army)
	}
	return factors
}

func (*ActionTick) updateIslands(g *Game, delta time.Duration) {
	factors := growthFactors(g)
	for _, island := range g.Islands() {
		size := float64(island.Size())
		// Determine change for delta, based on island size.
		var change time.Duration
		if island.IsOwnedBy(g.PlayerNeutral().ID()) {
			// Armies on neutral islands decrease over time, scaled inversely
			// by island size.
			change = -1 * time.Duration((1-size)*float64(delta))
		} else {
			// Armies on player controller islands increase over time, scaled
			// by islands size.
			// Upkeep reduces the growth of players with a large army.
			factor := 1.0
			if factors != nil {
				factor = factors[island.Owner()]
			}
			change = time.Duration(size * factor * float64(delta))
		}
		// Calculate the whole number of added strength, storing the remaining
		// "fractions" as the growth remainder.
		remainder := island.GrowthRemainder()
		addedStrength := (remainder + change) / IslandGrowthInterval
		newRemainder := (remainder + change) % IslandGrowthInterval
		newStrength := island.Strength() + int64(addedStrength)
		// Limit incremented strength to IslandGrowthCap, decremented to 0.
		newStrengthOk := false
		if change > 0 {
			newStrengthOk = float64(newStrength) < IslandGrowthCap*size
		} else if change < 0 {
			newStrengthOk = newStrength >= 0
		}
		if newStrengthOk {
			island.SetStrength(newStrength)
		}
		island.SetGrowthRemainder(newRemainder)
	}
}

// isPlayerAlive returns true if player p is still alive in game g. An alive
// player has control of at least one island or airplane.
func (*ActionTick) isPlayerAlive(g *Game, p *Player) bool {
	for _, island := range g.Islands() {
		if island.IsOwnedBy(p.ID()) {
			return true
		}
	}
	for _, airplane := range g.Airplanes() {
		if airplane.IsOwnedBy(p.ID()) {
			return true
		}
	}
	return false
}

// edgeOrigin returns where an airplane from outside the map to the island
// starts: just outside the top or bottom edge, whichever is closer.
func edgeOrigin(g *Game, island *Island) Coordinate {
	if island.Position().Y > g.Size().Y/2 {
		return Coordinate{X: island.Position().X, Y: g.Size().Y}
	}
	return Coordinate{X: island.Position().X, Y: -1}
}

// updateUN sends UN airplanes against players with a too large army, see
// Rules.UN.
func (*ActionTick) updateUN(g *Game, delta time.Duration) {
	un := g.Rules().UN
	if un == nil {
		return
	}
	armies := armies(g)
	for _, player := range g.Players() {
		if player.State() != Alive {
			continue
		}
		excess := armies[player.ID()] - un.Army
		if excess <= 0 {
			player.SetUNTimer(0)
			continue
		}
		timer := player.UNTimer() + delta
		if timer < un.Interval {
			player.SetUNTimer(timer)
			continue
		}
		player.SetUNTimer(timer - un.Interval)
		var islands []*Island
		for _, island := range g.Islands() {
			if island.IsOwnedBy(player.ID()) {
				islands = append(islands, island)
			}
		}
		if len(islands) == 0 {
			continue
		}
		// The target is picked by an increasing counter, so that it moves
		// around between the player's islands.
		target := islands[g.UNCount()%len(islands)]
		g.SetUNCount(g.UNCount() + 1)
		strength := max(1, int64(math.Ceil(un.Share*float64(excess))))
		g.AddAirplane(NewAirplane(edgeOrigin(g, target), target, g.PlayerNeutral().ID(), strength))
	}
}

// revivePlayer tries to revive a player.
// A player is revived by being given an airplane targeted at a neutral island.
// If no neutral islands are left, the player cannot be revived.
// Returns true if player was revived, false otherwise.
func (*ActionTick) revivePlayer(g *Game, player *Player) bool {
	neutralIslands := make([]*Island, 0)
	for _, island := range g.Islands() {
		if island.IsOwnedBy(g.PlayerNeutral().ID()) && island.Strength() > 0 {
			neutralIslands = append(neutralIslands, island)
		}
	}
	if len(neutralIslands) == 0 {
		return false
	}
	// Revive player by giving the player an airplane targeted at a neutral
	// island. The island is picked by an increasing counter to prevent two
	// players revived the same tick to target the same island.
	reviveCount := g.ReviveCount()
	idx := reviveCount % len(neutralIslands)
	island := neutralIslands[idx]
	strength := island.Strength()*2 + 1
	airplane := NewAirplane(edgeOrigin(g, island), island, player.ID(), strength)
	airplane.SetSpeed(AirplaneDefaultSpeed * 2)
	airplane.SetGarrison(g.Rules().ReviveGarrison)
	g.AddAirplane(airplane)
	g.SetReviveCount(reviveCount + 1)
	return true
}

func (at *ActionTick) updatePlayers(g *Game, delta time.Duration) {
	// Find players in a state that may transition to another state. Note that
	// a player does at most one state transition per tick to allow for other
	// actions (such as checking game over) to be processed in-between.
	pendingRevival := make([]*Player, 0)
	alive := make([]*Player, 0)
	for _, player := range g.Players() {
		switch player.State() {
		case Alive:
			alive = append(alive, player)
		case PendingRevival:
			pendingRevival = append(pendingRevival, player)
		}
	}
	// Alive -> PendingRevival.
	for _, player := range alive {
		if !at.isPlayerAlive(g, player) {
			player.SetState(PendingRevival)
		}
	}
	// PendingRevival -> Alive | Dead.
	for _, player := range pendingRevival {
		if at.revivePlayer(g, player) {
			player.SetState(Alive)
		} else {
			player.SetState(Dead)
		}
	}
	// Time the players holding the share of islands for a domination
	// victory.
	if dom := g.Rules().Domination; dom != nil {
		counts := map[PlayerID]int{}
		for _, island := range g.Islands() {
			counts[island.Owner()]++
		}
		for _, player := range g.Players() {
			if player.State() == Alive && float64(counts[player.ID()]) >= dom.Share*float64(len(g.Islands())) {
				player.SetDominating(player.Dominating() + delta)
			} else {
				player.SetDominating(0)
			}
		}
	}
	// Last we re-calculate fog of war for Alive players.
	for _, player := range g.Players() {
		if player.State() == Alive {
			player.SetFogOfWar(generateFogOfWar(g, player))
		} else {
			player.SetFogOfWar(nil)
		}
	}
}
