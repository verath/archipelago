package archipelago

import (
	"context"
	"io"
	"log/slog"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	gorilla "github.com/gorilla/websocket"
	"github.com/verath/archipelago/lib/game"
	"github.com/verath/archipelago/lib/network/websocket"
	"github.com/verath/archipelago/lib/wire/msg"
	"google.golang.org/protobuf/proto"
)

// startTestServer runs a Server with AI opponents and no lobby wait, and
// returns the URL of its websocket endpoint without the version parameter.
func startTestServer(t *testing.T) string {
	t.Helper()
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	srv, err := New(logger, websocket.UpgraderOptions{SkipOriginCheck: true},
		game.CoordinatorOptions{LobbyWait: 0, AIPlayers: 1})
	if err != nil {
		t.Fatalf("New: %v", err)
	}
	ctx, cancel := context.WithCancel(context.Background())
	runDone := make(chan struct{})
	go func() {
		defer close(runDone)
		srv.Run(ctx)
	}()
	httpSrv := httptest.NewServer(srv)
	t.Cleanup(func() {
		cancel()
		httpSrv.Close()
		<-runDone
	})
	return "ws" + strings.TrimPrefix(httpSrv.URL, "http") + "/ws"
}

// readEvents reads n events from conn.
func readEvents(t *testing.T, conn *gorilla.Conn, n int) []*msg.EventEnvelope {
	t.Helper()
	conn.SetReadDeadline(time.Now().Add(10 * time.Second))
	var events []*msg.EventEnvelope
	for len(events) < n {
		_, b, err := conn.ReadMessage()
		if err != nil {
			t.Fatalf("ReadMessage after %d events: %v", len(events), err)
		}
		env := &msg.EventEnvelope{}
		if err := proto.Unmarshal(b, env); err != nil {
			t.Fatalf("Unmarshal: %v", err)
		}
		events = append(events, env)
	}
	return events
}

func TestServer_ProtocolVersions(t *testing.T) {
	url := startTestServer(t)

	t.Run("v4", func(t *testing.T) {
		conn, _, err := gorilla.DefaultDialer.Dial(url+"?v=4", nil)
		if err != nil {
			t.Fatalf("Dial: %v", err)
		}
		defer conn.Close()
		events := readEvents(t, conn, 3)
		if events[0].GetEventGameStart() == nil {
			t.Errorf("event 0 = %v, want game start", events[0])
		}
		for _, evt := range events[1:] {
			if evt.GetEventGameTick() == nil {
				t.Errorf("event = %v, want tick", evt)
			}
		}
	})

	t.Run("v5", func(t *testing.T) {
		conn, _, err := gorilla.DefaultDialer.Dial(url+"?v=5", nil)
		if err != nil {
			t.Fatalf("Dial: %v", err)
		}
		defer conn.Close()
		events := readEvents(t, conn, 4)
		if events[0].GetEventGameStart() == nil {
			t.Errorf("event 0 = %v, want game start", events[0])
		}
		snap := events[1].GetEventGameSnapshot()
		if snap == nil || snap.Seq != 1 || len(snap.Game.Islands) == 0 {
			t.Fatalf("event 1 = %v, want snapshot with seq 1 and islands", events[1])
		}
		for i, evt := range events[2:] {
			if d := evt.GetEventGameDelta(); d == nil || d.Seq != uint32(i+2) {
				t.Errorf("event %d = %v, want delta with seq %d", i+2, evt, i+2)
			}
		}
	})
}
