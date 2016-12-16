package util

import "context"

type ContextRunFunc func(ctx context.Context) error

// RunWithContext is a helper function for running multiple functions
// on separate go-routines. Generally the functions should all be
// functions that would normally run "forever".
//
// Each function provided must stop its execution when the context is
// cancelled, and must always return a non-nil error.
//
// This function blocks until have finished, and returns error from
// the function the finishes first.
func RunWithContext(ctx context.Context, funcs ...ContextRunFunc) error {
	ctx, cancel := context.WithCancel(ctx)
	errCh := make(chan error)

	// Run each function on a new go-routine, posting its result (error)
	// on the errCh.
	for _, f := range funcs {
		go func(f ContextRunFunc) {
			errCh <- f(ctx)
		}(f)
	}

	// If we receive an error, signal all functions to quit
	// and wait for them all to finish, before returning the
	// first error that occurred
	err := <-errCh
	cancel()
	for i := 1; i < len(funcs); i++ {
		<-errCh
	}
	return err
}
