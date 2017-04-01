package network

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/pkg/errors"
)

// The ClientQueue is a simple implementation of the ConnectionHandler interface
// that creates a client from the connection and puts the client in a queue.
type ClientQueue struct {
	log   *logrus.Logger
	queue chan Client
}

// Creates a new client queue. The log is given to each client created by
// the queue. The queueSize is the maximum number of clients held by the
// queue. Connections that would exceed the queue size are dropped.
func NewClientQueue(log *logrus.Logger, queueSize int) (*ClientQueue, error) {
	return &ClientQueue{
		log:   log,
		queue: make(chan Client, queueSize),
	}, nil
}

// Returns the first client in the queue. Blocks until a client can be
// provided, or the context expires.
func (cq *ClientQueue) NextClient(ctx context.Context) (Client, error) {
	select {
	case client := <-cq.queue:
		return client, nil
	case <-ctx.Done():
		return nil, ctx.Err()
	}
}

// Creates a Client from the connection, and adds the client to the
// queue. If the queue is full, the connection is discarded.
func (cq *ClientQueue) HandleConnection(conn connection) error {
	client, err := NewClient(cq.log, conn)
	if err != nil {
		return errors.Wrap(err, "Failed creating client for connection")
	}
	select {
	case cq.queue <- client:
		return nil
	default:
		return errors.New("Queue is full")
	}
}
