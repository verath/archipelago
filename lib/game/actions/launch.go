package actions

import (
	"fmt"
	"github.com/verath/archipelago/lib/game/events"
	"github.com/verath/archipelago/lib/game/model"
)

type launchAction struct {
	From model.IslandID `json:"from"`
	To   model.IslandID `json:"to"`

	ownerID model.PlayerID
}

// We implement ToAction by setting the ownerID property and returning
// ourselves, as we already implement the Action interface.
func (a *launchAction) ToAction(playerID model.PlayerID) Action {
	a.ownerID = playerID
	return a
}

func (a *launchAction) Apply(g *model.Game) ([]events.Event, error) {
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

	if !fromIsland.IsOwnedBy(owningPlayer) {
		return nil, newInvalidActionError(owningPlayer, "to island does not exist")

	}

	if fromIsland.Strength() < 2 {
		return nil, newIllegalActionError(owningPlayer, "from island strength < 2")
	}

	// Launch an airplane with half the army of the island
	islandStr := fromIsland.Strength()
	airplaneStr := islandStr / 2
	fromIsland.SetStrength(islandStr - airplaneStr)

	airplane, err := model.NewAirplane(fromIsland, toIsland, owningPlayer, airplaneStr)
	if err != nil {
		return nil, fmt.Errorf("Error creating airplane: %v", err)
	}
	g.AddAirplane(airplane)
	return nil, nil
}
