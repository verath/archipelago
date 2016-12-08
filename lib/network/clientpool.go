package network

import (
	"context"
	"errors"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/logutil"
	"sync"
)

const (
	// The size of the buffer for the add channel
	poolAddChannelBufferSize = 32

	// The size of the buffer for the client channel
	poolGetChannelBufferSize = 32
)

// The client pool manages connected Clients. Clients added to the pool
// should not be started yet, but is instead started when added. This is
// done so that the lifetime of the Clients are bound to the lifetime of
// the ClientPool.
type ClientPool struct {
	log *logrus.Logger

	// The addCh holds clients that has been added to the pool, but
	// that has not been started yet.
	addCh chan *Client

	// The clientCh is a buffered channel of started Clients that are
	// ready to be used.
	getCh chan *Client
}

func (pool *ClientPool) waitForNewClient(ctx context.Context, addCh <-chan *Client) (*Client, error) {
	select {
	case <-ctx.Done():
		return nil, ctx.Err()
	case client, ok := <-addCh:
		if !ok {
			return nil, errors.New("addCh closed")
		}
		return client, nil
	}
}

func (pool *ClientPool) broadcastClient(ctx context.Context, getCh chan<- *Client, client *Client) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	case getCh <- client:
		return nil
	}
}

func (pool *ClientPool) runLoop(ctx context.Context) error {
	logEntry := logutil.ModuleEntryWithID(pool.log, "clientPool")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	var err error
	var client *Client
	var clientsWG sync.WaitGroup

	for {
		client, err = pool.waitForNewClient(ctx, pool.addCh)
		if err != nil {
			err = fmt.Errorf("Error waiting for new client: %v", err)
			break
		}

		// Start the client with our current context
		clientsWG.Add(1)
		go func() {
			defer clientsWG.Done()
			err := client.Run(ctx)
			if err != nil && err != context.Canceled {
				logEntry.WithError(err).Error("Client quit")
			}
		}()

		err = pool.broadcastClient(ctx, pool.getCh, client)
		if err != nil {
			err = fmt.Errorf("Error broadcasting client: %v", err)
			break
		}
	}

	close(pool.getCh)
	clientsWG.Wait()
	return err
}

// Returns the channel for adding new clients to the pool.
func (pool *ClientPool) AddCh() chan<- *Client {
	return pool.addCh
}

// Returns the channel where clients are posted to.
func (pool *ClientPool) GetCh() <-chan *Client {
	return pool.getCh
}

func (pool *ClientPool) Run(ctx context.Context) error {
	return pool.runLoop(ctx)
}

func NewClientPool(log *logrus.Logger) (*ClientPool, error) {
	return &ClientPool{
		log:   log,
		addCh: make(chan *Client, poolAddChannelBufferSize),
		getCh: make(chan *Client, poolGetChannelBufferSize),
	}, nil
}
