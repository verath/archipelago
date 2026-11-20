import { wire } from "../wire/proto_bundle.js";
import type { ServerEvent } from "../network/Connection.ts";

/**
 * Builders for protobuf messages, as the server would send them.
 */

export const NEUTRAL_ID = "neutral";

export function makeIsland(
    id: string, x: number, y: number, ownerId: string = NEUTRAL_ID, strength = 10, size = 0,
): wire.msg.Island.$Properties {
    return {
        id,
        army: { ownerId, strength },
        position: { x, y },
        size,
    };
}

export function makeAirplane(
    id: string, x: number, y: number, ownerId: string, strength = 5, direction = 0, speed = 0,
): wire.msg.Airplane.$Properties {
    return {
        id,
        army: { ownerId, strength },
        position: { x, y },
        direction,
        speed,
    };
}

export function makePlayer(id: string, state = wire.msg.PlayerState.ALIVE): wire.msg.Player.$Properties {
    return { id, state };
}

export interface GameOptions {
    size?: wire.msg.Coordinate.$Properties;
    players?: wire.msg.Player.$Properties[];
    islands?: wire.msg.Island.$Properties[];
    airplanes?: wire.msg.Airplane.$Properties[];
}

export function makeGame({ size = { x: 5, y: 5 }, players = [], islands = [], airplanes = [] }: GameOptions = {}): wire.msg.Game {
    return wire.msg.Game.create({
        id: "game-1",
        size,
        playerNeutral: makePlayer(NEUTRAL_ID),
        players,
        islands,
        airplanes,
    });
}

/** The payload of each event an EventEnvelope can carry. */
export interface EventPayloads {
    eventGameStart: wire.msg.EventGameStart.$Shape;
    eventGameOver: wire.msg.EventGameOver.$Shape;
    eventGameTick: wire.msg.EventGameTick.$Shape;
}

/**
 * An event name together with its payload, e.g. ["eventGameOver", { winnerId: "x" }].
 * Spread as the arguments of the functions below, so that switching on the
 * name narrows the payload.
 */
export type EventArgs = { [K in keyof EventPayloads]: [eventName: K, payload: EventPayloads[K]] }[keyof EventPayloads];

/**
 * Wraps an event in an EventEnvelope.
 */
export function makeEventEnvelope(...[eventName, payload]: EventArgs): ServerEvent {
    switch (eventName) {
        case "eventGameStart":
            return wire.msg.EventEnvelope.create({ eventGameStart: payload });
        case "eventGameOver":
            return wire.msg.EventEnvelope.create({ eventGameOver: payload });
        case "eventGameTick":
            return wire.msg.EventEnvelope.create({ eventGameTick: payload });
    }
}

/**
 * Encodes an EventEnvelope as the server would put it on the wire.
 */
export function encodeEvent(...args: EventArgs): ArrayBuffer {
    const bytes = wire.msg.EventEnvelope.encode(makeEventEnvelope(...args)).finish();
    // A copy of just these bytes, in an ArrayBuffer of its own. (Not slice():
    // in Node, protobufjs returns a Buffer, whose slice() does not copy.)
    return new Uint8Array(bytes).buffer;
}

/**
 * Returns the value, failing the test if it is null or undefined. For values
 * the test goes on to use, e.g. an island looked up by id.
 */
export function defined<T>(value: T | null | undefined): T {
    if (value == null) {
        throw new Error(`expected a value, got ${value}`);
    }
    return value;
}
