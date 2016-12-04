package model

import "github.com/nu7hatch/gouuid"

type identifier string

func (id identifier) ID() identifier {
	return id
}

func (id identifier) Equals(other identifier) bool {
	return id == other
}

func newIdentifier() (identifier, error) {
	id, err := uuid.NewV4()
	if err != nil {
		return "", err
	}
	return identifier(id.String()), nil
}
