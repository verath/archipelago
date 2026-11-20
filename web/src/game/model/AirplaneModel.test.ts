import { describe, it, expect, vi } from "vitest";
// GameModel must be imported first: AirplaneModel -> GameModel ->
// LocalAirplaneModel -> AirplaneModel is a cycle that only resolves when
// entered through GameModel (as the app does).
import GameModel from "./GameModel.ts";
import AirplaneModel, { DEFAULT_AIRPLANE_SPEED } from "./AirplaneModel.ts";
import LocalAirplaneModel from "./LocalAirplaneModel.ts";
import { defined, makeAirplane, makeGame, makeIsland, makePlayer } from "../../test/fixtures.ts";

function newGameWithTick(tickInterval: number): GameModel {
    const game = new GameModel();
    game.myPlayerId = "me";
    game.serverTickInterval = tickInterval;
    game.update(makeGame({ players: [makePlayer("me")] }));
    return game;
}

describe("AirplaneModel", () => {
    it("snaps to the server position the first time", () => {
        const plane = new AirplaneModel(newGameWithTick(1000));
        plane.update(makeAirplane("a", 3, 4, "me", 5, 0, 0.001));
        expect([plane.position.x, plane.position.y]).toEqual([3, 4]);
        expect(plane.id).toBe("a");
        expect(plane.strength).toBe(5);
    });

    it("heads for where the server will put it next tick", () => {
        const plane = new AirplaneModel(newGameWithTick(1000));
        plane.update(makeAirplane("a", 0, 0, "me", 5, 0, 0.001));
        expect(plane.direction).toBeCloseTo(0);
        expect(plane.speed).toBeCloseTo(0.001);

        // Server says we are at x=0.2 (within a tile, so no snapping): our
        // local position stays and we speed up to reach x=1.2 by next tick.
        plane.update(makeAirplane("a", 0.2, 0, "me", 5, 0, 0.001));
        expect(plane.position.x).toBe(0);
        expect(plane.speed).toBeCloseTo(0.0012);
        expect(plane.direction).toBeCloseTo(0);
    });

    it("snaps when more than a tile away from the server position", () => {
        const plane = new AirplaneModel(newGameWithTick(1000));
        plane.update(makeAirplane("a", 0, 0, "me", 5, 0, 0.001));
        plane.update(makeAirplane("a", 3, 0, "me", 5, 0, 0.001));
        expect(plane.position.x).toBe(3);
    });

    it("uses the default speed when the server sends none", () => {
        const plane = new AirplaneModel(newGameWithTick(1000));
        plane.update(makeAirplane("a", 0, 0, "me", 5, Math.PI / 2, 0));
        expect(plane.speed).toBeCloseTo(DEFAULT_AIRPLANE_SPEED);
        expect(plane.direction).toBeCloseTo(Math.PI / 2);
    });

    it("interpolates position by speed, direction and elapsed time", () => {
        const plane = new AirplaneModel(newGameWithTick(1000));
        plane.update(makeAirplane("a", 0, 0, "me", 5, Math.PI / 2, 0.002));
        const listener = vi.fn();
        plane.addChangeListener(listener);

        plane.interpolate(100);

        expect(plane.position.x).toBeCloseTo(0);
        expect(plane.position.y).toBeCloseTo(0.2);
        expect(listener).toHaveBeenCalledTimes(1);
    });
});

describe("LocalAirplaneModel", () => {
    it("starts at the origin, owned by it, flying towards the target", () => {
        const game = newGameWithTick(1000);
        game.update(makeGame({
            players: [makePlayer("me")],
            islands: [makeIsland("o", 1, 1, "me", 10), makeIsland("t", 1, 4, "me", 1)],
        }));
        const origin = defined(game.islandById("o"));
        const target = defined(game.islandById("t"));

        const plane = new LocalAirplaneModel(game, origin, target, 5);

        expect(plane.owner).toBe(origin.owner);
        expect(plane.strength).toBe(5);
        expect([plane.position.x, plane.position.y]).toEqual([1, 1]);
        expect(plane.direction).toBeCloseTo(Math.PI / 2);
        expect(plane.speed).toBe(DEFAULT_AIRPLANE_SPEED);
    });

    it("gets a unique id", () => {
        const game = newGameWithTick(1000);
        game.update(makeGame({
            players: [makePlayer("me")],
            islands: [makeIsland("o", 1, 1, "me", 10)],
        }));
        const o = defined(game.islandById("o"));
        const a = new LocalAirplaneModel(game, o, o, 1);
        const b = new LocalAirplaneModel(game, o, o, 1);
        expect(a.id).not.toBe(b.id);
    });
});
