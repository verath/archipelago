package wire_test

import (
	"bytes"
	"context"
	"reflect"
	"testing"
	"time"

	"github.com/pkg/errors"
	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/wire"
	"github.com/verath/archipelago/lib/wire/msg"
	"google.golang.org/protobuf/proto"
)

func protoMarshalOrPanic(pb proto.Message) []byte {
	msg, err := proto.Marshal(pb)
	if err != nil {
		errors.Wrap(err, "Could not marshal protobuf message")
		panic(err)
	}
	return msg
}

func newPBClientAdapterOrFail(tb testing.TB, client wire.Client) *wire.PBClientAdapter {
	pbClient, err := wire.NewPBClientAdapter(client)
	if err != nil {
		errors.Wrap(err, "Error creating NewPBClientAdapter")
		tb.Fatalf("%+v", err)
	}
	return pbClient
}

func TestPBClientAdapter_Disconnect(t *testing.T) {
	disconnectCalled := false
	mockClient := &wire.MockClient{
		DisconnectFunc: func() {
			disconnectCalled = true
		},
	}
	pbClient := newPBClientAdapterOrFail(t, mockClient)
	pbClient.Disconnect()
	if !disconnectCalled {
		t.Error("Disconnect should call Disconnect on underlying client")
	}
}

func TestPBClientAdapter_DisconnectCh(t *testing.T) {
	ch := make(chan struct{})
	mockClient := &wire.MockClient{
		DisconnectChFunc: func() <-chan struct{} {
			return ch
		},
	}
	pbClient := newPBClientAdapterOrFail(t, mockClient)
	if pbClient.DisconnectCh() != ch {
		t.Error("DisconnectCh should return the underlying client disconnectCh")
	}
}

var (
	actionLeaveExpected = &model.PlayerActionLeave{}
	actionLeave         = &msg.ActionEnvelope{
		Action: &msg.ActionEnvelope_ActionGameLeave{
			ActionGameLeave: &msg.ActionGameLeave{},
		},
	}

	actionLaunchExpected = &model.PlayerActionLaunch{
		To:   "1",
		From: "2",
	}
	actionLaunch = &msg.ActionEnvelope{
		Action: &msg.ActionEnvelope_ActionGameLaunch{
			ActionGameLaunch: &msg.ActionGameLaunch{
				ToId:   string(actionLaunchExpected.To),
				FromId: string(actionLaunchExpected.From),
			},
		},
	}
)

var readTests = []struct {
	// readMsg is the message we return from the mock client
	readMsg []byte
	// readErr is the error we return from the mock client
	readErr error
	// expectErr is true if we expect an error to be returned
	expectErr bool
	expected  model.PlayerAction
}{
	{
		// Empty (nil) message returned from client
		readMsg:   nil,
		expectErr: true,
	},
	{
		// Invalid message returned from client
		readMsg:   []byte("INVALID PROTOBUF"),
		expectErr: true,
	},
	{
		// Error returned when reading from client
		readErr:   errors.New("ClientError"),
		expectErr: true,
	},
	{
		// Valid envelope with unknown (empty) Action
		readMsg:   protoMarshalOrPanic(&msg.ActionEnvelope{}),
		expectErr: true,
	},
	{
		// Valid leave action
		readMsg:  protoMarshalOrPanic(actionLeave),
		expected: actionLeaveExpected,
	},
	{
		// Valid launch action
		readMsg:  protoMarshalOrPanic(actionLaunch),
		expected: actionLaunchExpected,
	},
}

func TestPBClientAdapter_ReadPlayerAction(t *testing.T) {
	mockClient := &wire.MockClient{}
	pbClient := newPBClientAdapterOrFail(t, mockClient)
	for _, tt := range readTests {
		mockClient.ReadMessageFunc = func(context.Context) ([]byte, error) {
			return tt.readMsg, tt.readErr
		}
		actual, err := pbClient.ReadPlayerAction(context.Background())
		if err != nil {
			if !tt.expectErr {
				t.Errorf("Unexpected error: %+v", err)
			}
			continue
		}
		if !reflect.DeepEqual(actual, tt.expected) {
			t.Errorf("PlayerAction did not match expected:\n"+
				"Expected:\n\t%T: %+v\n"+
				"Actual:  \n\t%T: %+v\n",
				tt.expected, tt.expected,
				actual, actual)
		}
	}
}

type PlayerEventDummy struct {
}

func (PlayerEventDummy) PlayerEventMarker() {}

var (
	eventGameStart = (&model.EventGameStart{
		TickInterval: time.Second,
	}).ToPlayerEvent("playerIDTest").(*model.PlayerEventGameStart)
	eventGameStartExpected = &msg.EventEnvelope{
		Event: &msg.EventEnvelope_EventGameStart{
			EventGameStart: msg.EncodeEventGameStart(eventGameStart),
		},
	}

	emptyGame = (func() *model.Game {
		p1, _ := model.NewPlayer()
		p2, _ := model.NewPlayer()
		pn, _ := model.NewPlayer()
		gb := model.NewGameBuilder(model.Coordinate{X: 9, Y: 9}, pn)
		gb.AddPlayer(p1)
		gb.AddPlayer(p2)
		return gb.BuildOrPanic()
	})()
	eventGameTick = (&model.EventTick{
		Game: emptyGame,
	}).ToPlayerEvent("PlayerIdTest").(*model.PlayerEventTick)
	eventGameTickExpected = &msg.EventEnvelope{
		Event: &msg.EventEnvelope_EventGameTick{
			EventGameTick: msg.EncodeEventGameTick(eventGameTick),
		},
	}

	eventGameOver = (&model.EventGameOver{
		WinnerID: "winnerIDTest",
	}).ToPlayerEvent("playerIDTest").(*model.PlayerEventGameOver)
	eventGameOverExpected = &msg.EventEnvelope{
		Event: &msg.EventEnvelope_EventGameOver{
			EventGameOver: msg.EncodeEventGameOver(eventGameOver),
		},
	}
)

var writeTests = []struct {
	// writeEvt is the player event we write to the adapter
	writeEvt model.PlayerEvent
	// writeErr is the error we return from the mock client
	writeErr error
	// expectErr is true if we expect an error to be returned
	expectErr bool
	// expectedMsg is the message expected to be written to the client
	expectedMsg []byte
}{
	{
		// Empty (nil) event
		writeEvt:  nil,
		expectErr: true,
	},
	{
		// Unknown PlayerEvent type
		writeEvt:  &PlayerEventDummy{},
		expectErr: true,
	},
	{
		// Error returned when writing to client
		writeEvt:  eventGameStart,
		writeErr:  errors.New("ClientError"),
		expectErr: true,
	},
	{
		// Valid game start event
		writeEvt:    eventGameStart,
		expectedMsg: protoMarshalOrPanic(eventGameStartExpected),
	},
	{
		// Valid game over event
		writeEvt:    eventGameOver,
		expectedMsg: protoMarshalOrPanic(eventGameOverExpected),
	},
	{
		writeEvt:    eventGameTick,
		expectedMsg: protoMarshalOrPanic(eventGameTickExpected),
	},
}

func TestPBClientAdapter_WritePlayerEvent(t *testing.T) {
	mockClient := &wire.MockClient{}
	pbClient := newPBClientAdapterOrFail(t, mockClient)
	for _, tt := range writeTests {
		var actualMsg []byte
		mockClient.WriteMessageFunc = func(_ context.Context, msg []byte) error {
			actualMsg = msg
			return tt.writeErr
		}
		err := pbClient.WritePlayerEvent(context.Background(), tt.writeEvt)
		if err != nil {
			if !tt.expectErr {
				t.Errorf("Unexpected error: %+v", err)
			}
			continue
		}
		if bytes.Compare(actualMsg, tt.expectedMsg) != 0 {
			t.Errorf("Message did not match expected message for event:\n"+
				"%T %+v\n"+
				"Expected:\n\t%v\n"+
				"Actual:  \n\t%v\n",
				tt.writeEvt, tt.writeEvt,
				tt.expectedMsg,
				actualMsg)
		}
	}
}
