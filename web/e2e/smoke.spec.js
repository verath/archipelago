import fs from "node:fs";
import path from "node:path";

import { test, expect } from "./fixtures.js";
import { collectPageProblems } from "./helpers.js";
import { DIST_DIR } from "./paths.js";
import { firebaseHeaders } from "./servers.js";

/**
 * The `long` package (used by protobufjs) probes for WebAssembly support in
 * a try/catch and falls back to plain JS when the CSP (no 'wasm-unsafe-eval')
 * blocks it. That probe is reported as a violation but is harmless.
 * @param {import("./helpers.js").CSPViolation} violation
 * @returns {boolean}
 */
function isKnownCSPViolation(violation) {
    return violation.directive === "script-src" && violation.blockedURI === "wasm-eval";
}

test.describe("production build", () => {
    // Exactly what Firebase serves, with its headers incl. the CSP. Two
    // humans and no AI, so the lobby ("Finding a game") is deterministic.
    test.use({ frontend: "production", backendArgs: ["-aiPlayers", "0", "-lobbyWait", "0s"] });

    test("loads and starts a game without errors or CSP violations", async ({ page, newPlayerPage }) => {
        const problems1 = await collectPageProblems(page);
        const response = await page.goto("/");
        expect(response.headers()["content-security-policy"])
            .toBe(firebaseHeaders()["Content-Security-Policy"]);
        await expect(page.getByText("Finding a game")).toBeVisible();

        const page2 = await newPlayerPage({ navigate: false });
        const problems2 = await collectPageProblems(page2);
        await page2.goto("/");

        for (const p of [page, page2]) {
            await expect(p.locator("canvas")).toBeVisible();
            // The canvas is sized to the board once the first tick arrived.
            await expect.poll(async () => (await p.locator("canvas").boundingBox())?.width ?? 0)
                .toBeGreaterThan(100);
            // Let a few more frames render.
            await p.evaluate(() => new Promise((resolve) => {
                let frames = 10;
                const next = () => (--frames > 0) ? requestAnimationFrame(next) : resolve();
                requestAnimationFrame(next);
            }));
        }
        await expect(page.getByText("Game Over")).toHaveCount(0);

        for (const [p, problems] of [[page, problems1], [page2, problems2]]) {
            expect(problems.errors).toEqual([]);
            expect((await problems.cspViolations()).filter((v) => !isKnownCSPViolation(v))).toEqual([]);
            // The production bundle must not contain the e2e test hook.
            expect(await p.evaluate(() => "__archipelagoTest" in window)).toBe(false);
        }
    });
});

test("production dist does not contain the e2e test hook", () => {
    const files = fs.readdirSync(DIST_DIR, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => path.join(entry.parentPath, entry.name));
    expect(files.some((f) => f.endsWith(".js"))).toBe(true);
    const withHook = files.filter((f) => fs.readFileSync(f).includes("__archipelagoTest"));
    expect(withHook).toEqual([]);
});
