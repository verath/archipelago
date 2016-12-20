package model

import "github.com/verath/archipelago/lib/id"

type Identifier string

func (id Identifier) ID() Identifier {
	return id
}

func (id Identifier) Equals(other Identifier) bool {
	return id == other
}

func NewIdentifier() (Identifier, error) {
	return Identifier(id.Next()), nil
}
