package archipelago

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/controller"
	"github.com/verath/archipelago/lib/logutil"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/network/websocket"
	"sync"
)

type archipelago struct {
	log *logrus.Logger
}

func (a *archipelago) Run(ctx context.Context) {
	logEntry := logutil.ModuleEntry(a.log, "archipelago")
	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")

	var wg sync.WaitGroup
	ctx, cancel := context.WithCancel(ctx)
	playerConnCh := make(chan network.PlayerConn, 0)

	socketServer := websocket.NewServer(a.log)
	wg.Add(1)
	go func() {
		err := socketServer.Run(ctx, playerConnCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("WSS shutdown")
		}
		cancel()
		wg.Done()
	}()

	gc := controller.NewGameCoordinator(a.log)
	wg.Add(1)
	go func() {
		err := gc.Run(ctx, playerConnCh)
		if err != nil && err != context.Canceled {
			logEntry.WithError(err).Error("GC shutdown")
		}
		cancel()
		wg.Done()
	}()

	wg.Wait()
	close(playerConnCh)
}

func NewArchipelago(log *logrus.Logger) *archipelago {
	return &archipelago{log: log}
}
