package controller

import (
	"context"
	"errors"
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/event"
	"github.com/verath/archipelago/lib/model"
	"github.com/verath/archipelago/lib/network"
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
	actionBuilder, err := pp.playerClient.NextActionBuilder(ctx)
	if err != nil {
		return nil, err
	}
	return actionBuilder.Build(pp.playerID)
}

func (pp *playerProxy) SendEvent(ctx context.Context, eventBuilder event.EventBuilder) error {
	evt := eventBuilder.Build(pp.playerID)
	return pp.playerClient.SendEvent(ctx, evt)
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
