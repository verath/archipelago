package testutil

import "log/slog"

// DiscardLogger is a slog.Logger configured to discard all output
var DiscardLogger = slog.New(slog.DiscardHandler)
