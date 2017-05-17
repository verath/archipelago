// Code generated by protoc-gen-go.
// source: proto/wire/game/model.proto
// DO NOT EDIT!

/*
Package game is a generated protocol buffer package.

It is generated from these files:
	proto/wire/game/model.proto

It has these top-level messages:
	Coordinate
	FloatCoordinate
	Player
	Army
	Airplane
	Island
	Game
*/
package game

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion2 // please upgrade the proto package

type Coordinate struct {
	X int32 `protobuf:"varint,1,opt,name=x" json:"x,omitempty"`
	Y int32 `protobuf:"varint,2,opt,name=y" json:"y,omitempty"`
}

func (m *Coordinate) Reset()                    { *m = Coordinate{} }
func (m *Coordinate) String() string            { return proto.CompactTextString(m) }
func (*Coordinate) ProtoMessage()               {}
func (*Coordinate) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

func (m *Coordinate) GetX() int32 {
	if m != nil {
		return m.X
	}
	return 0
}

func (m *Coordinate) GetY() int32 {
	if m != nil {
		return m.Y
	}
	return 0
}

type FloatCoordinate struct {
	X float32 `protobuf:"fixed32,1,opt,name=x" json:"x,omitempty"`
	Y float32 `protobuf:"fixed32,2,opt,name=y" json:"y,omitempty"`
}

func (m *FloatCoordinate) Reset()                    { *m = FloatCoordinate{} }
func (m *FloatCoordinate) String() string            { return proto.CompactTextString(m) }
func (*FloatCoordinate) ProtoMessage()               {}
func (*FloatCoordinate) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{1} }

func (m *FloatCoordinate) GetX() float32 {
	if m != nil {
		return m.X
	}
	return 0
}

func (m *FloatCoordinate) GetY() float32 {
	if m != nil {
		return m.Y
	}
	return 0
}

type Player struct {
	Id string `protobuf:"bytes,1,opt,name=id" json:"id,omitempty"`
}

func (m *Player) Reset()                    { *m = Player{} }
func (m *Player) String() string            { return proto.CompactTextString(m) }
func (*Player) ProtoMessage()               {}
func (*Player) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{2} }

func (m *Player) GetId() string {
	if m != nil {
		return m.Id
	}
	return ""
}

type Army struct {
	Owner    *Player `protobuf:"bytes,1,opt,name=owner" json:"owner,omitempty"`
	Strength int32   `protobuf:"varint,2,opt,name=strength" json:"strength,omitempty"`
}

func (m *Army) Reset()                    { *m = Army{} }
func (m *Army) String() string            { return proto.CompactTextString(m) }
func (*Army) ProtoMessage()               {}
func (*Army) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{3} }

func (m *Army) GetOwner() *Player {
	if m != nil {
		return m.Owner
	}
	return nil
}

func (m *Army) GetStrength() int32 {
	if m != nil {
		return m.Strength
	}
	return 0
}

type Airplane struct {
	Id        string           `protobuf:"bytes,1,opt,name=id" json:"id,omitempty"`
	Army      *Army            `protobuf:"bytes,2,opt,name=army" json:"army,omitempty"`
	Position  *FloatCoordinate `protobuf:"bytes,3,opt,name=position" json:"position,omitempty"`
	Direction float32          `protobuf:"fixed32,4,opt,name=direction" json:"direction,omitempty"`
	Speed     float32          `protobuf:"fixed32,5,opt,name=speed" json:"speed,omitempty"`
}

func (m *Airplane) Reset()                    { *m = Airplane{} }
func (m *Airplane) String() string            { return proto.CompactTextString(m) }
func (*Airplane) ProtoMessage()               {}
func (*Airplane) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{4} }

func (m *Airplane) GetId() string {
	if m != nil {
		return m.Id
	}
	return ""
}

func (m *Airplane) GetArmy() *Army {
	if m != nil {
		return m.Army
	}
	return nil
}

func (m *Airplane) GetPosition() *FloatCoordinate {
	if m != nil {
		return m.Position
	}
	return nil
}

func (m *Airplane) GetDirection() float32 {
	if m != nil {
		return m.Direction
	}
	return 0
}

func (m *Airplane) GetSpeed() float32 {
	if m != nil {
		return m.Speed
	}
	return 0
}

type Island struct {
	Id       string      `protobuf:"bytes,1,opt,name=id" json:"id,omitempty"`
	Army     *Army       `protobuf:"bytes,2,opt,name=army" json:"army,omitempty"`
	Position *Coordinate `protobuf:"bytes,3,opt,name=position" json:"position,omitempty"`
	Size     float32     `protobuf:"fixed32,4,opt,name=size" json:"size,omitempty"`
}

func (m *Island) Reset()                    { *m = Island{} }
func (m *Island) String() string            { return proto.CompactTextString(m) }
func (*Island) ProtoMessage()               {}
func (*Island) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{5} }

func (m *Island) GetId() string {
	if m != nil {
		return m.Id
	}
	return ""
}

func (m *Island) GetArmy() *Army {
	if m != nil {
		return m.Army
	}
	return nil
}

func (m *Island) GetPosition() *Coordinate {
	if m != nil {
		return m.Position
	}
	return nil
}

func (m *Island) GetSize() float32 {
	if m != nil {
		return m.Size
	}
	return 0
}

type Game struct {
	Id            string      `protobuf:"bytes,1,opt,name=id" json:"id,omitempty"`
	Size          *Coordinate `protobuf:"bytes,2,opt,name=size" json:"size,omitempty"`
	Player1       *Player     `protobuf:"bytes,3,opt,name=player1" json:"player1,omitempty"`
	Player2       *Player     `protobuf:"bytes,4,opt,name=player2" json:"player2,omitempty"`
	PlayerNeutral *Player     `protobuf:"bytes,5,opt,name=player_neutral,json=playerNeutral" json:"player_neutral,omitempty"`
	Islands       []*Island   `protobuf:"bytes,6,rep,name=islands" json:"islands,omitempty"`
	Airplanes     []*Airplane `protobuf:"bytes,7,rep,name=airplanes" json:"airplanes,omitempty"`
}

func (m *Game) Reset()                    { *m = Game{} }
func (m *Game) String() string            { return proto.CompactTextString(m) }
func (*Game) ProtoMessage()               {}
func (*Game) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{6} }

func (m *Game) GetId() string {
	if m != nil {
		return m.Id
	}
	return ""
}

func (m *Game) GetSize() *Coordinate {
	if m != nil {
		return m.Size
	}
	return nil
}

func (m *Game) GetPlayer1() *Player {
	if m != nil {
		return m.Player1
	}
	return nil
}

func (m *Game) GetPlayer2() *Player {
	if m != nil {
		return m.Player2
	}
	return nil
}

func (m *Game) GetPlayerNeutral() *Player {
	if m != nil {
		return m.PlayerNeutral
	}
	return nil
}

func (m *Game) GetIslands() []*Island {
	if m != nil {
		return m.Islands
	}
	return nil
}

func (m *Game) GetAirplanes() []*Airplane {
	if m != nil {
		return m.Airplanes
	}
	return nil
}

func init() {
	proto.RegisterType((*Coordinate)(nil), "wire.game.Coordinate")
	proto.RegisterType((*FloatCoordinate)(nil), "wire.game.FloatCoordinate")
	proto.RegisterType((*Player)(nil), "wire.game.Player")
	proto.RegisterType((*Army)(nil), "wire.game.Army")
	proto.RegisterType((*Airplane)(nil), "wire.game.Airplane")
	proto.RegisterType((*Island)(nil), "wire.game.Island")
	proto.RegisterType((*Game)(nil), "wire.game.Game")
}

func init() { proto.RegisterFile("proto/wire/game/model.proto", fileDescriptor0) }

var fileDescriptor0 = []byte{
	// 401 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x9c, 0x93, 0x41, 0x6b, 0xa3, 0x40,
	0x14, 0x80, 0xd1, 0xa8, 0x89, 0x2f, 0x9b, 0x84, 0x9d, 0xdd, 0x05, 0xc9, 0xee, 0x21, 0xb8, 0x87,
	0xcd, 0xb2, 0xac, 0x21, 0x2e, 0x2c, 0xbd, 0xa6, 0x85, 0x96, 0x52, 0x28, 0xc5, 0x63, 0x2f, 0x65,
	0x52, 0x87, 0x74, 0x40, 0x1d, 0x19, 0x2d, 0x89, 0x3d, 0xf7, 0xdf, 0xf4, 0xdc, 0xff, 0x57, 0x7c,
	0x63, 0xa2, 0x4d, 0x24, 0x87, 0xde, 0xe6, 0xbd, 0xf7, 0x3d, 0xe7, 0x9b, 0x37, 0x0e, 0x7c, 0x4f,
	0xa5, 0xc8, 0xc5, 0x6c, 0xcd, 0x25, 0x9b, 0xad, 0x68, 0xcc, 0x66, 0xb1, 0x08, 0x59, 0xe4, 0x61,
	0x96, 0xd8, 0x65, 0xda, 0x2b, 0xd3, 0xee, 0x14, 0xe0, 0x4c, 0x08, 0x19, 0xf2, 0x84, 0xe6, 0x8c,
	0x7c, 0x02, 0x6d, 0xe3, 0x68, 0x13, 0x6d, 0x6a, 0x06, 0xda, 0xa6, 0x8c, 0x0a, 0x47, 0x57, 0x51,
	0xe1, 0xfe, 0x85, 0xd1, 0x79, 0x24, 0x68, 0xde, 0x86, 0xeb, 0xef, 0x70, 0xbd, 0xc4, 0x1d, 0xb0,
	0x6e, 0x22, 0x5a, 0x30, 0x49, 0x86, 0xa0, 0xf3, 0x10, 0x31, 0x3b, 0xd0, 0x79, 0xe8, 0x5e, 0x81,
	0xb1, 0x90, 0x71, 0x41, 0x7e, 0x81, 0x29, 0xd6, 0x09, 0x93, 0x58, 0xea, 0xfb, 0x9f, 0xbd, 0x9d,
	0x95, 0xa7, 0x3a, 0x03, 0x55, 0x27, 0x63, 0xe8, 0x65, 0xb9, 0x64, 0xc9, 0x2a, 0x7f, 0xa8, 0x74,
	0x76, 0xb1, 0xfb, 0xa2, 0x41, 0x6f, 0xc1, 0x65, 0x1a, 0xd1, 0x84, 0xed, 0xef, 0x44, 0x7e, 0x82,
	0x41, 0x65, 0xac, 0xa4, 0xfa, 0xfe, 0xa8, 0xb1, 0x41, 0x29, 0x10, 0x60, 0x91, 0xfc, 0x87, 0x5e,
	0x2a, 0x32, 0x9e, 0x73, 0x91, 0x38, 0x1d, 0x04, 0xc7, 0x0d, 0x70, 0xef, 0xc8, 0xc1, 0x8e, 0x25,
	0x3f, 0xc0, 0x0e, 0xb9, 0x64, 0xf7, 0xd8, 0x68, 0xe0, 0xb1, 0xeb, 0x04, 0xf9, 0x0a, 0x66, 0x96,
	0x32, 0x16, 0x3a, 0x26, 0x56, 0x54, 0xe0, 0x3e, 0x6b, 0x60, 0x5d, 0x66, 0x11, 0x4d, 0xc2, 0x8f,
	0xb9, 0xce, 0x0f, 0x5c, 0xbf, 0x35, 0xc0, 0x56, 0x4d, 0x02, 0x46, 0xc6, 0x9f, 0x58, 0x65, 0x88,
	0x6b, 0xf7, 0x55, 0x07, 0xe3, 0x82, 0xc6, 0x87, 0x03, 0xfb, 0x5d, 0xc1, 0xfa, 0xb1, 0x6f, 0x23,
	0x42, 0xfe, 0x40, 0x37, 0xc5, 0x5b, 0x9a, 0x57, 0x26, 0x2d, 0xf7, 0xb7, 0x25, 0x6a, 0xd8, 0x47,
	0x8f, 0x63, 0xb0, 0x4f, 0x4e, 0x60, 0xa8, 0x96, 0x77, 0x09, 0x7b, 0xcc, 0x25, 0x8d, 0x70, 0x86,
	0xad, 0x3d, 0x03, 0x05, 0x5e, 0x2b, 0xae, 0xdc, 0x86, 0xe3, 0x74, 0x33, 0xc7, 0x9a, 0x74, 0xf6,
	0x5a, 0xd4, 0xdc, 0x83, 0x2d, 0x41, 0xe6, 0x60, 0xd3, 0xea, 0xc7, 0xc9, 0x9c, 0x2e, 0xe2, 0x5f,
	0x9a, 0x53, 0xaf, 0x6a, 0x41, 0x4d, 0x9d, 0x8e, 0x6e, 0x07, 0x11, 0x5f, 0xd6, 0x8f, 0x6a, 0x69,
	0xe1, 0x7b, 0xfa, 0xf7, 0x16, 0x00, 0x00, 0xff, 0xff, 0x49, 0xbc, 0x37, 0xc7, 0x6e, 0x03, 0x00,
	0x00,
}
