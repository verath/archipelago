package websocket

import (
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/network"
	"net/http"
)

// The websocket.Upgrader used for all upgrades from http -> ws.
var wsUpgrader = websocket.Upgrader{
	// TODO: should we allow all origins?
	CheckOrigin: func(r *http.Request) bool { return true },
}

// The upgradeHandler is an http.Handler that attempts to upgrade
// handled connections to websocket connections. Once upgraded,
// the connection is wrapped in a client and posted to the
// registered ClientConnectListener.
type upgradeHandler struct {
	logEntry    *logrus.Entry
	connHandler network.ConnectionHandler
}

// Creates a new UpgradeHandler, notifying the connectListener for clients
// successfully created.
func NewUpgradeHandler(log *logrus.Logger, connListener network.ConnectionHandler) *upgradeHandler {
	return &upgradeHandler{
		logEntry:    common.ModuleLogEntry(log, "websocket/wsConnHandler"),
		connHandler: connListener,
	}
}

// ServeHTTP is called on each http request that matches our handler.
// We try to upgrade each such request to a websocket connection.
func (h *upgradeHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	wsConn, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		h.logEntry.WithError(err).Warn("Failed upgrading to websocket")
		return
	}
	go func() {
		err := h.handleWSConn(wsConn)
		if err != nil {
			h.logEntry.WithError(err).Error("Error handling ws connection")
		}
	}()
}

// handleWSConn wraps the gorilla websocket in our own wsConnection
// and forwards the connection to the connection handler.
func (h *upgradeHandler) handleWSConn(wsConn *websocket.Conn) error {
	conn, err := newWSConnection(wsConn)
	if err != nil {
		return fmt.Errorf("Failed creating connection: %v", err)
	}
	if err := h.connHandler.HandleConnection(conn); err != nil {
		return err
	}
	return nil
}
