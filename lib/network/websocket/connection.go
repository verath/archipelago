package websocket

import (
	"context"
	"errors"
	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/verath/archipelago/lib/logutil"
	"sync"
	"time"
)

const (
	// Time allowed to write a message to the peer.
	connWriteWait = 5 * time.Second

	// Time allowed to read the next pong message from the peer.
	connPongWait = 30 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	connPingPeriod = 25 * time.Second

	// Maximum message size allowed from peer.
	connMaxMessageSize = 512

	// Max number of buffered messages on the send channel.
	connSendBufferSize = 16
)

var newline = []byte{'\n'}

// connection represents a websocket connection and handles reading
// and writing bytes to that connection.
//
// This implementation is mostly taken from the gorilla chat example
// with some minor modifications. See:
// https://github.com/gorilla/websocket/blob/master/examples/chat/client.go
type connection struct {
	log       *logrus.Logger
	conn      *websocket.Conn
	sendCh    chan []byte
	receiveCh chan []byte
}

// The readPump is the single go-routine reading from the underlying
// ws connection. Read messages are posted on the receiveCh.
func (c *connection) readPump(receiveCh chan<- []byte) error {
	defer func() {
		close(receiveCh)
		c.conn.Close()
	}()
	c.conn.SetReadLimit(connMaxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(connPongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(connPongWait))
		return nil
	})

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			return err
		}
		receiveCh <- message
	}
}

// The writePump is the single go-routine writing to the underlying
// ws connection. Messages to write are read from the sendCh.
func (c *connection) writePump(sendCh <-chan []byte) error {
	ticker := time.NewTicker(connPingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(connWriteWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				return err
			}
		case message, ok := <-sendCh:
			c.conn.SetWriteDeadline(time.Now().Add(connWriteWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return errors.New("sendCh closed")
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return err
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			n := len(sendCh)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-sendCh)
			}

			if err := w.Close(); err != nil {
				return err
			}
		}

	}
}

// Returns the send channel. Messages on the send channel will
// be written to the underlying connection. If the send channel
// is closed, the connection will shutdown.
func (c *connection) SendCh() chan<- []byte {
	return c.sendCh
}

// Returns the receive channel, where messages received from the
// underlying connection is written. The receive channel is closed
// if the connection is disconnected.
func (c *connection) ReceiveCh() <-chan []byte {
	return c.receiveCh
}

// Starts the connection and blocks until the connection is
// disconnected. Canceling the context will force the connection
// to shutdown. Run always returns a non-nil error
func (c *connection) Run(ctx context.Context) error {
	logEntry := logutil.ModuleEntryWithID(c.log, "ws/connection")
	logEntry.Info("Started")
	defer logEntry.Info("Stopped")

	ctx, cancel := context.WithCancel(ctx)
	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		err := c.writePump(c.sendCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("writePump quit")
		}
		cancel()
		wg.Done()
	}()

	wg.Add(1)
	go func() {
		// The read and write pump does not listen for context cancellation,
		// instead we listen for cancel here and force close the conn.
		// Note that generally the connection should be closed "normally" by
		// the sender closing the sendCh.
		<-ctx.Done()
		logEntry.WithError(ctx.Err()).Info("Context done, force closing conn")
		c.conn.Close()
		wg.Done()
	}()

	err := c.readPump(c.receiveCh)
	if err != nil && err != context.Canceled {
		logEntry.WithError(err).Error("readPump quit")
	}
	cancel()

	wg.Wait()
	return err
}

func newConnection(log *logrus.Logger, conn *websocket.Conn) (*connection, error) {
	return &connection{
		log:       log,
		conn:      conn,
		sendCh:    make(chan []byte, connSendBufferSize),
		receiveCh: make(chan []byte),
	}, nil
}
