package game

import (
	"context"
	"testing"
	"time"

	"github.com/verath/archipelago/lib/game/testutil"
)

func TestNewCoordinator_ValidatesOptions(t *testing.T) {
	tests := []struct {
		name    string
		opts    CoordinatorOptions
		wantErr bool
	}{
		{"defaults", CoordinatorOptions{LobbyWait: DefaultLobbyWait, AIPlayers: AIPlayersAuto}, false},
		{"zero lobby wait", CoordinatorOptions{LobbyWait: 0, AIPlayers: 0}, false},
		{"exact ai players", CoordinatorOptions{LobbyWait: time.Second, AIPlayers: 3}, false},
		{"negative lobby wait", CoordinatorOptions{LobbyWait: -time.Second, AIPlayers: AIPlayersAuto}, true},
		{"ai players below auto", CoordinatorOptions{LobbyWait: time.Second, AIPlayers: -2}, true},
		{"max ai players", CoordinatorOptions{LobbyWait: time.Second, AIPlayers: MaxAIPlayers}, false},
		{"too many ai players", CoordinatorOptions{LobbyWait: time.Second, AIPlayers: MaxAIPlayers + 1}, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := NewCoordinator(testutil.DiscardLogger, tt.opts)
			if gotErr := err != nil; gotErr != tt.wantErr {
				t.Errorf("expected error: %v, got: %v", tt.wantErr, err)
			}
		})
	}
}

func TestCoordinatorOptions_NumAIClients(t *testing.T) {
	tests := []struct {
		aiPlayers  int
		numRemote  int
		wantNumAIs int
	}{
		// Auto: fill up to 4 players, at least 1 AI (the production behaviour).
		{AIPlayersAuto, 1, 3},
		{AIPlayersAuto, 2, 2},
		{AIPlayersAuto, 3, 1},
		{AIPlayersAuto, 4, 1},
		{AIPlayersAuto, 10, 1},
		// Exact counts, regardless of the number of remote clients.
		{0, 2, 0},
		{0, 10, 0},
		{1, 1, 1},
		{5, 3, 5},
	}
	for _, tt := range tests {
		opts := CoordinatorOptions{AIPlayers: tt.aiPlayers}
		if got := opts.numAIClients(tt.numRemote); got != tt.wantNumAIs {
			t.Errorf("AIPlayers=%d, numRemote=%d: expected %d AI clients, got %d",
				tt.aiPlayers, tt.numRemote, tt.wantNumAIs, got)
		}
	}
}

func TestCoordinatorOptions_MinRemoteClients(t *testing.T) {
	tests := []struct {
		aiPlayers int
		want      int
	}{
		{AIPlayersAuto, 1},
		// Without AI players a game needs two humans.
		{0, 2},
		{1, 1},
		{3, 1},
	}
	for _, tt := range tests {
		opts := CoordinatorOptions{AIPlayers: tt.aiPlayers}
		if got := opts.minRemoteClients(); got != tt.want {
			t.Errorf("AIPlayers=%d: expected min %d remote clients, got %d", tt.aiPlayers, tt.want, got)
		}
	}
}

// newConnectedMockClient returns a mockClient that stays connected until
// Disconnect is called.
func newConnectedMockClient() *mockClient {
	disconnectCh := make(chan struct{})
	return &mockClient{
		DisconnectFunc: func() {
			select {
			case <-disconnectCh:
			default:
				close(disconnectCh)
			}
		},
		DisconnectChFunc: func() <-chan struct{} { return disconnectCh },
	}
}

// Test that awaitRemoteClients waits for minNumClients before starting the
// LobbyWait timer, then returns after LobbyWait.
func TestCoordinator_AwaitRemoteClients_UsesLobbyWait(t *testing.T) {
	coordinator, err := NewCoordinator(testutil.DiscardLogger, CoordinatorOptions{
		LobbyWait: 50 * time.Millisecond,
		AIPlayers: 0,
	})
	if err != nil {
		t.Fatalf("expected no error creating coordinator, got: %+v", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	type result struct {
		clients []Client
		err     error
	}
	resultCh := make(chan result, 1)
	go func() {
		clients, err := coordinator.awaitRemoteClients(ctx, coordinator.opts.minRemoteClients(), maxRemoteClientsPerGame)
		resultCh <- result{clients, err}
	}()

	if err := coordinator.AddClient(ctx, newConnectedMockClient()); err != nil {
		t.Fatalf("expected no error adding client, got: %+v", err)
	}
	// With a single client (and no AI players) the lobby must keep waiting,
	// well past LobbyWait.
	select {
	case res := <-resultCh:
		t.Fatalf("expected awaitRemoteClients to wait for a second client, got %d clients, err: %v",
			len(res.clients), res.err)
	case <-time.After(200 * time.Millisecond):
	}

	if err := coordinator.AddClient(ctx, newConnectedMockClient()); err != nil {
		t.Fatalf("expected no error adding client, got: %+v", err)
	}
	select {
	case res := <-resultCh:
		if res.err != nil {
			t.Fatalf("expected no error, got: %+v", res.err)
		}
		if len(res.clients) != 2 {
			t.Errorf("expected 2 clients, got %d", len(res.clients))
		}
		disconnectAll(res.clients)
	case <-ctx.Done():
		t.Fatal("timed out waiting for awaitRemoteClients to return after LobbyWait")
	}
}
