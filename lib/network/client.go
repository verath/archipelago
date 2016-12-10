package network

import (
	"encoding/json"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/event"
	"context"
)

type Client struct {
	log  *logrus.Logger
	conn Connection
}

func (c *Client) SendEvent(ctx context.Context, evt event.PlayerEvent) error {
	message, err := json.Marshal(evt)
	if err != nil {
		return fmt.Errorf("Error marshalling event as json: %v", err)
	}
	return c.conn.WriteMessage(ctx, message)
}

func (c *Client) NextAction(ctx context.Context) (action.PlayerAction, error) {
	_, err := c.conn.ReadMessage(ctx)
	if err != nil {
		return nil, err
	}
	// TODO: decode json
	return nil, nil
}

func NewClient(log *logrus.Logger, conn Connection) (*Client, error) {
	return &Client{
		log:       log,
		conn:      conn,
	}, nil
}
