package controller

import (
	"context"
	"errors"
	"github.com/verath/archipelago/lib/event"
	"github.com/verath/archipelago/lib/model"
	"github.com/verath/archipelago/lib/network"
)

// The playerProxy represents a player connection as a single player part
// of the game model. This is done by translating actions produced by the
// player connection, adding the playerId this proxy represents to each
// action.
type playerProxy struct {
	playerID     model.PlayerID
	playerClient *network.Client
}

func (pp *playerProxy) SendCh() chan<- event.Event {
	// We simply forward events, as they are not player specific
	return pp.playerClient.SendCh()
}

// Run starts listening for actions produced by the player action and
// forwards these as model actions on the provided actionCh.
func (pp *playerProxy) Run(ctx context.Context) error {
	/*playerActionCh := make(chan network.PlayerAction, 0)
	pp.playerConn.AddActionListener(playerActionCh)
	defer pp.playerConn.RemoveActionListener(playerActionCh)

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case playerAct, ok := <-playerActionCh:
			if !ok {
				// TODO(2016-12-03): should we also close actionCh here?
				return errors.New("PlayerConn action channel closed")
			}
			select {
			case <-ctx.Done():
				return ctx.Err()
			case actionCh <- playerAct.ToAction(pp.playerID):
			}
		}

	}
	*/
	<-ctx.Done()
	return ctx.Err()
}

func newPlayerProxy(player *model.Player, playerClient *network.Client) (*playerProxy, error) {
	if player == nil {
		return nil, errors.New("player cannot be nil")
	}
	return &playerProxy{
		playerID:     player.ID(),
		playerClient: playerClient,
	}, nil
}
