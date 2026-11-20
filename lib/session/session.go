// Package session lets a player resume a game on a new connection after the
// connection broke, e.g. when a phone switches from wifi to mobile data.
//
// A Session is the game.Client the game sees for a player. It wraps the
// player's current connection, which can be replaced by a new one with
// Attach. Sessions are created and found by token with a Registry.
package session

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/verath/archipelago/lib/game"
	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/network"
)

// DefaultGrace is the default time a Session waits for a new connection
// after its connection broke, before it ends.
const DefaultGrace = 20 * time.Second

var (
	// ErrEnded is returned when using a Session that has ended.
	ErrEnded = errors.New("session has ended")
	// ErrNotStarted is returned by Attach when the game has not started
	// for the session, so it can't be resumed.
	ErrNotStarted = errors.New("game has not started for session")
)

// attachment is a connection attached to a Session.
type attachment struct {
	client game.Client
	// detachedCh is closed when the client is detached from the Session.
	detachedCh chan struct{}
}

// A Session is a game.Client for a player that can survive the player's
// connection breaking. It forwards events and actions to and from its
// current connection, itself a game.Client.
//
// Before the game has started for the player (until a PlayerEventGameStart
// has been written), the Session ends when its connection is disconnected,
// as the connection itself would. After that, when the connection is
// disconnected or fails, the Session is detached: events are not written,
// but the latest tick and the game over are remembered, and reads block.
// If a new connection is attached within the grace period, it gets the game
// start, the latest tick and the game over (if the game ended meanwhile),
// and the game continues on it. Otherwise the Session ends: reads fail,
// which the game treats as the player leaving.
//
// WritePlayerEvent, ReadPlayerAction and Attach may be called concurrently.
type Session struct {
	token string
	grace time.Duration

	// writeMu serializes writes to the connections, so that a connection
	// gets events in order. Attach holds it while it writes the events a
	// new connection needs first. Never acquired while holding mu.
	writeMu sync.Mutex

	mu sync.Mutex
	// cur is the attached connection, nil while detached.
	cur *attachment
	// started is set once a PlayerEventGameStart was written to a
	// connection, i.e. the client knows the token.
	started bool
	ended   bool
	// endCh is closed when the Session ends.
	endCh chan struct{}
	// attachCh is closed, and replaced, when a connection is attached.
	attachCh chan struct{}
	// graceTimer ends the Session when it fires, nil if not running.
	graceTimer *time.Timer
	// start is the game start event (with the token) to write to new
	// connections, lastTick the latest tick and gameOver the game over
	// event. Each is nil if the game has not written one.
	start    *model.PlayerEventGameStart
	lastTick *model.PlayerEventTick
	gameOver *model.PlayerEventGameOver
}

// compile time check that Session implements game.Client.
var _ game.Client = (*Session)(nil)

// New creates a new Session on the connection client, with a new random
// token. grace is how long the Session waits for a new connection after
// the connection broke, before it ends.
func New(client game.Client, grace time.Duration) *Session {
	s := &Session{
		// 26 base32 characters, 130 random bits.
		token:    rand.Text(),
		grace:    grace,
		endCh:    make(chan struct{}),
		attachCh: make(chan struct{}),
	}
	s.mu.Lock()
	s.attachLocked(client)
	s.mu.Unlock()
	return s
}

// Token returns the token of the Session, the secret needed to resume it. It
// is written to the client in the PlayerEventGameStart.
func (s *Session) Token() string {
	return s.token
}

// Disconnect ends the Session, disconnecting its connection. If the
// Session is detached and has a game over event its client has not got,
// the Session is kept until the client resumes and gets it, or the grace
// period expires. Disconnect does not block.
func (s *Session) Disconnect() {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.cur == nil && s.gameOver != nil {
		return
	}
	s.endLocked()
}

// DisconnectCh returns a channel that is closed when the Session has ended.
// It is not closed while the Session is detached.
func (s *Session) DisconnectCh() <-chan struct{} {
	return s.endCh
}

// WritePlayerEvent writes evt to the current connection, adding the token
// and the grace period (as ResumeTimeout) to a PlayerEventGameStart. If the Session is detached, or the write fails
// after the game has started, the event is not written, but remembered for
// a new connection, and nil is returned. Blocks until the event has been
// written, an error occurs, or the context is canceled.
func (s *Session) WritePlayerEvent(ctx context.Context, evt model.PlayerEvent) error {
	s.writeMu.Lock()
	defer s.writeMu.Unlock()
	s.mu.Lock()
	if s.ended {
		s.mu.Unlock()
		return ErrEnded
	}
	switch e := evt.(type) {
	case *model.PlayerEventGameStart:
		withToken := *e
		withToken.ResumeToken = s.token
		withToken.ResumeTimeout = s.grace
		s.start = &withToken
		evt = s.start
	case *model.PlayerEventTick:
		s.lastTick = e
	case *model.PlayerEventGameOver:
		s.gameOver = e
	}
	att := s.cur
	s.mu.Unlock()
	if att == nil {
		return nil
	}

	err := att.client.WritePlayerEvent(ctx, evt)
	s.mu.Lock()
	defer s.mu.Unlock()
	if err != nil {
		if ctx.Err() != nil {
			return err
		}
		s.detachLocked(att)
		if s.ended {
			return fmt.Errorf("%w: write failed: %w", ErrEnded, err)
		}
		return nil
	}
	switch evt.(type) {
	case *model.PlayerEventGameStart:
		if !s.ended {
			s.started = true
		}
	case *model.PlayerEventGameOver:
		// Nothing more to write, unless the connection was detached
		// meanwhile, then the game over may not have arrived and is
		// written to the next connection.
		if s.cur == att {
			s.endLocked()
		}
	}
	return nil
}

// ReadPlayerAction reads a PlayerAction from the current connection. While
// detached, it blocks until a connection is attached. Blocks until an
// action is read, the Session ends (then ErrEnded is returned), or the
// context is canceled.
func (s *Session) ReadPlayerAction(ctx context.Context) (model.PlayerAction, error) {
	for {
		s.mu.Lock()
		ended, att, attachCh := s.ended, s.cur, s.attachCh
		s.mu.Unlock()
		if ended {
			return nil, ErrEnded
		}
		if att == nil {
			select {
			case <-attachCh:
			case <-s.endCh:
			case <-ctx.Done():
				return nil, ctx.Err()
			}
			continue
		}
		act, err := att.client.ReadPlayerAction(ctx)
		if err == nil {
			return act, nil
		}
		if ctx.Err() != nil {
			return nil, err
		}
		if errors.Is(err, network.ErrPeerClosed) {
			// The client closed the connection on purpose (e.g. the tab
			// was closed): it left, it won't resume.
			if s.leave(att) {
				return nil, fmt.Errorf("%w: %w", ErrEnded, err)
			}
			continue
		}
		// The connection broke (or sent something invalid), wait for the
		// next one.
		s.detach(att)
	}
}

// leave ends the Session because the client of att closed its connection on
// purpose, unless another connection was attached meanwhile. Reports
// whether the Session has ended.
func (s *Session) leave(att *attachment) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	// att may already be detached, by the watcher of its DisconnectCh.
	if s.cur == att || s.cur == nil {
		s.endLocked()
	}
	return s.ended
}

// Attach makes client the connection of the Session, to resume the game on
// it. A connection that is still attached is disconnected first. client
// gets the game start event, the latest tick (if any) and the game over
// event (if the game is over, then the Session ends), then events as
// usual. Attach blocks until these have been written, an error occurs, or
// the context is canceled. Fails with ErrNotStarted if the game has not
// started for the Session, and ErrEnded if it has ended. On error, client
// is disconnected.
func (s *Session) Attach(ctx context.Context, client game.Client) (err error) {
	defer func() {
		if err != nil {
			client.Disconnect()
		}
	}()
	// Detach the old connection before taking writeMu: a write in progress
	// may be blocked on it, and disconnecting it makes the write fail.
	s.mu.Lock()
	if err := s.resumableLocked(); err != nil {
		s.mu.Unlock()
		return err
	}
	s.dropLocked()
	s.stopGraceLocked()
	s.mu.Unlock()

	s.writeMu.Lock()
	defer s.writeMu.Unlock()
	s.mu.Lock()
	if err := s.resumableLocked(); err != nil {
		s.mu.Unlock()
		return err
	}
	// Another Attach may have won the race for writeMu.
	s.dropLocked()
	s.stopGraceLocked()
	events := []model.PlayerEvent{s.start}
	if s.lastTick != nil {
		events = append(events, s.lastTick)
	}
	gameOver := s.gameOver != nil
	if gameOver {
		events = append(events, s.gameOver)
	}
	s.mu.Unlock()

	for _, evt := range events {
		if err := client.WritePlayerEvent(ctx, evt); err != nil {
			s.mu.Lock()
			if !s.ended && s.cur == nil {
				s.startGraceLocked()
			}
			s.mu.Unlock()
			return fmt.Errorf("error writing %T: %w", evt, err)
		}
	}

	s.mu.Lock()
	defer s.mu.Unlock()
	if s.ended {
		return ErrEnded
	}
	s.attachLocked(client)
	if gameOver {
		s.endLocked()
	}
	return nil
}

// resumableLocked returns an error if the Session can't be resumed.
func (s *Session) resumableLocked() error {
	if s.ended {
		return ErrEnded
	}
	if !s.started {
		return ErrNotStarted
	}
	return nil
}

// Resumable reports whether the Session can be resumed by Attach (unless it
// ends first).
func (s *Session) Resumable() bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.resumableLocked() == nil
}

// peerCloser is implemented by clients that can tell whether they were
// disconnected because the peer closed the connection on purpose, see
// network.ErrPeerClosed.
type peerCloser interface {
	PeerClosed() bool
}

// attachLocked makes client the current connection, and starts watching
// for it to disconnect.
func (s *Session) attachLocked(client game.Client) {
	att := &attachment{client: client, detachedCh: make(chan struct{})}
	s.cur = att
	close(s.attachCh)
	s.attachCh = make(chan struct{})
	go func() {
		select {
		case <-client.DisconnectCh():
			// ReadPlayerAction may not see the read error that tells a
			// closed from a broken connection, if it isn't reading now, so
			// ask the client.
			if pc, ok := client.(peerCloser); ok && pc.PeerClosed() {
				s.leave(att)
			} else {
				s.detach(att)
			}
		case <-att.detachedCh:
		}
	}()
}

// detach detaches att, if it is the current connection, see detachLocked.
func (s *Session) detach(att *attachment) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.detachLocked(att)
}

// detachLocked detaches and disconnects att, if it is the current
// connection. Before the game has started that ends the Session, after
// it starts the grace period.
func (s *Session) detachLocked(att *attachment) {
	if s.cur != att {
		return
	}
	s.dropLocked()
	if !s.started {
		s.endLocked()
		return
	}
	s.startGraceLocked()
}

// dropLocked detaches and disconnects the current connection, if any.
func (s *Session) dropLocked() {
	if s.cur == nil {
		return
	}
	close(s.cur.detachedCh)
	s.cur.client.Disconnect()
	s.cur = nil
}

// startGraceLocked starts (or restarts) the grace period, after which the
// Session ends.
func (s *Session) startGraceLocked() {
	s.stopGraceLocked()
	var t *time.Timer
	t = time.AfterFunc(s.grace, func() {
		s.mu.Lock()
		defer s.mu.Unlock()
		// Ignore a timer stopped too late.
		if s.graceTimer == t {
			s.endLocked()
		}
	})
	s.graceTimer = t
}

// stopGraceLocked stops the grace period, if running.
func (s *Session) stopGraceLocked() {
	if s.graceTimer != nil {
		s.graceTimer.Stop()
		s.graceTimer = nil
	}
}

// endLocked ends the Session, disconnecting the current connection. No-op
// if already ended.
func (s *Session) endLocked() {
	if s.ended {
		return
	}
	s.ended = true
	s.stopGraceLocked()
	s.dropLocked()
	close(s.endCh)
}
