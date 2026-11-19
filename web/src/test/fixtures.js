import { wire } from "../wire/proto_bundle.js";

/**
 * Builders for protobuf messages, as the server would send them.
 */

export const NEUTRAL_ID = "neutral";

export function makeIsland(id, x, y, ownerId = NEUTRAL_ID, strength = 10, size = 0) {
    return {
        id,
        army: { ownerId, strength },
        position: { x, y },
        size,
    };
}

export function makeAirplane(id, x, y, ownerId, strength = 5, direction = 0, speed = 0) {
    return {
        id,
        army: { ownerId, strength },
        position: { x, y },
        direction,
        speed,
    };
}

export function makePlayer(id, state = wire.msg.PlayerState.ALIVE) {
    return { id, state };
}

/**
 * @returns {wire.msg.Game}
 */
export function makeGame({ size = { x: 5, y: 5 }, players = [], islands = [], airplanes = [] } = {}) {
    return wire.msg.Game.create({
        id: "game-1",
        size,
        playerNeutral: makePlayer(NEUTRAL_ID),
        players,
        islands,
        airplanes,
    });
}

/**
 * Wraps an event in an EventEnvelope.
 */
export function makeEventEnvelope(eventName, payload) {
    return wire.msg.EventEnvelope.create({ [eventName]: payload });
}

/**
 * Encodes an EventEnvelope as the server would put it on the wire.
 * @returns {ArrayBuffer}
 */
export function encodeEvent(eventName, payload) {
    const bytes = wire.msg.EventEnvelope.encode(makeEventEnvelope(eventName, payload)).finish();
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}
