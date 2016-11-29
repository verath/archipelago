package archipelago

import (
	"context"
	"github.com/Sirupsen/logrus"
	"sync"
	"github.com/verath/archipelago/lib/network/websocket"
	"github.com/verath/archipelago/lib/network"
	"github.com/verath/archipelago/lib/controller"
)

func Run(ctx context.Context, log *logrus.Logger) {
	logEntry := log.WithField("module", "archipelago")
	logEntry.Info("Starting...")

	var wg sync.WaitGroup
	ctx, cancel := context.WithCancel(ctx)
	playerConnCh := make(chan network.PlayerConn, 0)

	socketServer := websocket.NewServer(log)
	wg.Add(1)
	go func() {
		if err := socketServer.Run(ctx, playerConnCh); err != nil {
			logEntry.WithField("err", err).Error("WSS shutdown")
		} else {
			logEntry.Info("WSS shutdown")
		}
		cancel()
		wg.Done()
	}()

	gc := controller.NewGameCoordinator(log)
	wg.Add(1)
	go func() {
		if err := gc.Run(ctx, playerConnCh); err != nil {
			logEntry.WithField("err", err).Error("GC shutdown")
		} else {
			logEntry.Info("GC shutdown")
		}
		cancel()
		wg.Done()
	}()

	wg.Wait()
	close(playerConnCh)
	logEntry.Info("Shutdown")
}
