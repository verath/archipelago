package action

import (
	"github.com/verath/archipelago/lib/event"
	"github.com/verath/archipelago/lib/model"
)

// An action is what modifies a game instance. Actions
// must be applied synchronously.
//
// TODO: Generally interface names ends in -er, applier?
type Action interface {

	// Applies the action to the provided game, returning a slice
	// of events the action created.
	//
	// Apply returns an error iff the game is considered to be
	// in a state where it cannot continue. E.g. if an error
	// occurs halfway trough applying the action and no rollback
	// can be performed.
	//
	// Invalid actions due to player input is silently ignored
	// E.g. sending an airplane to a non-existing island.
	// TODO: we might want to return "InvalidActionEvent" then
	Apply(*model.Game) ([]event.EventBuilder, error)
}

type ActionFunc func(*model.Game) ([]event.EventBuilder, error)

func (f ActionFunc) Apply(g *model.Game) ([]event.EventBuilder, error) {
	return f(g)
}

type ActionBuilder interface {
	Build(model.PlayerID) (Action, error)
}

func BuilderForType(actionType string) (ActionBuilder, bool) {
	switch actionType {
	case "launch":
		return &launchActionBuilder{}, true
	default:
		return nil, false
	}
}
