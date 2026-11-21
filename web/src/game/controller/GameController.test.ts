import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from "vitest";
import GameController, { type GameResult } from "./GameController.ts";
import GameModel from "../model/GameModel.ts";
import type Connection from "../../network/Connection.ts";
import type { ServerEvent } from "../../network/Connection.ts";
import { wire } from "../../wire/proto_bundle.js";
import {
    makeAirplane, NEUTRAL_ID, makeGame, makeIsland, makePlayer, makeEventEnvelope, makeSnapshot, makeDelta, defined,
    type EventArgs,
} from "../../test/fixtures.ts";

/** The part of Connection that GameController uses. */
type ServerEventQueue = Pick<Connection, "next" | "peek" | "sendAction" | "resume">;

/**
 * A stand-in for Connection with the same queueing interface. Tests push
 * server events into it and inspect the actions the controller sent.
 */
class FakeConnection implements ServerEventQueue {
    readonly events: ServerEvent[] = [];
    readonly sentActions: wire.msg.ActionEnvelope[] = [];
    ended = false;
    private readonly _waiters: (() => void)[] = [];

    push(...args: EventArgs): void {
        this.events.push(makeEventEnvelope(...args));
        this._wake();
    }

    end(): void {
        this.ended = true;
        this._wake();
    }

    private _wake(): void {
        this._waiters.splice(0).forEach(resolve => resolve());
    }

    async next(): Promise<ServerEvent | null> {
        const event = await this.peek();
        if (event !== null) {
            this.events.shift();
        }
        return event;
    }

    async peek(): Promise<ServerEvent | null> {
        while (this.events.length === 0) {
            if (this.ended) {
                return null;
            }
            await new Promise<void>(resolve => this._waiters.push(resolve));
        }
        return this.events[0];
    }

    /** What each resume() call resolves to, in order; false when empty. */
    resumeResults: boolean[] = [];
    readonly resumeTokens: string[] = [];

    resume(token: string): Promise<boolean> {
        this.resumeTokens.push(token);
        const ok = this.resumeResults.shift() ?? false;
        if (ok) {
            this.ended = false;
        }
        return Promise.resolve(ok);
    }

    sendAction(action: wire.msg.ActionEnvelope): void {
        // Round-trip through the wire format, like the real Connection.
        const bytes = wire.msg.ActionEnvelope.encode(action).finish();
        this.sentActions.push(wire.msg.ActionEnvelope.decode(bytes));
    }
}

function newController(conn: FakeConnection, gameModel: GameModel): GameController {
    // GameController takes a Connection, whose private members a fake cannot
    // have; it only uses the ServerEventQueue part, which FakeConnection implements.
    return new GameController(conn as unknown as Connection, gameModel);
}

function snapshotOf(islands: wire.msg.Island.$Properties[], seq = 1): wire.msg.EventGameSnapshot.$Shape {
    return makeSnapshot(makeGame({
        players: [makePlayer("me"), makePlayer("enemy")],
        islands,
    }), seq);
}

const TWO_ISLANDS = () => [
    makeIsland("mine", 1, 1, "me", 10),
    makeIsland("theirs", 3, 3, "enemy", 5),
    makeIsland("free", 0, 4, NEUTRAL_ID, 4),
];

let connection: FakeConnection;
let model: GameModel;
let controller: GameController;
/** The result of the run() started by the onIslandClicked tests. */
let runResult: Promise<GameResult>;

/** Lets run() process everything currently queued. */
const flush = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0));

beforeEach(() => {
    connection = new FakeConnection();
    model = new GameModel();
    controller = newController(connection, model);
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("GameController.run", () => {
    it("applies game start, snapshot and delta events to the model", async () => {
        const result = controller.run();
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        connection.push("eventGameSnapshot", snapshotOf(TWO_ISLANDS()));
        await flush();

        expect(model.myPlayerId).toBe("me");
        expect(model.islands.map(i => i.id)).toEqual(["mine", "theirs", "free"]);
        expect(model.islandById("mine")?.owner?.isSelf()).toBe(true);

        connection.push("eventGameDelta", makeDelta(2, 333, {
            islands: [
                { id: "mine", army: { ownerId: "me", strength: 11 } },
                { id: "theirs", army: { ownerId: "enemy", strength: 4 } },
            ],
        }));
        await flush();
        expect(model.islandById("mine")?.strength).toBe(11);
        expect(model.islandById("theirs")?.strength).toBe(4);

        connection.push("eventGameOver", { winnerId: "me" });
        await result;
    });

    it("resolves with the winner on game over", async () => {
        const result = controller.run();
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        connection.push("eventGameSnapshot", snapshotOf(TWO_ISLANDS()));
        connection.push("eventGameOver", { winnerId: "enemy" });
        await expect(result).resolves.toEqual({ reason: "GAME_OVER", winnerId: "enemy" });
    });

    it("stops reading events after game over", async () => {
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        connection.push("eventGameOver", { winnerId: "me" });
        connection.push("eventGameSnapshot", snapshotOf(TWO_ISLANDS()));
        await controller.run();
        expect(model.islands).toHaveLength(0);
        expect(connection.events).toHaveLength(1);
    });

    it("resolves as game over with an empty winner when the connection ends", async () => {
        const result = controller.run();
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        await flush();
        connection.end();
        await expect(result).resolves.toEqual({ reason: "GAME_OVER", winnerId: "" });
        expect(model.myPlayerId).toBe("me");
    });

    it("does not try to resume without a resume token", async () => {
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        connection.end();
        await expect(controller.run()).resolves.toEqual({ reason: "GAME_OVER", winnerId: "" });
        expect(connection.resumeTokens).toEqual([]);
    });

    it("resumes the game on a new connection when the connection breaks", async () => {
        const result = controller.run();
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250, resumeToken: "tok", resumeTimeout: 5000 });
        connection.push("eventGameSnapshot", snapshotOf(TWO_ISLANDS(), 1));
        connection.push("eventGameDelta", makeDelta(2, 333));
        await flush();
        controller.onIslandClicked("mine");
        controller.onIslandClicked("theirs");
        expect(model.airplanes).toHaveLength(1);

        // The first attempt fails (network still down), the second works.
        connection.resumeResults = [false, true];
        connection.end();
        await vi.waitFor(() => expect(connection.resumeTokens).toEqual(["tok", "tok"]), { timeout: 2000 });
        // The launch may have been lost with the old connection.
        expect(model.airplanes).toHaveLength(0);
        expect(model.islandById("mine")?.strength).toBe(10);

        // The server starts over: game start, a snapshot (seq 1), deltas.
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250, resumeToken: "tok", resumeTimeout: 5000 });
        connection.push("eventGameSnapshot", snapshotOf([makeIsland("mine", 1, 1, "me", 12)], 1));
        connection.push("eventGameDelta", makeDelta(2, 5000));
        await flush();
        expect(model.islandById("mine")?.strength).toBe(12);

        // Launch seqs go on.
        controller.onIslandClicked("mine");
        controller.onIslandClicked("mine");
        connection.push("eventGameOver", { winnerId: "me" });
        await expect(result).resolves.toEqual({ reason: "GAME_OVER", winnerId: "me" });
    });

    it("gives up resuming after the resume timeout", async () => {
        const result = controller.run();
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250, resumeToken: "tok", resumeTimeout: 600 });
        await flush();
        const start = performance.now();
        connection.end();
        await expect(result).resolves.toEqual({ reason: "GAME_OVER", winnerId: "" });
        const elapsed = performance.now() - start;
        expect(elapsed).toBeGreaterThanOrEqual(550);
        expect(elapsed).toBeLessThan(1500);
        // At 0, 250 and 750 (capped to 600) ms.
        expect(connection.resumeTokens.length).toBeGreaterThanOrEqual(2);
    });

    it("still handles events queued before the connection ended", async () => {
        connection.push("eventGameStart", { playerId: "me", tickInterval: 100 });
        connection.push("eventGameOver", { winnerId: "me" });
        connection.end();
        await expect(controller.run()).resolves.toEqual({ reason: "GAME_OVER", winnerId: "me" });
    });

    it("ignores unknown events", async () => {
        vi.spyOn(console, "log").mockImplementation(() => { });
        connection.events.push(wire.msg.EventEnvelope.create({}));
        connection.push("eventGameOver", { winnerId: "me" });
        await expect(controller.run()).resolves.toEqual({ reason: "GAME_OVER", winnerId: "me" });
    });

    it("ends the game with an error when a delta's seq skips one", async () => {
        vi.spyOn(console, "error").mockImplementation(() => { });
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        connection.push("eventGameSnapshot", snapshotOf(TWO_ISLANDS(), 5));
        connection.push("eventGameDelta", makeDelta(6, 333));
        connection.push("eventGameDelta", makeDelta(8, 999));
        await expect(controller.run()).resolves.toEqual({ reason: "ERROR" });
    });

    it("ends the game with an error on a delta before any snapshot", async () => {
        vi.spyOn(console, "error").mockImplementation(() => { });
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        connection.push("eventGameDelta", makeDelta(1, 0));
        await expect(controller.run()).resolves.toEqual({ reason: "ERROR" });
    });

    it("ends the game with an error on a delta that doesn't fit the state", async () => {
        vi.spyOn(console, "error").mockImplementation(() => { });
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        connection.push("eventGameSnapshot", snapshotOf(TWO_ISLANDS()));
        connection.push("eventGameDelta", makeDelta(2, 333, { airplanesRemoved: ["unknown"] }));
        await expect(controller.run()).resolves.toEqual({ reason: "ERROR" });
    });

    it("ends the game with an error on a delta the model can't apply", async () => {
        vi.spyOn(console, "error").mockImplementation(() => { });
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        connection.push("eventGameSnapshot", snapshotOf(TWO_ISLANDS()));
        // An island update without an army.
        connection.push("eventGameDelta", makeDelta(2, 333, { islands: [{ id: "mine" }] }));
        await expect(controller.run()).resolves.toEqual({ reason: "ERROR" });
    });

    it("accepts a new snapshot at any time", async () => {
        const result = controller.run();
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        connection.push("eventGameSnapshot", snapshotOf(TWO_ISLANDS(), 1));
        connection.push("eventGameSnapshot", snapshotOf([makeIsland("mine", 1, 1, "me", 3)], 7));
        connection.push("eventGameDelta", makeDelta(8, 666));
        await flush();
        expect(model.islands.map(i => i.id)).toEqual(["mine"]);
        connection.push("eventGameOver", { winnerId: "me" });
        await expect(result).resolves.toEqual({ reason: "GAME_OVER", winnerId: "me" });
    });

    it("stops its model on game over, connection end, and errors", async () => {
        const stop = vi.spyOn(model, "stop");
        connection.push("eventGameOver", { winnerId: "me" });
        await controller.run();
        expect(stop).toHaveBeenCalledTimes(1);

        const c2 = new FakeConnection();
        c2.end();
        const m2 = new GameModel();
        const stop2 = vi.spyOn(m2, "stop");
        await newController(c2, m2).run();
        expect(stop2).toHaveBeenCalledTimes(1);

        // A snapshot of a game our player is not in makes the model throw.
        vi.spyOn(console, "error").mockImplementation(() => { });
        const c3 = new FakeConnection();
        c3.push("eventGameStart", { playerId: "nobody", tickInterval: 100 });
        c3.push("eventGameSnapshot", snapshotOf(TWO_ISLANDS()));
        const m3 = new GameModel();
        const stop3 = vi.spyOn(m3, "stop");
        await expect(newController(c3, m3).run()).resolves.toEqual({ reason: "ERROR" });
        expect(stop3).toHaveBeenCalledTimes(1);
    });
});

describe("GameController.onIslandClicked", () => {
    beforeEach(async () => {
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        connection.push("eventGameSnapshot", snapshotOf(TWO_ISLANDS()));
        runResult = controller.run();
        await flush();
    });

    afterEach(async () => {
        connection.push("eventGameOver", { winnerId: "me" });
        await runResult;
    });

    it("selects an own island on the first click", () => {
        controller.onIslandClicked("mine");
        expect(model.islandById("mine")?.selected).toBe(true);
        expect(connection.sentActions).toHaveLength(0);
    });

    it("does not select an enemy or neutral island", () => {
        controller.onIslandClicked("theirs");
        controller.onIslandClicked("free");
        expect(model.islands.some(i => i.selected)).toBe(false);
    });

    it("launches an airplane from the selected island to the clicked one", () => {
        controller.onIslandClicked("mine");
        controller.onIslandClicked("theirs");

        expect(connection.sentActions).toHaveLength(1);
        const action = connection.sentActions[0];
        expect(action.action).toBe("actionGameLaunch");
        expect(action.actionGameLaunch?.fromId).toBe("mine");
        expect(action.actionGameLaunch?.toId).toBe("theirs");
        expect(action.actionGameLaunch?.seq).toBe(1);

        // The selection is consumed, and a local airplane takes half the strength.
        expect(model.islandById("mine")?.selected).toBe(false);
        expect(model.islandById("mine")?.strength).toBe(5);
        expect(model.airplanes).toHaveLength(1);
        expect(model.airplanes[0].strength).toBe(5);
    });

    it("numbers launches from 1", () => {
        controller.onIslandClicked("mine");
        controller.onIslandClicked("theirs");
        controller.onIslandClicked("mine");
        controller.onIslandClicked("free");
        expect(connection.sentActions.map(a => a.actionGameLaunch?.seq)).toEqual([1, 2]);
        expect(model.airplanes.map(a => a.launchSeq)).toEqual([1, 2]);
    });

    it("replaces the local airplane once the server processed the launch", async () => {
        controller.onIslandClicked("mine");
        controller.onIslandClicked("theirs");
        connection.push("eventGameDelta", makeDelta(2, 333, {
            players: [makePlayer("me", wire.msg.PlayerState.ALIVE, 1)],
            islands: [{ id: "mine", army: { ownerId: "me", strength: 5 } }],
            airplanesAdded: [makeAirplane("srv", 1.1, 1.1, "me", 5, Math.PI / 4, 0.001, { destinationId: "theirs", launchSeq: 1 })],
        }));
        await flush();
        expect(model.airplanes.map(a => a.id)).toEqual(["srv"]);
        expect(model.islandById("mine")?.strength).toBe(5);
    });

    it("does not launch from a selected island that was taken from us", async () => {
        controller.onIslandClicked("mine");
        connection.push("eventGameDelta", makeDelta(2, 333, {
            islands: [{ id: "mine", army: { ownerId: "enemy", strength: 8 } }],
        }));
        await flush();
        controller.onIslandClicked("theirs");
        expect(connection.sentActions).toHaveLength(0);
        expect(model.airplanes).toHaveLength(0);
    });

    it("numbers launches after the server's last seq", async () => {
        connection.push("eventGameDelta", makeDelta(2, 333, {
            players: [makePlayer("me", wire.msg.PlayerState.ALIVE, 41)],
        }));
        await flush();
        controller.onIslandClicked("mine");
        controller.onIslandClicked("theirs");
        expect(connection.sentActions[0].actionGameLaunch?.seq).toBe(42);
    });

    it("can launch to a neutral island too", () => {
        controller.onIslandClicked("mine");
        controller.onIslandClicked("free");
        expect(connection.sentActions[0].actionGameLaunch?.toId).toBe("free");
    });

    it("deselects without launching when the same island is clicked again", () => {
        controller.onIslandClicked("mine");
        controller.onIslandClicked("mine");
        expect(model.islandById("mine")?.selected).toBe(false);
        expect(connection.sentActions).toHaveLength(0);
        expect(model.airplanes).toHaveLength(0);
    });

    it("does not launch from an island with less than 2 strength", async () => {
        connection.push("eventGameDelta", makeDelta(2, 333, {
            islands: [{ id: "mine", army: { ownerId: "me", strength: 1 } }],
        }));
        await flush();
        controller.onIslandClicked("mine");
        controller.onIslandClicked("theirs");
        expect(connection.sentActions).toHaveLength(0);
        expect(model.airplanes).toHaveLength(0);
    });

    it("ignores clicks on unknown islands", () => {
        vi.spyOn(console, "warn").mockImplementation(() => { });
        controller.onIslandClicked("nope");
        expect(model.islands.some(i => i.selected)).toBe(false);
    });

    it("ignores clicks once the game is over", async () => {
        connection.push("eventGameOver", { winnerId: "enemy" });
        await runResult;
        controller.onIslandClicked("mine");
        expect(model.islandById("mine")?.selected).toBe(false);
    });
});
