package websocket

import (
	"context"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
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

// WSConnection is an adapter for a gorilla/websocket Conn implementing the
// network.Connection interface.
type WSConnection struct {
	// The websocket connection used
	wsConn *websocket.Conn
	// A mutex that must be held to write to the wsConn. This mutex
	// is required as our read spawns an internal ping-writing goroutine.
	writeMu sync.Mutex
}

// newWSConnection creates a new WSConnection, wrapping the provided gorilla
// wsConn.
func newWSConnection(wsConn *websocket.Conn) (*WSConnection, error) {
	if wsConn == nil {
		return nil, errors.New("wsConn cannot be nil")
	}
	return &WSConnection{
		wsConn: wsConn,
	}, nil
}

// ReadMessage reads a binary message from the websocket connection. Blocks
// until a message has been read, an error occurs, or the context is canceled.
// Only a single goroutine may call ReadMessage at a time. If ReadMessage
// returns an error it should not be called again.
func (c *WSConnection) ReadMessage(ctx context.Context) (msg []byte, err error) {
	msgType, msg, err := c.readMessage(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "Failed reading message")
	}
	if msgType != websocket.BinaryMessage {
		return nil, errors.Errorf("Unexpected message type '%d'", msgType)
	}
	return msg, nil
}

// WriteMessage writes a text message to the websocket connection. Blocks until
// the message is sent, an error occurs, or the context is canceled.
func (c *WSConnection) WriteMessage(ctx context.Context, message []byte) error {
	c.writeMu.Lock()
	defer c.writeMu.Unlock()
	return c.writeMessage(ctx, websocket.BinaryMessage, message)
}

// Shutdown attempts to cleanly shutdown the connection, sending a websocket
// close frame to the client and then closing the connection. Blocks until
// the shutdown is complete, or the context is cancelled.
func (c *WSConnection) Shutdown(ctx context.Context) error {
	return c.shutdown(ctx)
}

// Close closes the connection, without sending a close message. Closing the
// connection will make all current and future readers and writers fail.
func (c *WSConnection) Close() error {
	return c.wsConn.Close()
}

// pingLoop writes a ping message to the websocket connection every
// connPingPeriod.
func (c *WSConnection) pingLoop(ctx context.Context, quitCh <-chan struct{}) error {
	ticker := time.NewTicker(connPingPeriod)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			if err := c.writePing(ctx); err != nil {
				return errors.Wrap(err, "failed writing ping")
			}
		case <-quitCh:
			return nil
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

// readMessage reads a message from the underlying websocket connection.
// If readMessage returns an error, it must not be called again. The
// method blocks until a message is read.
func (c *WSConnection) readMessage(ctx context.Context) (int, []byte, error) {
	ctxDeadline, hasCtxDeadline := ctx.Deadline()
	extendReadDeadline := func() error {
		readDeadline := time.Now().Add(connReadTimeout)
		if hasCtxDeadline && ctxDeadline.Before(readDeadline) {
			readDeadline = ctxDeadline
		}
		return c.wsConn.SetReadDeadline(readDeadline)
	}
	if err := extendReadDeadline(); err != nil {
		return 0, nil, errors.Wrap(err, "failed extending read deadline")
	}
	c.wsConn.SetReadLimit(connMaxMessageSize)
	// Send pings and listen for pongs during read. We extend the the timeout
	// when a pong is received as it proves the peer is still connected.
	pingQuitCh := make(chan struct{})
	pingErrCh := make(chan error)
	go func() {
		pingErrCh <- c.pingLoop(ctx, pingQuitCh)
	}()
	c.wsConn.SetPongHandler(func(string) error {
		if err := ctx.Err(); err != nil {
			return err
		}
		if err := extendReadDeadline(); err != nil {
			return errors.Wrap(err, "failed extending read deadline")
		}
		return nil
	})
	// Read message.
	messageType, msg, err := c.wsConn.ReadMessage()
	// Wait for pingLoop to quit.
	close(pingQuitCh)
	if pingErr := <-pingErrCh; err == nil {
		err = pingErr
	}
	return messageType, msg, err
}

// writeMessage writes a message to the underlying websocket connection.
// The method must be called holding c.writeMu.
func (c *WSConnection) writeMessage(ctx context.Context, messageType int, msg []byte) error {
	writeDeadline := time.Now().Add(connWriteTimeout)
	ctxDeadline, hasCtxDeadline := ctx.Deadline()
	if hasCtxDeadline && ctxDeadline.Before(writeDeadline) {
		writeDeadline = ctxDeadline
	}
	if err := c.wsConn.SetWriteDeadline(writeDeadline); err != nil {
		return errors.Wrap(err, "failed setting write deadline")
	}
	// Spawn a goroutine that handles context cancellation by force closing
	// wsConn.
	doneCh := make(chan struct{})
	errCh := make(chan error)
	go func() {
		select {
		case <-doneCh:
			errCh <- nil
		case <-ctx.Done():
			c.wsConn.Close()
			errCh <- ctx.Err()
		}
	}()
	// Write message.
	err := errors.Wrap(c.wsConn.WriteMessage(messageType, msg),
		"failed writing message to wsConn")
	// Cleanup context cancellation goroutine.
	close(doneCh)
	ctxErr := <-errCh
	if err == nil {
		err = ctxErr
	}
	return err
}

// writePing writes a websocket PING message to the peer, which the peer
// should reply to with a PONG message.
func (c *WSConnection) writePing(ctx context.Context) error {
	c.writeMu.Lock()
	defer c.writeMu.Unlock()
	return c.writeMessage(ctx, websocket.PingMessage, []byte{})
}

// Writes a websocket close message to the client and, if successful,
// closes the connection.
func (c *WSConnection) shutdown(ctx context.Context) error {
	c.writeMu.Lock()
	defer c.writeMu.Unlock()
	err := c.writeMessage(ctx, websocket.CloseMessage, []byte{})
	if err != nil {
		return errors.Wrap(err, "failed writing CloseMessage")
	}
	return c.wsConn.Close()
}
