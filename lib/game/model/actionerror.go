package model

// An ActionError is an error that might be returned from applying an action.
// The error contains the player that caused the error, if it can be determined
// and a flag for if the error should be considered fatal. A fatal error should
// always interrupt the game, whereas a non-fatal error might not.
type ActionError interface {
	// Returns the description of the error
	Error() string
	// Returns the player that caused the error, or nil if undetermined
	Player() *Player
	// Returns true if this is a fatal error, or false if the error
	// was caused by an action that is probably not intentional caused
	// by the user.
	IsFatal() bool
}

type actionErrorImpl struct {
	text string
	// The player that caused this error, or nil if undetermined
	player *Player
	// Flag for if this error should be considered a fatal error.
	fatal bool
}

func (e *actionErrorImpl) Error() string   { return e.text }
func (e *actionErrorImpl) Player() *Player { return e.player }
func (e *actionErrorImpl) IsFatal() bool   { return e.fatal }

func newActionError(player *Player, text string, fatal bool) ActionError {
	return &actionErrorImpl{
		text:   text,
		player: player,
		fatal:  fatal,
	}
}

// Creates a new Illegal ActionError. An illegal error is a fatal error,
// that is thought to have been caused intentionally by the player. Alternatively
// an illegal error might also be caused by non-expected state. An illegal action
// error will always stop the game.
func newIllegalActionError(player *Player, text string) error {
	return newActionError(player, text, true)
}

// Creates a new invalid ActionError. An invalid error is a non-fatal
// error, that is thought to have been caused by the player unintentionally.
func newInvalidActionError(player *Player, text string) error {
	return newActionError(player, text, false)
}
