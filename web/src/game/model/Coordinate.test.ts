import { describe, it, expect } from "vitest";
import Coordinate from "./Coordinate.ts";

describe("Coordinate", () => {
    it("defaults to an off-screen position", () => {
        const c = new Coordinate();
        expect(c.x).toBe(-1000);
        expect(c.y).toBe(-1000);
    });

    it("coerces falsy values to 0", () => {
        const c = new Coordinate(undefined, NaN);
        expect(c.x).toBe(-1000);
        expect(c.y).toBe(0);
        // @ts-expect-error: checks the coercion of values untyped callers may pass
        c.x = undefined;
        // @ts-expect-error: as above
        c.y = null;
        expect([c.x, c.y]).toEqual([0, 0]);
    });

    it("set() copies x and y, treating missing values as 0", () => {
        const c = new Coordinate(1, 2);
        c.set({ x: 3 });
        expect([c.x, c.y]).toEqual([3, 0]);
    });
});
