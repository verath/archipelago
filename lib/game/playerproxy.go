package game

import (
	"context"

	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/game/model"
)

// A playerProxy represents a player connection as a single player part
// of the game model. This is done by translating actions produced by the
// player connection, adding the playerId this proxy represents to each
// actions.
type playerProxy struct {
	playerID model.PlayerID
	client   Client
}

// newPlayerProxy creates a new player proxy representing the provided player
// model, writing/reading on the provided Client.
func newPlayerProxy(player *model.Player, client Client) (*playerProxy, error) {
	if player == nil {
		return nil, errors.New("player cannot be nil")
	}
	return &playerProxy{
		playerID: player.ID(),
		client:   client,
	}, nil
}

// WriteEvent takes an event, transforms it into a player event for the proxy's player
// id, then forwards the event to the underlying Client. Blocks until the event has been
// sent or the context is cancelled.
func (pp *playerProxy) WriteEvent(ctx context.Context, evt model.Event) error {
	playerEvent := evt.ToPlayerEvent(pp.playerID)
	if err := pp.client.WritePlayerEvent(ctx, playerEvent); err != nil {
		return errors.Wrap(err, "Error writing PlayerEvent to Client")
	}
	return nil
}

// ReadAction reads a PlayerAction from the underlying Client and transforms
// the PlayerAction to an Action by applying the proxy's player id. Blocks
// until an action can be read, or the context is cancelled.
func (pp *playerProxy) ReadAction(ctx context.Context) (model.Action, error) {
	playerAction, err := pp.client.ReadPlayerAction(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "Error reading player action from Client")
	}
	return playerAction.ToAction(pp.playerID), nil
}

// Disconnect disconnects the underlying Client.
func (pp *playerProxy) Disconnect() {
	pp.client.Disconnect()
}
