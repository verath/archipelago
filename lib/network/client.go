package network

import (
	"context"
	"sync"
	"time"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"github.com/verath/archipelago/lib/common"
)

const (
	// clientReadBufferSize is the max number of messages buffered
	// in the readQueue.
	clientReadBufferSize = 32

	// clientWriteBufferSize is the max number of messages buffered
	// in the writeQueue.
	clientWriteBufferSize = 32

	// clientShutdownWait is the max time the client will wait for the
	// underlying connection to cleanly shutdown before force closing.
	clientShutdownWait = 10 * time.Second
)

// ErrClientDisconnected is the error returned when trying to read or write
// a message to/from a client that has disconnected.
var ErrClientDisconnected = errors.New("Client has disconnected")

// errWritePumpShutdownRequested is an error returned by the writePump when it
// quits due to shutdown requested.
var errWritePumpShutdownRequested = errors.New("client shutdown requested")

// writeRequest is a struct encapsulating a message to be written,
// and a channel for communicating when the write is done.
type writeRequest struct {
	// msg is the message to send to the connection.
	msg []byte

	// doneCh is closed when msg has been successfully written.
	doneCh chan<- struct{}
}

// A Client represents a network peer to which it is possible to send
// and receive messages, represented as byte arrays. Encoding and decoding
// messages is left to the caller.
type Client struct {
	logEntry *logrus.Entry
	// The underlying connection used for the client.
	conn Connection
	// Buffered queue of messages that has been read from the connection.
	readQueue chan []byte
	// writeQueue is a queue of writes to be made to the connection.
	writeQueue chan *writeRequest

	disconnectOnce sync.Once
	// disconnectCh is a channel that is closed when the Client has started
	// disconnecting. The Client should not be expected to sucessfully perform
	// reads or writes once disconnectCh is closed.
	disconnectCh chan struct{}
}

// NewClient creates a new Client, communicating on the provided connection.
func NewClient(log *logrus.Logger, conn Connection) (*Client, error) {
	return &Client{
		logEntry:     common.ModuleLogEntryWithID(log, "network/client"),
		conn:         conn,
		readQueue:    make(chan []byte, clientReadBufferSize),
		writeQueue:   make(chan *writeRequest, clientWriteBufferSize),
		disconnectCh: make(chan struct{}),
	}, nil
}

// Disconnect requests that the Client disconnects. Disconnect does
// not block. After the first call Disconnect is a no-op.
func (c *Client) Disconnect() {
	c.disconnect()
}

// DisconnectCh is a channel closed when the client is disconnected.
// A disconnected client will not successfully perform any reads or
// writes.
func (c *Client) DisconnectCh() <-chan struct{} {
	return c.disconnectCh
}

// WriteMessage writes a message to the client. This method blocks until
// the message has successfully been sent, an error occurs, or the context
// is cancelled.
func (c *Client) WriteMessage(ctx context.Context, msg []byte) error {
	// Enqueue write request.
	doneCh := make(chan struct{})
	req := &writeRequest{msg, doneCh}
	select {
	case c.writeQueue <- req:
	case <-c.disconnectCh:
		return ErrClientDisconnected
	case <-ctx.Done():
		return ctx.Err()
	}
	// Await write done.
	select {
	case <-doneCh:
		return nil
	case <-c.disconnectCh:
		return ErrClientDisconnected
	case <-ctx.Done():
		return ctx.Err()
	}
}

// ReadMessage reads a message from the client. This method blocks until
// a message can be read, an error occurs, or the context is cancelled.
func (c *Client) ReadMessage(ctx context.Context) ([]byte, error) {
	select {
	case msg := <-c.readQueue:
		return msg, nil
	case <-c.disconnectCh:
		return nil, ErrClientDisconnected
	case <-ctx.Done():
		return nil, ctx.Err()
	}
}

// Run starts and runs the Client, in turn starting the read and write
// pumps of the client. Run blocks until the context is cancelled, the
// client is disconnected, or an error occurs. The Client and the underlying
// connection is guaranteed to be in a disconnected state when Run returns.
func (c *Client) Run(ctx context.Context) error {
	c.logEntry.Debug("Starting")
	defer c.logEntry.Debug("Stopped")

	errCh := make(chan error)
	defer close(errCh)
	go func() {
		err := c.writePump(ctx, c.writeQueue, c.disconnectCh)
		errCh <- errors.Wrap(err, "writePump quit")
	}()
	go func() {
		err := c.readPump(ctx, c.readQueue, c.disconnectCh)
		errCh <- errors.Wrap(err, "readPump quit")
	}()

	err := <-errCh
	c.disconnect()
	if errors.Cause(err) == errWritePumpShutdownRequested {
		ctxShutdown, cancelShutdown := context.WithTimeout(ctx, clientShutdownWait)
		defer cancelShutdown()
		errShutdown := c.shutdown(ctxShutdown)
		// Always overwrite err, errWritePumpShutdownRequested is impl detail.
		err = errors.Wrap(errShutdown, "error performing requested shutdown")
	} else {
		c.conn.Close()
	}
	<-errCh
	return err
}

// writePump continuously takes "write-requests" from the writeQueue and
// writes them to the connection.
func (c *Client) writePump(ctx context.Context, writeQueue <-chan *writeRequest, disconnectCh <-chan struct{}) error {
	for {
		select {
		case req := <-writeQueue:
			if err := c.conn.WriteMessage(ctx, req.msg); err != nil {
				return errors.Wrap(err, "writing message to conn failed")
			}
			close(req.doneCh)
		case <-disconnectCh:
			// Shutdown requested, stop writing messages and quit. This makes
			// it possible for Run to safely write a shutdown message to conn,
			// without the writePump interfering.
			return errWritePumpShutdownRequested
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

// readPump continuously reads messages from the connection and posts them
// on the readQueue.
func (c *Client) readPump(ctx context.Context, readQueue chan<- []byte, disconnectCh <-chan struct{}) error {
	for {
		msg, err := c.conn.ReadMessage(ctx)
		if err != nil {
			return errors.Wrap(err, "error reading from connection")
		}
		select {
		case readQueue <- msg:
		case <-disconnectCh:
			// Shutdown requested, discard message(s). Eventually Run will
			// close conn and ReadMessage will return an error, which will
			// cause us to break out of this loop.
		default:
			return errors.New("readQueue was full")
		}
	}
}

// disconnect closes disconnectCh the first time it is called. Any following
// calls do nothing.
func (c *Client) disconnect() {
	c.disconnectOnce.Do(func() {
		close(c.disconnectCh)
	})
}

// shutdown tries to cleanly shutdown conn, or force closes the conn if a clean
// shutdown fails. conn is always closed when shutdown returns.
func (c *Client) shutdown(ctx context.Context) error {
	if err := c.conn.Shutdown(ctx); err != nil {
		c.conn.Close()
		return errors.Wrap(err, "connection shutdown failed")
	}
	return nil
}
