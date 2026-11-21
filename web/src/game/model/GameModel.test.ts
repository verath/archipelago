import { describe, it, expect, vi } from "vitest";
import GameModel, { ProtocolError } from "./GameModel.ts";
import { PLAYER_COLORS, PLAYER_COLOR_SELF, PLAYER_COLOR_NEUTRAL } from "./PlayerColors.ts";
import { wire } from "../../wire/proto_bundle.js";
import {
    NEUTRAL_ID, defined, makeGame, makeIsland, makeAirplane, makePlayer, makeSnapshot, makeDelta,
    type GameOptions,
} from "../../test/fixtures.ts";

const { PlayerState } = wire.msg;

/** A 5x5 game where "me" owns the island in the middle. */
function newGame(overrides: GameOptions = {}): GameModel {
    const model = new GameModel();
    model.myPlayerId = "me";
    model.update(makeGame({
        players: [makePlayer("me"), makePlayer("enemy")],
        islands: [
            makeIsland("mine", 2, 2, "me", 10),
            makeIsland("theirs", 4, 4, "enemy", 7),
            makeIsland("free", 0, 0, NEUTRAL_ID, 3),
        ],
        ...overrides,
    }));
    return model;
}

const countClear = (model: GameModel): number => model.myFogOfWar.filter(inFog => !inFog).length;

describe("GameModel.update", () => {
    it("starts empty", () => {
        const model = new GameModel();
        expect(model.islands).toEqual([]);
        expect(model.airplanes).toEqual([]);
        expect(model.myPlayerId).toBeNull();
        expect(model.islandById("x")).toBeNull();
        expect(model.playerById("x")).toBeNull();
        expect(model.airplaneById("x")).toBeNull();
    });

    it("applies size, players, islands and airplanes", () => {
        const model = newGame({
            airplanes: [makeAirplane("a1", 1, 1, "enemy", 4)],
        });
        expect([model.size.x, model.size.y]).toEqual([5, 5]);
        expect(model.id).toBe("game-1");
        expect(model.playerNeutral.id).toBe(NEUTRAL_ID);
        expect(model.playerById("me")).not.toBeNull();
        expect(model.islands.map(i => i.id)).toEqual(["mine", "theirs", "free"]);
        expect(model.airplanes.map(a => a.id)).toEqual(["a1"]);
        expect(model.airplaneById("a1")?.strength).toBe(4);
    });

    it("resolves island owners to players or the neutral player", () => {
        const model = newGame();
        expect(model.islandById("mine")?.owner).toBe(model.playerById("me"));
        expect(model.islandById("mine")?.owner?.isSelf()).toBe(true);
        expect(model.islandById("free")?.owner).toBe(model.playerNeutral);
        expect(model.islandById("free")?.owner?.isNeutral()).toBe(true);
    });

    it("assigns player colors by index, with self and neutral overriding", () => {
        const model = new GameModel();
        model.myPlayerId = "me";
        model.update(makeGame({
            players: [makePlayer("e0"), makePlayer("me"), makePlayer("e2")],
        }));
        expect(model.playerById("e0")?.color).toBe(PLAYER_COLORS[0]);
        expect(model.playerById("e2")?.color).toBe(PLAYER_COLORS[2]);
        expect(model.playerById("me")?.color).toBe(PLAYER_COLOR_SELF);
        expect(model.playerNeutral.color).toBe(PLAYER_COLOR_NEUTRAL);
    });

    it("decodes player states", () => {
        const model = new GameModel();
        model.myPlayerId = "a";
        model.update(makeGame({
            players: [
                makePlayer("a"),
                makePlayer("b", PlayerState.PENDING_REVIVAL),
                makePlayer("c", PlayerState.DEAD),
                makePlayer("d", PlayerState.LEFT_GAME),
            ],
        }));
        expect(["a", "b", "c", "d"].map(id => model.playerById(id)?.state))
            .toEqual(["ALIVE", "PENDING_REVIVAL", "DEAD", "LEFT_GAME"]);
    });

    it("updates island ownership and strength in place on later ticks", () => {
        const model = newGame();
        const island = defined(model.islandById("free"));
        const islandListener = vi.fn();
        island.addChangeListener(islandListener);

        model.update(makeGame({
            players: [makePlayer("me"), makePlayer("enemy")],
            islands: [
                makeIsland("mine", 2, 2, "me", 11),
                makeIsland("theirs", 4, 4, "enemy", 7),
                makeIsland("free", 0, 0, "me", 2),
            ],
        }));

        expect(model.islandById("free")).toBe(island);
        expect(island.owner).toBe(model.playerById("me"));
        expect(island.strength).toBe(2);
        expect(model.islandById("mine")?.strength).toBe(11);
        expect(islandListener).toHaveBeenCalledTimes(1);
    });

    it("notifies listeners when islands or airplanes are added or removed", () => {
        const model = newGame();
        const listener = vi.fn();
        model.addChangeListener(listener);
        const players = [makePlayer("me"), makePlayer("enemy")];

        model.update(makeGame({
            players,
            islands: [makeIsland("mine", 2, 2, "me", 10)],
            airplanes: [makeAirplane("a1", 1, 1, "me")],
        }));
        expect(listener).toHaveBeenCalledTimes(1);
        expect(model.islands).toHaveLength(1);
        expect(model.airplanes).toHaveLength(1);

        model.update(makeGame({
            players,
            islands: [makeIsland("mine", 2, 2, "me", 10)],
        }));
        expect(listener).toHaveBeenCalledTimes(2);
        expect(model.airplanes).toHaveLength(0);
    });

    it("does not notify when a tick changes nothing structural", () => {
        const model = newGame();
        const listener = vi.fn();
        model.addChangeListener(listener);
        model.update(makeGame({
            players: [makePlayer("me"), makePlayer("enemy")],
            islands: [
                makeIsland("mine", 2, 2, "me", 12),
                makeIsland("theirs", 4, 4, "enemy", 7),
                makeIsland("free", 0, 0, NEUTRAL_ID, 3),
            ],
        }));
        expect(listener).not.toHaveBeenCalled();
    });

    it("emits a change when myPlayerId changes", () => {
        const model = new GameModel();
        const listener = vi.fn();
        model.addChangeListener(listener);
        model.myPlayerId = "me";
        model.myPlayerId = "me";
        expect(listener).toHaveBeenCalledTimes(1);
    });
});

describe("GameModel fog of war", () => {
    it("clears a 3x3 area around a small island and 5x5 around a large one", () => {
        const small = newGame();
        expect(small.myFogOfWar).toHaveLength(25);
        expect(countClear(small)).toBe(9);
        // The island in the middle: (2,2) and its neighbours are visible.
        expect(small.myFogOfWar[2 * 5 + 2]).toBe(false);
        expect(small.myFogOfWar[1 * 5 + 1]).toBe(false);
        expect(small.myFogOfWar[0]).toBe(true);

        const large = newGame({
            islands: [makeIsland("mine", 2, 2, "me", 10, 1)],
        });
        expect(countClear(large)).toBe(25);
    });

    it("clips the visible area at the map edge", () => {
        const model = newGame({ islands: [makeIsland("mine", 0, 0, "me", 10)] });
        expect(countClear(model)).toBe(4);
    });

    it("adds vision around the player's airplanes only", () => {
        const model = newGame({
            islands: [makeIsland("mine", 0, 0, "me", 10)],
            airplanes: [
                makeAirplane("mine-plane", 4, 4, "me"),
                makeAirplane("enemy-plane", 0, 4, "enemy"),
            ],
        });
        expect(countClear(model)).toBe(4 + 4);
        expect(model.myFogOfWar[4 * 5 + 0]).toBe(true);
    });

    it("gives a dead player full vision and a pending-revival player none", () => {
        const players = (state: wire.msg.PlayerState): wire.msg.Player.$Properties[] => [makePlayer("me", state), makePlayer("enemy")];
        const model = newGame();
        expect(countClear(model)).toBe(9);

        model.update(makeGame({
            players: players(PlayerState.PENDING_REVIVAL),
            islands: [makeIsland("mine", 2, 2, "me", 10)],
        }));
        expect(countClear(model)).toBe(0);

        model.update(makeGame({
            players: players(PlayerState.DEAD),
            islands: [makeIsland("mine", 2, 2, "enemy", 10)],
        }));
        expect(countClear(model)).toBe(25);
    });

    it("reports a change when the fog changes", () => {
        const model = newGame();
        const listener = vi.fn();
        model.addChangeListener(listener);
        model.update(makeGame({
            players: [makePlayer("me"), makePlayer("enemy")],
            islands: [makeIsland("mine", 0, 0, "me", 10)],
        }));
        expect(listener).toHaveBeenCalled();
        expect(countClear(model)).toBe(4);
    });
});

describe("GameModel.applySnapshot", () => {
    it("replaces the state, with airplanes at the snapshot's game time", () => {
        let now = 10_000;
        const model = new GameModel(() => now);
        model.myPlayerId = "me";
        model.applySnapshot(makeSnapshot(makeGame({
            players: [makePlayer("me")],
            islands: [makeIsland("mine", 0, 0, "me", 10)],
            airplanes: [makeAirplane("a1", 1, 1, "me", 3, 0, 0.001)],
        }), 1, 2000));

        expect(model.gameTime).toBe(2000);
        now += 500;
        model.interpolate(500);
        // The clock runs 1% slow between messages, see GameClock.
        expect(model.gameTime).toBeCloseTo(2000 + 500 * 0.99);
        expect(defined(model.airplaneById("a1")).position.x).toBeCloseTo(1 + 0.495);
    });

    it("throws a ProtocolError without a game", () => {
        const model = new GameModel();
        expect(() => model.applySnapshot({ seq: 1 })).toThrow(ProtocolError);
    });
});

describe("GameModel.applyDelta", () => {
    it("updates players, islands and airplanes", () => {
        const model = newGame({ airplanes: [makeAirplane("a1", 1, 1, "enemy", 4), makeAirplane("a2", 3, 3, "enemy", 2)] });
        const listener = vi.fn();
        model.addChangeListener(listener);

        model.applyDelta(makeDelta(2, 333, {
            players: [makePlayer("enemy", PlayerState.DEAD)],
            islands: [{ id: "free", army: { ownerId: "me", strength: 0 } }],
            airplanesRemoved: ["a1"],
            airplanesAdded: [makeAirplane("a3", 2, 2, "me", 6, 0, 0.001)],
            airplanesUpdated: [{ id: "a2", army: { ownerId: "enemy", strength: -1 } }],
        }));

        expect(model.playerById("enemy")?.state).toBe("DEAD");
        expect(model.islandById("free")?.owner).toBe(model.playerById("me"));
        expect(model.islandById("free")?.strength).toBe(0);
        expect(model.airplanes.map(a => a.id)).toEqual(["a2", "a3"]);
        expect(model.airplaneById("a1")).toBeNull();
        expect(model.airplaneById("a2")?.strength).toBe(-1);
        expect(model.airplaneById("a3")?.strength).toBe(6);
        // Airplanes were added and removed.
        expect(listener).toHaveBeenCalled();
    });

    it("positions added airplanes at the delta's game time", () => {
        let now = 0;
        const model = new GameModel(() => now);
        model.myPlayerId = "me";
        model.applySnapshot(makeSnapshot(makeGame({ players: [makePlayer("me")] }), 1, 0));
        now = 1000;
        model.applyDelta(makeDelta(2, 1000, { airplanesAdded: [makeAirplane("a", 0, 0, "me", 1, 0, 0.001)] }));
        now = 1250;
        model.interpolate(250);
        expect(defined(model.airplaneById("a")).position.x).toBeCloseTo(0.25);
    });

    it("can remove and add the same airplane", () => {
        const model = newGame({ airplanes: [makeAirplane("a1", 1, 1, "me", 4, 0)] });
        model.applyDelta(makeDelta(2, 0, {
            airplanesRemoved: ["a1"],
            airplanesAdded: [makeAirplane("a1", 1, 1, "me", 4, Math.PI)],
        }));
        expect(model.airplanes).toHaveLength(1);
        expect(model.airplaneById("a1")?.direction).toBeCloseTo(Math.PI);
    });

    it("updates the fog of war", () => {
        const model = newGame();
        expect(countClear(model)).toBe(9);
        model.applyDelta(makeDelta(2, 333, { islands: [{ id: "free", army: { ownerId: "me", strength: 3 } }] }));
        // "free" at (0, 0) clears 4 tiles, (1, 1) of which "mine" already did.
        expect(countClear(model)).toBe(9 + 4 - 1);
    });

    it.each([
        ["an unknown player", { players: [makePlayer("nobody")] }],
        ["an unknown island", { islands: [{ id: "nope", army: { ownerId: "me", strength: 1 } }] }],
        ["removing an unknown airplane", { airplanesRemoved: ["nope"] }],
        ["updating an unknown airplane", { airplanesUpdated: [{ id: "nope", army: { ownerId: "me", strength: 1 } }] }],
        ["adding a known airplane", { airplanesAdded: [makeAirplane("a1", 0, 0, "me")] }],
    ])("throws a ProtocolError for %s", (_, delta) => {
        const model = newGame({ airplanes: [makeAirplane("a1", 1, 1, "me", 4)] });
        expect(() => model.applyDelta(makeDelta(2, 0, delta))).toThrow(ProtocolError);
    });
});

describe("GameModel.launchAirplane", () => {
    it("takes half the strength (rounded down) into a local airplane", () => {
        const model = newGame();
        const listener = vi.fn();
        model.addChangeListener(listener);
        const origin = defined(model.islandById("mine"));
        origin.strength = 11;

        model.launchAirplane(origin, defined(model.islandById("theirs")), 1);

        expect(origin.strength).toBe(6);
        expect(model.airplanes).toHaveLength(1);
        const plane = model.airplanes[0];
        expect(plane.id).toMatch(/^local-\d+$/);
        expect(plane.strength).toBe(5);
        expect(plane.launchSeq).toBe(1);
        expect(plane.owner).toBe(model.playerById("me"));
        expect([plane.position.x, plane.position.y]).toEqual([2, 2]);
        // Heading down-right towards (4, 4).
        expect(plane.direction).toBeCloseTo(Math.PI / 4);
        expect(listener).toHaveBeenCalled();
    });

    it("keeps the island's predicted strength while the server's changes", () => {
        const model = newGame();
        const origin = defined(model.islandById("mine"));
        model.launchAirplane(origin, defined(model.islandById("theirs")), 1);
        expect(origin.strength).toBe(5);

        // The island grew before the server processed the launch.
        model.applyDelta(makeDelta(2, 333, { islands: [{ id: "mine", army: { ownerId: "me", strength: 11 } }] }));
        expect(origin.strength).toBe(6);
        expect(model.airplanes).toHaveLength(1);
    });

    it("replaces the local airplane with the server's once the launch was processed", () => {
        const model = newGame();
        const origin = defined(model.islandById("mine"));
        model.launchAirplane(origin, defined(model.islandById("theirs")), 1);
        const local = model.airplanes[0];
        const listener = vi.fn();
        model.addChangeListener(listener);

        model.applyDelta(makeDelta(2, 333, {
            players: [makePlayer("me", PlayerState.ALIVE, 1)],
            islands: [{ id: "mine", army: { ownerId: "me", strength: 5 } }],
            airplanesAdded: [makeAirplane("srv-1", 2.1, 2.1, "me", 5, Math.PI / 4, 0.001, { destinationId: "theirs", launchSeq: 1 })],
        }));

        expect(model.airplanes.map(a => a.id)).toEqual(["srv-1"]);
        expect(model.myLastLaunchSeq).toBe(1);
        expect(origin.strength).toBe(5);
        // The server's airplane takes over from where the local one was shown.
        const real = defined(model.airplaneById("srv-1"));
        expect([real.position.x, real.position.y]).toEqual([local.position.x, local.position.y]);
        expect(listener).toHaveBeenCalled();
    });

    it("removes the local airplane and restores the island when the launch failed", () => {
        const model = newGame();
        const origin = defined(model.islandById("mine"));
        model.launchAirplane(origin, defined(model.islandById("theirs")), 1);
        model.launchAirplane(origin, defined(model.islandById("free")), 2);
        expect(origin.strength).toBe(3);

        // Launch 1 failed (no airplane, island unchanged), 2 is not processed yet.
        model.applyDelta(makeDelta(2, 333, { players: [makePlayer("me", PlayerState.ALIVE, 1)] }));

        expect(model.airplanes.map(a => a.launchSeq)).toEqual([2]);
        expect(origin.strength).toBe(10 - 2);
    });

    it("keeps unprocessed local airplanes over a snapshot", () => {
        const model = newGame();
        model.launchAirplane(defined(model.islandById("mine")), defined(model.islandById("theirs")), 1);
        model.applySnapshot(makeSnapshot(makeGame({
            players: [makePlayer("me"), makePlayer("enemy")],
            islands: [makeIsland("mine", 2, 2, "me", 10), makeIsland("theirs", 4, 4, "enemy", 7)],
        }), 9, 0));
        expect(model.airplanes.map(a => a.launchSeq)).toEqual([1]);
        expect(model.islandById("mine")?.strength).toBe(5);
    });

    it("ignores predictions for an island we lost", () => {
        const model = newGame();
        const origin = defined(model.islandById("mine"));
        model.launchAirplane(origin, defined(model.islandById("theirs")), 1);
        model.applyDelta(makeDelta(2, 333, { islands: [{ id: "mine", army: { ownerId: "enemy", strength: 3 } }] }));
        expect(origin.strength).toBe(3);
    });
});

describe("GameModel.dropLocalLaunches", () => {
    it("removes local airplanes and restores island strengths", () => {
        const model = newGame({ airplanes: [makeAirplane("srv", 1, 1, "enemy", 2)] });
        model.launchAirplane(defined(model.islandById("mine")), defined(model.islandById("theirs")), 1);
        const listener = vi.fn();
        model.addChangeListener(listener);

        model.dropLocalLaunches();

        expect(model.airplanes.map(a => a.id)).toEqual(["srv"]);
        expect(model.islandById("mine")?.strength).toBe(10);
        expect(listener).toHaveBeenCalled();
    });
});

describe("GameModel.interpolate", () => {
    it("moves airplanes to the estimated game time", () => {
        let now = 0;
        const model = new GameModel(() => now);
        model.myPlayerId = "me";
        model.applySnapshot(makeSnapshot(makeGame({
            players: [makePlayer("me"), makePlayer("enemy")],
            islands: [makeIsland("mine", 2, 2, "me", 10)],
            airplanes: [makeAirplane("a1", 1, 1, "me", 3, 0, 0.001)],
        }), 1, 0));
        const plane = defined(model.airplaneById("a1"));
        expect([plane.position.x, plane.position.y]).toEqual([1, 1]);

        now = 500;
        model.interpolate(500);
        // 495 ms of game time: the clock runs 1% slow between messages.
        expect(plane.position.x).toBeCloseTo(1.495);
        expect(plane.position.y).toBeCloseTo(1);
    });

    it("does nothing once stopped", () => {
        let now = 0;
        const model = new GameModel(() => now);
        model.myPlayerId = "me";
        model.applySnapshot(makeSnapshot(makeGame({
            players: [makePlayer("me"), makePlayer("enemy")],
            islands: [makeIsland("mine", 2, 2, "me", 10)],
            airplanes: [makeAirplane("a1", 1, 1, "me", 3, 0, 0.001)],
        }), 1, 0));
        const plane = defined(model.airplaneById("a1"));

        model.stop();
        now = 500;
        model.interpolate(500);
        expect(plane.position.x).toBe(1);
    });
});
