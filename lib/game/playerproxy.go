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
	playerAction, err := pp.envelopeToPlayerAction(env)
	if err != nil {
		return nil, errors.Wrap(err, "Could not map envelope to action")
	}
	return playerAction.ToAction(pp.playerID), nil
}

// WriteEvent takes an event, transforms it into a player event for the proxy's player
// id, then forwards the event to the network layer. Blocks until the event has been
// sent or the context is cancelled.
func (pp *playerProxy) WriteEvent(ctx context.Context, evt model.Event) error {
	playerEvent := evt.ToPlayerEvent(pp.playerID)
	evtType, err := pp.envelopeTypeByPlayerEvent(playerEvent)
	if err != nil {
		return errors.Wrapf(err, "Could not determine envelope type for: %T", playerEvent)
	}
	env, err := newEnvelope(evtType, playerEvent)
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

func (pp *playerProxy) envelopeToPlayerAction(envelope receivedEnvelope) (model.PlayerAction, error) {
	switch envelope.Type() {
	case "act_launch":
		var data struct {
			From model.IslandID `json:"from"`
			To   model.IslandID `json:"to"`
		}
		if err := envelope.UnmarshalData(&data); err != nil {
			return nil, errors.Wrap(err, "Failed unmarshaling data")
		}
		return &model.PlayerActionLaunch{From: data.From, To: data.To}, nil
	case "act_leave":
		return &model.PlayerActionLeave{}, nil
	default:
		return nil, errors.Errorf("Unknown envelope type: %v", envelope.Type())
	}
}

func (pp *playerProxy) envelopeTypeByPlayerEvent(playerEvent model.PlayerEvent) (string, error) {
	switch playerEvent.(type) {
	case *model.PlayerEventGameStart:
		return "evt_game_start", nil
	case *model.PlayerEventTick:
		return "evt_tick", nil
	case *model.PlayerEventGameOver:
		return "evt_game_over", nil
	default:
		return "", errors.Errorf("Unknown PlayerEvent type: %T", playerEvent)
	}
}
