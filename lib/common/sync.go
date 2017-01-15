package common

import (
	"sync/atomic"
)

// SetStarted changes the value pointed to by startedAddr from 0 to 1. If the
// value pointed to by startedAddr is not 0, then this function panics.
func SetStarted(startedAddr *int32) {
	if !atomic.CompareAndSwapInt32(startedAddr, 0, 1) {
		panic("Already started!")
	}
}
