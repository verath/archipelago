package websocket

import (
	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/network"
	"net/http"
)

// wsVersion is the version of the websocket protocol that the server
// is currently implementing. Used to make sure that the client "talks"
// the same version as we do.
const wsVersion = "1"

// The websocket.Upgrader used for all upgrades from http -> ws.
var wsUpgrader = websocket.Upgrader{}

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
// We try to upgrade each such request to a websocket connection. We also
// check the version ("v") parameter, to make sure the client is talking
// the same websocket version as we are.
func (h *upgradeHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	clientWSVersion := r.URL.Query().Get("v")
	if clientWSVersion != wsVersion {
		h.logEntry.Warnf("Not upgrading to websocket, version " +
			"missmatch (client: %v, server: %v)", clientWSVersion, wsVersion)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}
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
