package network

import (
	"encoding/json"
	"testing"
)

func TestEnvelope_MarshalUnmarshalJSON(t *testing.T) {
	type envDataType struct{ Foo string }

	// Create a new envelope and marshal it to json
	data := envDataType{Foo: "bar"}
	env := &Envelope{"test", data}
	envJson, err := json.Marshal(env)
	if err != nil {
		t.Fatalf("Error when marshaling envelope: %v", err)
	}

	// Unmarshal the json into a receivedEnvelopeImpl, verify that
	// the type and data stays the same
	recvEnv := receivedEnvelopeImpl{}
	if err := json.Unmarshal(envJson, &recvEnv); err != nil {
		t.Fatalf("Error unmarshalling as receivedEnvelopeImpl: %v", err)
	}
	if recvEnv.Type() != env.Type() {
		t.Errorf("envelope type changed, expected: %s was: %s", env.Type(), recvEnv.Type())
	}

	recvData := envDataType{}
	if err := recvEnv.UnmarshalData(&recvData); err != nil {
		t.Fatalf("Error unmarshal received data: %v", err)
	}
	if recvData.Foo != data.Foo {
		t.Errorf("envelope data changed, expected: %s was: %s", data.Foo, recvData.Foo)
	}
}
