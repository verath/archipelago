package model

type (
	// Action is an action to be applied on a game instance.
	Action interface {
		// Apply applies an action to a game, returning a slice of events created.
		// The Apply method is responsible for validating the action before it is
		// applied.
		//
		// If Apply returns an IllegalActionError, then the action was found
		// invalid before it was applied. Such actions have no effect on the game.
		// If any other type of error is returned, then the game should be considered
		// in an invalid state, meaning no further actions may be applied to the game.
		Apply(game *Game) ([]Event, error)
	}

	// PlayerAction is an action created by some player. A PlayerAction is
	// turned into an Action by supplying it the PlayerID that the player
	// represents in the game model.
	PlayerAction interface {
		// ToAction takes a PlayerID and returns an Action that can
		// be applied to a game.
		ToAction(playerID PlayerID) Action
	}

	// IllegalActionError is an error used to represent an action
	// not being applied due to it being invalid. IllegalActionError
	// should only be used for errors that are due to user input (e.g.
	// the target of a launch action) and not for errors that would
	// indicate an error in the game server (e.g. the playerID of the
	// action not existing in the game)
	IllegalActionError struct {
		error
	}
)

// NewIllegalActionError returning a new IllegalActionError wrapping
// the provided error, or nil if the provided error was nil.
func NewIllegalActionError(err error) *IllegalActionError {
	if err == nil {
		return nil
	}
	return &IllegalActionError{
		error: err,
	}
}
