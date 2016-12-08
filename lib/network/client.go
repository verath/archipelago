package network

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/event"
	"github.com/verath/archipelago/lib/logutil"
)

/*

// A channel that is closed to signal that PlayerConn
// connection has disconnected, and that no more actions
// will be sent.
DisconnectChannel() <-chan interface{}

// Registers a channel to be forwarded all PlayerActions
// from this PlayerConn. The channel will be closed if the
// PlayerConn is disconnected.
AddActionListener(chan<- PlayerAction)

// Deregisters a channel from the PlayerConn. If the channel
// was not registered, this method is a no-op.
RemoveActionListener(chan<- PlayerAction)

OnEvent(event.Event) error

*/

type Client struct {
	log  *logrus.Logger
	conn Connection

	sendCh    chan event.Event
	receiveCh chan PlayerAction
}

func (c *Client) readPump(ctx context.Context, inCh <-chan []byte, outCh chan<- PlayerAction) error {
	defer close(outCh)

	for {
		//var message []byte
		var ok bool

		select {
		case <-ctx.Done():
			return ctx.Err()
		case _, ok = <-inCh:
			if !ok {
				return errors.New("inCh was closed")
			}
		}

		// TODO: decode as an action and send to outCh
	}
}

func (c *Client) writePump(ctx context.Context, inCh <-chan event.Event, outCh chan<- []byte) error {
	defer close(outCh)

	for {
		var evt event.Event
		var ok bool

		select {
		case <-ctx.Done():
			return ctx.Err()
		case evt, ok = <-inCh:
			if !ok {
				return errors.New("inCh was closed")
			}
		}

		message, err := json.Marshal(evt)
		if err != nil {
			return fmt.Errorf("Error marshalling event as json: %v", err)
		}

		select {
		case <-ctx.Done():
			return ctx.Err()
		case outCh <- message:
		}
	}
}

func (c *Client) SendCh() chan<- event.Event {
	return c.sendCh
}

func (c *Client) ReceiveCh() <-chan PlayerAction {
	return c.receiveCh
}

func (c *Client) Run(ctx context.Context) error {
	logEntry := logutil.ModuleEntryWithID(c.log, "client")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	errCh := make(chan error, 0)
	ctx, cancel := context.WithCancel(ctx)

	go func() {
		err := c.readPump(ctx, c.conn.ReceiveCh(), c.receiveCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("Read pump quit")
		}
		errCh <- err
	}()
	go func() {
		err := c.writePump(ctx, c.sendCh, c.conn.SendCh())
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("Write pump quit")
		}
		errCh <- err
	}()
	go func() {
		err := c.conn.Run(ctx)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("Connection quit")
		}
		errCh <- err
	}()

	err := <-errCh
	cancel()
	<-errCh
	<-errCh
	return err
}

func NewClient(log *logrus.Logger, conn Connection) (*Client, error) {
	return &Client{
		log:       log,
		conn:      conn,
		sendCh:    make(chan event.Event),
		receiveCh: make(chan PlayerAction),
	}, nil
}
