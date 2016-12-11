package controller

import (
	"context"
	"errors"
	"github.com/verath/archipelago/lib/event"
	"github.com/verath/archipelago/lib/model"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/action"
)

// The playerProxy represents a player connection as a single player part
// of the game model. This is done by translating actions produced by the
// player connection, adding the playerId this proxy represents to each
// action.
type playerProxy struct {
	playerID     model.PlayerID
	playerClient *network.Client
}

func (pp *playerProxy) NextAction(ctx context.Context) (action.Action, error) {
	_, err := pp.playerClient.NextAction(ctx)
	if err != nil {
		return nil, err
	}
	// TODO: remove
	act, _ := action.NewLaunchAction(model.Coordinate{0,0}, model.Coordinate{9,9}, pp.playerID)
	return act, nil
}

func (pp *playerProxy) SendEvent(ctx context.Context, evt event.Event) error {
	playerEvt := evt.ToPlayerEvent(pp.playerID)
	return pp.playerClient.SendEvent(ctx, playerEvt)
}

func newPlayerProxy(player *model.Player, playerClient *network.Client) (*playerProxy, error) {
	if player == nil {
		return nil, errors.New("player cannot be nil")
	}
	return &playerProxy{
		playerID:     player.ID(),
		playerClient: playerClient,
	}, nil
}
