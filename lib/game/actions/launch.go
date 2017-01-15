package actions

import (
	"errors"
	"fmt"
	"github.com/verath/archipelago/lib/game/events"
	"github.com/verath/archipelago/lib/game/model"
)

type launchAction struct {
	From model.IslandID `json:"from"`
	To   model.IslandID `json:"to"`

	playerID model.PlayerID
}

// We implement ToAction by setting the playerID property and returning
// ourselves, as we already implement the Action interface.
func (a *launchAction) ToAction(playerID model.PlayerID) Action {
	a.playerID = playerID
	return a
}

func (a *launchAction) Apply(g *model.Game) ([]events.Event, error) {
	if a.From == a.To {
		return nil, errors.New("from == to")
	}

	fromIsland := g.Island(a.From)
	toIsland := g.Island(a.To)
	owningPlayer := g.Player(a.playerID)

	if fromIsland == nil {
		return nil, errors.New("from island does not exist")
	}
	if toIsland == nil {
		return nil, errors.New("to island does not exist")
	}
	if owningPlayer == nil {
		return nil, errors.New("owning player does not exist")
	}

	if !fromIsland.IsOwnedBy(owningPlayer) {
		return nil, errors.New("owner does not own from island")
	}

	if fromIsland.Strength() < 2 {
		return nil, errors.New("from island strength < 2")
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
