package main

import (
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib"
	"os"
	"os/signal"
	"context"
)

func main() {
	log := logrus.New()
	log.Level = logrus.DebugLevel
	log.Formatter = &logrus.TextFormatter{}

	ctx, halt := context.WithCancel(context.Background())

	// Listen for interrupts
	sigs := make(chan os.Signal, 2)
	signal.Notify(sigs, os.Interrupt, os.Kill)
	go func() {
		<-sigs
		log.WithField("module", "main").Info("Caught interrupt, shutting down")
		halt()
	}()

	archipelago.Run(ctx, log)
	halt()
}
