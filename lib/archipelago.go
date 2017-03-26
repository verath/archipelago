package archipelago

import (
	"context"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/common"
	"github.com/verath/archipelago/lib/game"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/network/websocket"
	"net/http"
	"time"
)

const (
	// The max number of clients in the client queue
	// TODO(2017-01-13): What is an appropriate number here?
	clientQueueSize = 2

	httpReadTimeout  = 10 * time.Second
	httpWriteTimeout = 10 * time.Second
)

// archipelago is the main entry point to the game server. It is responsible for
// starting the http server, the game coordinator and connecting them.
type archipelago struct {
	logEntry *logrus.Entry

	clientQueue     *network.ClientQueue
	gameCoordinator *game.Coordinator
	httpServer      *http.Server
}

func New(log *logrus.Logger, staticRoot http.FileSystem, httpServerAddr string) (*archipelago, error) {
	logEntry := common.ModuleLogEntry(log, "archipelago")

	clientQueue, err := network.NewClientQueue(log, clientQueueSize)
	if err != nil {
		return nil, fmt.Errorf("Error creating client pool: %v", err)
	}

	gameCoordinator, err := game.NewCoordinator(log, clientQueue)
	if err != nil {
		return nil, fmt.Errorf("Error creating game coordinator: %v", err)
	}

	// Http server to server both the websocket upgrade route and the static
	// assets.
	mux := http.NewServeMux()
	mux.Handle("/ws", websocket.NewUpgradeHandler(log, clientQueue))
	mux.Handle("/", http.FileServer(staticRoot))
	server := &http.Server{
		Addr:         httpServerAddr,
		Handler:      mux,
		ReadTimeout:  httpReadTimeout,
		WriteTimeout: httpWriteTimeout,
	}

	return &archipelago{
		logEntry:        logEntry,
		clientQueue:     clientQueue,
		gameCoordinator: gameCoordinator,
		httpServer:      server,
	}, nil
}

func (a *archipelago) Run(ctx context.Context) error {
	httpErrCh := make(chan error)
	go func() { httpErrCh <- a.httpServer.ListenAndServe() }()
	err := a.gameCoordinator.Run(ctx)
	// Once the game coordinator stops, also close the http server
	// connection and wait it to stop
	if err := a.httpServer.Close(); err != nil {
		a.logEntry.WithError(err).Debug("Error closing httpServer")
	}
	httpErr := <-httpErrCh
	a.logEntry.WithError(httpErr).Error("httpServer stopped")
	return fmt.Errorf("gameCoorddinator stopped: %v", err)
}
