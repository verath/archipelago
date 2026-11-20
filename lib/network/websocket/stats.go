package websocket

import (
	"bufio"
	"errors"
	"net"
	"net/http"
	"sync/atomic"
)

// Stats are traffic counters for a WSConnection.
type Stats struct {
	// MessagesRead and MessagesWritten count data (binary) messages.
	// Control frames (ping, pong, close) are not counted.
	MessagesRead    int64
	MessagesWritten int64
	// PayloadBytesRead and PayloadBytesWritten are the sizes of the data
	// messages as seen by the application, i.e. before compression.
	PayloadBytesRead    int64
	PayloadBytesWritten int64
	// WireBytesRead and WireBytesWritten are the bytes read from and written
	// to the TCP connection after the HTTP upgrade request was read. They
	// include the upgrade response, websocket framing, control frames and
	// compression, so they are what the client actually downloads/uploads
	// (TCP/IP and TLS overhead excluded).
	WireBytesRead    int64
	WireBytesWritten int64
}

// CompressionRatio returns WireBytesWritten / PayloadBytesWritten, or 0 if
// nothing has been written.
func (s Stats) CompressionRatio() float64 {
	if s.PayloadBytesWritten == 0 {
		return 0
	}
	return float64(s.WireBytesWritten) / float64(s.PayloadBytesWritten)
}

// countingConn is a net.Conn that counts the bytes read and written.
type countingConn struct {
	net.Conn
	bytesRead    atomic.Int64
	bytesWritten atomic.Int64
}

func (c *countingConn) Read(b []byte) (int, error) {
	n, err := c.Conn.Read(b)
	c.bytesRead.Add(int64(n))
	return n, err
}

func (c *countingConn) Write(b []byte) (int, error) {
	n, err := c.Conn.Write(b)
	c.bytesWritten.Add(int64(n))
	return n, err
}

// countingResponseWriter wraps an http.ResponseWriter so that the connection
// returned by Hijack is a countingConn. gorilla/websocket does all reads and
// writes of an upgraded connection on the hijacked net.Conn (it re-targets
// the hijacked bufio reader/writer to it), so this counts all websocket
// traffic.
type countingResponseWriter struct {
	http.ResponseWriter
	conn *countingConn
}

func (w *countingResponseWriter) Hijack() (net.Conn, *bufio.ReadWriter, error) {
	hj, ok := w.ResponseWriter.(http.Hijacker)
	if !ok {
		return nil, nil, errors.New("response writer does not implement http.Hijacker")
	}
	netConn, brw, err := hj.Hijack()
	if err != nil {
		return nil, nil, err
	}
	w.conn = &countingConn{Conn: netConn}
	return w.conn, brw, nil
}
