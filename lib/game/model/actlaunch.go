package model

import (
	"github.com/pkg/errors"
)

type launchAction struct {
	From IslandID `json:"from"`
	To   IslandID `json:"to"`

	ownerID PlayerID
}

// We implement ToAction by setting the ownerID property and returning
// ourselves, as we already implement the Action interface.
func (a *launchAction) ToAction(playerID PlayerID) Action {
	a.ownerID = playerID
	return a
}

func (a *launchAction) Apply(g *Game) ([]Event, error) {
	fromIsland := g.Island(a.From)
	toIsland := g.Island(a.To)
	owningPlayer := g.Player(a.ownerID)

	if owningPlayer == nil {
		return nil, newIllegalActionError(owningPlayer, "owning player does not exist")
	}
	if fromIsland == nil {
		return nil, newIllegalActionError(owningPlayer, "from island does not exist")
	}
	if toIsland == nil {
		return nil, newIllegalActionError(owningPlayer, "to island does not exist")
	}
	if fromIsland.ID() == toIsland.ID() {
		return nil, newIllegalActionError(owningPlayer, "fromIsland == toIsland")
	}
	// The errors below might happen due to client being behind the server state,
	// as such we treat them as invalid actions rather than illegal actions.
	if !fromIsland.IsOwnedBy(owningPlayer) {
		return nil, newInvalidActionError(owningPlayer, "fromIsland is not owned by sending player")
	}
	if fromIsland.Strength() < 2 {
		return nil, newInvalidActionError(owningPlayer, "from island strength < 2")
	}

	// Launch an airplane with half the army of the island
	islandStr := fromIsland.Strength()
	airplaneStr := islandStr / 2
	fromIsland.SetStrength(islandStr - airplaneStr)

	airplane, err := NewAirplane(fromIsland, toIsland, owningPlayer, airplaneStr)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating airplane")
	}
	g.AddAirplane(airplane)
	return nil, nil
}