package network

import (
	"encoding/json"
)

// Envelope is a "container" type wrapping all messages sent
// to a peer.
type Envelope struct {
	EnvType string      `json:"type"`
	EnvData interface{} `json:"data"`
}

func (env *Envelope) Type() string {
	return env.EnvType
}

// ReceivedEnvelope is an interface for an envelope received from a peer.
type ReceivedEnvelope interface {
	// Getter for the type of the envelope. This is a user-defined string,
	// used to identify the type of data contained in the envelope.
	Type() string

	// UnmarshalData unmarshals the data held in the envelop into
	// the provided data structure.
	UnmarshalData(v interface{}) error
}

// A JSON-based implementation of the ReceivedEnvelope interface
type receivedEnvelopeImpl struct {
	Envelope
	// The data received, stored as a json.RawMessage so that
	// it can be marshalled into the appropriate data structure
	// later.
	EnvData json.RawMessage `json:"data"`
}

func (recvEnv *receivedEnvelopeImpl) UnmarshalData(v interface{}) error {
	return json.Unmarshal(recvEnv.EnvData, v)
}
