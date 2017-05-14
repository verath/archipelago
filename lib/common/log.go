package common

import (
	"github.com/Sirupsen/logrus"
)

// Field name constants for the field names used on the
// logger entry.
const (
	FieldNameModule = "module"
	FieldNameID     = "id"
)

// ModuleLogEntry creates a new logrus entry that includes the module name as a field.
func ModuleLogEntry(log *logrus.Logger, moduleName string) *logrus.Entry {
	return log.WithField(FieldNameModule, moduleName)
}

// ModuleLogEntryWithID creates a new logrus entry that includes both  the module name
// and a global id as keys. This is useful when multiple instances of the same module
// will be running as the id can then be used to keep track of each module instance.
func ModuleLogEntryWithID(log *logrus.Logger, moduleName string) *logrus.Entry {
	return log.WithFields(logrus.Fields{
		FieldNameModule: moduleName,
		FieldNameID:     NextGlobalID(),
	})
}
