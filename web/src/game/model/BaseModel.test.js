import { describe, it, expect, vi } from "vitest";
import BaseModel from "./BaseModel.ts";

describe("BaseModel", () => {
    it("has a null id until updated", () => {
        expect(new BaseModel().id).toBeNull();
    });

    it("emits a change when the id changes, and only then", () => {
        const model = new BaseModel();
        const listener = vi.fn();
        model.addChangeListener(listener);

        model.update({ id: "a" });
        expect(model.id).toBe("a");
        expect(listener).toHaveBeenCalledTimes(1);

        model.update({ id: "a" });
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it("stops notifying removed listeners and honours the listener context", () => {
        const model = new BaseModel();
        const ctx = { n: 0 };
        const listener = function () { this.n++; };
        model.addChangeListener(listener, ctx);
        model.update({ id: "a" });
        expect(ctx.n).toBe(1);

        model.removeChangeListener(listener, ctx);
        model.update({ id: "b" });
        expect(ctx.n).toBe(1);
    });
});
