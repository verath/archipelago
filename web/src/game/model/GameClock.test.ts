import { describe, it, expect } from "vitest";
import GameClock from "./GameClock.ts";

describe("GameClock", () => {
    it("is at game time 0 before any server message", () => {
        expect(new GameClock().gameTimeAt(12345)).toBe(0);
    });

    it("follows local time from the first server message, 1% slow", () => {
        const clock = new GameClock();
        clock.onServerTime(1000, 5000);
        expect(clock.gameTimeAt(5000)).toBe(1000);
        expect(clock.gameTimeAt(5250)).toBeCloseTo(1000 + 250 * 0.99);
    });

    it("is not pulled back by a late message", () => {
        const clock = new GameClock();
        clock.onServerTime(1000, 5000);
        // Game time 1333 should have arrived at 5333, but is 200 ms late.
        clock.onServerTime(1333, 5533);
        expect(clock.gameTimeAt(5533)).toBeCloseTo(1533 - 533 * 0.01);
    });

    it("jumps ahead for a message that is faster than all before", () => {
        const clock = new GameClock();
        clock.onServerTime(1000, 5100);
        clock.onServerTime(1333, 5333);
        expect(clock.gameTimeAt(5333)).toBe(1333);
    });

    it("slowly adapts to a network that got slower", () => {
        const clock = new GameClock();
        clock.onServerTime(0, 1000);
        // From now on every message is 100 ms later than before.
        for (let t = 0; t <= 20_000; t += 333) {
            clock.onServerTime(t, 1000 + t + 100);
        }
        // Adapted after 100 ms / 10 ms per s = 10 s.
        expect(clock.gameTimeAt(1000 + 20_000 + 100)).toBeCloseTo(20_000, 0);
    });

    it("never goes back in time", () => {
        const clock = new GameClock();
        clock.onServerTime(0, 1000);
        let last = clock.gameTimeAt(1000);
        // Messages every 333 ms with up to 300 ms jitter, and a 5 s stall.
        const arrivals = [1333, 1900, 2000, 2400, 7500, 7600, 7700, 8000];
        let t = 1000;
        for (const [i, arrival] of arrivals.entries()) {
            for (; t < arrival; t += 16) {
                const now = clock.gameTimeAt(t);
                expect(now).toBeGreaterThanOrEqual(last);
                last = now;
            }
            clock.onServerTime((i + 1) * 333, arrival);
            const now = clock.gameTimeAt(arrival);
            expect(now).toBeGreaterThanOrEqual(last);
            last = now;
        }
    });
});
