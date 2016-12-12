package action

import (
	"errors"
	"fmt"
	"github.com/verath/archipelago/lib/event"
	"github.com/verath/archipelago/lib/model"
)

type launchAction struct {
	from  model.IslandID
	to    model.IslandID
	owner model.PlayerID
}

func (a *launchAction) Apply(g *model.Game) ([]event.EventBuilder, error) {
	if a.from == a.to {
		return nil, errors.New("from == to")
	}

	fromIsland := g.Island(a.from)
	toIsland := g.Island(a.to)
	owningPlayer := g.Player(a.owner)

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

func newLaunchAction(from model.IslandID, to model.IslandID, owner model.PlayerID) (*launchAction, error) {
	la := &launchAction{
		from:  from,
		to:    to,
		owner: owner,
	}
	return la, nil
}

type launchActionBuilder struct {
	From model.IslandID `json:"from"`
	To   model.IslandID `json:"to"`
}

func (la *launchActionBuilder) Build(playerID model.PlayerID) (Action, error) {
	return newLaunchAction(la.From, la.To, playerID)
}
