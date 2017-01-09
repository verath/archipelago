package network

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/util"
	"sync"
	"sync/atomic"
)

var (
	ErrClientDisconnected = errors.New("Client has disconnected")
)

const (
	// Max number of messages buffered in the readQueue. If this
	// number is exceeded, the readPump will start dropping messages.
	readQueueBufferSize = 32
)

// A struct encapsulating a message to be written and a channel
// for returning the result of the write operation.
type writeRequest struct {
	envelope *envelope
	resultCh chan<- error
}

// A client represents a network peer to which it is possible to send
// and receive messages. The client handles encoding and decoding messages
// from/to envelopes, and makes sure only one read and one write is done to
// the underlying connection.
type client struct {
	logEntry *logrus.Entry
	// The underlying connection used for the client.
	conn connection
	// Buffered queue of messages that has been read from the connection.
	readQueue chan *receivedEnvelope
	// Queue of writes to be made on the connection.
	writeQueue chan *writeRequest
	// Channel closed when the client should disconnect.
	disconnectCh chan struct{}
	// Flag for if the client has been started.
	started int32
	// Wait group used to wait for the read and write pump to finish.
	shutdownWG sync.WaitGroup
	// Lock around the disconnectCh so that it is only closed once.
	disconnectOnce sync.Once
}

// Creates a new client, communicating on the provided connection
func newClient(log *logrus.Logger, conn connection) *client {
	return &client{
		logEntry:     util.ModuleLogEntryWithID(log, "network/client"),
		conn:         conn,
		readQueue:    make(chan *receivedEnvelope, readQueueBufferSize),
		writeQueue:   make(chan *writeRequest),
		disconnectCh: make(chan struct{}),
	}
}

// Starts the client. Start must be called before any other methods
// on the client. Start panics if called more than once.
func (c *client) Start() {
	if !c.setStarted() {
		panic("client: Start called when already started")
	}
	c.shutdownWG.Add(2)
	go c.readPump()
	go c.writePump()
	c.logEntry.Debug("Started")
}

// Stops the client, disconnecting the underlying connection.
// Stop blocks until the client is fully stopped.
func (c *client) Stop() {
	c.disconnect()
	c.shutdownWG.Wait()
	c.logEntry.Debug("Stopped")
}

// DisconnectCh is a channel closed when the client is disconnected.
// A disconnected client will not successfully perform any reads or
// writes.
func (c *client) DisconnectCh() <-chan struct{} {
	return c.disconnectCh
}

// Writes data to the client, provided as an envelope. Write blocks until
// the message is successfully written to the client, or the context is
// cancelled.
func (c *client) WriteEnvelope(ctx context.Context, envelope *envelope) error {
	resultCh := make(chan error)
	req := &writeRequest{envelope, resultCh}
	select {
	case c.writeQueue <- req:
		// TODO(2017-01-08): select on ctx.Done() here too?
		return <-resultCh
	case <-ctx.Done():
		return ctx.Err()
	}
}

// Reads data from the client, returned as an envelope. Read blocks until
// the read is successful, or the context is cancelled. If ReadEnvelope
// returns ErrClientDisconnected, then any future reads will also return
// the same error.
func (c *client) ReadEnvelope(ctx context.Context) (*receivedEnvelope, error) {
	select {
	case env, ok := <-c.readQueue:
		if !ok {
			return nil, ErrClientDisconnected
		}
		return env, nil
	case <-ctx.Done():
		return nil, ctx.Err()
	}
}

// Disconnects the client by closing the disconnectCh as well as the
// underlying connection. Does not block until the read and write
// pumps have finished.
func (c *client) disconnect() {
	c.disconnectOnce.Do(func() {
		close(c.disconnectCh)
		// TODO(2017-01-08): Cleanly close the conn
		// By closing the underlying connection here, we force the
		// read and write pumps to get unblocked.
		c.conn.Close()
		c.logEntry.Debug("Disconnected")
	})
}

// Sets the started flag, returning true if it had not been set previously.
func (c *client) setStarted() bool {
	return atomic.CompareAndSwapInt32(&c.started, 0, 1)
}

// Encodes and writes an envelope to the connection
func (c *client) writeEnvelope(env *envelope) error {
	msg, err := json.Marshal(env)
	if err != nil {
		return err
	}
	return c.conn.WriteMessage(msg)
}

// The write pump takes write requests from the write queue and
// writes them to the connection.
func (c *client) writePump() {
	defer c.shutdownWG.Done()
	// If we ever get an error when writing, then all following
	// writes will fail. Instead of attempting to write, we then
	// return that same error to each write request.
	var writeErr error
	for {
		select {
		case req := <-c.writeQueue:
			if writeErr == nil {
				writeErr = c.writeEnvelope(req.envelope)
			}
			req.resultCh <- writeErr
		case <-c.disconnectCh:
			return
		}
	}
}

// Reads a message from the connection and decodes it as an envelope.
func (c *client) readEnvelope() (*receivedEnvelope, error) {
	msg, err := c.conn.ReadMessage()
	if err != nil {
		return nil, fmt.Errorf("Error reading message from conn: %v", err)
	}
	recvEnv := &receivedEnvelope{}
	return recvEnv, json.Unmarshal(msg, recvEnv)
}

// The read pump reads messages from the connection and posts them on the
// read queue. If a read fails, the read pump will disconnect the client.
// If the read queue is full, any messages read will be dropped.
func (c *client) readPump() {
	defer func() {
		close(c.readQueue)
		c.shutdownWG.Done()
	}()
	for {
		select {
		default:
			env, err := c.readEnvelope()
			if err != nil {
				c.logEntry.WithError(err).Debug("Error reading from connection")
				c.disconnect()
				return
			}
			// Try to add the envelope to the readQueue. If the queue is full we
			// have to drop the message so we can continue reading, otherwise we
			// cannot detect connection errors.
			select {
			case c.readQueue <- env:
			default:
				c.logEntry.Warn("readQueue full, dropping message")
			}
		case <-c.disconnectCh:
			return
		}
	}
}
