package websocket

import (
	"context"
	"errors"
	"fmt"
	"io"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
	"github.com/verath/archipelago/lib/network"
)

const (
	// Time allowed to write a message to the peer.
	connWriteTimeout = 10 * time.Second

	// Time allowed to read a message from the peer.
	connReadTimeout = 10 * time.Second

	// Send pings to peer with this period. Must be less than connReadTimeout.
	connPingPeriod = 5 * time.Second

	// Maximum message size allowed from peer. With compression this limits
	// both the compressed and the decompressed size of a message.
	connMaxMessageSize = 2048

	// Messages smaller than this are sent uncompressed, also when compression
	// was negotiated. Deflating a game delta (typically < 128 bytes) makes it
	// 7-16% larger, while larger messages shrink to 50-85%.
	connMinCompressSize = 128
)

// errMessageTooBig is returned when a message read from the peer
// decompresses to more than connMaxMessageSize bytes.
var errMessageTooBig = errors.New("message exceeds read limit")

// WSConnection is an adapter for a gorilla/websocket Conn implementing the
// network.Connection interface.
type WSConnection struct {
	// The websocket connection used
	wsConn *websocket.Conn
	// A mutex that must be held to write to the wsConn. This mutex
	// is required as our read spawns an internal ping-writing goroutine.
	writeMu sync.Mutex

	// netConn is the connection wsConn reads and writes on, used for
	// counting wire bytes. May be nil, then no wire bytes are counted.
	netConn *countingConn

	messagesRead        atomic.Int64
	messagesWritten     atomic.Int64
	payloadBytesRead    atomic.Int64
	payloadBytesWritten atomic.Int64
}

// newWSConnection creates a new WSConnection, wrapping the provided gorilla
// wsConn. netConn should be the connection wsConn uses, or nil.
func newWSConnection(wsConn *websocket.Conn, netConn *countingConn) *WSConnection {
	return &WSConnection{
		wsConn:  wsConn,
		netConn: netConn,
	}
}

// Stats returns the traffic counters of the connection. Safe to call
// concurrently with reads and writes, and after the connection is closed.
func (c *WSConnection) Stats() Stats {
	stats := Stats{
		MessagesRead:        c.messagesRead.Load(),
		MessagesWritten:     c.messagesWritten.Load(),
		PayloadBytesRead:    c.payloadBytesRead.Load(),
		PayloadBytesWritten: c.payloadBytesWritten.Load(),
	}
	if c.netConn != nil {
		stats.WireBytesRead = c.netConn.bytesRead.Load()
		stats.WireBytesWritten = c.netConn.bytesWritten.Load()
	}
	return stats
}

// ReadMessage reads a binary message from the websocket connection. Blocks
// until a message has been read, an error occurs, or the context is canceled.
// Only a single goroutine may call ReadMessage at a time. If ReadMessage
// returns an error it should not be called again.
func (c *WSConnection) ReadMessage(ctx context.Context) (msg []byte, err error) {
	msgType, msg, err := c.readMessage(ctx)
	if err != nil {
		// A close frame from the peer, e.g. the browser tab was closed.
		// gorilla reports a connection that just ended (EOF) as a close with
		// code 1006, which is never sent in a close frame.
		var closeErr *websocket.CloseError
		if errors.As(err, &closeErr) && closeErr.Code != websocket.CloseAbnormalClosure {
			return nil, fmt.Errorf("Failed reading message: %w: %w", network.ErrPeerClosed, err)
		}
		return nil, fmt.Errorf("Failed reading message: %w", err)
	}
	if msgType != websocket.BinaryMessage {
		return nil, fmt.Errorf("Unexpected message type '%d'", msgType)
	}
	c.messagesRead.Add(1)
	c.payloadBytesRead.Add(int64(len(msg)))
	return msg, nil
}

// WriteMessage writes a text message to the websocket connection. Blocks until
// the message is sent, an error occurs, or the context is canceled.
func (c *WSConnection) WriteMessage(ctx context.Context, message []byte) error {
	c.writeMu.Lock()
	defer c.writeMu.Unlock()
	// No-op if compression was not negotiated.
	c.wsConn.EnableWriteCompression(len(message) >= connMinCompressSize)
	if err := c.writeMessage(ctx, websocket.BinaryMessage, message); err != nil {
		return err
	}
	c.messagesWritten.Add(1)
	c.payloadBytesWritten.Add(int64(len(message)))
	return nil
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
				return fmt.Errorf("failed writing ping: %w", err)
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
		return 0, nil, fmt.Errorf("failed extending read deadline: %w", err)
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
			return fmt.Errorf("failed extending read deadline: %w", err)
		}
		return nil
	})
	// Read message.
	messageType, msg, err := c.readLimited()
	// Wait for pingLoop to quit.
	close(pingQuitCh)
	if pingErr := <-pingErrCh; err == nil {
		err = pingErr
	}
	return messageType, msg, err
}

// readLimited reads the next message from wsConn, failing if it is larger
// than connMaxMessageSize. wsConn's read limit applies to the frame size,
// which for a compressed message is the compressed size, so we also limit the
// decompressed size here to not read e.g. a 2KiB message that inflates to
// 2MiB.
func (c *WSConnection) readLimited() (int, []byte, error) {
	messageType, r, err := c.wsConn.NextReader()
	if err != nil {
		return messageType, nil, err
	}
	msg, err := io.ReadAll(io.LimitReader(r, connMaxMessageSize+1))
	if err != nil {
		return messageType, nil, err
	}
	if len(msg) > connMaxMessageSize {
		return messageType, nil, errMessageTooBig
	}
	return messageType, msg, nil
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
		return fmt.Errorf("failed setting write deadline: %w", err)
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
	err := c.wsConn.WriteMessage(messageType, msg)
	if err != nil {
		err = fmt.Errorf("failed writing message to wsConn: %w", err)
	}
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
		return fmt.Errorf("failed writing CloseMessage: %w", err)
	}
	return c.wsConn.Close()
}
