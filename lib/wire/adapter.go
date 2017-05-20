package wire

import (
	"context"
	"github.com/golang/protobuf/proto"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/game/model"
)

// ClientAdapter is an adapter for a client that reads and writes byte slices,
// providing higher level abstractions that also handle message encoding and
// decoding.
type ClientAdapter struct {
	client Client
}

// NewClientAdapter creates a new ClientAdapter wrapping the provided
// client.
func NewClientAdapter(client Client) (*ClientAdapter, error) {
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

// WritePlayerEvent encodes and writes a PlayerEvent to the underlying client.
// This method blocks until the PlayerEvent has been written, or the context
// is cancelled.
func (ca *ClientAdapter) WritePlayerEvent(ctx context.Context, playerEvent model.PlayerEvent) error {
	pbMsg := &EventEnvelope{}
	switch evt := playerEvent.(type) {
	case *model.PlayerEventGameStart:
		evtStart, err := EncodeEventGameStart(evt)
		if err != nil {
			return err
		}
		pbMsg.Event = &EventEnvelope_EventGameStart{EventGameStart: evtStart}
	case *model.PlayerEventTick:
		evtTick, err := EncodeEventGameTick(evt)
		if err != nil {
			return err
		}
		pbMsg.Event = &EventEnvelope_EventGameTick{EventGameTick: evtTick}
	case *model.PlayerEventGameOver:
		evtOver, err := EncodeEventGameOver(evt)
		if err != nil {
			return err
		}
		pbMsg.Event = &EventEnvelope_EventGameOver{EventGameOver: evtOver}
	default:
		return errors.Errorf("Unknown PlayerEvent type: %T", playerEvent)
	}
	if err := ca.writeProtobufMessage(ctx, pbMsg); err != nil {
		return errors.Wrap(err, "Error writing protobuf message to client")
	}
	return nil
}

// ReadPlayerAction reads and decodes a PlayerAction from the underlying client.
// This method blocks until a PlayerAction is read, or the context is cancelled.
func (ca *ClientAdapter) ReadPlayerAction(ctx context.Context) (model.PlayerAction, error) {
	actEnv := &ActionEnvelope{}
	if err := ca.readProtobufMessage(ctx, actEnv); err != nil {
		return nil, errors.Wrap(err, "Error reading protobuf message from client")
	}
	switch act := actEnv.Action.(type) {
	case *ActionEnvelope_ActionGameLeave:
		return DecodeActionGameLeave(act.ActionGameLeave)
	case *ActionEnvelope_ActionGameLaunch:
		return DecodeActionGameLaunch(act.ActionGameLaunch)
	default:
		return nil, errors.Errorf("Unknown ActionEnvelope.Action type: %T", actEnv.Action)
	}
}

// writeProtobufMessage encodes and writes the given protobuf message to the underlying
// client. This method blocks until the message has been written or the context is
// cancelled.
func (ca *ClientAdapter) writeProtobufMessage(ctx context.Context, pbMsg proto.Message) error {
	msg, err := proto.Marshal(pbMsg)
	if err != nil {
		return errors.Wrap(err, "Failed encoding protobuf message")
	}
	if err := ca.client.WriteMessage(ctx, msg); err != nil {
		return errors.Wrap(err, "Error writing message to Client")
	}
	return nil
}

// readProtobufMessage reads and decodes a message from the underlying client
// to the provided proto.Message. Blocks until a message is read, or the context
// is cancelled.
func (ca *ClientAdapter) readProtobufMessage(ctx context.Context, pbMsg proto.Message) error {
	msg, err := ca.client.ReadMessage(ctx)
	if err != nil {
		return errors.Wrap(err, "Could not read message from Client")
	}
	if err := proto.Unmarshal(msg, pbMsg); err != nil {
		return errors.Wrap(err, "Error unmarshalling message as protobuf")
	}
	return nil
}
