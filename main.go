package main

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib"
	"github.com/verath/archipelago/lib/logutil"
	"net/http"
	"os"
	"os/signal"
)

func main() {
	log := logrus.New()
	log.Level = logrus.DebugLevel
	log.Formatter = &logrus.TextFormatter{}
	logEntry := logutil.ModuleEntry(log, "main")

	logEntry.Info("Starting")
	defer logEntry.Info("Stopped")
	ctx, cancel := context.WithCancel(context.Background())

	// Listen for interrupts
	sigs := make(chan os.Signal, 2)
	signal.Notify(sigs, os.Interrupt, os.Kill)
	go func() {
		<-sigs
		logEntry.Info("Caught interrupt, shutting down")
		cancel()
	}()

	archipelagoGame, err := archipelago.New(log, http.Dir("static"), ":8080")
	if err != nil {
		logEntry.WithError(err).Error("Error creating game")
	}

	err = archipelagoGame.Run(ctx)
	if err != nil && err != context.Canceled {
		logEntry.WithError(err).Error("Error during Run")
	}
}
