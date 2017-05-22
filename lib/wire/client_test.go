package wire

import "context"

// MockClient is a mock implementation of the wire.Client interface,
// that for each method forwards calls to the Func defined in the struct.
type MockClient struct {
	DisconnectFunc   func()
	DisconnectChFunc func() <-chan struct{}
	WriteMessageFunc func(ctx context.Context, msg []byte) error
	ReadMessageFunc  func(ctx context.Context) ([]byte, error)
}

func (c *MockClient) Disconnect() {
	c.DisconnectFunc()
}
func (c *MockClient) DisconnectCh() <-chan struct{} {
	return c.DisconnectChFunc()
}
func (c *MockClient) WriteMessage(ctx context.Context, msg []byte) error {
	return c.WriteMessageFunc(ctx, msg)
}
func (c *MockClient) ReadMessage(ctx context.Context) ([]byte, error) {
	return c.ReadMessageFunc(ctx)
}
