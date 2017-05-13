package game

import (
	"context"
	"encoding/json"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/game/model"
)

// A playerProxy represents a player connection as a single player part
// of the game model. This is done by translating actions produced by the
// player connection, adding the playerId this proxy represents to each
// actions.
type playerProxy struct {
	playerID model.PlayerID
	client   client
}

// newPlayerProxy creates a new player proxy representing the provided player
// model, writing/reading on the provided client.
func newPlayerProxy(player *model.Player, client client) (*playerProxy, error) {
	if player == nil {
		return nil, errors.New("player cannot be nil")
	}
	return &playerProxy{
		playerID: player.ID(),
		client:   client,
	}, nil
}

// ReadAction reads and decodes player actions from the network layer. Each player
// action is then transformed to an action for the proxy's player id. Blocks
// until the event has been sent or the context is cancelled.
func (pp *playerProxy) ReadAction(ctx context.Context) (model.Action, error) {
	msg, err := pp.client.ReadMessage(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "Could not read message from client")
	}
	env := &receivedEnvelopeImpl{}
	if err := json.Unmarshal(msg, env); err != nil {
		return nil, errors.Wrap(err, "Failed umarshaling to envelope")
	}
	playerAction, err := model.PlayerActionByType(env.Type())
	if err != nil {
		return nil, errors.Wrap(err, "Could not map envelope to action")
	}
	if err := env.UnmarshalData(playerAction); err != nil {
		return nil, errors.Wrap(err, "Could not unmarshal envelope data")
	}
	return playerAction.ToAction(pp.playerID), nil
}

// WriteEvent takes an event, transforms it into a player event for the proxy's player
// id, then forwards the event to the network layer. Blocks until the event has been
// sent or the context is cancelled.
func (pp *playerProxy) WriteEvent(ctx context.Context, evt model.Event) error {
	playerEvent := evt.ToPlayerEvent(pp.playerID)
	var evtType string
	switch playerEvent.(type) {
	case *model.PlayerEventGameStart:
		evtType = "evt_game_start"
	case *model.PlayerEventTick:
		evtType = "evt_tick"
	case *model.PlayerEventGameOver:
		evtType = "evt_game_over"
	default:
		return errors.Errorf("Unknown PlayerEvent type: %T", playerEvent)
	}
	env, err := NewEnvelope(evtType, playerEvent)
	if err != nil {
		return errors.Wrapf(err, "Error creating envelope for playerEvent: %v", playerEvent)
	}
	msg, err := json.Marshal(env)
	if err != nil {
		return errors.Wrap(err, "Failed encoding envelope")
	}
	if err := pp.client.WriteMessage(ctx, msg); err != nil {
		return errors.Wrap(err, "Error writing envelope to client")
	}
	return nil
}
