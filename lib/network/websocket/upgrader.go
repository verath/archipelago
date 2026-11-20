package websocket

import (
	"compress/flate"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

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

// UpgraderOptions configures an Upgrader. Apart from Versions, which must be
// set, the zero value is the production configuration.
type UpgraderOptions struct {
	// Versions are the protocol versions the server implements. A client
	// requests one with the "v" query parameter of the URL; requests for
	// other versions are rejected. What the versions mean is up to the user
	// of the WSConnection, see WSConnection.Version.
	Versions []string
	// SkipOriginCheck disables checking the Origin of the request. Otherwise
	// the origin must be either exactly "playarchipelago.com" or a subdomain
	// of "playarchipelago.com".
	SkipOriginCheck bool
	// DisableCompression disables negotiating the permessage-deflate
	// extension (RFC 7692) with clients.
	DisableCompression bool
}

// Upgrader is a preconfigured wrapper around gorilla websocket.Upgrader that
// upgrades HTTP requests to websocket connections.
type Upgrader struct {
	wsUpgrader websocket.Upgrader
	versions   map[string]bool
}

// NewUpgrader creates a new Upgrader.
func NewUpgrader(opts UpgraderOptions) (*Upgrader, error) {
	if len(opts.Versions) == 0 {
		return nil, errors.New("no protocol versions")
	}
	versions := make(map[string]bool, len(opts.Versions))
	for _, v := range opts.Versions {
		versions[v] = true
	}
	checkOriginFunc := strictOriginCheck
	if opts.SkipOriginCheck {
		checkOriginFunc = noOriginCheck
	}
	return &Upgrader{
		wsUpgrader: websocket.Upgrader{
			HandshakeTimeout: 10 * time.Second,
			CheckOrigin:      checkOriginFunc,
			// Negotiate permessage-deflate if the client offers it (all
			// browsers do). gorilla only supports it without context
			// takeover, i.e. each message is compressed on its own.
			EnableCompression: !opts.DisableCompression,
		},
		versions: versions,
	}, nil
}

// Upgrade upgrades the HTTP connection to WebSocket protocol.
// Upgrade replies with an error to the client on error.
func (h *Upgrader) Upgrade(w http.ResponseWriter, r *http.Request) (*WSConnection, error) {
	// Verify client wanted version is current version.
	clientWSVersion := r.URL.Query().Get("v")
	if !h.versions[clientWSVersion] {
		err := errors.New("version missmatch")
		http.Error(w, http.StatusText(http.StatusBadRequest)+" (version missmatch)", http.StatusBadRequest)
		return nil, err
	}
	// Upgrade to a gorilla WS connection, counting the bytes sent and
	// received on the hijacked connection.
	cw := &countingResponseWriter{ResponseWriter: w}
	gorillaWSConn, err := h.wsUpgrader.Upgrade(cw, r, nil)
	if err != nil {
		// Note upgrader has already written error response.
		return nil, fmt.Errorf("upgrading to gorilla ws failed: %w", err)
	}
	// Messages are small and sent often, favor CPU over compression ratio.
	// Only fails for an invalid level.
	if err := gorillaWSConn.SetCompressionLevel(flate.BestSpeed); err != nil {
		gorillaWSConn.Close()
		return nil, fmt.Errorf("setting compression level failed: %w", err)
	}
	// Wrap in our WSConnection.
	wsConn, err := newWSConnection(gorillaWSConn, cw.conn, clientWSVersion)
	if err != nil {
		// The connection is hijacked, an HTTP error can no longer be sent.
		gorillaWSConn.Close()
		return nil, fmt.Errorf("failed creating WSConnection: %w", err)
	}
	return wsConn, nil
}
