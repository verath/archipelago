package main

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib"
	"github.com/verath/archipelago/lib/logutil"
	"os"
	"os/signal"
)

func main() {
	log := logrus.New()
	log.Level = logrus.DebugLevel
	log.Formatter = &logrus.TextFormatter{}
	logEntry := logutil.ModuleEntry(log, "main")

	ctx, halt := context.WithCancel(context.Background())

	// Listen for interrupts
	sigs := make(chan os.Signal, 2)
	signal.Notify(sigs, os.Interrupt, os.Kill)
	go func() {
		<-sigs
		logEntry.Info("Caught interrupt, shutting down")
		halt()
	}()

	archipelagoGame := archipelago.NewArchipelago(log)
	archipelagoGame.Run(ctx)
	halt()
}
