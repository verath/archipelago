import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Ticker } from "pixi.js";
import GameController from "./GameController.js";
import GameModel from "../model/GameModel.js";
import { wire } from "../../wire/proto_bundle.js";
import {
    NEUTRAL_ID, makeGame, makeIsland, makePlayer, makeEventEnvelope,
} from "../../test/fixtures.js";

/**
 * A stand-in for Connection with the same queueing interface. Tests push
 * server events into it and inspect the actions the controller sent.
 */
class FakeConnection {
    constructor() {
        this.events = [];
        this.sentActions = [];
        this.ended = false;
        this._waiters = [];
    }

    push(eventName, payload) {
        this.events.push(makeEventEnvelope(eventName, payload));
        this._wake(true);
    }

    end() {
        this.ended = true;
        this._wake(false);
    }

    _wake(value) {
        this._waiters.splice(0).forEach(resolve => resolve(value));
    }

    hasNext() { return this.events.length > 0; }
    getNext() { return this.events.shift(); }
    peekNext() { return this.events[0]; }

    waitNext() {
        if (this.ended) {
            return Promise.resolve(false);
        }
        return new Promise(resolve => this._waiters.push(resolve));
    }

    sendAction(action) {
        // Round-trip through the wire format, like the real Connection.
        const bytes = wire.msg.ActionEnvelope.encode(action).finish();
        this.sentActions.push(wire.msg.ActionEnvelope.decode(bytes));
    }
}

function tickGame(islands) {
    return {
        game: makeGame({
            players: [makePlayer("me"), makePlayer("enemy")],
            islands,
        }),
    };
}

const TWO_ISLANDS = () => [
    makeIsland("mine", 1, 1, "me", 10),
    makeIsland("theirs", 3, 3, "enemy", 5),
    makeIsland("free", 0, 4, NEUTRAL_ID, 4),
];

let connection, model, controller, destroySpy;

/** Lets run() process everything currently queued. */
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

beforeEach(() => {
    // Pixi's Ticker schedules itself with requestAnimationFrame, which node lacks.
    vi.stubGlobal("requestAnimationFrame", (cb) => setTimeout(() => cb(performance.now()), 16));
    vi.stubGlobal("cancelAnimationFrame", (id) => clearTimeout(id));
    destroySpy = vi.spyOn(Ticker.prototype, "destroy");
    connection = new FakeConnection();
    model = new GameModel();
    controller = new GameController(connection, model);
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("GameController.run", () => {
    it("applies game start and tick events to the model", async () => {
        const result = controller.run();
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        connection.push("eventGameTick", tickGame(TWO_ISLANDS()));
        await flush();

        expect(model.myPlayerId).toBe("me");
        expect(model.serverTickInterval).toBe(250);
        expect(model.islands.map(i => i.id)).toEqual(["mine", "theirs", "free"]);
        expect(model.islandById("mine").owner.isSelf()).toBe(true);

        connection.push("eventGameTick", tickGame([
            makeIsland("mine", 1, 1, "me", 11),
            makeIsland("theirs", 3, 3, "enemy", 4),
            makeIsland("free", 0, 4, NEUTRAL_ID, 4),
        ]));
        await flush();
        expect(model.islandById("mine").strength).toBe(11);
        expect(model.islandById("theirs").strength).toBe(4);

        connection.push("eventGameOver", { winnerId: "me" });
        await result;
    });

    it("resolves with the winner on game over", async () => {
        const result = controller.run();
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        connection.push("eventGameTick", tickGame(TWO_ISLANDS()));
        connection.push("eventGameOver", { winnerId: "enemy" });
        await expect(result).resolves.toEqual({ reason: "GAME_OVER", winnerId: "enemy" });
    });

    it("stops reading events after game over", async () => {
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        connection.push("eventGameOver", { winnerId: "me" });
        connection.push("eventGameTick", tickGame(TWO_ISLANDS()));
        await controller.run();
        expect(model.islands).toHaveLength(0);
        expect(connection.hasNext()).toBe(true);
    });

    it("resolves as game over with an empty winner when the connection ends", async () => {
        const result = controller.run();
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        await flush();
        connection.end();
        await expect(result).resolves.toEqual({ reason: "GAME_OVER", winnerId: "" });
        expect(model.myPlayerId).toBe("me");
    });

    it("still handles events queued before the connection ended", async () => {
        connection.push("eventGameStart", { playerId: "me", tickInterval: 100 });
        connection.push("eventGameOver", { winnerId: "me" });
        connection.end();
        await expect(controller.run()).resolves.toEqual({ reason: "GAME_OVER", winnerId: "me" });
    });

    it("ignores unknown events", async () => {
        vi.spyOn(console, "log").mockImplementation(() => { });
        connection.events.push(new wire.msg.EventEnvelope());
        connection.push("eventGameOver", { winnerId: "me" });
        await expect(controller.run()).resolves.toEqual({ reason: "GAME_OVER", winnerId: "me" });
    });

    it("destroys its ticker on game over, connection end, and errors", async () => {
        connection.push("eventGameOver", { winnerId: "me" });
        await controller.run();
        expect(destroySpy).toHaveBeenCalledTimes(1);

        const c2 = new FakeConnection();
        c2.end();
        await new GameController(c2, new GameModel()).run();
        expect(destroySpy).toHaveBeenCalledTimes(2);

        // A tick for a game our player is not in makes the model throw.
        vi.spyOn(console, "log").mockImplementation(() => { });
        const c3 = new FakeConnection();
        c3.push("eventGameStart", { playerId: "nobody", tickInterval: 100 });
        c3.push("eventGameTick", tickGame(TWO_ISLANDS()));
        await expect(new GameController(c3, new GameModel()).run()).rejects.toThrow();
        expect(destroySpy).toHaveBeenCalledTimes(3);
    });
});

describe("GameController.onIslandClicked", () => {
    beforeEach(async () => {
        connection.push("eventGameStart", { playerId: "me", tickInterval: 250 });
        connection.push("eventGameTick", tickGame(TWO_ISLANDS()));
        const result = controller.run();
        await flush();
        controller.result = result;
    });

    afterEach(async () => {
        connection.push("eventGameOver", { winnerId: "me" });
        await controller.result;
    });

    it("selects an own island on the first click", () => {
        controller.onIslandClicked("mine");
        expect(model.islandById("mine").selected).toBe(true);
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
        expect(action.actionGameLaunch.fromId).toBe("mine");
        expect(action.actionGameLaunch.toId).toBe("theirs");

        // The selection is consumed, and a local airplane takes half the strength.
        expect(model.islandById("mine").selected).toBe(false);
        expect(model.islandById("mine").strength).toBe(5);
        expect(model.airplanes).toHaveLength(1);
        expect(model.airplanes[0].strength).toBe(5);
    });

    it("can launch to a neutral island too", () => {
        controller.onIslandClicked("mine");
        controller.onIslandClicked("free");
        expect(connection.sentActions[0].actionGameLaunch.toId).toBe("free");
    });

    it("deselects without launching when the same island is clicked again", () => {
        controller.onIslandClicked("mine");
        controller.onIslandClicked("mine");
        expect(model.islandById("mine").selected).toBe(false);
        expect(connection.sentActions).toHaveLength(0);
        expect(model.airplanes).toHaveLength(0);
    });

    it("does not launch from an island with less than 2 strength", async () => {
        connection.push("eventGameTick", tickGame([
            makeIsland("mine", 1, 1, "me", 1),
            makeIsland("theirs", 3, 3, "enemy", 5),
        ]));
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
        await controller.result;
        controller.onIslandClicked("mine");
        expect(model.islandById("mine").selected).toBe(false);
    });
});
