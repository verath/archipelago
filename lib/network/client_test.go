package network

import (
	"bytes"
	"context"
	"crypto/rand"
	"errors"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

// These tests pin the behaviour of a server-side connection as the rest of
// the backend sees it: a client that is run, and read from, written to and
// disconnected while it runs.

const testTimeout = 5 * time.Second

// startClient connects a peer to a new server-side client and runs the
// client with ctx until the test ends. awaitRun waits for Run to return
// and returns its error.
func startClient(t *testing.T, ctx context.Context) (peer *websocket.Conn, client *Client, awaitRun func() error) {
	t.Helper()
	url, connCh := startServer(t, UpgraderOptions{})
	peer, _ = dial(t, url, true)
	client = nextConn(t, connCh)
	return peer, client, runClient(t, ctx, client)
}

// runClient runs client with ctx until the test ends. The returned awaitRun
// waits for Run to return and returns its error.
func runClient(t *testing.T, ctx context.Context, client *Client) (awaitRun func() error) {
	ctx, cancel := context.WithCancel(ctx)
	runDone := make(chan struct{})
	var runErr error
	go func() {
		defer close(runDone)
		runErr = client.Run(ctx)
	}()
	awaitRun = func() error {
		t.Helper()
		select {
		case <-runDone:
			return runErr
		case <-time.After(testTimeout):
			t.Fatal("timeout waiting for Run to return")
			return nil
		}
	}
	t.Cleanup(func() {
		cancel()
		awaitRun()
	})
	return awaitRun
}

// awaitDisconnect fails the test if client doesn't disconnect in time.
func awaitDisconnect(t *testing.T, client *Client) {
	t.Helper()
	select {
	case <-client.DisconnectCh():
	case <-time.After(testTimeout):
		t.Fatal("timeout waiting for DisconnectCh to close")
	}
}

func TestClient_RoundTrip(t *testing.T) {
	peer, client, _ := startClient(t, context.Background())

	if err := peer.WriteMessage(websocket.BinaryMessage, []byte("action")); err != nil {
		t.Fatalf("peer WriteMessage: %v", err)
	}
	got, err := client.ReadMessage(ctxWithTimeout(t))
	if err != nil || string(got) != "action" {
		t.Fatalf("ReadMessage = %q, %v; want %q", got, err, "action")
	}

	for _, msg := range [][]byte{[]byte("event"), compressible} {
		if err := client.WriteMessage(ctxWithTimeout(t), msg); err != nil {
			t.Fatalf("WriteMessage: %v", err)
		}
		peer.SetReadDeadline(time.Now().Add(testTimeout))
		msgType, got, err := peer.ReadMessage()
		if err != nil || msgType != websocket.BinaryMessage || !bytes.Equal(got, msg) {
			t.Fatalf("peer ReadMessage = %d, %d bytes, %v; want binary message of %d bytes",
				msgType, len(got), err, len(msg))
		}
	}
}

func TestClient_PeerClosed(t *testing.T) {
	peer, client, _ := startClient(t, context.Background())

	// A close frame, as a browser sends when the tab is closed.
	msg := websocket.FormatCloseMessage(websocket.CloseGoingAway, "")
	if err := peer.WriteControl(websocket.CloseMessage, msg, time.Now().Add(time.Second)); err != nil {
		t.Fatalf("WriteControl: %v", err)
	}
	if _, err := client.ReadMessage(ctxWithTimeout(t)); !errors.Is(err, ErrPeerClosed) {
		t.Errorf("ReadMessage err = %v, want ErrPeerClosed", err)
	}
	awaitDisconnect(t, client)
	if !client.PeerClosed() {
		t.Error("PeerClosed() = false, want true")
	}
}

func TestClient_ConnectionBroken_NotPeerClosed(t *testing.T) {
	peer, client, _ := startClient(t, context.Background())

	// No close frame, like a network that went away.
	peer.NetConn().Close()
	_, err := client.ReadMessage(ctxWithTimeout(t))
	if err == nil || errors.Is(err, ErrPeerClosed) {
		t.Errorf("ReadMessage err = %v, want an error that is not ErrPeerClosed", err)
	}
	awaitDisconnect(t, client)
	if client.PeerClosed() {
		t.Error("PeerClosed() = true, want false")
	}
}

// Test that the client notices the peer going away while nobody reads from
// it, as for a client waiting in the lobby.
func TestClient_DisconnectChClosesWithoutReads(t *testing.T) {
	t.Run("close frame", func(t *testing.T) {
		peer, client, _ := startClient(t, context.Background())
		msg := websocket.FormatCloseMessage(websocket.CloseGoingAway, "")
		if err := peer.WriteControl(websocket.CloseMessage, msg, time.Now().Add(time.Second)); err != nil {
			t.Fatalf("WriteControl: %v", err)
		}
		awaitDisconnect(t, client)
		if !client.PeerClosed() {
			t.Error("PeerClosed() = false, want true")
		}
	})
	t.Run("connection broken", func(t *testing.T) {
		peer, client, _ := startClient(t, context.Background())
		peer.NetConn().Close()
		awaitDisconnect(t, client)
		if client.PeerClosed() {
			t.Error("PeerClosed() = true, want false")
		}
	})
}

// Test that Disconnect closes the connection cleanly, with a close frame,
// and that the client can't be used after.
func TestClient_Disconnect(t *testing.T) {
	peer, client, awaitRun := startClient(t, context.Background())

	client.Disconnect()
	awaitDisconnect(t, client)
	peer.SetReadDeadline(time.Now().Add(testTimeout))
	_, _, err := peer.ReadMessage()
	var closeErr *websocket.CloseError
	if !errors.As(err, &closeErr) || closeErr.Code == websocket.CloseAbnormalClosure {
		t.Errorf("peer ReadMessage err = %v, want a close frame", err)
	}
	if err := awaitRun(); err != nil {
		t.Errorf("Run = %v, want nil", err)
	}
	if err := client.WriteMessage(ctxWithTimeout(t), []byte("event")); err == nil {
		t.Error("WriteMessage after Disconnect succeeded, want error")
	}
	if _, err := client.ReadMessage(ctxWithTimeout(t)); err == nil {
		t.Error("ReadMessage after Disconnect succeeded, want error")
	}
}

// Test that canceling the context Run was called with closes the
// connection.
func TestClient_RunContextCanceled(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	peer, client, awaitRun := startClient(t, ctx)

	cancel()
	if err := awaitRun(); !errors.Is(err, context.Canceled) {
		t.Errorf("Run = %v, want context.Canceled", err)
	}
	awaitDisconnect(t, client)
	peer.SetReadDeadline(time.Now().Add(testTimeout))
	if _, _, err := peer.ReadMessage(); err == nil {
		t.Error("peer ReadMessage succeeded, want error")
	}
}

// Test that a peer misbehaving gets disconnected.
func TestClient_DisconnectsMisbehavingPeer(t *testing.T) {
	for name, send := range map[string]func(peer *websocket.Conn) error{
		"read rate limit exceeded": func(peer *websocket.Conn) error {
			// More than the burst of the rate limit, at once. The writes
			// fail once the client has disconnected.
			for range 20 {
				peer.WriteMessage(websocket.BinaryMessage, []byte("action"))
			}
			return nil
		},
		"message too big": func(peer *websocket.Conn) error {
			return peer.WriteMessage(websocket.BinaryMessage, make([]byte, maxMessageSize+1))
		},
		"message inflating past limit": func(peer *websocket.Conn) error {
			return peer.WriteMessage(websocket.BinaryMessage, make([]byte, 1<<20))
		},
		"text message": func(peer *websocket.Conn) error {
			return peer.WriteMessage(websocket.TextMessage, []byte("action"))
		},
	} {
		t.Run(name, func(t *testing.T) {
			peer, client, _ := startClient(t, context.Background())
			if err := send(peer); err != nil {
				t.Fatalf("peer WriteMessage: %v", err)
			}
			awaitDisconnect(t, client)
			if client.PeerClosed() {
				t.Error("PeerClosed() = true, want false")
			}
		})
	}
}

// Test that Disconnect makes a write blocked on a peer that doesn't read
// fail at once, rather than at its deadline.
func TestClient_DisconnectUnblocksWrite(t *testing.T) {
	_, client, _ := startClient(t, context.Background())

	// Random bytes don't compress, so the writes soon fill the TCP buffers
	// of the peer, which doesn't read.
	msg := make([]byte, 64<<10)
	rand.Read(msg)
	writing := make(chan struct{}, 1)
	writeErrCh := make(chan error, 1)
	go func() {
		for {
			writing <- struct{}{}
			if err := client.WriteMessage(context.Background(), msg); err != nil {
				writeErrCh <- err
				return
			}
		}
	}()
	// Wait until a write has been blocked for a while.
	timeout := time.After(testTimeout)
	for blocked := false; !blocked; {
		select {
		case <-writing:
		case <-time.After(200 * time.Millisecond):
			blocked = true
		case <-timeout:
			t.Fatal("timeout waiting for a write to block")
		}
	}
	client.Disconnect()
	select {
	case <-writeErrCh:
	case <-time.After(writeTimeout / 2):
		t.Fatal("WriteMessage still blocked after Disconnect")
	}
}
