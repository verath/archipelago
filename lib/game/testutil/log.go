package testutil

import (
	"io/ioutil"

	"github.com/sirupsen/logrus"
)

// DiscardLogger is a logrus.Logger configured to discard all output
var DiscardLogger = &logrus.Logger{
	Out: ioutil.Discard,
}
