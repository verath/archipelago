import { describe, it, expect } from "vitest";
// GameModel must be imported first: AirplaneModel -> GameModel ->
// LocalAirplaneModel -> AirplaneModel is a cycle that only resolves when
// entered through GameModel (as the app does).
import GameModel from "./GameModel.ts";
import AirplaneModel, { DEFAULT_AIRPLANE_SPEED } from "./AirplaneModel.ts";
import LocalAirplaneModel from "./LocalAirplaneModel.ts";
import { defined, makeAirplane, makeGame, makeIsland, makePlayer } from "../../test/fixtures.ts";

/** A game with our player and a target island "t" at (4, 0). */
function newGame(): GameModel {
    const game = new GameModel(() => 0);
    game.myPlayerId = "me";
    game.update(makeGame({
        players: [makePlayer("me")],
        islands: [makeIsland("o", 0, 0, "me", 10), makeIsland("t", 4, 0, "me", 1)],
    }));
    return game;
}

describe("AirplaneModel", () => {
    it("starts at the server position", () => {
        const plane = new AirplaneModel(newGame());
        plane.update({ ...makeAirplane("a", 3, 4, "me", 5, 0, 0.001), gameTime: 1000 });
        expect([plane.position.x, plane.position.y]).toEqual([3, 4]);
        expect(plane.id).toBe("a");
        expect(plane.strength).toBe(5);
        expect(plane.speed).toBe(0.001);
    });

    it("flies from its position at its game time along its direction", () => {
        const plane = new AirplaneModel(newGame());
        plane.update({ ...makeAirplane("a", 1, 1, "me", 5, Math.PI / 2, 0.002), gameTime: 1000 });
        expect(plane.positionAt(1100).x).toBeCloseTo(1);
        expect(plane.positionAt(1100).y).toBeCloseTo(1.2);
        // Not before its game time.
        expect(plane.positionAt(900)).toEqual({ x: 1, y: 1 });
    });

    it("stops at its destination island", () => {
        const plane = new AirplaneModel(newGame());
        plane.update({ ...makeAirplane("a", 0, 0, "me", 5, 0, 0.001, { destinationId: "t" }), gameTime: 0 });
        expect(plane.positionAt(3000).x).toBeCloseTo(3);
        expect(plane.positionAt(10_000).x).toBeCloseTo(4);
    });

    it("flies on without a (known) destination", () => {
        const plane = new AirplaneModel(newGame());
        plane.update({ ...makeAirplane("a", 0, 0, "enemy", 5, 0, 0.001), gameTime: 0 });
        expect(plane.positionAt(10_000).x).toBeCloseTo(10);
    });

    it("uses the default speed when the server sends none", () => {
        const plane = new AirplaneModel(newGame());
        plane.update({ ...makeAirplane("a", 0, 0, "me", 5, Math.PI / 2, 0), gameTime: 0 });
        expect(plane.speed).toBe(DEFAULT_AIRPLANE_SPEED);
        expect(plane.direction).toBeCloseTo(Math.PI / 2);
    });

    it("advances its displayed position to the game time", () => {
        const plane = new AirplaneModel(newGame());
        plane.update({ ...makeAirplane("a", 0, 0, "me", 5, Math.PI / 2, 0.002), gameTime: 0 });

        plane.advance(100, 16);

        expect(plane.position.x).toBeCloseTo(0);
        expect(plane.position.y).toBeCloseTo(0.2);
    });

    it("smoothly corrects from another position", () => {
        const plane = new AirplaneModel(newGame());
        plane.update({ ...makeAirplane("a", 1, 0, "me", 5, 0, 0.001), gameTime: 0 });

        plane.correctFrom({ x: 0.5, y: 0 }, 0);
        expect(plane.position.x).toBe(0.5);

        // The 0.5 tile correction fades with a 150 ms time constant.
        plane.advance(0, 150);
        expect(plane.position.x).toBeCloseTo(1 - 0.5 * Math.exp(-1));
        for (let i = 0; i < 20; i++) {
            plane.advance(0, 100);
        }
        expect(plane.position.x).toBeCloseTo(1);
    });

    it("updates only its army from a delta", () => {
        const plane = new AirplaneModel(newGame());
        plane.update({ ...makeAirplane("a", 1, 0, "me", 5, 0, 0.001), gameTime: 0 });
        plane.updateArmy({ ownerId: "enemy", strength: -1 });
        expect(plane.strength).toBe(-1);
        expect(plane.positionAt(1000).x).toBeCloseTo(2);
    });
});

describe("LocalAirplaneModel", () => {
    it("starts at the origin at the given game time, owned by it, flying towards the target", () => {
        const game = newGame();
        game.update(makeGame({
            players: [makePlayer("me")],
            islands: [makeIsland("o", 1, 1, "me", 10), makeIsland("t", 1, 4, "me", 1)],
        }));
        const origin = defined(game.islandById("o"));
        const target = defined(game.islandById("t"));

        const plane = new LocalAirplaneModel(game, origin, target, 5, 3, 1000);

        expect(plane.id).toMatch(/^local-\d+$/);
        expect(plane.owner).toBe(origin.owner);
        expect(plane.strength).toBe(5);
        expect(plane.launchSeq).toBe(3);
        expect(plane.destinationId).toBe("t");
        expect([plane.position.x, plane.position.y]).toEqual([1, 1]);
        expect(plane.direction).toBeCloseTo(Math.PI / 2);
        expect(plane.speed).toBe(DEFAULT_AIRPLANE_SPEED);
        expect(plane.positionAt(1000 + 3000).y).toBeCloseTo(2);
    });

    it("gets a unique id", () => {
        const game = newGame();
        const o = defined(game.islandById("o"));
        const a = new LocalAirplaneModel(game, o, o, 1, 1, 0);
        const b = new LocalAirplaneModel(game, o, o, 1, 2, 0);
        expect(a.id).not.toBe(b.id);
    });
});
