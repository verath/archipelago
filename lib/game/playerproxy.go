package game

import (
	"context"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/game/actions"
	"github.com/verath/archipelago/lib/game/events"
	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/network"
)

// The playerProxy represents a player connection as a single player part
// of the game model. This is done by translating actions produced by the
// player connection, adding the playerId this proxy represents to each
// actions.
type playerProxy struct {
	playerID model.PlayerID
	client   network.Client
}

func newPlayerProxy(player *model.Player, playerClient network.Client) (*playerProxy, error) {
	if player == nil {
		return nil, errors.New("player cannot be nil")
	}
	return &playerProxy{
		playerID: player.ID(),
		client:   playerClient,
	}, nil
}

// Reads and decodes player actions from the network layer. Each player
// action is then transformed to an action for the proxy's player id. Blocks
// until the event has been sent. If  the context is expired, then the
// context's error is returned.
func (pp *playerProxy) NextAction(ctx context.Context) (actions.Action, error) {
	env, err := pp.client.ReadEnvelope(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "Could not read envelope from client")
	}
	playerAction, err := actions.PlayerActionByType(env.Type())
	if err != nil {
		return nil, errors.Wrap(err, "Could not map envelope to action")
	}

	if err := env.UnmarshalData(playerAction); err != nil {
		return nil, errors.Wrap(err, "Could not unmarshal envelope data")
	}

	return playerAction.ToAction(pp.playerID), nil
}

// Takes an event, transforms it into a player event for the proxy's player id, then
// forwards the event to the network layer. Blocks until the event has been sent. If
// the context is expired, then the context's error is returned.
func (pp *playerProxy) SendEvent(ctx context.Context, evt events.Event) error {
	playerEvent := evt.ToPlayerEvent(pp.playerID)
	env, err := network.NewEnvelope(playerEvent.Type(), playerEvent.Data())
	if err != nil {
		return errors.Wrapf(err,
			"Error creating envelope for playerEvent: %v", playerEvent)
	}
	if err := pp.client.WriteEnvelope(ctx, env); err != nil {
		return errors.Wrap(err, "Error writing envelope to client")
	}
	return nil
}
