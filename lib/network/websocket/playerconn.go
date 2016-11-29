package websocket

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/event"
	"log"
	"time"
)

// Time until a client is considered disconnected
var heartbeatTimeout time.Duration = 20 * time.Second

type playerConn struct {
	log *logrus.Logger

	conn *websocket.Conn
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
	pc.log.Debug("Starting player conn...")
	<-ctx.Done()
	pc.log.Info("Player conn stopped")
}

func (pc *playerConn) ActionChannel() <-chan action.Action {
	return nil
}

func (pc *playerConn) OnEvent(event event.Event) {
}

func newPlayerConn(conn *websocket.Conn, log *logrus.Logger) *playerConn {
	return &playerConn{
		log:  log,
		conn: conn,
	}
}
