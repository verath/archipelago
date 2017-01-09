package websocket

import (
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/util"
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
	logEntry        *logrus.Entry
	connectListener network.ClientConnectListener
}

// Creates a new UpgradeHandler, notifying the connectListener for clients
// successfully created.
func NewUpgradeHandler(log *logrus.Logger, connectListener network.ClientConnectListener) *upgradeHandler {
	return &upgradeHandler{
		logEntry:        util.ModuleLogEntry(log, "websocket/wsConnHandler"),
		connectListener: connectListener,
	}
}

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

func (h *upgradeHandler) handleWSConn(wsConn *websocket.Conn) error {
	// Wrap the gorilla websocket in our wsConnection, wrap
	// that in a Client, then notify the listener
	conn, err := newWSConnection(wsConn)
	if err != nil {
		return fmt.Errorf("Failed creating connection: %v", err)
	}
	client, err := network.NewClient(h.logEntry.Logger, conn)
	if err != nil {
		return fmt.Errorf("Failed creating client: %v", err)
	}
	h.connectListener.OnClientConnected(client)
	return nil
}
