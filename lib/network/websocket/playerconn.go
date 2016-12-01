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

func (pc *playerConn) run(ctx context.Context) {
	logEntry := logutil.ModuleEntryWithID(pc.log, "ws/playerconn")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	<-ctx.Done()
}

func (pc *playerConn) ActionChannel() <-chan network.PlayerAction {
	return pc.actionCh
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
