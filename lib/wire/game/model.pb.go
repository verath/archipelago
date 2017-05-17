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
	X int64 `protobuf:"varint,1,opt,name=x" json:"x,omitempty"`
	Y int64 `protobuf:"varint,2,opt,name=y" json:"y,omitempty"`
}

func (m *Coordinate) Reset()                    { *m = Coordinate{} }
func (m *Coordinate) String() string            { return proto.CompactTextString(m) }
func (*Coordinate) ProtoMessage()               {}
func (*Coordinate) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

func (m *Coordinate) GetX() int64 {
	if m != nil {
		return m.X
	}
	return 0
}

func (m *Coordinate) GetY() int64 {
	if m != nil {
		return m.Y
	}
	return 0
}

type FloatCoordinate struct {
	X float64 `protobuf:"fixed64,1,opt,name=x" json:"x,omitempty"`
	Y float64 `protobuf:"fixed64,2,opt,name=y" json:"y,omitempty"`
}

func (m *FloatCoordinate) Reset()                    { *m = FloatCoordinate{} }
func (m *FloatCoordinate) String() string            { return proto.CompactTextString(m) }
func (*FloatCoordinate) ProtoMessage()               {}
func (*FloatCoordinate) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{1} }

func (m *FloatCoordinate) GetX() float64 {
	if m != nil {
		return m.X
	}
	return 0
}

func (m *FloatCoordinate) GetY() float64 {
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
	Strength int64   `protobuf:"varint,2,opt,name=strength" json:"strength,omitempty"`
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

func (m *Army) GetStrength() int64 {
	if m != nil {
		return m.Strength
	}
	return 0
}

type Airplane struct {
	Id        string           `protobuf:"bytes,1,opt,name=id" json:"id,omitempty"`
	Army      *Army            `protobuf:"bytes,2,opt,name=army" json:"army,omitempty"`
	Position  *FloatCoordinate `protobuf:"bytes,3,opt,name=position" json:"position,omitempty"`
	Direction float64          `protobuf:"fixed64,4,opt,name=direction" json:"direction,omitempty"`
	Speed     float64          `protobuf:"fixed64,5,opt,name=speed" json:"speed,omitempty"`
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

func (m *Airplane) GetDirection() float64 {
	if m != nil {
		return m.Direction
	}
	return 0
}

func (m *Airplane) GetSpeed() float64 {
	if m != nil {
		return m.Speed
	}
	return 0
}

type Island struct {
	Id       string      `protobuf:"bytes,1,opt,name=id" json:"id,omitempty"`
	Army     *Army       `protobuf:"bytes,2,opt,name=army" json:"army,omitempty"`
	Position *Coordinate `protobuf:"bytes,3,opt,name=position" json:"position,omitempty"`
	Size     float64     `protobuf:"fixed64,4,opt,name=size" json:"size,omitempty"`
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

func (m *Island) GetSize() float64 {
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
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x9c, 0x93, 0x41, 0x6b, 0xdb, 0x30,
	0x14, 0x80, 0x91, 0xe3, 0x38, 0xf1, 0xcb, 0x92, 0x30, 0x6d, 0x03, 0x93, 0xed, 0x10, 0xbc, 0xc3,
	0x32, 0xc6, 0x1c, 0xe2, 0xc1, 0xd8, 0x35, 0x1b, 0xac, 0x94, 0x42, 0x29, 0x3e, 0xf6, 0x52, 0x94,
	0x5a, 0xa4, 0x02, 0xdb, 0x32, 0xb2, 0x4b, 0xe2, 0x9e, 0xfb, 0x6f, 0x7a, 0xee, 0xff, 0x2b, 0x7e,
	0x72, 0x62, 0x37, 0x31, 0x39, 0xf4, 0xa6, 0xf7, 0xde, 0xf7, 0xac, 0x4f, 0x4f, 0x16, 0x7c, 0x4e,
	0x95, 0xcc, 0xe5, 0x7c, 0x23, 0x14, 0x9f, 0xaf, 0x59, 0xcc, 0xe7, 0xb1, 0x0c, 0x79, 0xe4, 0x61,
	0x96, 0xda, 0x65, 0xda, 0x2b, 0xd3, 0xee, 0x0c, 0xe0, 0x9f, 0x94, 0x2a, 0x14, 0x09, 0xcb, 0x39,
	0x7d, 0x07, 0x64, 0xeb, 0x90, 0x29, 0x99, 0x75, 0x02, 0xb2, 0x2d, 0xa3, 0xc2, 0x31, 0x74, 0x54,
	0xb8, 0x3f, 0x61, 0xfc, 0x3f, 0x92, 0x2c, 0x6f, 0xc3, 0xc9, 0x2b, 0x9c, 0x94, 0xb8, 0x03, 0xd6,
	0x55, 0xc4, 0x0a, 0xae, 0xe8, 0x08, 0x0c, 0x11, 0x22, 0x66, 0x07, 0x86, 0x08, 0xdd, 0x0b, 0x30,
	0x97, 0x2a, 0x2e, 0xe8, 0x37, 0xe8, 0xca, 0x4d, 0xc2, 0x15, 0x96, 0x06, 0xfe, 0x7b, 0x6f, 0x6f,
	0xe5, 0xe9, 0xce, 0x40, 0xd7, 0xe9, 0x04, 0xfa, 0x59, 0xae, 0x78, 0xb2, 0xce, 0xef, 0x2a, 0x9d,
	0x7d, 0xec, 0x3e, 0x11, 0xe8, 0x2f, 0x85, 0x4a, 0x23, 0x96, 0xf0, 0xc3, 0x9d, 0xe8, 0x57, 0x30,
	0x99, 0x8a, 0xb5, 0xd4, 0xc0, 0x1f, 0x37, 0x36, 0x28, 0x05, 0x02, 0x2c, 0xd2, 0xdf, 0xd0, 0x4f,
	0x65, 0x26, 0x72, 0x21, 0x13, 0xa7, 0x83, 0xe0, 0xa4, 0x01, 0x1e, 0x1c, 0x39, 0xd8, 0xb3, 0xf4,
	0x0b, 0xd8, 0xa1, 0x50, 0xfc, 0x16, 0x1b, 0x4d, 0x3c, 0x76, 0x9d, 0xa0, 0x1f, 0xa1, 0x9b, 0xa5,
	0x9c, 0x87, 0x4e, 0x17, 0x2b, 0x3a, 0x70, 0x1f, 0x09, 0x58, 0xe7, 0x59, 0xc4, 0x92, 0xf0, 0x6d,
	0xae, 0x8b, 0x23, 0xd7, 0x4f, 0x0d, 0xb0, 0x55, 0x93, 0x82, 0x99, 0x89, 0x07, 0x5e, 0x19, 0xe2,
	0xda, 0x7d, 0x36, 0xc0, 0x3c, 0x63, 0xf1, 0xf1, 0xc0, 0xbe, 0x57, 0xb0, 0x71, 0xea, 0xdb, 0x88,
	0xd0, 0x1f, 0xd0, 0x4b, 0xf1, 0x96, 0x16, 0x95, 0x49, 0xcb, 0xfd, 0xed, 0x88, 0x1a, 0xf6, 0xd1,
	0xe3, 0x14, 0xec, 0xd3, 0x3f, 0x30, 0xd2, 0xcb, 0x9b, 0x84, 0xdf, 0xe7, 0x8a, 0x45, 0x38, 0xc3,
	0xd6, 0x9e, 0xa1, 0x06, 0x2f, 0x35, 0x57, 0x6e, 0x23, 0x70, 0xba, 0x99, 0x63, 0x4d, 0x3b, 0x07,
	0x2d, 0x7a, 0xee, 0xc1, 0x8e, 0xa0, 0x0b, 0xb0, 0x59, 0xf5, 0xe3, 0x64, 0x4e, 0x0f, 0xf1, 0x0f,
	0xcd, 0xa9, 0x57, 0xb5, 0xa0, 0xa6, 0xfe, 0x8e, 0xaf, 0x87, 0x91, 0x58, 0xd5, 0x8f, 0x6a, 0x65,
	0xe1, 0x7b, 0xfa, 0xf5, 0x12, 0x00, 0x00, 0xff, 0xff, 0xb9, 0x49, 0x5b, 0x88, 0x6e, 0x03, 0x00,
	0x00,
}
