package wire

import (
	"context"
	"encoding/json"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/game/model"
)

// ClientAdapter is an adapter for a client that reads and writes byte slices,
// providing higher level abstractions that also handle message encoding and
// decoding.
type ClientAdapter struct {
	client client
}

// NewClientAdapter creates a new ClientAdapter wrapping the provided
// client.
func NewClientAdapter(client client) (*ClientAdapter, error) {
	return &ClientAdapter{
		client: client,
	}, nil
}

// Disconnect disconnects underlying client.
func (ca *ClientAdapter) Disconnect() {
	ca.client.Disconnect()
}

// DisconnectCh returns a channel that is closed when the underlying
// client is disconnected.
func (ca *ClientAdapter) DisconnectCh() <-chan struct{} {
	return ca.client.DisconnectCh()
}

// WritePlayerEvent encodes and writes a PlayerEvent to the underlying connection.
// This method blocks until the PlayerEvent has been written, or the context is cancelled.
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

// ReadPlayerAction reads and decodes a PlayerAction from the underlying connection.
// This method blocks until a PlayerAction is read, or the context is cancelled.
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
