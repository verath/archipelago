package game

import (
	"context"
	"github.com/verath/archipelago/lib/network"
)

// A ClientProvider is an interface for something that can
// provide clients to the caller.
type ClientProvider interface {
	// NextClient returns a client to the caller, if one can be
	// provided before the context has expired. Otherwise, the
	// context's error is returned.
	NextClient(ctx context.Context) (network.Client, error)
}
