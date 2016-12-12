package model

import "github.com/nu7hatch/gouuid"

type Identifier string

func (id Identifier) ID() Identifier {
	return id
}

func (id Identifier) Equals(other Identifier) bool {
	return id == other
}

func NewIdentifier() (Identifier, error) {
	id, err := uuid.NewV4()
	if err != nil {
		return "", err
	}
	return Identifier(id.String()), nil
}
