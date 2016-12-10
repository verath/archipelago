package event


type PlayerEvent interface {
	Name() string
	Data() interface{}
}
