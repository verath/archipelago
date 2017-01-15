package common

import (
	"github.com/Sirupsen/logrus"
)

var ModuleNameKey = "module"

func ModuleLogEntry(log *logrus.Logger, moduleName string) *logrus.Entry {
	return log.WithField(ModuleNameKey, moduleName)
}

func ModuleLogEntryWithID(log *logrus.Logger, moduleName string) *logrus.Entry {
	return log.WithFields(logrus.Fields{
		ModuleNameKey: moduleName,
		"id":          NextGlobalID(),
	})
}
