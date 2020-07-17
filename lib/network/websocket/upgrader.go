package websocket

import (
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
)

// wsVersion is the version of the websocket protocol that the server
// is currently implementing. Used to make sure that the client "talks"
// the same version as we do.
const wsVersion = "4"

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

// Upgrader is a preconfigured wrapper around gorilla websocket.Upgrader that
// upgrades HTTP requests to websocket connections.
type Upgrader struct {
	wsUpgrader websocket.Upgrader
}

// NewUpgrader creates a new Upgrader.
// If skipWSOriginCheck is true then the origin of the request is not checked
// before upgrading, otherwise the origin must be either exactly
// "playarchipelago.com" domain or a subdomain of "playarchipelago.com".
func NewUpgrader(skipWSOriginCheck bool) (*Upgrader, error) {
	checkOriginFunc := strictOriginCheck
	if skipWSOriginCheck {
		checkOriginFunc = noOriginCheck
	}
	return &Upgrader{
		wsUpgrader: websocket.Upgrader{
			HandshakeTimeout: 10 * time.Second,
			CheckOrigin:      checkOriginFunc,
		},
	}, nil
}

// Upgrade upgrades the HTTP connection to WebSocket protocol.
// Upgrade replies with an error to the client on error.
func (h *Upgrader) Upgrade(w http.ResponseWriter, r *http.Request) (*WSConnection, error) {
	// Verify client wanted version is current version.
	clientWSVersion := r.URL.Query().Get("v")
	if clientWSVersion != wsVersion {
		err := errors.New("version missmatch")
		http.Error(w, http.StatusText(http.StatusBadRequest)+" (version missmatch)", http.StatusBadRequest)
		return nil, err
	}
	// Upgrade to a gorilla WS connection.
	gorillaWSConn, err := h.wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		// Note upgrader has already written error response.
		return nil, errors.Wrap(err, "upgrading to gorilla ws failed")
	}
	// Wrap in our WSConnection.
	wsConn, err := newWSConnection(gorillaWSConn)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return nil, errors.Wrap(err, "failed creating WSConnection")
	}
	return wsConn, nil
}
