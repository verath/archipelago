package network

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/common"
	"sync"
	"time"
)

const (
	// Max number of messages buffered in the readQueue.
	clientReadBufferSize = 32

	// Max number of messages buffered in the writeQueue.
	clientWriteBufferSize = 32

	// Max time the client will wait for the underlying connection
	// to cleanly shutdown before force closing.
	clientShutdownWait = 1 * time.Second
)

// ErrClientDisconnected is the error returned when trying to read or write
// a message to a client that has disconnected.
var ErrClientDisconnected = errors.New("Client has disconnected")

// A struct encapsulating a message to be written and a channel
// for returning the result of the write operation.
type writeRequest struct {
	// The message to send to the connection.
	msg []byte
	// A channel used to return the result of the write. Sending
	// a message to this channel must not block.
	resultCh chan<- error
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
	// Queue of writes to be made on the connection.
	writeQueue chan *writeRequest
	// Wait group used to wait for the read and write pump to finish.
	shutdownWG sync.WaitGroup
	// Lock around the disconnectCh so that it is only closed once.
	disconnectOnce sync.Once
	// Channel closed when the client is disconnected.
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

// Stops the client, disconnecting the underlying connection.
// Disconnect blocks until the client is fully stopped. Calling
// Disconnect on an already disconnected Client is a no-op.
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
	resultCh := make(chan error, 1)
	// Enqueue write request
	req := &writeRequest{msg: msg, resultCh: resultCh}
	select {
	case c.writeQueue <- req:
	case <-c.disconnectCh:
		return ErrClientDisconnected
	case <-ctx.Done():
		return ctx.Err()
	}
	// Await result of write request
	select {
	case err := <-resultCh:
		return err
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
// client is disconnected, or an error occurs. The Client is guaranteed
// to be in a disconnected state when Run returns.
func (c *Client) Run(ctx context.Context) error {
	c.logEntry.Debug("Starting")
	defer c.logEntry.Debug("Stopped")
	ctx, cancel := context.WithCancel(ctx)
	errCh := make(chan error)
	go func() {
		err := c.writePump(ctx)
		errCh <- errors.Wrap(err, "writePump quit with an error")
	}()
	go func() {
		err := c.readPump(ctx)
		errCh <- errors.Wrap(err, "readPump quit with an error")
	}()
	err := <-errCh
	cancel()
	c.disconnect()
	<-errCh
	return err
}

// Disconnects the client by closing the disconnectCh, as well as the
// underlying connection. Does not block until the read and write
// pumps have finished.
func (c *Client) disconnect() {
	c.disconnectOnce.Do(func() {
		close(c.disconnectCh)
		// By closing the underlying connection here, we force the
		// read and write pumps to get unblocked.
		ctx, cancel := context.WithTimeout(context.Background(), clientShutdownWait)
		defer cancel()
		if err := c.conn.Shutdown(ctx); err != nil {
			c.logEntry.WithError(err).Debug("Failed clean shutdown, closing.")
			c.conn.Close()
		}
		c.logEntry.Debug("Disconnected")
	})
}

// writePump continuously takes "write-requests" from the write queue and
// writes them to the connection. writePump blocks until the context is
// cancelled. It does not quit on write errors.
func (c *Client) writePump(ctx context.Context) error {
	for {
		select {
		case req := <-c.writeQueue:
			req.resultCh <- c.conn.WriteMessage(req.msg)
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

// readPump continuously reads messages from the connection and posts them
// on the readQueue. readPump blocks until a read fails, the readQueue is full
// or the context is cancelled.
func (c *Client) readPump(ctx context.Context) error {
	for {
		msg, err := c.conn.ReadMessage()
		if err != nil {
			return errors.Wrap(err, "Error reading from connection")
		}
		select {
		case c.readQueue <- msg:
		case <-ctx.Done():
			return ctx.Err()
		default:
			return errors.New("readQueue was full")
		}
	}
}
