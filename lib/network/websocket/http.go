package websocket

import (
	"github.com/Sirupsen/logrus"
	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/network"
	"net/http"
	"sync"
)

// wsVersion is the version of the websocket protocol that the server
// is currently implementing. Used to make sure that the client "talks"
// the same version as we do.
const wsVersion = "1"

// The websocket.Upgrader used for all upgrades from http -> ws.
var wsUpgrader = websocket.Upgrader{}

// The UpgradeHandler is an http.Handler that attempts to upgrade requests
// to websocket connections. Successful upgrades are forwarded to the registered
// ConnectionHandler.
type UpgradeHandler struct {
	logEntry *logrus.Entry

	connHandlerMu sync.RWMutex
	connHandler   network.ConnectionHandler
}

// NewUpgradeHandler creates a new UpgradeHandler.
func NewUpgradeHandler(log *logrus.Logger) (*UpgradeHandler, error) {
	return &UpgradeHandler{
		logEntry: common.ModuleLogEntry(log, "websocket/UpgradeHandler"),
	}, nil
}

func (h *UpgradeHandler) SetConnectionHandler(connHandler network.ConnectionHandler) {
	h.connHandlerMu.Lock()
	defer h.connHandlerMu.Unlock()
	h.connHandler = connHandler
}

func (h *UpgradeHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	clientWSVersion := r.URL.Query().Get("v")
	if clientWSVersion != wsVersion {
		h.logEntry.Warnf("Not upgrading to websocket, version "+
			"missmatch (client: %v, server: %v)", clientWSVersion, wsVersion)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}
	wsConn, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		h.logEntry.Warnf("Failed upgrading to websocket: %+v", err)
		return
	}
	if err := h.handleWSConn(wsConn); err != nil {
		h.logEntry.Errorf("Error handling ws connection: %+v", err)
	}
}

// handleWSConn wraps the gorilla websocket in our own wsConnection
// and forwards the connection to the connection handler (if set).
func (h *UpgradeHandler) handleWSConn(wsConn *websocket.Conn) error {
	h.connHandlerMu.RLock()
	defer h.connHandlerMu.RUnlock()
	if h.connHandler == nil {
		return errors.New("connHandler was nil")
	}
	conn, err := newWSConnection(wsConn)
	if err != nil {
		return errors.Wrap(err, "Failed creating WSConnection")
	}
	go h.connHandler.HandleConnection(conn)
	return nil
}
