package network

import (
	"context"
	"github.com/Sirupsen/logrus"
	"github.com/verath/archipelago/lib/common"
	"sync"
)

// ClientHandler is a handler that handles new Clients.
type ClientHandler interface {
	// HandleClient handles the the provided Client. The method
	// may block, but must unblock when the context is cancelled.
	HandleClient(ctx context.Context, client Client) error
}

// ConnectionProvider is an entity that allows registering ConnectionHandlers.
type ConnectionProvider interface {
	// SetConnectionHandler registers a ConnectionHandler to be notified
	// of new Connections.
	SetConnectionHandler(handler ConnectionHandler)
}

// The ClientManager handles creating, starting and running Clients. The clients
// are created by listening for new connection from the ConnectionProvider.
type ClientManager struct {
	logEntry      *logrus.Entry
	clientHandler ClientHandler
	clientsWG     sync.WaitGroup
}

// NewClientManager returns a new ClientManager.
func NewClientManager(log *logrus.Logger, clientHandler ClientHandler) (*ClientManager, error) {
	return &ClientManager{
		logEntry:      common.ModuleLogEntryWithID(log, "network/clientmanager"),
		clientHandler: clientHandler,
	}, nil
}

// Run starts and runs the ClientManager, which makes the ClientManager listen to the
// ConnectionProvider for new connection This method blocks until the context is
// cancelled or an error occurs, and always returns a non-nil error. It is guaranteed
// that all Clients, that were created by the ClientManger, is stopped when Run returns.
func (cm *ClientManager) Run(ctx context.Context, connProvider ConnectionProvider) error {
	connProvider.SetConnectionHandler(cm.connectionHandler(ctx))
	<-ctx.Done()
	connProvider.SetConnectionHandler(nil)
	cm.logEntry.Debug("Waiting for clients to stop...")
	cm.clientsWG.Wait()
	return ctx.Err()
}

// connectionHandler creates a ConnectionHandler that keeps the provided context in scope.
func (cm *ClientManager) connectionHandler(ctx context.Context) ConnectionHandler {
	return ConnectionHandlerFunc(func(connection Connection) {
		err := cm.handleConnection(ctx, connection)
		if err != nil {
			cm.logEntry.Errorf("Error handling connection: %+v", err)
		}
	})
}

// handleConnection handles new connections by creating a new client for the
// connection, starting the client, and forwarding it to the ClientHandler.
func (cm *ClientManager) handleConnection(ctx context.Context, connection Connection) error {
	client, err := cm.createClient(cm.logEntry.Logger, connection)
	if err != nil {
		return err
	}
	go cm.runClient(ctx, client)
	return cm.clientHandler.HandleClient(ctx, client)
}

// createClient returns a new Client from the provided logger and connection.
// This method is primarily used so tests can override Client creation, it
// if needed.
func (cm *ClientManager) createClient(log *logrus.Logger, conn Connection) (Client, error) {
	return NewClient(log, conn)
}

// runClient starts and runs a client using the context provided.
func (cm *ClientManager) runClient(ctx context.Context, client Client) {
	cm.clientsWG.Add(1)
	defer cm.clientsWG.Done()
	err := client.Run(ctx)
	if err != nil {
		cm.logEntry.Debugf("Client stopped with an error: %v", err)
	}
}
