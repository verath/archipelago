import { describe, it, expect } from "vitest";
import {
    PLAYER_COLORS, PLAYER_COLOR_SELF, PLAYER_COLOR_NEUTRAL, PLAYER_COLOR_NOT_SET,
} from "./PlayerColors.ts";

describe("PlayerColors", () => {
    it("has distinct fill colors for enemies, self and neutral", () => {
        const fills = PLAYER_COLORS.map(c => c.fill);
        expect(new Set(fills).size).toBe(fills.length);
        expect(fills).not.toContain(PLAYER_COLOR_SELF.fill);
        expect(fills).not.toContain(PLAYER_COLOR_NEUTRAL.fill);
    });

    it("exposes fill and text colors", () => {
        expect(PLAYER_COLOR_SELF.fill).toBe(0x0000ff);
        expect(PLAYER_COLOR_NOT_SET.textFill).toBe(0);
        expect(PLAYER_COLOR_NEUTRAL.textStroke).toBe(0xeeeeee);
    });
});
