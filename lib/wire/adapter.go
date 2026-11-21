package wire

import (
	"context"
	"fmt"

	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/wire/msg"
	"google.golang.org/protobuf/proto"
)

// PBClientAdapter is an adapter for a client that reads and writes byte slices,
// providing higher level abstractions. The encoding/decoding is based on protobuf,
// see game.proto for the protocol.
//
// WritePlayerEvent must not be called concurrently, as the encoding of ticks
// depends on the previously written ones.
type PBClientAdapter struct {
	client Client
	// deltaEncoder encodes ticks as a snapshot, then deltas.
	deltaEncoder deltaEncoder
}

// NewPBClientAdapter creates a new PBClientAdapter wrapping the provided
// client.
func NewPBClientAdapter(client Client) *PBClientAdapter {
	return &PBClientAdapter{
		client: client,
	}
}

// Disconnect disconnects underlying client.
func (ca *PBClientAdapter) Disconnect() {
	ca.client.Disconnect()
}

// PeerClosed reports whether the underlying client disconnected because the
// peer closed the connection on purpose.
func (ca *PBClientAdapter) PeerClosed() bool {
	return ca.client.PeerClosed()
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
		pbMsg = ca.deltaEncoder.encodeTick(evt)
	case *model.PlayerEventGameOver:
		evtOver := msg.EncodeEventGameOver(evt)
		pbMsg.Event = &msg.EventEnvelope_EventGameOver{EventGameOver: evtOver}
	default:
		return fmt.Errorf("Unknown PlayerEvent type: %T", playerEvent)
	}
	if err := ca.writeProtobufMessage(ctx, pbMsg); err != nil {
		return fmt.Errorf("Error writing protobuf message to client: %w", err)
	}
	return nil
}

// ReadPlayerAction reads and decodes a PlayerAction from the underlying client.
// This method blocks until a PlayerAction is read, or the context is cancelled.
func (ca *PBClientAdapter) ReadPlayerAction(ctx context.Context) (model.PlayerAction, error) {
	actEnv := &msg.ActionEnvelope{}
	if err := ca.readProtobufMessage(ctx, actEnv); err != nil {
		return nil, fmt.Errorf("Error reading protobuf message from client: %w", err)
	}
	switch act := actEnv.Action.(type) {
	case *msg.ActionEnvelope_ActionGameLeave:
		return msg.DecodeActionGameLeave(act.ActionGameLeave), nil
	case *msg.ActionEnvelope_ActionGameLaunch:
		return msg.DecodeActionGameLaunch(act.ActionGameLaunch), nil
	default:
		return nil, fmt.Errorf("Unknown ActionEnvelope.Action type: %T", actEnv.Action)
	}
}

// writeProtobufMessage encodes and writes the given protobuf message to the underlying
// client. This method blocks until the message has been written or the context is
// cancelled.
func (ca *PBClientAdapter) writeProtobufMessage(ctx context.Context, pbMsg proto.Message) error {
	msg, err := proto.Marshal(pbMsg)
	if err != nil {
		return fmt.Errorf("Failed encoding protobuf message: %w", err)
	}
	if err := ca.client.WriteMessage(ctx, msg); err != nil {
		return fmt.Errorf("Error writing message to Client: %w", err)
	}
	return nil
}

// readProtobufMessage reads and decodes a message from the underlying client
// to the provided proto.Message. Blocks until a message is read, or the context
// is cancelled.
func (ca *PBClientAdapter) readProtobufMessage(ctx context.Context, pbMsg proto.Message) error {
	msg, err := ca.client.ReadMessage(ctx)
	if err != nil {
		return fmt.Errorf("Could not read message from Client: %w", err)
	}
	if err := proto.Unmarshal(msg, pbMsg); err != nil {
		return fmt.Errorf("Error unmarshalling message as protobuf: %w", err)
	}
	return nil
}
