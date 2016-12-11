package network

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/event"
)

type Client struct {
	log  *logrus.Logger
	conn Connection
}

func (c *Client) SendEvent(ctx context.Context, evt *event.Event) error {
	message, err := json.Marshal(evt)
	if err != nil {
		return fmt.Errorf("Error marshalling event as json: %v", err)
	}
	return c.conn.WriteMessage(ctx, message)
}

// Reads the next message from the underlying connection and returns it
// as an action builder. This method blocks until a  message can be read
// and parsed, or until the context is cancelled.
func (c *Client) NextActionBuilder(ctx context.Context) (action.ActionBuilder, error) {
	// We parse the message in two steps; First the message is read as an
	// ActionPayload where only the action type is parsed. The type is used
	// to lookup a creator for the type. The creator is then initialized
	// with the data field of the payload.
	message, err := c.conn.ReadMessage(ctx)
	if err != nil {
		return nil, err
	}

	payload := &ActionPayload{}
	if err := json.Unmarshal(message, payload); err != nil {
		return nil, fmt.Errorf("Failed unmarshaling as action payload: %v", err)
	}

	actionBuilder, ok := action.BuilderForType(payload.ActionType)
	if !ok {
		return nil, fmt.Errorf("Could not find action creator for type: %s",
			payload.ActionType)
	}
	if err := json.Unmarshal(payload.Data, actionBuilder); err != nil {
		return nil, fmt.Errorf("Failed unmarshaling payload data: %v", err)
	}
	return actionBuilder, nil
}

// Disconnect asks the Client to disconnect. This in turn will
// close the underlying connection.
func (c *Client) Disconnect() {
	c.conn.Disconnect()
}

func NewClient(log *logrus.Logger, conn Connection) (*Client, error) {
	return &Client{
		log:  log,
		conn: conn,
	}, nil
}
