package websocket

import (
	"errors"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/util"
	"net/http"
)

var upgrader = websocket.Upgrader{
	// TODO: should we allow all origins?
	CheckOrigin: func(r *http.Request) bool { return true },
}

func handleWSConn(log *logrus.Logger, clientPool *network.ClientPool, wsConn *websocket.Conn) error {
	conn, err := newConnection(log, wsConn)
	if err != nil {
		return fmt.Errorf("Failed creating connection: %v", err)
	}

	select {
	case clientPool.AddCh() <- conn:
	default:
		return errors.New("Client dropped, addCh was full")
	}
	return nil
}

// Returns an http handler that connects websockets requests
// to the client pool
func ConnectHandler(log *logrus.Logger, clientPool *network.ClientPool) http.Handler {
	logEntry := util.ModuleLogEntry(log, "ws/ConnectHandler")

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		wsConn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			logEntry.WithError(err).Warn("Failed upgrading to websocket")
			return
		}

		// Move off the http request go-routine, so it can handle another req
		go func() {
			err := handleWSConn(log, clientPool, wsConn)
			if err != nil {
				logEntry.WithError(err).Error("Error handling ws connection")
			}
		}()
	})
}
