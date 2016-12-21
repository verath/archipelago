package util

import (
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/id"
)

var ModuleNameKey = "module"

func ModuleLogEntry(log *logrus.Logger, moduleName string) *logrus.Entry {
	return log.WithField(ModuleNameKey, moduleName)
}

func ModuleLogEntryWithID(log *logrus.Logger, moduleName string) *logrus.Entry {
	return log.WithFields(logrus.Fields{
		ModuleNameKey: moduleName,
		"id":          id.NextGlobalID(),
	})
}
