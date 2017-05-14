package websocket

import (
	"context"
	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
	"sync"
	"time"
)

const (
	// Time allowed to write a message to the peer.
	connWriteTimeout = 10 * time.Second

	// Time allowed to read a message from the peer.
	connReadTimeout = 10 * time.Second

	// Send pings to peer with this period. Must be less than connReadTimeout.
	connPingPeriod = 5 * time.Second

	// Maximum message size allowed from peer.
	connMaxMessageSize = 2048
)

// WSConnection is an adapter for a websocket Conn implementing the
// network.connection interface.
type WSConnection struct {
	// The websocket connection used
	wsConn *websocket.Conn
	// A mutex that must be held to write to the wsConn. This mutex
	// is required as our read spawns an internal ping-writing goroutine.
	writeMu sync.Mutex
	// The first error returned from reading a message from the
	// websocket connection.
	readError error
}

// newWSConnection creates a new WSConnection, wrapping the provided wsConn.
func newWSConnection(wsConn *websocket.Conn) (*WSConnection, error) {
	if wsConn == nil {
		return nil, errors.New("wsConn cannot be nil")
	}
	return &WSConnection{
		wsConn: wsConn,
	}, nil
}

// ReadMessage reads a text message from the websocket connection. Blocks until
// a message has been read. Only a single goroutine may call ReadMessage at a
// time. If ReadMessage ever returns an error, the same error will be returned
// on each following call.
func (c *WSConnection) ReadMessage() (msg []byte, err error) {
	if c.readError != nil {
		return nil, c.readError
	}
	defer func() { c.readError = err }()

	msgType, msg, err := c.readMessage()
	if err != nil {
		return nil, errors.Wrap(err, "Failed reading message")
	}
	if msgType != websocket.TextMessage {
		return nil, errors.Errorf("Unexpected message type '%d'", msgType)
	}
	return msg, nil
}

// WriteMessage writes a text message to the websocket connection. Blocks
// until the message is sent. Only a single goroutine may call WriteMessage
// at the same time.
func (c *WSConnection) WriteMessage(message []byte) (err error) {
	c.writeMu.Lock()
	defer c.writeMu.Unlock()
	return c.writeMessage(websocket.TextMessage, message)
}

// Shutdown attempts to cleanly shutdown the connection, sending a websocket
// close frame to the client and then closing the connection. Blocks until
// the shutdown is complete, or the context is cancelled.
func (c *WSConnection) Shutdown(ctx context.Context) error {
	errCh := make(chan error, 1)
	go func() { errCh <- c.shutdown() }()
	select {
	case err := <-errCh:
		return errors.Wrap(err, "Unable to cleanly shutdown")
	case <-ctx.Done():
		return ctx.Err()
	}
}

// Close closes the connection, without sending a close message. Closing the
// connection will make all current and future readers and writers fail.
func (c *WSConnection) Close() error {
	return c.wsConn.Close()
}

// pingLoop writes a ping message to the websocket connection
// every connPingPeriod. The pingLoop is stopped if the stop
// channel is closed, or if writing a ping message fails.
func (c *WSConnection) pingLoop(stop <-chan struct{}) error {
	ticker := time.NewTicker(connPingPeriod)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			if err := c.writePing(); err != nil {
				return errors.Wrap(err, "Failed writing ping message")
			}
		case <-stop:
			return nil
		}
	}
}

// readMessage reads a message from the underlying websocket connection.
// If readMessage returns an error, it must not be called again. The
// method blocks until a message is read.
func (c *WSConnection) readMessage() (messageType int, msg []byte, err error) {
	// Start a separate goroutine for sending PINGs while we are
	// waiting for a message to be read. pingLoop quitting will,
	// due to the deadline, make the ReadMessage call fail.
	stopPing := make(chan struct{})
	go c.pingLoop(stopPing)
	defer close(stopPing)

	// Set a deadline for reading a message from the connection.
	// If the client sends a pong message, the deadline for
	// reading a real message is extended.
	c.wsConn.SetReadDeadline(time.Now().Add(connReadTimeout))
	c.wsConn.SetPongHandler(func(string) error {
		c.wsConn.SetReadDeadline(time.Now().Add(connReadTimeout))
		return nil
	})
	c.wsConn.SetReadLimit(connMaxMessageSize)
	return c.wsConn.ReadMessage()
}

// writeMessage writes a message to the underlying websocket connection.
// The method must be called holding writeMu. The method blocks until the
// message is written, or for at most connWriteTimeout.
func (c *WSConnection) writeMessage(messageType int, msg []byte) error {
	c.wsConn.SetWriteDeadline(time.Now().Add(connWriteTimeout))
	return c.wsConn.WriteMessage(messageType, msg)
}

// writePing writes a websocket PING message to the peer, which the peer
// should reply to with a PONG message.
func (c *WSConnection) writePing() error {
	c.writeMu.Lock()
	defer c.writeMu.Unlock()
	return c.writeMessage(websocket.PingMessage, []byte{})
}

// Writes a websocket close message to the client and, if successful,
// closes the connection.
func (c *WSConnection) shutdown() error {
	c.writeMu.Lock()
	defer c.writeMu.Unlock()
	err := c.writeMessage(websocket.CloseMessage, []byte{})
	if err != nil {
		return errors.Wrap(err, "Failed writing websocket CloseMessage")
	}
	return c.wsConn.Close()
}
