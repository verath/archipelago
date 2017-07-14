// Code generated by protoc-gen-go. DO NOT EDIT.
// source: proto/wire/event.proto

package wire

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"
import wire_game "github.com/verath/archipelago/lib/wire/game"

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

type EventEnvelope struct {
	// Types that are valid to be assigned to Event:
	//	*EventEnvelope_EventGameStart
	//	*EventEnvelope_EventGameOver
	//	*EventEnvelope_EventGameTick
	Event isEventEnvelope_Event `protobuf_oneof:"event"`
}

func (m *EventEnvelope) Reset()                    { *m = EventEnvelope{} }
func (m *EventEnvelope) String() string            { return proto.CompactTextString(m) }
func (*EventEnvelope) ProtoMessage()               {}
func (*EventEnvelope) Descriptor() ([]byte, []int) { return fileDescriptor1, []int{0} }

type isEventEnvelope_Event interface {
	isEventEnvelope_Event()
}

type EventEnvelope_EventGameStart struct {
	EventGameStart *EventGameStart `protobuf:"bytes,1,opt,name=event_game_start,json=eventGameStart,oneof"`
}
type EventEnvelope_EventGameOver struct {
	EventGameOver *EventGameOver `protobuf:"bytes,2,opt,name=event_game_over,json=eventGameOver,oneof"`
}
type EventEnvelope_EventGameTick struct {
	EventGameTick *EventGameTick `protobuf:"bytes,3,opt,name=event_game_tick,json=eventGameTick,oneof"`
}

func (*EventEnvelope_EventGameStart) isEventEnvelope_Event() {}
func (*EventEnvelope_EventGameOver) isEventEnvelope_Event()  {}
func (*EventEnvelope_EventGameTick) isEventEnvelope_Event()  {}

func (m *EventEnvelope) GetEvent() isEventEnvelope_Event {
	if m != nil {
		return m.Event
	}
	return nil
}

func (m *EventEnvelope) GetEventGameStart() *EventGameStart {
	if x, ok := m.GetEvent().(*EventEnvelope_EventGameStart); ok {
		return x.EventGameStart
	}
	return nil
}

func (m *EventEnvelope) GetEventGameOver() *EventGameOver {
	if x, ok := m.GetEvent().(*EventEnvelope_EventGameOver); ok {
		return x.EventGameOver
	}
	return nil
}

func (m *EventEnvelope) GetEventGameTick() *EventGameTick {
	if x, ok := m.GetEvent().(*EventEnvelope_EventGameTick); ok {
		return x.EventGameTick
	}
	return nil
}

// XXX_OneofFuncs is for the internal use of the proto package.
func (*EventEnvelope) XXX_OneofFuncs() (func(msg proto.Message, b *proto.Buffer) error, func(msg proto.Message, tag, wire int, b *proto.Buffer) (bool, error), func(msg proto.Message) (n int), []interface{}) {
	return _EventEnvelope_OneofMarshaler, _EventEnvelope_OneofUnmarshaler, _EventEnvelope_OneofSizer, []interface{}{
		(*EventEnvelope_EventGameStart)(nil),
		(*EventEnvelope_EventGameOver)(nil),
		(*EventEnvelope_EventGameTick)(nil),
	}
}

func _EventEnvelope_OneofMarshaler(msg proto.Message, b *proto.Buffer) error {
	m := msg.(*EventEnvelope)
	// event
	switch x := m.Event.(type) {
	case *EventEnvelope_EventGameStart:
		b.EncodeVarint(1<<3 | proto.WireBytes)
		if err := b.EncodeMessage(x.EventGameStart); err != nil {
			return err
		}
	case *EventEnvelope_EventGameOver:
		b.EncodeVarint(2<<3 | proto.WireBytes)
		if err := b.EncodeMessage(x.EventGameOver); err != nil {
			return err
		}
	case *EventEnvelope_EventGameTick:
		b.EncodeVarint(3<<3 | proto.WireBytes)
		if err := b.EncodeMessage(x.EventGameTick); err != nil {
			return err
		}
	case nil:
	default:
		return fmt.Errorf("EventEnvelope.Event has unexpected type %T", x)
	}
	return nil
}

func _EventEnvelope_OneofUnmarshaler(msg proto.Message, tag, wire int, b *proto.Buffer) (bool, error) {
	m := msg.(*EventEnvelope)
	switch tag {
	case 1: // event.event_game_start
		if wire != proto.WireBytes {
			return true, proto.ErrInternalBadWireType
		}
		msg := new(EventGameStart)
		err := b.DecodeMessage(msg)
		m.Event = &EventEnvelope_EventGameStart{msg}
		return true, err
	case 2: // event.event_game_over
		if wire != proto.WireBytes {
			return true, proto.ErrInternalBadWireType
		}
		msg := new(EventGameOver)
		err := b.DecodeMessage(msg)
		m.Event = &EventEnvelope_EventGameOver{msg}
		return true, err
	case 3: // event.event_game_tick
		if wire != proto.WireBytes {
			return true, proto.ErrInternalBadWireType
		}
		msg := new(EventGameTick)
		err := b.DecodeMessage(msg)
		m.Event = &EventEnvelope_EventGameTick{msg}
		return true, err
	default:
		return false, nil
	}
}

func _EventEnvelope_OneofSizer(msg proto.Message) (n int) {
	m := msg.(*EventEnvelope)
	// event
	switch x := m.Event.(type) {
	case *EventEnvelope_EventGameStart:
		s := proto.Size(x.EventGameStart)
		n += proto.SizeVarint(1<<3 | proto.WireBytes)
		n += proto.SizeVarint(uint64(s))
		n += s
	case *EventEnvelope_EventGameOver:
		s := proto.Size(x.EventGameOver)
		n += proto.SizeVarint(2<<3 | proto.WireBytes)
		n += proto.SizeVarint(uint64(s))
		n += s
	case *EventEnvelope_EventGameTick:
		s := proto.Size(x.EventGameTick)
		n += proto.SizeVarint(3<<3 | proto.WireBytes)
		n += proto.SizeVarint(uint64(s))
		n += s
	case nil:
	default:
		panic(fmt.Sprintf("proto: unexpected type %T in oneof", x))
	}
	return n
}

type EventGameStart struct {
	PlayerId     string `protobuf:"bytes,1,opt,name=player_id,json=playerId" json:"player_id,omitempty"`
	TickInterval int64  `protobuf:"varint,2,opt,name=tick_interval,json=tickInterval" json:"tick_interval,omitempty"`
}

func (m *EventGameStart) Reset()                    { *m = EventGameStart{} }
func (m *EventGameStart) String() string            { return proto.CompactTextString(m) }
func (*EventGameStart) ProtoMessage()               {}
func (*EventGameStart) Descriptor() ([]byte, []int) { return fileDescriptor1, []int{1} }

func (m *EventGameStart) GetPlayerId() string {
	if m != nil {
		return m.PlayerId
	}
	return ""
}

func (m *EventGameStart) GetTickInterval() int64 {
	if m != nil {
		return m.TickInterval
	}
	return 0
}

type EventGameOver struct {
	WinnerId string `protobuf:"bytes,1,opt,name=winner_id,json=winnerId" json:"winner_id,omitempty"`
}

func (m *EventGameOver) Reset()                    { *m = EventGameOver{} }
func (m *EventGameOver) String() string            { return proto.CompactTextString(m) }
func (*EventGameOver) ProtoMessage()               {}
func (*EventGameOver) Descriptor() ([]byte, []int) { return fileDescriptor1, []int{2} }

func (m *EventGameOver) GetWinnerId() string {
	if m != nil {
		return m.WinnerId
	}
	return ""
}

type EventGameTick struct {
	Game *wire_game.Game `protobuf:"bytes,1,opt,name=game" json:"game,omitempty"`
}

func (m *EventGameTick) Reset()                    { *m = EventGameTick{} }
func (m *EventGameTick) String() string            { return proto.CompactTextString(m) }
func (*EventGameTick) ProtoMessage()               {}
func (*EventGameTick) Descriptor() ([]byte, []int) { return fileDescriptor1, []int{3} }

func (m *EventGameTick) GetGame() *wire_game.Game {
	if m != nil {
		return m.Game
	}
	return nil
}

func init() {
	proto.RegisterType((*EventEnvelope)(nil), "wire.EventEnvelope")
	proto.RegisterType((*EventGameStart)(nil), "wire.EventGameStart")
	proto.RegisterType((*EventGameOver)(nil), "wire.EventGameOver")
	proto.RegisterType((*EventGameTick)(nil), "wire.EventGameTick")
}

func init() { proto.RegisterFile("proto/wire/event.proto", fileDescriptor1) }

var fileDescriptor1 = []byte{
	// 284 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x6c, 0x91, 0xcf, 0x4b, 0xfb, 0x40,
	0x10, 0xc5, 0x9b, 0x6f, 0xfb, 0xd5, 0x66, 0x34, 0xad, 0xac, 0x22, 0xc1, 0x5c, 0x24, 0xbd, 0x78,
	0x90, 0x04, 0xd4, 0xab, 0x20, 0x85, 0x62, 0x73, 0x12, 0x56, 0x4f, 0x5e, 0x42, 0xda, 0x0c, 0xb2,
	0x34, 0xbf, 0x58, 0x97, 0x2d, 0xfe, 0xa7, 0xfe, 0x39, 0x32, 0x93, 0x20, 0x49, 0xf1, 0xfa, 0x99,
	0xf7, 0xde, 0xbe, 0xd9, 0x81, 0xcb, 0x46, 0xd7, 0xa6, 0x8e, 0xf7, 0x4a, 0x63, 0x8c, 0x16, 0x2b,
	0x13, 0x31, 0x10, 0x13, 0x22, 0x57, 0x41, 0x6f, 0xfa, 0x91, 0x95, 0x18, 0x97, 0x75, 0x8e, 0x45,
	0x2b, 0x09, 0xbf, 0x1d, 0xf0, 0x56, 0x64, 0x59, 0x55, 0x16, 0x8b, 0xba, 0x41, 0xf1, 0x04, 0x67,
	0x9c, 0x91, 0x92, 0x36, 0xfd, 0x34, 0x99, 0x36, 0xbe, 0x73, 0xed, 0xdc, 0x9c, 0xdc, 0x5d, 0x44,
	0x94, 0x11, 0xb1, 0xfc, 0x39, 0x2b, 0xf1, 0x95, 0x66, 0xeb, 0x91, 0x9c, 0xe1, 0x80, 0x88, 0x47,
	0x98, 0xf7, 0x12, 0x6a, 0x8b, 0xda, 0xff, 0xc7, 0x01, 0xe7, 0x07, 0x01, 0x2f, 0x16, 0xf5, 0x7a,
	0x24, 0x3d, 0xec, 0x83, 0x03, 0xbb, 0x51, 0xdb, 0x9d, 0x3f, 0xfe, 0xd3, 0xfe, 0xa6, 0xb6, 0xbb,
	0x81, 0x9d, 0xc0, 0xf2, 0x18, 0xfe, 0x33, 0x08, 0x25, 0xcc, 0x86, 0x55, 0x45, 0x00, 0x6e, 0x53,
	0x64, 0x5f, 0xa8, 0x53, 0x95, 0xf3, 0x4e, 0xae, 0x9c, 0xb6, 0x20, 0xc9, 0xc5, 0x02, 0x3c, 0x7a,
	0x2b, 0x55, 0x95, 0x41, 0x6d, 0xb3, 0x82, 0x3b, 0x8f, 0xe5, 0x29, 0xc1, 0xa4, 0x63, 0xe1, 0x6d,
	0xf7, 0x5b, 0xbf, 0x65, 0x03, 0x70, 0xf7, 0xaa, 0xaa, 0x06, 0x91, 0x2d, 0x48, 0xf2, 0xf0, 0xa1,
	0xa7, 0xa6, 0x6e, 0x62, 0x01, 0x13, 0x5a, 0xaa, 0xfb, 0xcf, 0x79, 0xbb, 0x0f, 0x91, 0x88, 0x24,
	0x92, 0x87, 0x4b, 0x78, 0x9f, 0x16, 0x6a, 0xc3, 0xf7, 0xda, 0x1c, 0xf1, 0x95, 0xee, 0x7f, 0x02,
	0x00, 0x00, 0xff, 0xff, 0x51, 0xcf, 0x25, 0xa5, 0xe2, 0x01, 0x00, 0x00,
}
