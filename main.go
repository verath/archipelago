package main

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib"
	"net/http"
	"os"
	"os/signal"
)

func main() {
	log := logrus.New()
	log.Level = logrus.DebugLevel
	log.Formatter = &logrus.TextFormatter{}

	ctx, cancel := context.WithCancel(context.Background())

	// Listen for interrupts
	sigs := make(chan os.Signal, 2)
	signal.Notify(sigs, os.Interrupt, os.Kill)
	go func() {
		<-sigs
		log.Info("Caught interrupt, shutting down")
		cancel()
		// If we get another interrupt, we force shut down
		<-sigs
		os.Exit(1)
	}()

	archipelagoGame, err := archipelago.New(log, http.Dir("static"), ":8080")
	if err != nil {
		log.WithError(err).Error("Error creating game")
	}

	log.Fatal(archipelagoGame.Run(ctx))
}
