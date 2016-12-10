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

func (a *launchAction) Apply(g *model.Game) ([]event.Event, error) {
	fromIsland := g.Island(a.from)
	if fromIsland == nil {
		return nil, errors.New("from island does not exist")
	}

	if fromIsland.Strength() < 2 {
		return nil, errors.New("from island strength < 2")
	}

	if g.Island(a.to) == nil {
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

func NewLaunchAction(from model.Coordinate, to model.Coordinate, ownerID model.PlayerID) (*launchAction, error) {
	if from == to {
		return nil, errors.New("from == to")
	}
	la := &launchAction{
		from:    from,
		to:      to,
		ownerID: ownerID,
	}
	return la, nil
}
