package network

import "encoding/json"

// An action payload is what is sent by the client when
// it wants to perform an action. Used to partially parse
// a payload to determine the action type.
type ActionPayload struct {
	ActionType string          `json:"action"`
	Data       json.RawMessage `json:"data"`
}
