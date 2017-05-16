package wire

import (
	"context"
	"encoding/json"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/game/model"
)

// A client represents a (remote) player connection that can be
// written to and read from.
type client interface {
	Disconnect()
	DisconnectCh() <-chan struct{}
	WriteMessage(ctx context.Context, msg []byte) error
	ReadMessage(ctx context.Context) ([]byte, error)
}

type ClientAdapter struct {
	client client
}

func NewClientAdapter(client client) (*ClientAdapter, error) {
	return &ClientAdapter{
		client: client,
	}, nil
}

func (ca *ClientAdapter) Disconnect() {
	ca.client.Disconnect()
}

func (ca *ClientAdapter) DisconnectCh() <-chan struct{} {
	return ca.client.DisconnectCh()
}

func (ca *ClientAdapter) WritePlayerEvent(ctx context.Context, evt model.PlayerEvent) error {
	evtType, err := ca.envelopeTypeByPlayerEvent(evt)
	if err != nil {
		return errors.Wrapf(err, "Could not determine envelope type for: %T", evt)
	}
	env, err := newEnvelope(evtType, evt)
	if err != nil {
		return errors.Wrapf(err, "Error creating envelope for playerEvent: %v", evt)
	}
	msg, err := json.Marshal(env)
	if err != nil {
		return errors.Wrap(err, "Failed encoding envelope")
	}
	if err := ca.client.WriteMessage(ctx, msg); err != nil {
		return errors.Wrap(err, "Error writing envelope to client")
	}
	return nil
}

func (ca *ClientAdapter) ReadPlayerAction(ctx context.Context) (model.PlayerAction, error) {
	msg, err := ca.client.ReadMessage(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "Could not read message from client")
	}
	env := &receivedEnvelopeImpl{}
	if err := json.Unmarshal(msg, env); err != nil {
		return nil, errors.Wrap(err, "Failed umarshaling to envelope")
	}
	playerAction, err := ca.envelopeToPlayerAction(env)
	if err != nil {
		return nil, errors.Wrap(err, "Could not map envelope to action")
	}
	return playerAction, nil
}

func (ca *ClientAdapter) envelopeToPlayerAction(envelope receivedEnvelope) (model.PlayerAction, error) {
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

func (ca *ClientAdapter) envelopeTypeByPlayerEvent(playerEvent model.PlayerEvent) (string, error) {
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
