package action

import (
	"errors"
	"fmt"
	"github.com/verath/archipelago/lib/event"
	"github.com/verath/archipelago/lib/model"
)

type launchAction struct {
	from    model.Coordinate
	to      model.Coordinate
	ownerID model.PlayerID
}

func (a *launchAction) Apply(g *model.Game) ([]event.EventBuilder, error) {
	fromIsland := g.Island(a.from)
	toIsland := g.Island(a.to)

	if a.from == a.to {
		return nil, errors.New("from == to")
	}

	if fromIsland == nil {
		return nil, errors.New("from island does not exist")
	}

	if fromIsland.Strength() < 2 {
		return nil, errors.New("from island strength < 2")
	}

	if toIsland == nil {
		return nil, errors.New("to island does not exist")
	}

	if !fromIsland.IsOwnedBy(a.ownerID) {
		return nil, errors.New("owner does not own from island")
	}

	// Launch an airplane with half the army of the island
	islandStr := fromIsland.Strength()
	airplaneStr := islandStr / 2
	fromIsland.SetStrength(islandStr - airplaneStr)

	airplane, err := model.NewAirplane(a.from, a.to, fromIsland.Owner(), airplaneStr)
	if err != nil {
		return nil, fmt.Errorf("Error creating airplane: %v", err)
	}
	g.AddAirplane(airplane)
	return nil, nil
}

func newLaunchAction(from model.Coordinate, to model.Coordinate, ownerID model.PlayerID) (*launchAction, error) {
	la := &launchAction{
		from:    from,
		to:      to,
		ownerID: ownerID,
	}
	return la, nil
}

type launchActionBuilder struct {
	From model.Coordinate `json:"from"`
	To   model.Coordinate `json:"to"`
}

func (la *launchActionBuilder) Build(playerID model.PlayerID) (Action, error) {
	return newLaunchAction(la.From, la.To, playerID)
}
