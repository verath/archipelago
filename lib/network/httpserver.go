package network

import (
	"context"
	"fmt"
	"net"
	"net/http"
)

// closableHTTPServer is a thin wrapper around http.Server that
// implements a Shutdown method for stopping the server.
// TODO: The "normal" http.server implements Shutdown in go 1.8
type closableHTTPServer struct {
	server   *http.Server
	listener net.Listener
}

func newClosableHTTPServer(server *http.Server) (*closableHTTPServer, error) {
	listener, err := net.Listen("tcp", server.Addr)
	if err != nil {
		return nil, fmt.Errorf("Could not create listener: %v", err)
	}
	return &closableHTTPServer{
		server:   server,
		listener: listener,
	}, nil
}

func (srv *closableHTTPServer) ListenAndServe() error {
	return srv.server.Serve(srv.listener)
}

func (srv *closableHTTPServer) Shutdown(ctx context.Context) error {
	// TODO: we are not graceful atm, go 1.8 fixes
	return srv.listener.Close()
}
