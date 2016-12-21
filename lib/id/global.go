package id

import (
	"strconv"
	"sync/atomic"
)

var idCount uint64 = 0

func NextGlobalID() string {
	val := atomic.AddUint64(&idCount, uint64(1))
	return strconv.FormatUint(val, 16)
}
