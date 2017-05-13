package model

import (
	"github.com/pkg/errors"
)

const (
	ActionTypeLaunch = "act_launch"
	ActionTypeLeave  = "act_leave"
)

type (
	Action interface {
		// Apply applies an action to a game, returning a slice of events
		// created. Additionally, the Apply method is responsible for validating
		// the action before it is applied. Invalid or Illegal actions are returned
		// as ActionErrors. Unless the error returned is explicitly non-fatal, any
		// error should be regarded as fatal by default and must stop the game.
		Apply(game *Game) ([]Event, error)
	}

	PlayerAction interface {
		ToAction(playerID PlayerID) Action
	}
)

// Map between a string identifier for an actions and a creator for
// creating an instance of the identified actions type. Used to lookup
// the appropriate actions to unmarshal into. This map is appended to
// in the init function.
var playerActions = make(map[string]playerActionCreator)

// A creator creates new empty actions that can be used to unmarshal
// user provided data into.
type playerActionCreator interface {
	// Creates a new instance of the actions type.
	New() PlayerAction
}

// creatorFunc is a type for implementing the creator interface
// as a function
type creatorFunc func() PlayerAction

func (f creatorFunc) New() PlayerAction {
	return f()
}

// Tries to find and create a new player actions for the type actType.
func PlayerActionByType(actType string) (PlayerAction, error) {
	if creator, ok := playerActions[actType]; ok {
		return creator.New(), nil
	}
	return nil, errors.Errorf("No creator for actType: %s", actType)
}

func init() {
	playerActions[ActionTypeLaunch] = creatorFunc(func() PlayerAction { return &launchAction{} })
	playerActions[ActionTypeLeave] = creatorFunc(func() PlayerAction { return &leaveAction{} })
}
