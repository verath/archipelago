package wire

import (
	"context"

	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/wire/msg"
	"google.golang.org/protobuf/proto"
)

// PBClientAdapter is an adapter for a client that reads and writes byte slices,
// providing higher level abstractions. The encoding/decoding is based on protobuf.
type PBClientAdapter struct {
	client Client
}

// NewPBClientAdapter creates a new PBClientAdapter wrapping the provided
// client.
func NewPBClientAdapter(client Client) (*PBClientAdapter, error) {
	return &PBClientAdapter{
		client: client,
	}, nil
}

// Disconnect disconnects underlying client.
func (ca *PBClientAdapter) Disconnect() {
	ca.client.Disconnect()
}

// DisconnectCh returns a channel that is closed when the underlying
// client is disconnected.
func (ca *PBClientAdapter) DisconnectCh() <-chan struct{} {
	return ca.client.DisconnectCh()
}

// WritePlayerEvent encodes and writes a PlayerEvent to the underlying client.
// This method blocks until the PlayerEvent has been written, or the context
// is cancelled.
func (ca *PBClientAdapter) WritePlayerEvent(ctx context.Context, playerEvent model.PlayerEvent) error {
	pbMsg := &msg.EventEnvelope{}
	switch evt := playerEvent.(type) {
	case *model.PlayerEventGameStart:
		evtStart := msg.EncodeEventGameStart(evt)
		pbMsg.Event = &msg.EventEnvelope_EventGameStart{EventGameStart: evtStart}
	case *model.PlayerEventTick:
		evtTick := msg.EncodeEventGameTick(evt)
		pbMsg.Event = &msg.EventEnvelope_EventGameTick{EventGameTick: evtTick}
	case *model.PlayerEventGameOver:
		evtOver := msg.EncodeEventGameOver(evt)
		pbMsg.Event = &msg.EventEnvelope_EventGameOver{EventGameOver: evtOver}
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
func (ca *PBClientAdapter) ReadPlayerAction(ctx context.Context) (model.PlayerAction, error) {
	actEnv := &msg.ActionEnvelope{}
	if err := ca.readProtobufMessage(ctx, actEnv); err != nil {
		return nil, errors.Wrap(err, "Error reading protobuf message from client")
	}
	switch act := actEnv.Action.(type) {
	case *msg.ActionEnvelope_ActionGameLeave:
		return msg.DecodeActionGameLeave(act.ActionGameLeave), nil
	case *msg.ActionEnvelope_ActionGameLaunch:
		return msg.DecodeActionGameLaunch(act.ActionGameLaunch), nil
	default:
		return nil, errors.Errorf("Unknown ActionEnvelope.Action type: %T", actEnv.Action)
	}
}

// writeProtobufMessage encodes and writes the given protobuf message to the underlying
// client. This method blocks until the message has been written or the context is
// cancelled.
func (ca *PBClientAdapter) writeProtobufMessage(ctx context.Context, pbMsg proto.Message) error {
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
func (ca *PBClientAdapter) readProtobufMessage(ctx context.Context, pbMsg proto.Message) error {
	msg, err := ca.client.ReadMessage(ctx)
	if err != nil {
		return errors.Wrap(err, "Could not read message from Client")
	}
	if err := proto.Unmarshal(msg, pbMsg); err != nil {
		return errors.Wrap(err, "Error unmarshalling message as protobuf")
	}
	return nil
}
