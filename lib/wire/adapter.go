package wire

import (
	"context"
	"fmt"

	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/wire/msg"
	"google.golang.org/protobuf/proto"
)

// ProtocolVersion is a version of the wire protocol, see EventEnvelope in
// game.proto for how they differ.
type ProtocolVersion int

const (
	// ProtocolV4 sends the full game state every tick.
	ProtocolV4 ProtocolVersion = 4
	// ProtocolV5 sends a snapshot of the game state, then deltas.
	ProtocolV5 ProtocolVersion = 5
)

// SupportedProtocolVersions returns the protocol versions ParseProtocolVersion
// accepts, as given in the "v" query parameter of the websocket URL.
func SupportedProtocolVersions() []string {
	return []string{"4", "5"}
}

// ParseProtocolVersion parses a protocol version, as given in the "v" query
// parameter of the websocket URL.
func ParseProtocolVersion(s string) (ProtocolVersion, error) {
	switch s {
	case "4":
		return ProtocolV4, nil
	case "5":
		return ProtocolV5, nil
	default:
		return 0, fmt.Errorf("unsupported protocol version %q", s)
	}
}

// PBClientAdapter is an adapter for a client that reads and writes byte slices,
// providing higher level abstractions. The encoding/decoding is based on protobuf.
//
// WritePlayerEvent must not be called concurrently, as the v5 encoding
// depends on the previously written events.
type PBClientAdapter struct {
	client  Client
	version ProtocolVersion
	// deltaEncoder encodes ticks for ProtocolV5.
	deltaEncoder deltaEncoder
}

// NewPBClientAdapter creates a new PBClientAdapter wrapping the provided
// client, encoding events with the given protocol version.
func NewPBClientAdapter(client Client, version ProtocolVersion) (*PBClientAdapter, error) {
	switch version {
	case ProtocolV4, ProtocolV5:
	default:
		return nil, fmt.Errorf("unsupported protocol version %d", version)
	}
	return &PBClientAdapter{
		client:  client,
		version: version,
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
		if ca.version == ProtocolV4 {
			// v4 clients can't resume.
			evtStart.ResumeToken = ""
			evtStart.ResumeTimeout = 0
		}
		pbMsg.Event = &msg.EventEnvelope_EventGameStart{EventGameStart: evtStart}
	case *model.PlayerEventTick:
		if ca.version == ProtocolV5 {
			pbMsg = ca.deltaEncoder.encodeTick(evt)
		} else {
			evtTick := msg.EncodeEventGameTick(evt)
			pbMsg.Event = &msg.EventEnvelope_EventGameTick{EventGameTick: evtTick}
		}
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
