package network

import (
	"context"
)

// ClientQueue is a simple wrapper around a channel of Clients.
type ClientQueue struct {
	queue chan *Client
}

// Creates a new client queue. The queueSize is the maximum number of
// clients held by the queue. Adding more clients when there are already
// queueSize clients in the queue will block until a Client is taken from
// the queue.
func NewClientQueue(queueSize int) (*ClientQueue, error) {
	return &ClientQueue{
		queue: make(chan *Client, queueSize),
	}, nil
}

// NextClient returns the first client in the queue. Blocks until a client can
// be provided, or the context is cancelled.
func (cq *ClientQueue) NextClient(ctx context.Context) (*Client, error) {
	select {
	case client := <-cq.queue:
		return client, nil
	case <-ctx.Done():
		return nil, ctx.Err()
	}
}

// HandleClient adds a client to the end of the queue. Blocks until the client
// can be added, or the context is cancelled.
func (cq *ClientQueue) HandleClient(ctx context.Context, client *Client) error {
	select {
	case cq.queue <- client:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}
