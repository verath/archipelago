package websocket

import (
	"github.com/verath/archipelago/lib/network"
	"testing"
)

func TestPlayerConn_AddActionListener(t *testing.T) {
	pc := newPlayerConn(nil, nil)
	listener := make(chan network.PlayerAction, 1)

	pc.AddActionListener(listener)
	pc.dispatchAction(nil)
	select {
	case <-listener:
	default:
		t.Error("Listener did not receive action")
	}
	pc.RemoveActionListener(listener)
}

func TestPlayerConn_RemoveActionListener(t *testing.T) {
	pc := newPlayerConn(nil, nil)
	listener := make(chan network.PlayerAction, 1)

	pc.AddActionListener(listener)
	pc.RemoveActionListener(listener)
	pc.dispatchAction(nil)
	select {
	case <-listener:
		t.Error("Removed listener received action")
	default:
	}
}
