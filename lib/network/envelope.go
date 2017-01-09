package network

import (
	"encoding/json"
)

type (
	// Envelope is the "container" type wrapping all messages.
	envelope struct {
		// The type this Envelope represents
		envType string
		// The actual data, sent or received.
		envData interface{}
	}

	// ReceivedEnvelope is an enveloped received, unmarshalling the data as
	// a json.RawMessage so that it can be appropriately handled later.
	receivedEnvelope struct {
		envelope
		envData json.RawMessage
	}
)

// Getter for the type of the envelope. This is a user-defined string,
// used to identify the type of data contained in the envelope.
func (env *envelope) Type() string {
	return env.envType
}

func (env *envelope) MarshalJSON() ([]byte, error) {
	// We implement MarshalJSON to keep the envType and envData
	// fields hidden in the API.
	return json.Marshal(&struct {
		EnvType string      `json:"type"`
		EnvData interface{} `json:"data"`
	}{
		EnvType: env.envType,
		EnvData: env.envData,
	})
}

// Creates a new envelope, used to encapsulate some data to send
// to a client.
func NewEnvelope(envType string, envData interface{}) *envelope {
	return &envelope{
		envType: envType,
		envData: envData,
	}
}

// UnmarshalData unmarshals the data held in the envelop into
// the provided data structure.
func (recvEnv *receivedEnvelope) UnmarshalData(v interface{}) error {
	return json.Unmarshal(recvEnv.envData, v)
}

func (recvEnv *receivedEnvelope) UnmarshalJSON(data []byte) error {
	decodeEnv := struct {
		EnvType string          `json:"type"`
		EnvData json.RawMessage `json:"data"`
	}{}
	err := json.Unmarshal(data, &decodeEnv)
	recvEnv.envType = decodeEnv.EnvType
	recvEnv.envData = decodeEnv.EnvData
	return err
}

