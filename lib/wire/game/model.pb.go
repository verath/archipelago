// Code generated by protoc-gen-go. DO NOT EDIT.
// source: wire/game/model.proto

package game

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion3 // please upgrade the proto package

// PlayerState represents the current exclusive state of a Player.
type PlayerState int32

const (
	// ALIVE is when still alive in the game.
	PlayerState_ALIVE PlayerState = 0
	// PENDING_REVIVAL is when dead, but may be revived.
	PlayerState_PENDING_REVIVAL PlayerState = 1
	// DEAD is when dead and will remain dead.
	PlayerState_DEAD PlayerState = 2
	// LEFT_GAME is when the Player has left the game.
	PlayerState_LEFT_GAME PlayerState = 3
)

var PlayerState_name = map[int32]string{
	0: "ALIVE",
	1: "PENDING_REVIVAL",
	2: "DEAD",
	3: "LEFT_GAME",
}

var PlayerState_value = map[string]int32{
	"ALIVE":           0,
	"PENDING_REVIVAL": 1,
	"DEAD":            2,
	"LEFT_GAME":       3,
}

func (x PlayerState) String() string {
	return proto.EnumName(PlayerState_name, int32(x))
}

func (PlayerState) EnumDescriptor() ([]byte, []int) {
	return fileDescriptor_58314dfb3cd76f5b, []int{0}
}

type Coordinate struct {
	X                    int32    `protobuf:"varint,1,opt,name=x,proto3" json:"x,omitempty"`
	Y                    int32    `protobuf:"varint,2,opt,name=y,proto3" json:"y,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Coordinate) Reset()         { *m = Coordinate{} }
func (m *Coordinate) String() string { return proto.CompactTextString(m) }
func (*Coordinate) ProtoMessage()    {}
func (*Coordinate) Descriptor() ([]byte, []int) {
	return fileDescriptor_58314dfb3cd76f5b, []int{0}
}

func (m *Coordinate) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Coordinate.Unmarshal(m, b)
}
func (m *Coordinate) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Coordinate.Marshal(b, m, deterministic)
}
func (m *Coordinate) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Coordinate.Merge(m, src)
}
func (m *Coordinate) XXX_Size() int {
	return xxx_messageInfo_Coordinate.Size(m)
}
func (m *Coordinate) XXX_DiscardUnknown() {
	xxx_messageInfo_Coordinate.DiscardUnknown(m)
}

var xxx_messageInfo_Coordinate proto.InternalMessageInfo

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
	X                    float32  `protobuf:"fixed32,1,opt,name=x,proto3" json:"x,omitempty"`
	Y                    float32  `protobuf:"fixed32,2,opt,name=y,proto3" json:"y,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *FloatCoordinate) Reset()         { *m = FloatCoordinate{} }
func (m *FloatCoordinate) String() string { return proto.CompactTextString(m) }
func (*FloatCoordinate) ProtoMessage()    {}
func (*FloatCoordinate) Descriptor() ([]byte, []int) {
	return fileDescriptor_58314dfb3cd76f5b, []int{1}
}

func (m *FloatCoordinate) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_FloatCoordinate.Unmarshal(m, b)
}
func (m *FloatCoordinate) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_FloatCoordinate.Marshal(b, m, deterministic)
}
func (m *FloatCoordinate) XXX_Merge(src proto.Message) {
	xxx_messageInfo_FloatCoordinate.Merge(m, src)
}
func (m *FloatCoordinate) XXX_Size() int {
	return xxx_messageInfo_FloatCoordinate.Size(m)
}
func (m *FloatCoordinate) XXX_DiscardUnknown() {
	xxx_messageInfo_FloatCoordinate.DiscardUnknown(m)
}

var xxx_messageInfo_FloatCoordinate proto.InternalMessageInfo

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
	Id                   string      `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	State                PlayerState `protobuf:"varint,2,opt,name=state,proto3,enum=wire.game.PlayerState" json:"state,omitempty"`
	XXX_NoUnkeyedLiteral struct{}    `json:"-"`
	XXX_unrecognized     []byte      `json:"-"`
	XXX_sizecache        int32       `json:"-"`
}

func (m *Player) Reset()         { *m = Player{} }
func (m *Player) String() string { return proto.CompactTextString(m) }
func (*Player) ProtoMessage()    {}
func (*Player) Descriptor() ([]byte, []int) {
	return fileDescriptor_58314dfb3cd76f5b, []int{2}
}

func (m *Player) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Player.Unmarshal(m, b)
}
func (m *Player) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Player.Marshal(b, m, deterministic)
}
func (m *Player) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Player.Merge(m, src)
}
func (m *Player) XXX_Size() int {
	return xxx_messageInfo_Player.Size(m)
}
func (m *Player) XXX_DiscardUnknown() {
	xxx_messageInfo_Player.DiscardUnknown(m)
}

var xxx_messageInfo_Player proto.InternalMessageInfo

func (m *Player) GetId() string {
	if m != nil {
		return m.Id
	}
	return ""
}

func (m *Player) GetState() PlayerState {
	if m != nil {
		return m.State
	}
	return PlayerState_ALIVE
}

type Army struct {
	OwnerId              string   `protobuf:"bytes,1,opt,name=owner_id,json=ownerId,proto3" json:"owner_id,omitempty"`
	Strength             int32    `protobuf:"varint,2,opt,name=strength,proto3" json:"strength,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Army) Reset()         { *m = Army{} }
func (m *Army) String() string { return proto.CompactTextString(m) }
func (*Army) ProtoMessage()    {}
func (*Army) Descriptor() ([]byte, []int) {
	return fileDescriptor_58314dfb3cd76f5b, []int{3}
}

func (m *Army) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Army.Unmarshal(m, b)
}
func (m *Army) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Army.Marshal(b, m, deterministic)
}
func (m *Army) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Army.Merge(m, src)
}
func (m *Army) XXX_Size() int {
	return xxx_messageInfo_Army.Size(m)
}
func (m *Army) XXX_DiscardUnknown() {
	xxx_messageInfo_Army.DiscardUnknown(m)
}

var xxx_messageInfo_Army proto.InternalMessageInfo

func (m *Army) GetOwnerId() string {
	if m != nil {
		return m.OwnerId
	}
	return ""
}

func (m *Army) GetStrength() int32 {
	if m != nil {
		return m.Strength
	}
	return 0
}

type Airplane struct {
	Id        string           `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Army      *Army            `protobuf:"bytes,2,opt,name=army,proto3" json:"army,omitempty"`
	Position  *FloatCoordinate `protobuf:"bytes,3,opt,name=position,proto3" json:"position,omitempty"`
	Direction float32          `protobuf:"fixed32,4,opt,name=direction,proto3" json:"direction,omitempty"`
	// [tiles/ms]
	Speed                float32  `protobuf:"fixed32,5,opt,name=speed,proto3" json:"speed,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Airplane) Reset()         { *m = Airplane{} }
func (m *Airplane) String() string { return proto.CompactTextString(m) }
func (*Airplane) ProtoMessage()    {}
func (*Airplane) Descriptor() ([]byte, []int) {
	return fileDescriptor_58314dfb3cd76f5b, []int{4}
}

func (m *Airplane) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Airplane.Unmarshal(m, b)
}
func (m *Airplane) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Airplane.Marshal(b, m, deterministic)
}
func (m *Airplane) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Airplane.Merge(m, src)
}
func (m *Airplane) XXX_Size() int {
	return xxx_messageInfo_Airplane.Size(m)
}
func (m *Airplane) XXX_DiscardUnknown() {
	xxx_messageInfo_Airplane.DiscardUnknown(m)
}

var xxx_messageInfo_Airplane proto.InternalMessageInfo

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
	Id                   string      `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Army                 *Army       `protobuf:"bytes,2,opt,name=army,proto3" json:"army,omitempty"`
	Position             *Coordinate `protobuf:"bytes,3,opt,name=position,proto3" json:"position,omitempty"`
	Size                 float32     `protobuf:"fixed32,4,opt,name=size,proto3" json:"size,omitempty"`
	XXX_NoUnkeyedLiteral struct{}    `json:"-"`
	XXX_unrecognized     []byte      `json:"-"`
	XXX_sizecache        int32       `json:"-"`
}

func (m *Island) Reset()         { *m = Island{} }
func (m *Island) String() string { return proto.CompactTextString(m) }
func (*Island) ProtoMessage()    {}
func (*Island) Descriptor() ([]byte, []int) {
	return fileDescriptor_58314dfb3cd76f5b, []int{5}
}

func (m *Island) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Island.Unmarshal(m, b)
}
func (m *Island) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Island.Marshal(b, m, deterministic)
}
func (m *Island) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Island.Merge(m, src)
}
func (m *Island) XXX_Size() int {
	return xxx_messageInfo_Island.Size(m)
}
func (m *Island) XXX_DiscardUnknown() {
	xxx_messageInfo_Island.DiscardUnknown(m)
}

var xxx_messageInfo_Island proto.InternalMessageInfo

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
	Id                   string      `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Size                 *Coordinate `protobuf:"bytes,2,opt,name=size,proto3" json:"size,omitempty"`
	PlayerNeutral        *Player     `protobuf:"bytes,3,opt,name=player_neutral,json=playerNeutral,proto3" json:"player_neutral,omitempty"`
	Players              []*Player   `protobuf:"bytes,4,rep,name=players,proto3" json:"players,omitempty"`
	Islands              []*Island   `protobuf:"bytes,5,rep,name=islands,proto3" json:"islands,omitempty"`
	Airplanes            []*Airplane `protobuf:"bytes,6,rep,name=airplanes,proto3" json:"airplanes,omitempty"`
	XXX_NoUnkeyedLiteral struct{}    `json:"-"`
	XXX_unrecognized     []byte      `json:"-"`
	XXX_sizecache        int32       `json:"-"`
}

func (m *Game) Reset()         { *m = Game{} }
func (m *Game) String() string { return proto.CompactTextString(m) }
func (*Game) ProtoMessage()    {}
func (*Game) Descriptor() ([]byte, []int) {
	return fileDescriptor_58314dfb3cd76f5b, []int{6}
}

func (m *Game) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Game.Unmarshal(m, b)
}
func (m *Game) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Game.Marshal(b, m, deterministic)
}
func (m *Game) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Game.Merge(m, src)
}
func (m *Game) XXX_Size() int {
	return xxx_messageInfo_Game.Size(m)
}
func (m *Game) XXX_DiscardUnknown() {
	xxx_messageInfo_Game.DiscardUnknown(m)
}

var xxx_messageInfo_Game proto.InternalMessageInfo

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

func (m *Game) GetPlayerNeutral() *Player {
	if m != nil {
		return m.PlayerNeutral
	}
	return nil
}

func (m *Game) GetPlayers() []*Player {
	if m != nil {
		return m.Players
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
	proto.RegisterEnum("wire.game.PlayerState", PlayerState_name, PlayerState_value)
	proto.RegisterType((*Coordinate)(nil), "wire.game.Coordinate")
	proto.RegisterType((*FloatCoordinate)(nil), "wire.game.FloatCoordinate")
	proto.RegisterType((*Player)(nil), "wire.game.Player")
	proto.RegisterType((*Army)(nil), "wire.game.Army")
	proto.RegisterType((*Airplane)(nil), "wire.game.Airplane")
	proto.RegisterType((*Island)(nil), "wire.game.Island")
	proto.RegisterType((*Game)(nil), "wire.game.Game")
}

func init() { proto.RegisterFile("wire/game/model.proto", fileDescriptor_58314dfb3cd76f5b) }

var fileDescriptor_58314dfb3cd76f5b = []byte{
	// 489 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x9c, 0x93, 0x41, 0x6f, 0xd3, 0x30,
	0x14, 0xc7, 0x49, 0x9a, 0x74, 0xcd, 0x1b, 0x6b, 0x8b, 0xc7, 0x50, 0x98, 0x38, 0x4c, 0xe1, 0x32,
	0x18, 0x4b, 0xb4, 0x21, 0x21, 0x2e, 0x1c, 0x02, 0x4d, 0xab, 0x48, 0xa5, 0x9a, 0x02, 0xea, 0x81,
	0x4b, 0xe5, 0x36, 0x56, 0x6b, 0x29, 0x89, 0x23, 0xc7, 0x63, 0x2b, 0x67, 0x0e, 0x7c, 0x17, 0xbe,
	0x24, 0x8a, 0x9d, 0x65, 0x81, 0x54, 0x1c, 0x76, 0xcb, 0x7b, 0xef, 0x67, 0xe7, 0xa7, 0xbf, 0x6d,
	0x38, 0xba, 0xa1, 0x9c, 0x78, 0x6b, 0x9c, 0x12, 0x2f, 0x65, 0x31, 0x49, 0xdc, 0x9c, 0x33, 0xc1,
	0x90, 0x55, 0xb6, 0xdd, 0xb2, 0xed, 0x9c, 0x02, 0x7c, 0x62, 0x8c, 0xc7, 0x34, 0xc3, 0x82, 0xa0,
	0xc7, 0xa0, 0xdd, 0xda, 0xda, 0x89, 0x76, 0x6a, 0x46, 0xda, 0x6d, 0x59, 0x6d, 0x6d, 0x5d, 0x55,
	0x5b, 0xe7, 0x1c, 0x06, 0xe3, 0x84, 0x61, 0xb1, 0x0b, 0xd7, 0xff, 0xc2, 0xf5, 0x12, 0x1f, 0x43,
	0xf7, 0x2a, 0xc1, 0x5b, 0xc2, 0x51, 0x1f, 0x74, 0x1a, 0x4b, 0xcc, 0x8a, 0x74, 0x1a, 0xa3, 0x37,
	0x60, 0x16, 0x02, 0x0b, 0x22, 0xd9, 0xfe, 0xe5, 0x33, 0xb7, 0xb6, 0x71, 0xd5, 0x8a, 0x2f, 0xe5,
	0x34, 0x52, 0x90, 0xf3, 0x01, 0x0c, 0x9f, 0xa7, 0x5b, 0xf4, 0x1c, 0x7a, 0xec, 0x26, 0x23, 0x7c,
	0x51, 0xef, 0xb5, 0x27, 0xeb, 0x30, 0x46, 0xc7, 0xd0, 0x2b, 0x04, 0x27, 0xd9, 0x5a, 0x6c, 0x2a,
	0xdd, 0xba, 0x76, 0x7e, 0x6b, 0xd0, 0xf3, 0x29, 0xcf, 0x13, 0x9c, 0x91, 0x96, 0xc9, 0x4b, 0x30,
	0x30, 0x4f, 0x95, 0xf4, 0xfe, 0xe5, 0xa0, 0x21, 0x52, 0xfe, 0x32, 0x92, 0x43, 0xf4, 0x0e, 0x7a,
	0x39, 0x2b, 0xa8, 0xa0, 0x2c, 0xb3, 0x3b, 0x12, 0x3c, 0x6e, 0x80, 0xff, 0x44, 0x12, 0xd5, 0x2c,
	0x7a, 0x01, 0x56, 0x4c, 0x39, 0x59, 0xc9, 0x85, 0x86, 0x8c, 0xe5, 0xbe, 0x81, 0x9e, 0x82, 0x59,
	0xe4, 0x84, 0xc4, 0xb6, 0x29, 0x27, 0xaa, 0x70, 0x7e, 0x6a, 0xd0, 0x0d, 0x8b, 0x04, 0x67, 0xf1,
	0xc3, 0x5c, 0x2f, 0x5a, 0xae, 0x47, 0x0d, 0x70, 0xa7, 0x26, 0x02, 0xa3, 0xa0, 0x3f, 0x48, 0x65,
	0x28, 0xbf, 0x9d, 0x5f, 0x3a, 0x18, 0x13, 0x9c, 0xb6, 0x03, 0x7b, 0x55, 0xc1, 0xfa, 0xff, 0xf6,
	0x96, 0x08, 0x7a, 0x0f, 0xfd, 0x5c, 0x9e, 0xe6, 0x22, 0x23, 0xd7, 0x82, 0xe3, 0xa4, 0x12, 0x7a,
	0xd2, 0x3a, 0xee, 0xe8, 0x40, 0x81, 0x33, 0xc5, 0xa1, 0x33, 0xd8, 0x53, 0x8d, 0xc2, 0x36, 0x4e,
	0x3a, 0xbb, 0x97, 0xdc, 0x11, 0x25, 0x4c, 0x65, 0x60, 0x85, 0x6d, 0xb6, 0x60, 0x15, 0x65, 0x74,
	0x47, 0xa0, 0x0b, 0xb0, 0x70, 0x75, 0x17, 0x0a, 0xbb, 0x2b, 0xf1, 0xc3, 0x66, 0x90, 0xd5, 0x2c,
	0xba, 0xa7, 0x5e, 0x8f, 0x61, 0xbf, 0x71, 0x29, 0x91, 0x05, 0xa6, 0x3f, 0x0d, 0xe7, 0xc1, 0xf0,
	0x11, 0x3a, 0x84, 0xc1, 0x55, 0x30, 0x1b, 0x85, 0xb3, 0xc9, 0x22, 0x0a, 0xe6, 0xe1, 0xdc, 0x9f,
	0x0e, 0x35, 0xd4, 0x03, 0x63, 0x14, 0xf8, 0xa3, 0xa1, 0x8e, 0x0e, 0xc0, 0x9a, 0x06, 0xe3, 0xaf,
	0x8b, 0x89, 0xff, 0x39, 0x18, 0x76, 0x3e, 0x9e, 0x7f, 0x3b, 0x5b, 0x53, 0xb1, 0xb9, 0x5e, 0xba,
	0x2b, 0x96, 0x7a, 0xdf, 0x09, 0xc7, 0x62, 0xe3, 0x61, 0xbe, 0xda, 0xd0, 0x9c, 0x24, 0x78, 0xcd,
	0xbc, 0x84, 0x2e, 0xbd, 0xfa, 0xb5, 0x2e, 0xbb, 0xf2, 0xa1, 0xbe, 0xfd, 0x13, 0x00, 0x00, 0xff,
	0xff, 0xe9, 0x9a, 0x90, 0x4f, 0xc1, 0x03, 0x00, 0x00,
}
