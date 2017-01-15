package network

import (
	"context"
	"fmt"
	"net"
	"net/http"
)

// ClosableHTTPServer is a thin wrapper around http.Server that
// implements a Shutdown method for stopping the server.
// TODO: The "normal" http.server implements Shutdown in go 1.8
type ClosableHTTPServer struct {
	server   *http.Server
	listener net.Listener
}

func NewClosableHTTPServer(server *http.Server) (*ClosableHTTPServer, error) {
	listener, err := net.Listen("tcp", server.Addr)
	if err != nil {
		return nil, fmt.Errorf("Could not create listener: %v", err)
	}
	return &ClosableHTTPServer{
		server:   server,
		listener: listener,
	}, nil
}

func (srv *ClosableHTTPServer) ListenAndServe() error {
	return srv.server.Serve(srv.listener)
}

func (srv *ClosableHTTPServer) Shutdown(ctx context.Context) error {
	// TODO: we are not graceful atm, go 1.8 fixes
	return srv.listener.Close()
}

func (srv *ClosableHTTPServer) Close() error {
	return srv.listener.Close()
}
