package archipelago

import (
	"context"
	"fmt"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/controller"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/network/websocket"
	"github.com/verath/archipelago/lib/util"
	"net/http"
)

type archipelago struct {
	logEntry *logrus.Entry

	clientPool      *network.ClientPool
	gameCoordinator *controller.GameCoordinator
	httpServer      *network.HTTPServer
}

func (a *archipelago) Run(ctx context.Context) error {
	a.logEntry.Info("Starting")
	defer a.logEntry.Info("Stopped")

	return util.RunWithContext(ctx,
		a.gameCoordinator.Run,
		a.httpServer.Run,
	)
}

func New(log *logrus.Logger, staticRoot http.FileSystem, httpServerAddr string) (*archipelago, error) {
	logEntry := util.ModuleLogEntry(log, "archipelago")

	clientPool, err := network.NewClientPool(log)
	if err != nil {
		return nil, fmt.Errorf("Error creating client pool: %v", err)
	}

	gameCoordinator, err := controller.NewGameCoordinator(log, clientPool)
	if err != nil {
		return nil, fmt.Errorf("Error creating game coordinator: %v", err)
	}

	mux := http.NewServeMux()
	mux.Handle("/ws", websocket.ConnectHandler(log, clientPool))
	mux.Handle("/", http.FileServer(staticRoot))

	httpServer, err := network.NewServer(log, mux, httpServerAddr)
	if err != nil {
		return nil, fmt.Errorf("Error creating server: %v", err)

	}

	return &archipelago{
		logEntry:        logEntry,
		clientPool:      clientPool,
		gameCoordinator: gameCoordinator,
		httpServer:      httpServer,
	}, nil
}
