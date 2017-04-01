package websocket

import (
	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
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
		h.logEntry.Warnf("Failed upgrading to websocket: %+v", err)
		return
	}
	go func() {
		if err := h.handleWSConn(wsConn); err != nil {
			h.logEntry.Errorf("Error handling ws connection: %+v", err)
		}
	}()
}

// handleWSConn wraps the gorilla websocket in our own wsConnection
// and forwards the connection to the connection handler.
func (h *upgradeHandler) handleWSConn(wsConn *websocket.Conn) error {
	conn, err := newWSConnection(wsConn)
	if err != nil {
		return errors.Wrap(err, "Failed creating WSConnection")
	}
	if err := h.connHandler.HandleConnection(conn); err != nil {
		return errors.Wrap(err, "Connection handler did not handle connection")
	}
	return nil
}
