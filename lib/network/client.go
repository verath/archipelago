package network

import (
	"context"
	"errors"
	"fmt"
	"io"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
	"golang.org/x/time/rate"
)

const (
	// Time allowed to write a message to the peer.
	writeTimeout = 10 * time.Second

	// Time allowed to read a message from the peer.
	readTimeout = 10 * time.Second

	// Send pings to peer with this period. Must be less than readTimeout.
	pingPeriod = 5 * time.Second

	// Maximum message size allowed from peer. With compression this limits
	// both the compressed and the decompressed size of a message.
	maxMessageSize = 2048

	// Messages smaller than this are sent uncompressed, also when compression
	// was negotiated. Deflating a game delta (typically < 128 bytes) makes it
	// 7-16% larger, while larger messages shrink to 50-85%.
	minCompressSize = 128

	// readQueueSize is the max number of messages read from the peer but
	// not yet by ReadMessage.
	readQueueSize = 32

	// shutdownWait is the max time Run waits for the connection to shut down
	// cleanly when disconnecting, before force closing it.
	shutdownWait = 10 * time.Second

	// readLimitRate is the rate limit bucket refill rate [token/s].
	readLimitRate = rate.Limit(10)

	// readLimitBurst is the rate limit bucket size.
	readLimitBurst = 10
)

var (
	// ErrPeerClosed is wrapped by the errors of reading from a Client that
	// the peer closed on purpose (e.g. a websocket close frame when a browser
	// tab is closed), rather than the connection breaking.
	ErrPeerClosed = errors.New("peer closed the connection")

	// ErrClientDisconnected is the error returned when trying to read or
	// write a message to/from a client that has disconnected.
	ErrClientDisconnected = errors.New("Client has disconnected")

	// errMessageTooBig is returned when a message read from the peer
	// decompresses to more than maxMessageSize bytes.
	errMessageTooBig = errors.New("message exceeds read limit")
)

// A Client is a websocket connection to a remote peer, to which it is
// possible to send and receive binary messages. Encoding and decoding
// messages is left to the caller. A Client is created by an Upgrader, and
// must be run with Run.
type Client struct {
	// The websocket connection used.
	ws *websocket.Conn
	// writeMu must be held to write a data message to ws. Control frames
	// are written with WriteControl, which may be called concurrently.
	writeMu sync.Mutex
	// netConn is the connection ws reads and writes on, used for counting
	// wire bytes. May be nil, then no wire bytes are counted.
	netConn *countingConn

	// readQueue holds the messages the read pump has read from ws.
	readQueue chan []byte

	// peerClosed is set when the peer closed the connection on purpose,
	// see ErrPeerClosed.
	peerClosed atomic.Bool

	// disconnected is canceled when the Client has started disconnecting.
	// The Client should not be expected to successfully perform reads or
	// writes after.
	disconnected context.Context
	disconnect   context.CancelFunc

	messagesRead        atomic.Int64
	messagesWritten     atomic.Int64
	payloadBytesRead    atomic.Int64
	payloadBytesWritten atomic.Int64
}

// newClient creates a new Client on the gorilla websocket connection ws.
// netConn should be the connection ws uses, or nil.
func newClient(ws *websocket.Conn, netConn *countingConn) *Client {
	disconnected, disconnect := context.WithCancel(context.Background())
	return &Client{
		ws:           ws,
		netConn:      netConn,
		readQueue:    make(chan []byte, readQueueSize),
		disconnected: disconnected,
		disconnect:   disconnect,
	}
}

// Disconnect requests that the Client disconnects. Disconnect does not
// block. After the first call Disconnect is a no-op.
func (c *Client) Disconnect() {
	c.disconnect()
}

// PeerClosed reports whether the client disconnected because the peer
// closed the connection on purpose (see ErrPeerClosed). It is set before
// DisconnectCh is closed.
func (c *Client) PeerClosed() bool {
	return c.peerClosed.Load()
}

// DisconnectCh is a channel closed when the client is disconnected.
// A disconnected client will not successfully perform any reads or
// writes.
func (c *Client) DisconnectCh() <-chan struct{} {
	return c.disconnected.Done()
}

// Stats returns the traffic counters of the connection. Safe to call
// concurrently with reads and writes, and after the connection is closed.
func (c *Client) Stats() Stats {
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

// ReadMessage reads a message from the client. This method blocks until
// a message can be read, an error occurs, or the context is cancelled. The
// error wraps ErrPeerClosed if the client disconnected because the peer
// closed the connection on purpose.
func (c *Client) ReadMessage(ctx context.Context) ([]byte, error) {
	select {
	case msg := <-c.readQueue:
		return msg, nil
	case <-c.disconnected.Done():
		if c.peerClosed.Load() {
			return nil, fmt.Errorf("%w: %w", ErrClientDisconnected, ErrPeerClosed)
		}
		return nil, ErrClientDisconnected
	case <-ctx.Done():
		return nil, ctx.Err()
	}
}

// WriteMessage writes a binary message to the client. This method blocks
// until the message has been written, an error occurs, or the context is
// cancelled. Canceling the context, or disconnecting the client, while the
// message is being written closes the connection.
func (c *Client) WriteMessage(ctx context.Context, msg []byte) error {
	c.writeMu.Lock()
	defer c.writeMu.Unlock()
	if c.disconnected.Err() != nil {
		return ErrClientDisconnected
	}
	// A write normally takes no time, but one to a peer that stopped reading
	// blocks until its deadline. Its caller should not have to wait for that
	// once the client is disconnected (e.g. a session that resumes the game
	// on a new connection), and a close frame would not get through anyway.
	stopDisconnect := context.AfterFunc(c.disconnected, func() { c.ws.Close() })
	defer stopDisconnect()
	stopCtx := context.AfterFunc(ctx, func() { c.ws.Close() })
	defer stopCtx()

	deadline := time.Now().Add(writeTimeout)
	if ctxDeadline, ok := ctx.Deadline(); ok && ctxDeadline.Before(deadline) {
		deadline = ctxDeadline
	}
	if err := c.ws.SetWriteDeadline(deadline); err != nil {
		return fmt.Errorf("failed setting write deadline: %w", err)
	}
	// No-op if compression was not negotiated.
	c.ws.EnableWriteCompression(len(msg) >= minCompressSize)
	if err := c.ws.WriteMessage(websocket.BinaryMessage, msg); err != nil {
		return fmt.Errorf("failed writing message to wsConn: %w", err)
	}
	c.messagesWritten.Add(1)
	c.payloadBytesWritten.Add(int64(len(msg)))
	return nil
}

// Run runs the Client: it reads messages from the peer, for ReadMessage,
// and pings the peer, until the context is cancelled, the client is
// disconnected, or an error occurs. On Disconnect, the connection is shut
// down cleanly, with a close frame, otherwise it is closed. The connection
// is closed when Run returns, which is nil after a clean shutdown.
//
// Reading continuously, also while nothing calls ReadMessage (e.g. while
// waiting in the lobby for a game), is what notices that the peer went away.
func (c *Client) Run(ctx context.Context) error {
	readErrCh := make(chan error, 1)
	go func() { readErrCh <- c.readPump() }()
	pingDone := make(chan struct{})
	go func() {
		defer close(pingDone)
		c.pingLoop()
	}()
	defer func() { <-pingDone }()

	select {
	case err := <-readErrCh:
		c.disconnect()
		c.ws.Close()
		return fmt.Errorf("readPump quit: %w", err)
	case <-c.disconnected.Done():
		err := c.shutdown()
		<-readErrCh
		return err
	case <-ctx.Done():
		c.disconnect()
		c.ws.Close()
		<-readErrCh
		return ctx.Err()
	}
}

// readPump continuously reads messages from the connection and posts them
// on the readQueue, until an error occurs.
func (c *Client) readPump() error {
	c.ws.SetReadLimit(maxMessageSize)
	// A pong proves the peer is still connected, see pingLoop.
	c.ws.SetPongHandler(func(string) error {
		return c.extendReadDeadline()
	})
	limiter := rate.NewLimiter(readLimitRate, readLimitBurst)
	for {
		if !limiter.Allow() {
			return errors.New("client read rate limit exceeded")
		}
		msg, err := c.readMessage()
		if err != nil {
			// Set before returning, i.e. before disconnected is canceled.
			if errors.Is(err, ErrPeerClosed) {
				c.peerClosed.Store(true)
			}
			return fmt.Errorf("error reading from connection: %w", err)
		}
		select {
		case c.readQueue <- msg:
		default:
			return errors.New("readQueue was full")
		}
	}
}

// readMessage reads a binary message from the websocket connection. The
// error wraps ErrPeerClosed if the peer closed the connection on purpose.
func (c *Client) readMessage() ([]byte, error) {
	if err := c.extendReadDeadline(); err != nil {
		return nil, err
	}
	msgType, msg, err := c.readLimited()
	if err != nil {
		// A close frame from the peer, e.g. the browser tab was closed.
		// gorilla reports a connection that just ended (EOF) as a close with
		// code 1006, which is never sent in a close frame.
		var closeErr *websocket.CloseError
		if errors.As(err, &closeErr) && closeErr.Code != websocket.CloseAbnormalClosure {
			return nil, fmt.Errorf("Failed reading message: %w: %w", ErrPeerClosed, err)
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

// readLimited reads the next message from ws, failing if it is larger than
// maxMessageSize. ws's read limit applies to the frame size, which for a
// compressed message is the compressed size, so we also limit the
// decompressed size here to not read e.g. a 2KiB message that inflates to
// 2MiB.
func (c *Client) readLimited() (int, []byte, error) {
	messageType, r, err := c.ws.NextReader()
	if err != nil {
		return messageType, nil, err
	}
	msg, err := io.ReadAll(io.LimitReader(r, maxMessageSize+1))
	if err != nil {
		return messageType, nil, err
	}
	if len(msg) > maxMessageSize {
		return messageType, nil, errMessageTooBig
	}
	return messageType, msg, nil
}

// extendReadDeadline makes reads fail if nothing, not even a pong, is read
// from the peer within readTimeout.
func (c *Client) extendReadDeadline() error {
	if err := c.ws.SetReadDeadline(time.Now().Add(readTimeout)); err != nil {
		return fmt.Errorf("failed extending read deadline: %w", err)
	}
	return nil
}

// pingLoop writes a ping message to the peer every pingPeriod, which the
// peer replies to with a pong, until the client is disconnected or a ping
// fails.
func (c *Client) pingLoop() {
	ticker := time.NewTicker(pingPeriod)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			// If the connection broke, so do reads, which ends Run.
			if err := c.ws.WriteControl(websocket.PingMessage, nil, time.Now().Add(writeTimeout)); err != nil {
				return
			}
		case <-c.disconnected.Done():
			return
		}
	}
}

// shutdown writes a websocket close frame to the peer, waiting at most
// shutdownWait, and then closes the connection.
func (c *Client) shutdown() error {
	defer c.ws.Close()
	if err := c.ws.WriteControl(websocket.CloseMessage, []byte{}, time.Now().Add(shutdownWait)); err != nil {
		return fmt.Errorf("failed writing CloseMessage: %w", err)
	}
	return nil
}
