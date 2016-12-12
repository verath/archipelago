package websocket

import (
	"context"
	"errors"
	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/verath/archipelago/lib/logutil"
	"github.com/verath/archipelago/lib/network"
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
)

var newline = []byte{'\n'}

// connection represents a websocket connection and handles reading
// and writing bytes to that connection.
//
// This implementation is mostly taken from the gorilla chat example
// with some minor modifications. See:
// https://github.com/gorilla/websocket/blob/master/examples/chat/client.go
type connection struct {
	log  *logrus.Logger
	conn *websocket.Conn

	// Channel closed when we have been asked to disconnect
	disconnectCh chan struct{}

	sendCh    chan []byte
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

func (c *connection) Disconnect() {
	select {
	case <-c.disconnectCh:
		// Already signaled to disconnect
	default:
		// TODO: race, fix
		close(c.disconnectCh)
	}
}

// Starts the connection and blocks until the connection is
// disconnected. Canceling the context will force the connection
// to shutdown. Run always returns a non-nil error
func (c *connection) Run(ctx context.Context) error {
	logEntry := logutil.ModuleEntryWithID(c.log, "ws/connection")
	logEntry.Info("Started")
	defer logEntry.Info("Stopped")

	ctx, cancel := context.WithCancel(ctx)
	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		defer wg.Done()
		defer cancel()
		err := c.writePump(ctx, c.disconnectCh, c.sendCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("writePump quit")
		}
	}()

	err := c.readPump(ctx, c.receiveCh)
	if err != nil && err != context.Canceled {
		logEntry.WithError(err).Error("readPump quit")
	}
	cancel()

	logEntry.Debug("Waiting for writePump to quit")
	wg.Wait()
	return err
}

func newConnection(log *logrus.Logger, conn *websocket.Conn) (*connection, error) {
	return &connection{
		log:          log,
		conn:         conn,
		disconnectCh: make(chan struct{}),
		sendCh:       make(chan []byte),
		receiveCh:    make(chan []byte),
	}, nil
}
