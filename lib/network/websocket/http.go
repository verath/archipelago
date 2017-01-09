package websocket

import (
	"errors"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/util"
	"net/http"
	"context"
)

var wsUpgrader = websocket.Upgrader{
	// TODO: should we allow all origins?
	CheckOrigin: func(r *http.Request) bool { return true },
}

func handleWSConn(clientPool *network.ClientPool, wsConn *websocket.Conn) error {
	conn, err := newConnection(wsConn)
	if err != nil {
		return fmt.Errorf("Failed creating connection: %v", err)
	}

	return clientPool.AddConnection(conn)
}

// Returns an http handler that connects websocket requests
// to the client pool
func ConnectHandler(log *logrus.Logger, clientPool *network.ClientPool) http.Handler {
	logEntry := util.ModuleLogEntry(log, "ws/ConnectHandler")

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		wsConn, err := wsUpgrader.Upgrade(w, r, nil)
		if err != nil {
			logEntry.WithError(err).Warn("Failed upgrading to websocket")
			return
		}

		// Process the ws connection on a new go-routine, so the http request go-routine can
		// handle another request.
		go func() {
			err := handleWSConn(clientPool, wsConn)
			if err != nil {
				logEntry.WithError(err).Error("Error handling ws connection")
			}
		}()
	})
}
