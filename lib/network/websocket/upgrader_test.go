package websocket

import (
	"bytes"
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

// wsVersion is the version the tests connect with by default.
const wsVersion = "5"

// startServer starts an HTTP server upgrading requests with an Upgrader
// created from opts, supporting versions 4 and 5. Upgraded connections are
// sent on the returned channel.
func startServer(t *testing.T, opts UpgraderOptions) (string, <-chan *WSConnection) {
	t.Helper()
	opts.Versions = []string{"4", wsVersion}
	upgrader, err := NewUpgrader(opts)
	if err != nil {
		t.Fatalf("NewUpgrader: %v", err)
	}
	connCh := make(chan *WSConnection, 1)
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		wsConn, err := upgrader.Upgrade(w, r)
		if err != nil {
			return
		}
		connCh <- wsConn
	}))
	t.Cleanup(srv.Close)
	return "ws" + strings.TrimPrefix(srv.URL, "http") + "/?v=" + wsVersion, connCh
}

// dial connects a gorilla client to url, offering compression if compress.
func dial(t *testing.T, url string, compress bool) (*websocket.Conn, *http.Response) {
	t.Helper()
	dialer := websocket.Dialer{EnableCompression: compress, HandshakeTimeout: 5 * time.Second}
	conn, resp, err := dialer.Dial(url, nil)
	if err != nil {
		t.Fatalf("Dial: %v", err)
	}
	t.Cleanup(func() { conn.Close() })
	return conn, resp
}

func nextConn(t *testing.T, connCh <-chan *WSConnection) *WSConnection {
	t.Helper()
	select {
	case c := <-connCh:
		t.Cleanup(func() { c.Close() })
		return c
	case <-time.After(5 * time.Second):
		t.Fatal("timeout waiting for server connection")
		return nil
	}
}

func ctxWithTimeout(t *testing.T) context.Context {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	t.Cleanup(cancel)
	return ctx
}

// compressible is a message that deflates to a fraction of its size, like a
// game tick does.
var compressible = bytes.Repeat([]byte("island-army-strength;"), 150)

func TestUpgrade_NegotiatesCompressionAndCountsWireBytes(t *testing.T) {
	url, connCh := startServer(t, UpgraderOptions{SkipOriginCheck: true})
	client, resp := dial(t, url, true)
	if ext := resp.Header.Get("Sec-WebSocket-Extensions"); !strings.Contains(ext, "permessage-deflate") {
		t.Fatalf("Sec-WebSocket-Extensions = %q, want permessage-deflate", ext)
	}
	server := nextConn(t, connCh)

	if err := server.WriteMessage(ctxWithTimeout(t), compressible); err != nil {
		t.Fatalf("WriteMessage: %v", err)
	}
	msgType, got, err := client.ReadMessage()
	if err != nil {
		t.Fatalf("client ReadMessage: %v", err)
	}
	if msgType != websocket.BinaryMessage || !bytes.Equal(got, compressible) {
		t.Fatalf("client got type %d, %d bytes; want binary message of %d bytes", msgType, len(got), len(compressible))
	}

	stats := server.Stats()
	if stats.MessagesWritten != 1 || stats.PayloadBytesWritten != int64(len(compressible)) {
		t.Errorf("MessagesWritten, PayloadBytesWritten = %d, %d; want 1, %d",
			stats.MessagesWritten, stats.PayloadBytesWritten, len(compressible))
	}
	// The wire bytes include the ~150 byte upgrade response, the message
	// itself should deflate to well under 10% of its 3150 bytes.
	if stats.WireBytesWritten <= 0 || stats.WireBytesWritten > int64(len(compressible))/4 {
		t.Errorf("WireBytesWritten = %d, want compressed (0 < n <= %d)", stats.WireBytesWritten, len(compressible)/4)
	}
	if r := stats.CompressionRatio(); r <= 0 || r >= 0.25 {
		t.Errorf("CompressionRatio() = %.2f, want in (0, 0.25)", r)
	}
}

func TestWriteMessage_DoesNotCompressSmallMessages(t *testing.T) {
	url, connCh := startServer(t, UpgraderOptions{})
	client, _ := dial(t, url, true)
	server := nextConn(t, connCh)
	before := server.Stats().WireBytesWritten

	small := compressible[:100]
	if err := server.WriteMessage(ctxWithTimeout(t), small); err != nil {
		t.Fatalf("WriteMessage: %v", err)
	}
	if _, got, err := client.ReadMessage(); err != nil || !bytes.Equal(got, small) {
		t.Fatalf("client ReadMessage = %q, %v; want %q", got, err, small)
	}
	// Sent as is: the payload plus a 2 byte frame header (for < 126 bytes).
	if written := server.Stats().WireBytesWritten - before; written != int64(len(small))+2 {
		t.Errorf("wrote %d bytes for a %d byte message, want %d (uncompressed)", written, len(small), len(small)+2)
	}
}

func TestUpgrade_DisableCompression(t *testing.T) {
	url, connCh := startServer(t, UpgraderOptions{SkipOriginCheck: true, DisableCompression: true})
	client, resp := dial(t, url, true)
	if ext := resp.Header.Get("Sec-WebSocket-Extensions"); ext != "" {
		t.Fatalf("Sec-WebSocket-Extensions = %q, want none", ext)
	}
	server := nextConn(t, connCh)

	if err := server.WriteMessage(ctxWithTimeout(t), compressible); err != nil {
		t.Fatalf("WriteMessage: %v", err)
	}
	if _, _, err := client.ReadMessage(); err != nil {
		t.Fatalf("client ReadMessage: %v", err)
	}
	if stats := server.Stats(); stats.WireBytesWritten < int64(len(compressible)) {
		t.Errorf("WireBytesWritten = %d, want >= %d (uncompressed)", stats.WireBytesWritten, len(compressible))
	}
}

func TestUpgrade_ClientWithoutCompression(t *testing.T) {
	url, connCh := startServer(t, UpgraderOptions{SkipOriginCheck: true})
	client, resp := dial(t, url, false)
	if ext := resp.Header.Get("Sec-WebSocket-Extensions"); ext != "" {
		t.Fatalf("Sec-WebSocket-Extensions = %q, want none", ext)
	}
	server := nextConn(t, connCh)
	if err := server.WriteMessage(ctxWithTimeout(t), compressible); err != nil {
		t.Fatalf("WriteMessage: %v", err)
	}
	if _, got, err := client.ReadMessage(); err != nil || !bytes.Equal(got, compressible) {
		t.Fatalf("client ReadMessage = %d bytes, %v; want %d bytes", len(got), err, len(compressible))
	}
}

func TestUpgrade_Versions(t *testing.T) {
	url, connCh := startServer(t, UpgraderOptions{SkipOriginCheck: true})
	for _, v := range []string{"4", "5"} {
		dial(t, strings.Replace(url, "v="+wsVersion, "v="+v, 1), true)
		if got := nextConn(t, connCh).Version(); got != v {
			t.Errorf("Version() = %q, want %q", got, v)
		}
	}
}

func TestNewUpgrader_NoVersions(t *testing.T) {
	if _, err := NewUpgrader(UpgraderOptions{}); err == nil {
		t.Error("NewUpgrader without versions succeeded, want error")
	}
}

func TestUpgrade_VersionMismatch(t *testing.T) {
	url, _ := startServer(t, UpgraderOptions{SkipOriginCheck: true})
	url = strings.Replace(url, "v="+wsVersion, "v=0", 1)
	_, resp, err := websocket.DefaultDialer.Dial(url, nil)
	if err == nil {
		t.Fatal("Dial succeeded, want error")
	}
	if resp == nil || resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("resp = %v, want 400", resp)
	}
}

func TestReadMessage_CountsMessages(t *testing.T) {
	url, connCh := startServer(t, UpgraderOptions{SkipOriginCheck: true})
	client, _ := dial(t, url, true)
	server := nextConn(t, connCh)

	msg := bytes.Repeat([]byte{1}, connMaxMessageSize)
	if err := client.WriteMessage(websocket.BinaryMessage, msg); err != nil {
		t.Fatalf("client WriteMessage: %v", err)
	}
	got, err := server.ReadMessage(ctxWithTimeout(t))
	if err != nil {
		t.Fatalf("ReadMessage of a message at the limit: %v", err)
	}
	if !bytes.Equal(got, msg) {
		t.Fatalf("ReadMessage got %d bytes, want %d", len(got), len(msg))
	}
	stats := server.Stats()
	if stats.MessagesRead != 1 || stats.PayloadBytesRead != int64(len(msg)) {
		t.Errorf("MessagesRead, PayloadBytesRead = %d, %d; want 1, %d", stats.MessagesRead, stats.PayloadBytesRead, len(msg))
	}
	if stats.WireBytesRead <= 0 || stats.WireBytesRead >= int64(len(msg)) {
		t.Errorf("WireBytesRead = %d, want compressed (0 < n < %d)", stats.WireBytesRead, len(msg))
	}
}

func TestReadMessage_RejectsMessageInflatingPastLimit(t *testing.T) {
	url, connCh := startServer(t, UpgraderOptions{SkipOriginCheck: true})
	client, _ := dial(t, url, true)
	server := nextConn(t, connCh)

	// 1MiB of zeros deflates to ~1KiB, under the frame size limit, but must
	// still be rejected.
	if err := client.WriteMessage(websocket.BinaryMessage, make([]byte, 1<<20)); err != nil {
		t.Fatalf("client WriteMessage: %v", err)
	}
	_, err := server.ReadMessage(ctxWithTimeout(t))
	if !errors.Is(err, errMessageTooBig) {
		t.Fatalf("ReadMessage err = %v, want %v", err, errMessageTooBig)
	}
}

func TestReadMessage_RejectsFrameOverLimit(t *testing.T) {
	url, connCh := startServer(t, UpgraderOptions{SkipOriginCheck: true, DisableCompression: true})
	client, _ := dial(t, url, false)
	server := nextConn(t, connCh)

	if err := client.WriteMessage(websocket.BinaryMessage, make([]byte, connMaxMessageSize+1)); err != nil {
		t.Fatalf("client WriteMessage: %v", err)
	}
	if _, err := server.ReadMessage(ctxWithTimeout(t)); err == nil {
		t.Fatal("ReadMessage succeeded, want error")
	}
}
