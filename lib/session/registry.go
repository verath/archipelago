package session

import (
	"sync"
	"time"

	"github.com/verath/archipelago/lib/game"
)

// A Registry creates Sessions and finds them by token. Sessions are
// removed from it when they end.
type Registry struct {
	grace time.Duration

	mu       sync.Mutex
	sessions map[string]*Session
}

// NewRegistry creates a new Registry, creating Sessions with the given
// grace period (see New).
func NewRegistry(grace time.Duration) *Registry {
	return &Registry{
		grace:    grace,
		sessions: make(map[string]*Session),
	}
}

// New creates a new Session on the connection client and adds it to the
// Registry until it ends.
func (r *Registry) New(client game.Client) *Session {
	s := New(client, r.grace)
	r.mu.Lock()
	r.sessions[s.token] = s
	r.mu.Unlock()
	go func() {
		<-s.DisconnectCh()
		r.mu.Lock()
		delete(r.sessions, s.token)
		r.mu.Unlock()
	}()
	return s
}

// Resumable returns the Session with the given token if it can be resumed
// (see Session.Attach), otherwise nil.
func (r *Registry) Resumable(token string) *Session {
	r.mu.Lock()
	s := r.sessions[token]
	r.mu.Unlock()
	if s == nil || !s.Resumable() {
		return nil
	}
	return s
}

// Len returns the number of Sessions in the Registry.
func (r *Registry) Len() int {
	r.mu.Lock()
	defer r.mu.Unlock()
	return len(r.sessions)
}
