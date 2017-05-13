package model

type (
	// Action is an action to be applied on the game instance.
	Action interface {
		// Apply applies an action to a game, returning a slice of events
		// created. Additionally, the Apply method is responsible for validating
		// the action before it is applied. Unless the error returned is explicitly
		// non-fatal, any error should be regarded as fatal by default and must stop the game.
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
)
