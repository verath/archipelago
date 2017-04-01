package network

import (
	"context"
	"encoding/json"
	"github.com/Sirupsen/logrus"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/common"
	"sync"
	"sync/atomic"
	"time"
)

const (
	// Max number of messages buffered in the readQueue. If this
	// number is exceeded, the readPump will start dropping messages.
	clientReadBufferSize = 32

	// Max time the client will wait for the underlying connection
	// to cleanly shutdown before force closing.
	clientShutdownWait = 1 * time.Second
)

// A Client represents a network peer to which it is possible to send
// and receive messages. The client handles encoding and decoding messages
// from/to envelopes, and makes sure only a single read and a single write
// is simultaneously performed on the underlying connection.
type Client interface {
	// Starts the client. Start must be called before any other methods
	// on the client. Blocks until the client is started.
	Start()

	// Stops the client, disconnecting the underlying connection.
	// Disconnect blocks until the client is fully stopped. Calling
	// Disconnect on an already disconnected Client is a no-op.
	Disconnect()

	// DisconnectCh is a channel closed when the client is disconnected.
	// A disconnected client will not successfully perform any reads or
	// writes.
	DisconnectCh() <-chan struct{}

	// Writes data to the client, provided as an envelope. Blocks until the
	// message is successfully written to the client, or the context is
	// cancelled.
	WriteEnvelope(ctx context.Context, envelope *envelope) error

	// Reads data from the client, returned as an envelope. Read blocks until
	// the read is successful, or the context is cancelled.
	ReadEnvelope(ctx context.Context) (ReceivedEnvelope, error)
}

// clientImpl is an implementation of the Client interface.
type clientImpl struct {
	logEntry *logrus.Entry
	// The underlying connection used for the client.
	conn connection
	// Buffered queue of messages that has been read from the connection.
	readQueue chan *receivedEnvelopeImpl
	// Queue of writes to be made on the connection.
	writeQueue chan *writeRequest
	// Channel closed when the client should disconnect.
	disconnectCh chan struct{}
	// Flag for if the client has been started.
	started int32
	// Wait group used to wait for the read and write pump to start.
	startWG sync.WaitGroup
	// Wait group used to wait for the read and write pump to finish.
	shutdownWG sync.WaitGroup
	// Lock around the disconnectCh so that it is only closed once.
	disconnectOnce sync.Once
}

// A struct encapsulating a message to be written and a channel
// for returning the result of the write operation.
type writeRequest struct {
	envelope *envelope
	// A channel used to return the result of the write. Sending
	// a message to this channel must not block.
	resultCh chan<- error
}

// Creates a new Client, communicating on the provided connection
func NewClient(log *logrus.Logger, conn connection) (Client, error) {
	return &clientImpl{
		logEntry:     common.ModuleLogEntryWithID(log, "network/client"),
		conn:         conn,
		readQueue:    make(chan *receivedEnvelopeImpl, clientReadBufferSize),
		writeQueue:   make(chan *writeRequest),
		disconnectCh: make(chan struct{}),
	}, nil
}

func (c *clientImpl) Start() {
	if !c.setStarted() {
		c.logEntry.Warn("Start called when already started")
		return
	}
	c.startWG.Add(2)
	c.shutdownWG.Add(2)
	go c.readPump()
	go c.writePump()
	c.startWG.Wait()
	c.logEntry.Debug("Started")
}

func (c *clientImpl) Disconnect() {
	c.disconnect()
	c.shutdownWG.Wait()
	c.logEntry.Debug("Stopped")
}

func (c *clientImpl) DisconnectCh() <-chan struct{} {
	return c.disconnectCh
}

func (c *clientImpl) WriteEnvelope(ctx context.Context, envelope *envelope) error {
	resultCh := make(chan error)
	req := &writeRequest{envelope, resultCh}
	select {
	case c.writeQueue <- req:
		// TODO(2017-01-08): select on ctx.Done() here too? If we do,
		// make resultCh buffered.
		return <-resultCh
	case <-c.disconnectCh:
		return errors.New("Client has disconnected")
	case <-ctx.Done():
		return ctx.Err()
	}
}

func (c *clientImpl) ReadEnvelope(ctx context.Context) (ReceivedEnvelope, error) {
	select {
	case env, ok := <-c.readQueue:
		if !ok {
			return nil, errors.New("Client has disconnected")
		}
		return env, nil
	case <-ctx.Done():
		return nil, ctx.Err()
	}
}

// Sets the started flag, returning true if it had not been set previously.
func (c *clientImpl) setStarted() bool {
	return atomic.CompareAndSwapInt32(&c.started, 0, 1)
}

// Disconnects the client by closing the disconnectCh, as well as the
// underlying connection. Does not block until the read and write
// pumps have finished.
func (c *clientImpl) disconnect() {
	c.disconnectOnce.Do(func() {
		close(c.disconnectCh)
		// By closing the underlying connection here, we force the
		// read and write pumps to get unblocked. We first attempt a
		// clean shutdown, if it doesn't succeed within the shutdown
		// wait timeout, we force-close the connection instead.
		ctx, cancel := context.WithTimeout(context.Background(), clientShutdownWait)
		defer cancel()
		if err := c.conn.Shutdown(ctx); err != nil {
			c.logEntry.WithError(err).Debug("Failed clean shutdown, closing.")
			c.conn.Close()
		}
		c.logEntry.Debug("Disconnected")
	})
}

// Encodes and writes an envelope to the connection
func (c *clientImpl) writeEnvelope(env *envelope) error {
	msg, err := json.Marshal(env)
	if err != nil {
		return errors.Wrap(err, "Failed encoding envelope")
	}
	return c.conn.WriteMessage(msg)
}

// The write pump takes write requests from the write queue and
// writes them to the connection.
func (c *clientImpl) writePump() {
	c.startWG.Done()
	defer c.shutdownWG.Done()
	// If we ever get an error when writing, then all following
	// writes will fail. Instead of attempting to write, we store
	// and return that same error to each write request.
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
func (c *clientImpl) readEnvelope() (*receivedEnvelopeImpl, error) {
	msg, err := c.conn.ReadMessage()
	if err != nil {
		return nil, errors.Wrap(err, "Error reading message from conn")
	}
	recvEnv := &receivedEnvelopeImpl{}
	if err := json.Unmarshal(msg, recvEnv); err != nil {
		return nil, errors.Wrap(err, "Failed umarshaling to envelope")
	}
	return recvEnv, nil
}

// The read pump reads messages from the connection and posts them on the
// read queue. If a read fails, the read pump will disconnect the client.
// If the read queue is full, new messages will be dropped.
func (c *clientImpl) readPump() {
	c.startWG.Done()
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
