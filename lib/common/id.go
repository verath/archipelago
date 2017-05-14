package common

import (
	"strconv"
	"sync/atomic"
)

var idCount uint64

// NextGlobalID returns the next value of a global id counter,
// shared between any caller to this method. The returned id is
// returned as a base16 string.
func NextGlobalID() string {
	val := atomic.AddUint64(&idCount, uint64(1))
	return strconv.FormatUint(val, 16)
}
