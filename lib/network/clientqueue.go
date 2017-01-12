package network

import (
	"context"
	"errors"
	"fmt"
	"github.com/Sirupsen/logrus"
)

var ErrQueueFull = errors.New("Queue is full")

// The clientQueue is a simple implementation of the ConnectionHandler interface
// that creates a client from the connection and puts the client in a queue.
type clientQueue struct {
	log   *logrus.Logger
	queue chan Client
}

// Creates a new client queue. The log is given to each client created by
// the queue. The queueSize is the maximum number of clients held by the
// queue. Connections that would exceed the queue size are dropped.
func NewClientQueue(log *logrus.Logger, queueSize int) (*clientQueue, error) {
	return &clientQueue{
		log:   log,
		queue: make(chan Client, queueSize),
	}, nil
}

// Returns the first client in the queue. Blocks until a client can be
// provided, or the context expires.
func (cq *clientQueue) NextClient(ctx context.Context) (Client, error) {
	select {
	case client := <-cq.queue:
		return client, nil
	case <-ctx.Done():
		return nil, ctx.Err()
	}
}

// Implementation the ConnectionHandler interface
func (cq *clientQueue) HandleConnection(conn connection) error {
	client, err := NewClient(cq.log, conn)
	if err != nil {
		return fmt.Errorf("Failed creating client: %v", err)
	}
	select {
	case cq.queue <- client:
		return nil
	default:
		return ErrQueueFull
	}
}
