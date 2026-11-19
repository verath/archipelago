package common

import (
	"log/slog"
)

// Field name constants for the field names used on the
// logger entry.
const (
	FieldNameModule = "module"
	FieldNameID     = "id"
)

// ModuleLogEntry creates a new slog logger that includes the module name as a field.
func ModuleLogEntry(logger *slog.Logger, moduleName string) *slog.Logger {
	return logger.With(FieldNameModule, moduleName)
}

// ModuleLogEntryWithID creates a new slog logger that includes both  the module name
// and a global id as keys. This is useful when multiple instances of the same module
// will be running as the id can then be used to keep track of each module instance.
func ModuleLogEntryWithID(logger *slog.Logger, moduleName string) *slog.Logger {
	return logger.With(
		FieldNameModule, moduleName,
		FieldNameID, NextGlobalID(),
	)
}
