package logutil

import (
	"github.com/Sirupsen/logrus"
	"github.com/nu7hatch/gouuid"
)

var ModuleNameKey = "module"

func ModuleEntry(log *logrus.Logger, moduleName string) *logrus.Entry {
	return log.WithField(ModuleNameKey, moduleName)
}

func ModuleEntryWithID(log *logrus.Logger, moduleName string) *logrus.Entry {
	id := ""
	u, err := uuid.NewV4()
	if err != nil {
		log.WithError(err).Error("could not generate uuid for log entry")
	} else {
		id = u.String()
	}

	return log.WithFields(logrus.Fields{
		ModuleNameKey: moduleName,
		"id":          id,
	})
}
