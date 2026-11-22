import { describe, it, expect } from "vitest";

import DemoSimulation, { DEMO_TICK, SPECTATOR_ID } from "./DemoSimulation.ts";
import DemoGame, { demoBoardSize } from "./DemoGame.ts";

/**
 * A seeded random number generator (mulberry32), so that runs repeat.
 */
function seededRandom(seed: number): () => number {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = seed;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const MINUTE = 60_000;

describe("DemoSimulation", () => {
    it("starts each player on an island, with neutral islands around, and the center free", () => {
        const sim = new DemoSimulation(5, 7, seededRandom(1));
        const counts = sim.islandCounts();
        expect([...counts.values()]).toEqual([1, 1, 1]);
        const game = sim.snapshot().game!;
        expect(game.size).toEqual({ x: 5, y: 7 });
        // At least 5 per player.
        expect(game.islands!.length).toBeGreaterThanOrEqual(15);
        expect(game.islands!.some(i => i.position!.x === 2 && i.position!.y === 3)).toBe(false);
        // Watched by a spectator that is out of the game, so without fog.
        expect(game.players![0].id).toBe(SPECTATOR_ID);
    });

    it("has more players on large boards", () => {
        expect(new DemoSimulation(12, 7, seededRandom(1)).playerIds).toHaveLength(4);
    });

    // Long runs on boards of a phone and of a desktop screen, with a few
    // seeds: nobody wins, and islands keep changing owners.
    for (const [cols, rows] of [[4, 7], [8, 5], [12, 7]]) {
        for (const seed of [1, 2, 3]) {
            it(`keeps going without a winner (${cols}x${rows}, seed ${seed})`, () => {
                const sim = new DemoSimulation(cols, rows, seededRandom(seed));
                const capturesPerFiveMinutes: number[] = [];
                // The leader's share of all islands, at each tick.
                const leaderShares: number[] = [];
                for (let window = 0; window < 6; window++) {
                    const capturesBefore = sim.captures;
                    for (let t = 0; t < 5 * MINUTE; t += DEMO_TICK) {
                        sim.tick();
                        const counts = [...sim.islandCounts().values()];
                        expect(Math.min(...counts), "every player keeps an island").toBeGreaterThanOrEqual(1);
                        leaderShares.push(Math.max(...counts) / sim.numIslands);
                    }
                    capturesPerFiveMinutes.push(sim.captures - capturesBefore);
                }
                // Islands change owners all along, not just at the start.
                expect(Math.min(...capturesPerFiveMinutes), `captures per 5 minutes: ${capturesPerFiveMinutes}`)
                    .toBeGreaterThanOrEqual(10);
                // Nobody takes over the board, even for a while.
                const average = leaderShares.reduce((a, b) => a + b) / leaderShares.length;
                expect(average, "the leader's average share of the islands").toBeLessThan(0.55);
                const dominant = leaderShares.filter(share => share > 0.7).length / leaderShares.length;
                expect(dominant, "the share of the time a leader has > 70% of the islands").toBeLessThan(0.05);
                expect(sim.numAirplanes).toBeLessThan(30);
            });
        }
    }
});

describe("DemoGame", () => {
    it("shows the simulation in its GameModel, without fog of war", () => {
        const demo = new DemoGame(8, 5, seededRandom(1));
        const model = demo.model;
        expect(model.size.x).toBe(8);
        expect(model.size.y).toBe(5);
        expect(model.islands.length).toBeGreaterThan(3);
        expect(model.myFogOfWar.every(fog => !fog)).toBe(true);
        expect(model.playerById(SPECTATOR_ID)!.state).toBe("DEAD");

        // Run for a while at 60 fps: airplanes take off and fly smoothly.
        let sawAirplane = false;
        for (let i = 0; i < 60 * 20; i++) {
            demo.onFrame(1000 / 60);
            sawAirplane ||= model.airplanes.length > 0;
        }
        expect(sawAirplane).toBe(true);
        expect(model.gameTime).toBeGreaterThan(19_000);
    });

    it("doesn't jump after a long pause", () => {
        const demo = new DemoGame(8, 5, seededRandom(1));
        demo.onFrame(60_000);
        expect(demo.model.gameTime).toBeLessThanOrEqual(250);
    });
});

describe("demoBoardSize", () => {
    it("fits the screen's aspect ratio, with ~5 tiles across the shorter side", () => {
        // A phone, upright and on its side.
        expect(demoBoardSize(390, 664)).toEqual({ cols: 4, rows: 7 });
        expect(demoBoardSize(750, 342)).toEqual({ cols: 8, rows: 4 });
        // Desktops: tiles grow up to a limit, then there are more of them.
        expect(demoBoardSize(1000, 650)).toEqual({ cols: 8, rows: 5 });
        expect(demoBoardSize(1920, 1080)).toEqual({ cols: 12, rows: 7 });
    });
});
