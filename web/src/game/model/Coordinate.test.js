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
        c.x = undefined;
        c.y = null;
        expect([c.x, c.y]).toEqual([0, 0]);
    });

    it("set() copies x and y, treating missing values as 0", () => {
        const c = new Coordinate(1, 2);
        c.set({ x: 3 });
        expect([c.x, c.y]).toEqual([3, 0]);
    });

    it("equals() compares by value and treats missing values as 0", () => {
        const c = new Coordinate(2, 0);
        expect(c.equals({ x: 2, y: 0 })).toBe(true);
        expect(c.equals({ x: 2 })).toBe(true);
        expect(c.equals(new Coordinate(2, 0))).toBe(true);
        expect(c.equals({ x: 2, y: 1 })).toBe(false);
        expect(c.equals(null)).toBe(false);
        expect(c.equals(undefined)).toBe(false);
    });
});
