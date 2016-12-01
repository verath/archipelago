package websocket

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/verath/archipelago/lib/event"
	"github.com/verath/archipelago/lib/logutil"
	"github.com/verath/archipelago/lib/network"
	"log"
	"sync"
	"time"
)

// Time until a client is considered disconnected
var heartbeatTimeout time.Duration = 20 * time.Second

type playerConn struct {
	log *logrus.Logger

	mu           sync.Mutex
	conn         *websocket.Conn
	actionCh     chan network.PlayerAction
	disconnectCh chan interface{}

	listenerMu sync.RWMutex
	listeners  []chan<- network.PlayerAction
}

func (pc *playerConn) disconnect() {
}

func (pc *playerConn) heartbeat(ctx context.Context, heartbeatCh <-chan interface{}) {
	timer := time.NewTimer(heartbeatTimeout)
	for {
		select {
		case <-ctx.Done():
			return
		case <-timer.C:
			log.Println("playerConn: heartbeat timeout, disconnecting...")
			pc.disconnect()
			return
		case <-heartbeatCh:
			if !timer.Stop() {
				<-timer.C
			}
			timer.Reset(heartbeatTimeout)
		}
	}
}

func (pc *playerConn) dispatchAction(action network.PlayerAction) {
	pc.listenerMu.Lock()
	defer pc.listenerMu.Unlock()
	for _, listener := range pc.listeners {
		listener <- action
	}
}

func (pc *playerConn) run(ctx context.Context) {
	logEntry := logutil.ModuleEntryWithID(pc.log, "ws/playerconn")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	<-ctx.Done()
}

func (pc *playerConn) AddActionListener(listener chan<- network.PlayerAction) {
	pc.listenerMu.Lock()
	defer pc.listenerMu.Unlock()

	// We check if we are disconnected here as, if we were,
	// adding the channel would result in it never getting
	// any actions. Instead we close it directly.
	select {
	case <-pc.disconnectCh:
		close(listener)
	default:
		pc.listeners = append(pc.listeners, listener)
	}
}

func (pc *playerConn) RemoveActionListener(listener chan<- network.PlayerAction) {
	pc.listenerMu.Lock()
	defer pc.listenerMu.Unlock()

	for i, l := range pc.listeners {
		if l == listener {
			lastIdx := len(pc.listeners) - 1
			pc.listeners[i] = pc.listeners[lastIdx]
			pc.listeners = pc.listeners[:lastIdx]
		}
	}
}

func (pc *playerConn) OnEvent(event event.Event) {
	logEntry := logutil.ModuleEntryWithID(pc.log, "ws/playerconn")

	pc.mu.Lock()
	err := pc.conn.WriteJSON(event)
	pc.mu.Unlock()
	if err != nil {
		logEntry.WithError(err).Error("Could not write json, closing")
		close(pc.actionCh)
		close(pc.disconnectCh)
	}
}

func (pc *playerConn) DisconnectChannel() <-chan interface{} {
	return pc.disconnectCh
}

func newPlayerConn(conn *websocket.Conn, log *logrus.Logger) *playerConn {
	return &playerConn{
		log:          log,
		conn:         conn,
		actionCh:     make(chan network.PlayerAction, 0),
		disconnectCh: make(chan interface{}, 0),
	}
}
