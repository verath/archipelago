package archipelago

import (
	"context"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	gorilla "github.com/gorilla/websocket"
	"github.com/verath/archipelago/lib/session"
	"github.com/verath/archipelago/lib/wire/msg"
	"google.golang.org/protobuf/proto"
)

// startTestServer runs a Server with AI opponents and no lobby wait, and
// returns the URL of its websocket endpoint without the version parameter.
func startTestServer(t *testing.T) string {
	t.Helper()
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	opts := DefaultOptions()
	opts.SkipWSOriginCheck = true
	opts.LobbyWait = 0
	opts.AIPlayers = 1
	srv, err := New(logger, opts)
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

func TestServer_Protocol(t *testing.T) {
	url := startTestServer(t)

	t.Run("other versions are rejected", func(t *testing.T) {
		// E.g. a frontend for protocol version 4, cached by a browser.
		_, resp, err := gorilla.DefaultDialer.Dial(url+"?v=4", nil)
		if err == nil {
			t.Fatal("Dial succeeded, want error")
		}
		if resp == nil || resp.StatusCode != http.StatusBadRequest {
			t.Errorf("Dial = %v, %v; want status 400", resp, err)
		}
	})

	t.Run("snapshot then deltas", func(t *testing.T) {
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

// Test that New rejects a ResumeGrace that is not positive.
func TestNew_ResumeGrace(t *testing.T) {
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	for _, grace := range []time.Duration{0, -time.Second} {
		opts := DefaultOptions()
		opts.ResumeGrace = grace
		if _, err := New(logger, opts); err == nil {
			t.Errorf("New with ResumeGrace %v succeeded, want error", grace)
		}
	}
}

// Test that a client can resume a game after its connection broke.
func TestServer_Resume(t *testing.T) {
	url := startTestServer(t)
	conn, _, err := gorilla.DefaultDialer.Dial(url+"?v=5", nil)
	if err != nil {
		t.Fatalf("Dial: %v", err)
	}
	defer conn.Close()
	events := readEvents(t, conn, 3)
	start := events[0].GetEventGameStart()
	if start == nil || start.ResumeToken == "" {
		t.Fatalf("event 0 = %v, want game start with resume token", events[0])
	}
	if want := uint32(session.DefaultGrace.Milliseconds()); start.ResumeTimeout != want {
		t.Errorf("resume timeout = %d, want %d", start.ResumeTimeout, want)
	}
	if events[1].GetEventGameSnapshot() == nil || events[2].GetEventGameDelta() == nil {
		t.Fatalf("events 1, 2 = %v, %v; want snapshot, delta", events[1], events[2])
	}
	// Break the connection, without a close frame.
	conn.UnderlyingConn().Close()

	conn2, _, err := gorilla.DefaultDialer.Dial(url+"?v=5&resume="+start.ResumeToken, nil)
	if err != nil {
		t.Fatalf("Dial to resume: %v", err)
	}
	defer conn2.Close()
	events = readEvents(t, conn2, 3)
	start2 := events[0].GetEventGameStart()
	if start2 == nil || start2.PlayerId != start.PlayerId || start2.ResumeToken != start.ResumeToken {
		t.Errorf("event 0 = %v, want game start %v", events[0], start)
	}
	if snap := events[1].GetEventGameSnapshot(); snap == nil || snap.Seq != 1 || len(snap.Game.Islands) == 0 {
		t.Errorf("event 1 = %v, want snapshot with seq 1 and islands", events[1])
	}
	if d := events[2].GetEventGameDelta(); d == nil || d.Seq != 2 {
		t.Errorf("event 2 = %v, want delta with seq 2", events[2])
	}
}

// Test that resuming a game that can't be resumed fails before upgrading.
func TestServer_Resume_Fails(t *testing.T) {
	url := startTestServer(t)
	for query, wantStatus := range map[string]int{
		"?v=5&resume=bogus": http.StatusGone,
		"?v=5&resume=":      http.StatusGone,
		"?v=4&resume=bogus": http.StatusBadRequest,
		"?resume=bogus":     http.StatusBadRequest,
	} {
		conn, resp, err := gorilla.DefaultDialer.Dial(url+query, nil)
		if err == nil {
			conn.Close()
			t.Errorf("%s: Dial succeeded, want error", query)
			continue
		}
		if resp == nil || resp.StatusCode != wantStatus {
			t.Errorf("%s: Dial = %v, %v; want status %d", query, resp, err, wantStatus)
		}
	}
}
