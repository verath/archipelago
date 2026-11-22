import { wire } from "../wire/proto_bundle.js";
import type { ServerEvent } from "../network/Connection.ts";

/**
 * Builders for protobuf messages, as the server would send them.
 */

export const NEUTRAL_ID = "neutral";

export function makeIsland(
    id: string, x: number, y: number, ownerId: string = NEUTRAL_ID, strength = 10, size = 0, garrison = 0,
): wire.msg.Island.$Properties {
    return {
        id,
        army: { ownerId, strength },
        position: { x, y },
        size,
        garrison,
    };
}

export interface AirplaneOptions {
    destinationId?: string;
    launchSeq?: number;
}

export function makeAirplane(
    id: string, x: number, y: number, ownerId: string, strength = 5, direction = 0, speed = 0,
    { destinationId = "", launchSeq = 0 }: AirplaneOptions = {},
): wire.msg.Airplane.$Properties {
    return {
        id,
        army: { ownerId, strength },
        position: { x, y },
        direction,
        speed,
        destinationId,
        launchSeq,
    };
}

export function makePlayer(id: string, state = wire.msg.PlayerState.ALIVE, lastLaunchSeq = 0): wire.msg.Player.$Properties {
    return { id, state, lastLaunchSeq };
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
    eventGameSnapshot: wire.msg.EventGameSnapshot.$Shape;
    eventGameDelta: wire.msg.EventGameDelta.$Shape;
}

/**
 * An event name together with its payload, e.g. ["eventGameOver", { winnerId: "x" }].
 * Spread as the arguments of the functions below, so that switching on the
 * name narrows the payload.
 */
export type EventArgs = { [K in keyof EventPayloads]: [eventName: K, payload: EventPayloads[K]] }[keyof EventPayloads];

/**
 * An EventGameSnapshot of the game, as the server sends it first.
 */
export function makeSnapshot(game: wire.msg.Game, seq = 1, gameTime = 0): wire.msg.EventGameSnapshot {
    return wire.msg.EventGameSnapshot.create({ seq, gameTime, game });
}

/**
 * An EventGameDelta; lists not given are empty, as in a decoded message.
 */
export function makeDelta(seq: number, gameTime: number, delta: Omit<wire.msg.EventGameDelta.$Properties, "seq" | "gameTime"> = {}): wire.msg.EventGameDelta {
    return wire.msg.EventGameDelta.create({ seq, gameTime, ...delta });
}

/**
 * Wraps an event in an EventEnvelope.
 */
export function makeEventEnvelope(...[eventName, payload]: EventArgs): ServerEvent {
    switch (eventName) {
        case "eventGameStart":
            return wire.msg.EventEnvelope.create({ eventGameStart: payload });
        case "eventGameOver":
            return wire.msg.EventEnvelope.create({ eventGameOver: payload });
        case "eventGameSnapshot":
            return wire.msg.EventEnvelope.create({ eventGameSnapshot: payload });
        case "eventGameDelta":
            return wire.msg.EventEnvelope.create({ eventGameDelta: payload });
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
