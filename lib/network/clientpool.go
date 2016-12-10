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
	logEntry := logutil.ModuleEntryWithID(pool.log, "clientPool")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	var err error
	var conn Connection
	var connWG sync.WaitGroup

	for {
		conn, err = pool.waitForNewConn(ctx, pool.addCh)
		if err != nil {
			err = fmt.Errorf("Error waiting for new connection: %v", err)
			break
		}

		// Start the connection with our current context
		connWG.Add(1)
		go func() {
			defer connWG.Done()
			err := conn.Run(ctx)
			if err != nil && err != context.Canceled {
				logEntry.WithError(err).Error("Connection quit")
			}
		}()

		// Create a Client wrapping the connection
		client, err := NewClient(pool.log, conn)
		if err != nil {
			err = fmt.Errorf("Error creating client: %v", err)
			break
		}

		err = pool.broadcastClient(ctx, pool.getCh, client)
		if err != nil {
			err = fmt.Errorf("Error broadcasting client: %v", err)
			break
		}
	}

	close(pool.getCh)
	connWG.Wait()
	return err
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
	return &ClientPool{
		log:   log,
		addCh: make(chan Connection, poolAddChannelBufferSize),
		getCh: make(chan *Client, poolGetChannelBufferSize),
	}, nil
}
