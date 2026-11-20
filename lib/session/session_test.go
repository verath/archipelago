package session

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"testing"
	"time"

	"github.com/verath/archipelago/lib/game/model"
	"github.com/verath/archipelago/lib/network"
)

var errFakeDisconnected = errors.New("fakeConn disconnected")

// fakeConn is a game.Client recording the events written to it.
type fakeConn struct {
	// blockWrites makes writes block until the fakeConn is disconnected.
	blockWrites bool
	// writingCh, if not nil, gets a value when a write starts.
	writingCh chan struct{}

	written chan model.PlayerEvent
	actions chan model.PlayerAction
	// readErr, if set, is returned by reads once disconnected, instead of
	// errFakeDisconnected.
	readErr error

	disconnectOnce sync.Once
	disconnectCh   chan struct{}
}

func newFakeConn() *fakeConn {
	return &fakeConn{
		written:      make(chan model.PlayerEvent, 100),
		actions:      make(chan model.PlayerAction),
		disconnectCh: make(chan struct{}),
	}
}

func (c *fakeConn) Disconnect() {
	c.disconnectOnce.Do(func() { close(c.disconnectCh) })
}

func (c *fakeConn) DisconnectCh() <-chan struct{} {
	return c.disconnectCh
}

func (c *fakeConn) WritePlayerEvent(ctx context.Context, evt model.PlayerEvent) error {
	if c.writingCh != nil {
		c.writingCh <- struct{}{}
	}
	if c.blockWrites {
		select {
		case <-c.disconnectCh:
			return errFakeDisconnected
		case <-ctx.Done():
			return ctx.Err()
		}
	}
	select {
	case <-c.disconnectCh:
		return errFakeDisconnected
	default:
	}
	c.written <- evt
	return nil
}

func (c *fakeConn) ReadPlayerAction(ctx context.Context) (model.PlayerAction, error) {
	select {
	case act := <-c.actions:
		return act, nil
	case <-c.disconnectCh:
		if c.readErr != nil {
			return nil, c.readErr
		}
		return nil, errFakeDisconnected
	case <-ctx.Done():
		return nil, ctx.Err()
	}
}

func (c *fakeConn) PeerClosed() bool {
	return c.isDisconnected() && errors.Is(c.readErr, network.ErrPeerClosed)
}

func (c *fakeConn) isDisconnected() bool {
	select {
	case <-c.disconnectCh:
		return true
	default:
		return false
	}
}

const testTimeout = 5 * time.Second

// nextEvent returns the next event written to c.
func nextEvent(t *testing.T, c *fakeConn) model.PlayerEvent {
	t.Helper()
	select {
	case evt := <-c.written:
		return evt
	case <-time.After(testTimeout):
		t.Fatal("timeout waiting for event")
		return nil
	}
}

// expectNoEvent fails if an event has been written to c.
func expectNoEvent(t *testing.T, c *fakeConn) {
	t.Helper()
	select {
	case evt := <-c.written:
		t.Errorf("unexpected event %T %+v", evt, evt)
	default:
	}
}

// expectStart checks that the next event written to c is a game start with
// the session's token.
func expectStart(t *testing.T, c *fakeConn, s *Session) {
	t.Helper()
	start, ok := nextEvent(t, c).(*model.PlayerEventGameStart)
	if !ok {
		t.Fatalf("event is not a game start")
	}
	if start.PlayerID != "p1" || start.ResumeToken != s.Token() || start.ResumeTimeout != s.grace {
		t.Errorf("game start = %+v, want player p1, token %q and timeout %v", start, s.Token(), s.grace)
	}
}

// expectEvent checks that the next event written to c is want.
func expectEvent(t *testing.T, c *fakeConn, want model.PlayerEvent) {
	t.Helper()
	if got := nextEvent(t, c); got != want {
		t.Errorf("event = %T %+v, want %T %+v", got, got, want, want)
	}
}

func waitClosed(t *testing.T, ch <-chan struct{}, what string) {
	t.Helper()
	select {
	case <-ch:
	case <-time.After(testTimeout):
		t.Fatalf("timeout waiting for %s", what)
	}
}

func expectOpen(t *testing.T, ch <-chan struct{}, what string) {
	t.Helper()
	select {
	case <-ch:
		t.Fatalf("%s closed", what)
	case <-time.After(20 * time.Millisecond):
	}
}

func newStart() model.PlayerEvent {
	return (&model.EventGameStart{TickInterval: time.Second}).ToPlayerEvent("p1")
}

func newTick() *model.PlayerEventTick {
	return &model.PlayerEventTick{PlayerID: "p1", Game: model.CreateDummyGameEmpty()}
}

func newGameOver() *model.PlayerEventGameOver {
	return &model.PlayerEventGameOver{EventGameOver: &model.EventGameOver{WinnerID: "p1"}}
}

func write(t *testing.T, s *Session, evt model.PlayerEvent) {
	t.Helper()
	if err := s.WritePlayerEvent(context.Background(), evt); err != nil {
		t.Fatalf("WritePlayerEvent(%T): %v", evt, err)
	}
}

// newStartedSession returns a Session on a new fakeConn, with the game
// start written.
func newStartedSession(t *testing.T, grace time.Duration) (*Session, *fakeConn) {
	t.Helper()
	conn := newFakeConn()
	s := New(conn, grace)
	t.Cleanup(s.Disconnect)
	write(t, s, newStart())
	expectStart(t, conn, s)
	return s, conn
}

func TestSession_Token(t *testing.T) {
	s1, s2 := New(newFakeConn(), time.Minute), New(newFakeConn(), time.Minute)
	defer s1.Disconnect()
	defer s2.Disconnect()
	if len(s1.Token()) < 22 || s1.Token() == s2.Token() {
		t.Errorf("tokens %q and %q, want long and different", s1.Token(), s2.Token())
	}
}

func TestSession_DropBeforeStart_Ends(t *testing.T) {
	conn := newFakeConn()
	s := New(conn, time.Minute)
	conn.Disconnect()
	waitClosed(t, s.DisconnectCh(), "DisconnectCh")
	if err := s.WritePlayerEvent(context.Background(), newStart()); !errors.Is(err, ErrEnded) {
		t.Errorf("WritePlayerEvent = %v, want ErrEnded", err)
	}
	if _, err := s.ReadPlayerAction(context.Background()); !errors.Is(err, ErrEnded) {
		t.Errorf("ReadPlayerAction = %v, want ErrEnded", err)
	}
}

func TestSession_FailedStartWrite_Ends(t *testing.T) {
	conn := newFakeConn()
	s := New(conn, time.Minute)
	// Disconnected, but the session may not have noticed yet: the write
	// fails.
	conn.Disconnect()
	if err := s.WritePlayerEvent(context.Background(), newStart()); err == nil {
		t.Error("WritePlayerEvent succeeded, want error")
	}
	waitClosed(t, s.DisconnectCh(), "DisconnectCh")
}

func TestSession_AttachBeforeStart_Fails(t *testing.T) {
	s := New(newFakeConn(), time.Minute)
	defer s.Disconnect()
	if s.Resumable() {
		t.Error("Resumable before start")
	}
	conn := newFakeConn()
	if err := s.Attach(context.Background(), conn); !errors.Is(err, ErrNotStarted) {
		t.Errorf("Attach = %v, want ErrNotStarted", err)
	}
	if !conn.isDisconnected() {
		t.Error("connection not disconnected after failed Attach")
	}
}

func TestSession_Attached_ForwardsEvents(t *testing.T) {
	s, conn := newStartedSession(t, time.Minute)
	tick := newTick()
	write(t, s, tick)
	expectEvent(t, conn, tick)
	act := &model.PlayerActionLeave{}
	go func() { conn.actions <- act }()
	got, err := s.ReadPlayerAction(context.Background())
	if err != nil || got != act {
		t.Errorf("ReadPlayerAction = %v, %v; want %v, nil", got, err, act)
	}
	if !s.Resumable() {
		t.Error("not Resumable after start")
	}
}

func TestSession_DropAfterStart_DetachesAndResumes(t *testing.T) {
	s, conn := newStartedSession(t, time.Minute)
	write(t, s, newTick())
	nextEvent(t, conn)
	conn.Disconnect()

	// Writes while detached succeed, and the latest tick is kept.
	tick := newTick()
	write(t, s, newTick())
	write(t, s, tick)
	expectOpen(t, s.DisconnectCh(), "DisconnectCh")
	if !s.Resumable() {
		t.Fatal("not Resumable after drop")
	}

	conn2 := newFakeConn()
	if err := s.Attach(context.Background(), conn2); err != nil {
		t.Fatalf("Attach: %v", err)
	}
	expectStart(t, conn2, s)
	expectEvent(t, conn2, tick)
	expectNoEvent(t, conn2)

	// Later events go to the new connection.
	tick2 := newTick()
	write(t, s, tick2)
	expectEvent(t, conn2, tick2)
	expectNoEvent(t, conn)
}

func TestSession_ReadWhileDetached_WaitsForAttach(t *testing.T) {
	s, conn := newStartedSession(t, time.Minute)
	conn.Disconnect()
	type result struct {
		act model.PlayerAction
		err error
	}
	resultCh := make(chan result, 1)
	go func() {
		act, err := s.ReadPlayerAction(context.Background())
		resultCh <- result{act, err}
	}()
	select {
	case r := <-resultCh:
		t.Fatalf("ReadPlayerAction returned while detached: %v, %v", r.act, r.err)
	case <-time.After(20 * time.Millisecond):
	}

	conn2 := newFakeConn()
	if err := s.Attach(context.Background(), conn2); err != nil {
		t.Fatalf("Attach: %v", err)
	}
	act := &model.PlayerActionLaunch{From: "a", To: "b", Seq: 3}
	conn2.actions <- act
	select {
	case r := <-resultCh:
		if r.err != nil || r.act != act {
			t.Errorf("ReadPlayerAction = %v, %v; want %v, nil", r.act, r.err, act)
		}
	case <-time.After(testTimeout):
		t.Fatal("timeout waiting for ReadPlayerAction")
	}
}

func TestSession_GraceExpiry_Ends(t *testing.T) {
	s, conn := newStartedSession(t, 50*time.Millisecond)
	conn.Disconnect()
	readErrCh := make(chan error, 1)
	go func() {
		_, err := s.ReadPlayerAction(context.Background())
		readErrCh <- err
	}()
	waitClosed(t, s.DisconnectCh(), "DisconnectCh")
	select {
	case err := <-readErrCh:
		if !errors.Is(err, ErrEnded) {
			t.Errorf("ReadPlayerAction = %v, want ErrEnded", err)
		}
	case <-time.After(testTimeout):
		t.Fatal("timeout waiting for ReadPlayerAction")
	}
	if s.Resumable() {
		t.Error("Resumable after grace expiry")
	}
	conn2 := newFakeConn()
	if err := s.Attach(context.Background(), conn2); !errors.Is(err, ErrEnded) {
		t.Errorf("Attach = %v, want ErrEnded", err)
	}
	if !conn2.isDisconnected() {
		t.Error("connection not disconnected after failed Attach")
	}
	if err := s.WritePlayerEvent(context.Background(), newTick()); !errors.Is(err, ErrEnded) {
		t.Errorf("WritePlayerEvent = %v, want ErrEnded", err)
	}
}

func TestSession_Attach_StopsGraceTimer(t *testing.T) {
	s, conn := newStartedSession(t, 50*time.Millisecond)
	conn.Disconnect()
	if err := s.Attach(context.Background(), newFakeConn()); err != nil {
		t.Fatalf("Attach: %v", err)
	}
	expectOpen(t, s.DisconnectCh(), "DisconnectCh")
	time.Sleep(100 * time.Millisecond)
	expectOpen(t, s.DisconnectCh(), "DisconnectCh")
}

func TestSession_GameOverWhileDetached_DeliveredOnAttach(t *testing.T) {
	s, conn := newStartedSession(t, time.Minute)
	conn.Disconnect()
	tick, gameOver := newTick(), newGameOver()
	write(t, s, tick)
	write(t, s, gameOver)
	// The game is over and disconnects its clients, but the session waits
	// for the player to get the game over.
	s.Disconnect()
	expectOpen(t, s.DisconnectCh(), "DisconnectCh")

	conn2 := newFakeConn()
	if err := s.Attach(context.Background(), conn2); err != nil {
		t.Fatalf("Attach: %v", err)
	}
	expectStart(t, conn2, s)
	expectEvent(t, conn2, tick)
	expectEvent(t, conn2, gameOver)
	waitClosed(t, s.DisconnectCh(), "DisconnectCh")
	if !conn2.isDisconnected() {
		t.Error("connection not disconnected after game over")
	}
}

func TestSession_GameOverDelivered_Ends(t *testing.T) {
	s, conn := newStartedSession(t, time.Minute)
	gameOver := newGameOver()
	write(t, s, gameOver)
	expectEvent(t, conn, gameOver)
	waitClosed(t, s.DisconnectCh(), "DisconnectCh")
	if !conn.isDisconnected() {
		t.Error("connection not disconnected after game over")
	}
	if err := s.Attach(context.Background(), newFakeConn()); !errors.Is(err, ErrEnded) {
		t.Errorf("Attach = %v, want ErrEnded", err)
	}
}

func TestSession_Disconnect_Ends(t *testing.T) {
	s, conn := newStartedSession(t, time.Minute)
	s.Disconnect()
	waitClosed(t, s.DisconnectCh(), "DisconnectCh")
	if !conn.isDisconnected() {
		t.Error("connection not disconnected")
	}
}

func TestSession_DisconnectWhileDetached_Ends(t *testing.T) {
	s, conn := newStartedSession(t, time.Minute)
	conn.Disconnect()
	write(t, s, newTick())
	s.Disconnect()
	waitClosed(t, s.DisconnectCh(), "DisconnectCh")
}

func TestSession_AttachWhileAttached_DisconnectsOld(t *testing.T) {
	s, conn := newStartedSession(t, time.Minute)
	tick := newTick()
	write(t, s, tick)
	expectEvent(t, conn, tick)

	conn2 := newFakeConn()
	if err := s.Attach(context.Background(), conn2); err != nil {
		t.Fatalf("Attach: %v", err)
	}
	if !conn.isDisconnected() {
		t.Error("old connection not disconnected")
	}
	expectStart(t, conn2, s)
	expectEvent(t, conn2, tick)
	expectOpen(t, s.DisconnectCh(), "DisconnectCh")
}

// Test that Attach does not deadlock with a write blocked on the old
// connection, and that the new connection gets events in order.
func TestSession_AttachDuringBlockedWrite(t *testing.T) {
	conn := newFakeConn()
	s := New(conn, time.Minute)
	defer s.Disconnect()
	write(t, s, newStart())
	expectStart(t, conn, s)
	conn.blockWrites = true
	conn.writingCh = make(chan struct{}, 1)

	tick := newTick()
	writeErrCh := make(chan error, 1)
	go func() { writeErrCh <- s.WritePlayerEvent(context.Background(), tick) }()
	<-conn.writingCh

	conn2 := newFakeConn()
	attachErrCh := make(chan error, 1)
	go func() { attachErrCh <- s.Attach(context.Background(), conn2) }()
	for name, ch := range map[string]chan error{"WritePlayerEvent": writeErrCh, "Attach": attachErrCh} {
		select {
		case err := <-ch:
			if err != nil {
				t.Errorf("%s: %v", name, err)
			}
		case <-time.After(testTimeout):
			t.Fatalf("timeout waiting for %s", name)
		}
	}
	// The tick that didn't make it on the old connection is written to the
	// new one, followed by later ticks.
	tick2 := newTick()
	write(t, s, tick2)
	expectStart(t, conn2, s)
	expectEvent(t, conn2, tick)
	expectEvent(t, conn2, tick2)
}

// Test that events keep their order when written concurrently with Attach.
func TestSession_AttachConcurrentWrites_InOrder(t *testing.T) {
	s, conn := newStartedSession(t, time.Minute)
	conn.Disconnect()
	write(t, s, newTick())

	const numTicks = 50
	ticks := make([]*model.PlayerEventTick, numTicks)
	for i := range ticks {
		ticks[i] = newTick()
	}
	writeDone := make(chan struct{})
	go func() {
		defer close(writeDone)
		for _, tick := range ticks {
			if err := s.WritePlayerEvent(context.Background(), tick); err != nil {
				t.Errorf("WritePlayerEvent: %v", err)
			}
		}
	}()
	conn2 := newFakeConn()
	if err := s.Attach(context.Background(), conn2); err != nil {
		t.Fatalf("Attach: %v", err)
	}
	<-writeDone

	expectStart(t, conn2, s)
	// Then a suffix of the ticks, in order, starting with the latest tick
	// when attached.
	first, ok := nextEvent(t, conn2).(*model.PlayerEventTick)
	if !ok {
		t.Fatal("event after game start is not a tick")
	}
	i := 0
	for i < numTicks && ticks[i] != first {
		i++
	}
	if i == numTicks {
		// Attached before the first of ticks was written: the previous tick.
		i = -1
	}
	for i++; i < numTicks; i++ {
		expectEvent(t, conn2, ticks[i])
	}
	expectNoEvent(t, conn2)
}

func TestSession_ReadErrorAfterStart_Detaches(t *testing.T) {
	s, conn := newStartedSession(t, time.Minute)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	readErrCh := make(chan error, 1)
	go func() {
		_, err := s.ReadPlayerAction(ctx)
		readErrCh <- err
	}()
	conn.Disconnect()
	expectOpen(t, s.DisconnectCh(), "DisconnectCh")
	cancel()
	select {
	case err := <-readErrCh:
		if !errors.Is(err, context.Canceled) {
			t.Errorf("ReadPlayerAction = %v, want context.Canceled", err)
		}
	case <-time.After(testTimeout):
		t.Fatal("timeout waiting for ReadPlayerAction")
	}
}

func TestSession_PeerClosedAfterStart_Ends(t *testing.T) {
	conn := newFakeConn()
	conn.readErr = fmt.Errorf("closed: %w", network.ErrPeerClosed)
	s := New(conn, time.Minute)
	t.Cleanup(s.Disconnect)
	write(t, s, newStart())
	expectStart(t, conn, s)

	readErrCh := make(chan error, 1)
	go func() {
		_, err := s.ReadPlayerAction(context.Background())
		readErrCh <- err
	}()
	// The client closed the connection on purpose, e.g. closed the tab.
	conn.Disconnect()
	waitClosed(t, s.DisconnectCh(), "DisconnectCh")
	select {
	case err := <-readErrCh:
		if !errors.Is(err, ErrEnded) {
			t.Errorf("ReadPlayerAction = %v, want ErrEnded", err)
		}
	case <-time.After(testTimeout):
		t.Fatal("timeout waiting for ReadPlayerAction")
	}
	if s.Resumable() {
		t.Error("Resumable() = true after the client closed the connection")
	}
}

// The client closed the connection while no read was in progress: the
// watcher of its DisconnectCh ends the Session.
func TestSession_PeerClosedWhileNotReading_Ends(t *testing.T) {
	conn := newFakeConn()
	conn.readErr = fmt.Errorf("closed: %w", network.ErrPeerClosed)
	s := New(conn, time.Minute)
	t.Cleanup(s.Disconnect)
	write(t, s, newStart())
	expectStart(t, conn, s)
	conn.Disconnect()
	waitClosed(t, s.DisconnectCh(), "DisconnectCh")
}

func TestSession_PeerClosedOldConnection_DoesNotEndResumed(t *testing.T) {
	s, conn1 := newStartedSession(t, time.Minute)
	conn1.readErr = fmt.Errorf("closed: %w", network.ErrPeerClosed)
	// Resume on conn2 first, then the old connection's close arrives.
	conn2 := newFakeConn()
	if err := s.Attach(context.Background(), conn2); err != nil {
		t.Fatalf("Attach: %v", err)
	}
	expectStart(t, conn2, s)
	if !s.leave(&attachment{client: conn1}) {
		expectOpen(t, s.DisconnectCh(), "DisconnectCh")
	} else {
		t.Error("leave of an old connection ended the resumed session")
	}
}

func TestRegistry(t *testing.T) {
	r := NewRegistry(time.Minute)
	conn := newFakeConn()
	s := r.New(conn)
	if r.Len() != 1 {
		t.Errorf("Len = %d, want 1", r.Len())
	}
	if got := r.Resumable(s.Token()); got != nil {
		t.Error("Resumable before game start")
	}
	write(t, s, newStart())
	if got := r.Resumable(s.Token()); got != s {
		t.Errorf("Resumable = %v, want session", got)
	}
	if got := r.Resumable("bogus"); got != nil {
		t.Errorf("Resumable(bogus) = %v, want nil", got)
	}
	if got := r.Resumable(""); got != nil {
		t.Errorf("Resumable(\"\") = %v, want nil", got)
	}
	s.Disconnect()
	deadline := time.Now().Add(testTimeout)
	for r.Len() != 0 {
		if time.Now().After(deadline) {
			t.Fatal("ended session not removed")
		}
		time.Sleep(time.Millisecond)
	}
	if got := r.Resumable(s.Token()); got != nil {
		t.Error("Resumable after end")
	}
}
