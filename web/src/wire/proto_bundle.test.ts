import { describe, it, expect } from "vitest";
import type { IConversionOptions, Writer } from "protobufjs";
import { wire } from "./proto_bundle.js";

const { msg } = wire;

// Fields at their default (e.g. state ALIVE = 0) are not put on the wire, so
// compare both sides with defaults filled in.
const OPTS: IConversionOptions = { defaults: true, enums: Number };

/** The static methods of a generated message class M, with properties P. */
interface MessageType<M, P> {
    create(properties: P): M;
    encode(message: M): Writer;
    decode(bytes: Uint8Array): M;
    fromObject(object: P): M;
    toObject(message: M, options: IConversionOptions): Record<string, unknown>;
}

/** Encodes and decodes a message, returning the plain-object form of the result. */
function roundTrip<M, P>(Type: MessageType<M, P>, payload: NoInfer<P>): Record<string, unknown> {
    const bytes = Type.encode(Type.create(payload)).finish();
    return Type.toObject(Type.decode(bytes), OPTS);
}

/** The plain-object form of what we expect back. */
function expected<M, P>(Type: MessageType<M, P>, payload: NoInfer<P>): Record<string, unknown> {
    return Type.toObject(Type.fromObject(payload), OPTS);
}

const game = {
    id: "g1",
    size: { x: 7, y: 5 },
    playerNeutral: { id: "neutral", state: msg.PlayerState.ALIVE },
    players: [
        { id: "p1", state: msg.PlayerState.ALIVE },
        { id: "p2", state: msg.PlayerState.PENDING_REVIVAL },
        { id: "p3", state: msg.PlayerState.DEAD },
        { id: "p4", state: msg.PlayerState.LEFT_GAME },
    ],
    islands: [
        { id: "i1", army: { ownerId: "p1", strength: 12 }, position: { x: 1, y: 2 }, size: 1 },
        { id: "i2", army: { ownerId: "neutral", strength: 3 }, position: { x: 6, y: 4 }, size: 0.5 },
    ],
    airplanes: [
        {
            id: "a1",
            army: { ownerId: "p2", strength: 4 },
            position: { x: 2.5, y: 3.25 },
            direction: -1.5,
            speed: 0.25,
            destinationId: "i1",
            launchSeq: 7,
        },
    ],
} satisfies wire.msg.Game.$Properties;

describe("model messages", () => {
    it("Coordinate", () => {
        expect(roundTrip(msg.Coordinate, { x: -3, y: 9 })).toEqual(expected(msg.Coordinate, { x: -3, y: 9 }));
    });

    it("FloatCoordinate", () => {
        expect(roundTrip(msg.FloatCoordinate, { x: 1.5, y: -0.25 })).toEqual({ x: 1.5, y: -0.25 });
    });

    it("Player", () => {
        const player = { id: "p", state: msg.PlayerState.DEAD, lastLaunchSeq: 3 };
        expect(roundTrip(msg.Player, player)).toEqual(player);
    });

    it("Army", () => {
        expect(roundTrip(msg.Army, { ownerId: "o", strength: 42 })).toEqual({ ownerId: "o", strength: 42 });
    });

    it("Island", () => {
        expect(roundTrip(msg.Island, game.islands[0])).toEqual(expected(msg.Island, game.islands[0]));
    });

    it("Airplane", () => {
        expect(roundTrip(msg.Airplane, game.airplanes[0])).toEqual(expected(msg.Airplane, game.airplanes[0]));
    });

    it("Game", () => {
        expect(roundTrip(msg.Game, game)).toEqual(expected(msg.Game, game));
    });

    it("numbers the player states as the server does", () => {
        expect(msg.PlayerState).toMatchObject({
            ALIVE: 0, PENDING_REVIVAL: 1, DEAD: 2, LEFT_GAME: 3,
        });
    });
});

describe("EventEnvelope", () => {
    it("carries EventGameStart", () => {
        const decoded = msg.EventEnvelope.decode(msg.EventEnvelope.encode({
            eventGameStart: { playerId: "p1", tickInterval: 250 },
        }).finish());
        expect(decoded.event).toBe("eventGameStart");
        expect(decoded.eventGameStart?.playerId).toBe("p1");
        expect(decoded.eventGameStart?.tickInterval).toBe(250);
    });

    it("carries EventGameTick with a full game", () => {
        const decoded = msg.EventEnvelope.decode(msg.EventEnvelope.encode({
            eventGameTick: { game },
        }).finish());
        expect(decoded.event).toBe("eventGameTick");
        // decode() makes nested messages instances of their class, but the
        // generated types only promise the properties.
        const decodedGame = decoded.eventGameTick?.game as wire.msg.Game;
        expect(msg.Game.toObject(decodedGame, OPTS)).toEqual(expected(msg.Game, game));
    });

    it("carries EventGameSnapshot (v5)", () => {
        const decoded = msg.EventEnvelope.decode(msg.EventEnvelope.encode({
            eventGameSnapshot: { seq: 1, gameTime: 1234, game },
        }).finish());
        expect(decoded.event).toBe("eventGameSnapshot");
        expect(decoded.eventGameSnapshot?.seq).toBe(1);
        expect(decoded.eventGameSnapshot?.gameTime).toBe(1234);
        const decodedGame = decoded.eventGameSnapshot?.game as wire.msg.Game;
        expect(msg.Game.toObject(decodedGame, OPTS)).toEqual(expected(msg.Game, game));
    });

    it("carries EventGameDelta (v5)", () => {
        const delta = {
            seq: 2,
            gameTime: 1567,
            players: [{ id: "p1", state: msg.PlayerState.ALIVE, lastLaunchSeq: 8 }],
            islands: [{ id: "i1", army: { ownerId: "neutral", strength: 0 } }],
            airplanesAdded: game.airplanes,
            airplanesUpdated: [{ id: "a0", army: { ownerId: "p3", strength: -1 } }],
            airplanesRemoved: ["a9"],
        } satisfies wire.msg.EventGameDelta.$Properties;
        const decoded = msg.EventEnvelope.decode(msg.EventEnvelope.encode({ eventGameDelta: delta }).finish());
        expect(decoded.event).toBe("eventGameDelta");
        const decodedDelta = decoded.eventGameDelta as wire.msg.EventGameDelta;
        expect(msg.EventGameDelta.toObject(decodedDelta, OPTS)).toEqual(expected(msg.EventGameDelta, delta));
    });

    it("decodes the bytes the server sends for a delta (v5)", () => {
        // From the Go encoder: EventEnvelope{event_game_delta(5){seq=2,
        // game_time=300, islands=[{id="i", army={owner_id="o"}}],
        // airplanes_removed=["a"]}}. Strength 0 is not on the wire.
        const bytes = Uint8Array.from([
            0x2a, 0x12, 0x08, 0x02, 0x10, 0xac, 0x02, 0x22, 0x08, 0x0a, 0x01, 0x69,
            0x12, 0x03, 0x0a, 0x01, 0x6f, 0x3a, 0x01, 0x61,
        ]);
        const decoded = msg.EventEnvelope.decode(bytes);
        expect(decoded.event).toBe("eventGameDelta");
        const delta = decoded.eventGameDelta!;
        expect(delta.seq).toBe(2);
        expect(delta.gameTime).toBe(300);
        expect(delta.islands?.[0]?.id).toBe("i");
        expect(delta.islands?.[0]?.army?.ownerId).toBe("o");
        expect(delta.islands?.[0]?.army?.strength).toBe(0);
        expect(delta.airplanesRemoved).toEqual(["a"]);
        expect(delta.airplanesAdded).toEqual([]);
    });

    it("carries EventGameOver", () => {
        const decoded = msg.EventEnvelope.decode(msg.EventEnvelope.encode({
            eventGameOver: { winnerId: "p2" },
        }).finish());
        expect(decoded.event).toBe("eventGameOver");
        expect(decoded.eventGameOver?.winnerId).toBe("p2");
    });

    it("decodes the bytes the server sends for a game over", () => {
        // EventEnvelope{event_game_over(2){winner_id(1)="w"}}
        const bytes = Uint8Array.from([0x12, 0x03, 0x0a, 0x01, 0x77]);
        const decoded = msg.EventEnvelope.decode(bytes);
        expect(decoded.event).toBe("eventGameOver");
        expect(decoded.eventGameOver?.winnerId).toBe("w");
    });

    it("has no event set when empty", () => {
        const decoded = msg.EventEnvelope.decode(msg.EventEnvelope.encode({}).finish());
        expect(decoded.event).toBeUndefined();
    });
});

describe("ActionEnvelope", () => {
    it("carries ActionGameLaunch", () => {
        const bytes = msg.ActionEnvelope.encode({
            actionGameLaunch: { fromId: "a", toId: "b" },
        }).finish();
        const decoded = msg.ActionEnvelope.decode(bytes);
        expect(decoded.action).toBe("actionGameLaunch");
        expect(decoded.actionGameLaunch?.fromId).toBe("a");
        expect(decoded.actionGameLaunch?.toId).toBe("b");
    });

    it("encodes ActionGameLaunch to the bytes the server expects", () => {
        // ActionEnvelope{action_game_launch(2){from_id(1)="a", to_id(2)="b"}}
        const bytes = msg.ActionEnvelope.encode({
            actionGameLaunch: { fromId: "a", toId: "b" },
        }).finish();
        expect(Array.from(bytes)).toEqual([0x12, 0x06, 0x0a, 0x01, 0x61, 0x12, 0x01, 0x62]);
    });

    it("encodes ActionGameLaunch with a seq (v5) to the bytes the server expects", () => {
        // ActionEnvelope{action_game_launch(2){from_id(1)="a", to_id(2)="b", seq(3)=3}}
        const bytes = msg.ActionEnvelope.encode({
            actionGameLaunch: { fromId: "a", toId: "b", seq: 3 },
        }).finish();
        expect(Array.from(bytes)).toEqual([0x12, 0x08, 0x0a, 0x01, 0x61, 0x12, 0x01, 0x62, 0x18, 0x03]);
    });

    it("carries ActionGameLeave", () => {
        const bytes = msg.ActionEnvelope.encode({ actionGameLeave: {} }).finish();
        const decoded = msg.ActionEnvelope.decode(bytes);
        expect(decoded.action).toBe("actionGameLeave");
        // ActionEnvelope{action_game_leave(1){}}
        expect(Array.from(bytes)).toEqual([0x0a, 0x00]);
    });

    it("keeps only the last action of a oneof", () => {
        const env = new msg.ActionEnvelope();
        env.actionGameLeave = new msg.ActionGameLeave();
        env.actionGameLaunch = new msg.ActionGameLaunch({ fromId: "a", toId: "b" });
        expect(env.action).toBe("actionGameLaunch");
        const decoded = msg.ActionEnvelope.decode(msg.ActionEnvelope.encode(env).finish());
        expect(decoded.action).toBe("actionGameLaunch");
    });
});
