package archipelago

func (srv *Server) routes() {
	srv.router.HandleFunc("/ws", srv.handleWSConnect())
}
