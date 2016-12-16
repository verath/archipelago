package network

import (
	"context"
	"errors"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/util"
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
	logEntry *logrus.Entry

	// The addCh holds Connections that has been added to the pool, but
	// that has not been started yet.
	addCh chan Connection

	// The clientCh is a buffered channel of started Clients that are
	// ready to be used.
	getCh chan *Client
}

func (pool *ClientPool) waitForNewConn(ctx context.Context, addCh <-chan Connection) (Connection, error) {
	select {
	case <-ctx.Done():
		return nil, ctx.Err()
	case conn, ok := <-addCh:
		if !ok {
			return nil, errors.New("addCh closed")
		}
		return conn, nil
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
	pool.logEntry.Info("Starting")
	defer pool.logEntry.Info("Stopped")

	ctx, cancel := context.WithCancel(ctx)
	var connWG sync.WaitGroup
	defer func() {
		// Close the getCh, as we will not be posting any more
		// new connections.
		close(pool.getCh)
		// Signal to the connections we have started to finish,
		// and wait until they have all stopped
		cancel()
		connWG.Wait()
	}()

	for {
		// Wait for a new connection to be made. Once we have on
		// we start it with our current context, essentially making
		// us the owner of its lifetime
		conn, err := pool.waitForNewConn(ctx, pool.addCh)
		if err != nil {
			return fmt.Errorf("Error waiting for new connection: %v", err)
		}
		connWG.Add(1)
		go func() {
			defer connWG.Done()
			if err := conn.Run(ctx); err != nil && err != context.Canceled {
				pool.logEntry.WithError(err).Error("Connection quit")
			}
		}()

		// Create a Client wrapping the connection and broadcast it
		client, err := NewClient(pool.logEntry.Logger, conn)
		if err != nil {
			return fmt.Errorf("Error creating client: %v", err)
		}
		if err := pool.broadcastClient(ctx, pool.getCh, client); err != nil {
			return fmt.Errorf("Error broadcasting client: %v", err)
		}
	}
}

// Returns the channel for adding new clients to the pool.
func (pool *ClientPool) AddCh() chan<- Connection {
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
	logEntry := util.ModuleLogEntryWithID(log, "clientPool")

	return &ClientPool{
		logEntry: logEntry,
		addCh:    make(chan Connection, poolAddChannelBufferSize),
		getCh:    make(chan *Client, poolGetChannelBufferSize),
	}, nil
}
