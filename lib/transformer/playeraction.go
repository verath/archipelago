package transformer

import (
	"context"
	"errors"
	"github.com/verath/archipelago/lib/action"
	"github.com/verath/archipelago/lib/model"
	"github.com/verath/archipelago/lib/network"
)

// A playerActionTransformer takes network playerActions and transforms them
// to model actions by giving them a player id. The transformation is performed
// between two channels
type PlayerActionTransformer struct {
	playerID model.PlayerID
}

func (pat *PlayerActionTransformer) Run(ctx context.Context, inCh <-chan network.PlayerAction, outCh chan<- action.Action) error {
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case playerAct, ok := <-inCh:
			if !ok {
				return errors.New("inCh closed")
			}
			select {
			case <-ctx.Done():
				return ctx.Err()
			case outCh <- playerAct.ToAction(pat.playerID):
			}
		}

	}
}

func NewPlayerActionTransformer(player *model.Player) (*PlayerActionTransformer, error) {
	if player == nil {
		return nil, errors.New("player cannot be nil")
	}
	return &PlayerActionTransformer{
		playerID: player.ID(),
	}, nil
}
