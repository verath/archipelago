package network

import (
	"context"
	"testing"
	"time"
)

func TestClientQueue_HandleClient(t *testing.T) {
	cq, _ := NewClientQueue(1)
	ctx := context.Background()
	client := &MockClient{}
	if err := cq.HandleClient(ctx, client); err != nil {
		t.Errorf("Expected no error when adding client, got %+v", err)
	}
	ctx, cancel := context.WithTimeout(ctx, 10*time.Millisecond)
	defer cancel()
	if err := cq.HandleClient(ctx, client); err != context.DeadlineExceeded {
		t.Errorf("Expected queue to block when full and return context error, got: %+v", err)
	}
}

func TestClientQueue_NextClient(t *testing.T) {
	cq, _ := NewClientQueue(1)
	ctx := context.Background()
	client := &MockClient{}
	cq.HandleClient(ctx, client)

	queueClient, err := cq.NextClient(ctx)
	if err != nil {
		t.Errorf("Expected no error when getting next client from non-full queue, got: %+v", err)
	}
	if queueClient != client {
		t.Errorf("Expected to get the same client that was added previously\n\tExpected: %v\n\tActual: %v", client, queueClient)
	}

	ctx, cancel := context.WithTimeout(ctx, 10*time.Millisecond)
	defer cancel()
	if _, err := cq.NextClient(ctx); err != context.DeadlineExceeded {
		t.Errorf("Expected queue to block when empty and return context error, got: %+v", err)
	}
}
