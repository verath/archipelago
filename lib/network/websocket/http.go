package websocket

import (
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"github.com/verath/archipelago/lib/common"
)

// wsVersion is the version of the websocket protocol that the server
// is currently implementing. Used to make sure that the client "talks"
// the same version as we do.
const wsVersion = "3"

func noOriginCheck(*http.Request) bool {
	return true
}

func strictOriginCheck(req *http.Request) bool {
	origin := req.Header["Origin"]
	if len(origin) == 0 {
		return true
	}
	originURL, err := url.Parse(origin[0])
	if err != nil {
		return false
	}
	originHostname := originURL.Hostname()
	if originHostname == "playarchipelago.com" {
		return true
	}
	if strings.HasSuffix(originHostname, ".playarchipelago.com") {
		return true
	}
	return false
}

// WSConnectionHandler is a handler that handles new WSConnections.
type WSConnectionHandler interface {
	HandleWSConnection(*WSConnection) error
}

// WSConnectionHandlerFunc is a function that implements the WSConnectionHandler
// interface
type WSConnectionHandlerFunc func(*WSConnection) error

// HandleWSConnection calls the function itself.
func (f WSConnectionHandlerFunc) HandleWSConnection(conn *WSConnection) error {
	return f(conn)
}

// The UpgradeHandler is an http.Handler that attempts to upgrade requests
// to websocket connections. Successful upgrades are forwarded to the registered
// WSConnectionHandler.
type UpgradeHandler struct {
	logEntry *logrus.Entry

	wsUpgrader websocket.Upgrader

	connHandlerMu sync.RWMutex
	connHandler   WSConnectionHandler
}

// NewUpgradeHandler creates a new UpgradeHandler.
func NewUpgradeHandler(log *logrus.Logger, skipWSOriginCheck bool) (*UpgradeHandler, error) {
	checkOriginFunc := strictOriginCheck
	if skipWSOriginCheck {
		checkOriginFunc = noOriginCheck
	}
	return &UpgradeHandler{
		logEntry: common.ModuleLogEntry(log, "websocket/UpgradeHandler"),
		wsUpgrader: websocket.Upgrader{
			HandshakeTimeout: 10 * time.Second,
			CheckOrigin:      checkOriginFunc,
		},
	}, nil
}

// SetConnectionHandler sets the handler for new connections.
func (h *UpgradeHandler) SetConnectionHandler(connHandler WSConnectionHandler) {
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
	wsConn, err := h.wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		h.logEntry.Warnf("Failed upgrading to websocket: %+v", err)
		return
	}
	if err := h.handleWSConn(wsConn); err != nil {
		h.logEntry.Errorf("Error handling ws connection: %+v", err)
	}
}

// handleWSConn wraps the gorilla websocket in our own WSConnection
// and forwards the connection to the connection handler.
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
	return h.connHandler.HandleWSConnection(conn)
}
