package websocket

import (
	"context"
	"errors"
	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/util"
	"sync"
	"time"
)

const (
	// Time allowed to write a message to the peer.
	connWriteWait = 5 * time.Second

	// Time allowed to read the next pong message from the peer.
	connPongWait = 30 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	connPingPeriod = 25 * time.Second

	// Maximum message size allowed from peer.
	connMaxMessageSize = 512

	// Size of the buffer used for received messages.
	connReceiveBufferSize = 16
)

// connection represents a websocket connection and handles reading
// and writing bytes to that connection.
//
// This implementation is mostly taken from the gorilla chat example
// with some minor modifications. See:
// https://github.com/gorilla/websocket/blob/master/examples/chat/client.go
type connection struct {
	logEntry *logrus.Entry
	conn     *websocket.Conn

	// "Lock" around disconnectCh, to close it only once
	dcOnce sync.Once
	// Channel closed when we have been asked to disconnect
	disconnectedCh chan struct{}

	// A channel where messages that should be written to the client
	// is sent
	sendCh chan []byte
	// A channel where messages read from the client is sent
	receiveCh chan []byte
}

// The readPump is the single go-routine reading from the underlying
// ws connection. Read messages are posted on the receiveCh.
func (c *connection) readPump(ctx context.Context, receiveCh chan<- []byte) error {
	defer func() {
		close(receiveCh)
	}()
	c.conn.SetReadLimit(connMaxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(connPongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(connPongWait))
		return nil
	})

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			return err
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		case receiveCh <- message:
		default:
			// receiveCh was full. This either means we are getting
			// messages when they are not expected, or getting more
			// messages than the server can handle. In both cases
			// we close the connection.
			return errors.New("Could not send to receiveCh without blocking")
		}
	}
}

// The writePump is the single go-routine writing to the underlying
// ws connection. Messages to write are read from the sendCh.
func (c *connection) writePump(ctx context.Context, disconnectCh <-chan struct{}, sendCh <-chan []byte) error {
	ticker := time.NewTicker(connPingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	// Helper function for attempting to write a close message
	// to the connection.
	writeClose := func() {
		c.conn.SetWriteDeadline(time.Now().Add(connWriteWait))
		c.conn.WriteMessage(websocket.CloseMessage, []byte{})
	}

	for {
		select {
		case <-disconnectCh:
			writeClose()
			return network.Disconnected
		case <-ctx.Done():
			writeClose()
			return ctx.Err()
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(connWriteWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				return err
			}
		case message := <-sendCh:
			c.conn.SetWriteDeadline(time.Now().Add(connWriteWait))
			err := c.conn.WriteMessage(websocket.TextMessage, message)
			if err != nil {
				return err
			}
		}

	}
}

func (c *connection) ReadMessage(ctx context.Context) ([]byte, error) {
	select {
	case <-ctx.Done():
		return nil, ctx.Err()
	case message, ok := <-c.receiveCh:
		if !ok {
			return nil, errors.New("receiveCh is closed")
		}
		return message, nil
	}
}

func (c *connection) WriteMessage(ctx context.Context, message []byte) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	case c.sendCh <- message:
		return nil
	}
}

func (c *connection) DisconnectedCh() <-chan struct{} {
	return c.disconnectedCh
}

func (c *connection) Disconnect() {
	c.dcOnce.Do(func() {
		close(c.disconnectedCh)
	})
}

// Starts the connection and blocks until the connection is
// disconnected. Canceling the context will force the connection
// to shutdown. Run always returns a non-nil error
func (c *connection) Run(ctx context.Context) error {
	c.logEntry.Debug("Started")
	defer c.logEntry.Debug("Stopped")

	// Signal that we disconnected if we stopped for any reason
	defer c.Disconnect()

	return util.RunWithContext(ctx,
		func(ctx context.Context) error {
			return c.writePump(ctx, c.disconnectedCh, c.sendCh)
		},
		func(ctx context.Context) error {
			return c.readPump(ctx, c.receiveCh)
		},
	)
}

func newConnection(log *logrus.Logger, conn *websocket.Conn) (*connection, error) {
	logEntry := util.ModuleLogEntryWithID(log, "ws/connection")

	return &connection{
		logEntry:       logEntry,
		conn:           conn,
		disconnectedCh: make(chan struct{}),
		sendCh:         make(chan []byte),
		receiveCh:      make(chan []byte, connReceiveBufferSize),
	}, nil
}
