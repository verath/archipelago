import { expect } from "@playwright/test";

/**
 * @typedef Island
 * @property {string} id
 * @property {?string} ownerId
 * @property {number} strength Negative when in fog of war.
 * @property {number} size
 * @property {{x: number, y: number}} position Board position (tiles).
 * @property {boolean} selected
 * @property {?{x: number, y: number}} screen Center, in page CSS pixels.
 *
 * @typedef Airplane
 * @property {string} id
 * @property {?string} ownerId
 * @property {number} strength
 * @property {boolean} local Not yet confirmed by the server.
 *
 * @typedef GameState
 * @property {string} connectionState
 * @property {?string} myPlayerId
 * @property {?string} neutralPlayerId
 * @property {Island[]} islands
 * @property {Airplane[]} airplanes
 * @property {?{reason: string, winnerId?: ?string}} gameResult
 */

/**
 * Reads a snapshot of the game from window.__archipelagoTest (test build).
 * @param {import("@playwright/test").Page} page
 * @returns {Promise<?GameState>} null if the hook is not installed yet.
 */
export function gameState(page) {
    return page.evaluate(() => {
        const t = window.__archipelagoTest;
        if (!t) {
            return null;
        }
        return {
            connectionState: t.connectionState(),
            myPlayerId: t.myPlayerId(),
            neutralPlayerId: t.neutralPlayerId(),
            islands: t.islands(),
            airplanes: t.airplanes(),
            gameResult: t.gameResult(),
        };
    });
}

/**
 * Returns the island owned by me with the highest strength, if any.
 * @param {GameState} state
 * @returns {?Island}
 */
export function myIsland(state) {
    const mine = state.islands.filter((i) => i.ownerId === state.myPlayerId);
    mine.sort((a, b) => b.strength - a.strength);
    return mine[0] ?? null;
}

/**
 * Waits until the game has started and is rendered: my player id is known,
 * islands are in the model, mine has a screen position on the canvas.
 * @param {import("@playwright/test").Page} page
 * @returns {Promise<GameState>}
 */
export async function waitForGameStarted(page) {
    let state = null;
    await expect.poll(async () => {
        state = await gameState(page);
        if (state == null || state.myPlayerId == null) {
            return "no game";
        }
        const mine = myIsland(state);
        if (mine == null) {
            return "no island of mine";
        }
        if (mine.screen == null) {
            return "my island not rendered";
        }
        return "started";
    }, { message: "game started and rendered", timeout: 30_000 }).toBe("started");
    return state;
}

/**
 * @typedef CSPViolation
 * @property {string} directive The effective directive, e.g. "script-src".
 * @property {string} blockedURI E.g. a URL, "inline", "eval" or "wasm-eval".
 * @property {string} source file:line:column of the violation.
 */

/**
 * Collects console errors, page errors and CSP violations of a page. Must
 * be called before the page navigates.
 * @param {import("@playwright/test").Page} page
 * @returns {Promise<{errors: string[], cspViolations: function(): Promise<CSPViolation[]>}>}
 */
export async function collectPageProblems(page) {
    const errors = [];
    page.on("console", (msg) => {
        if (msg.type() === "error") {
            errors.push(`console.error: ${msg.text()}`);
        }
    });
    page.on("pageerror", (err) => {
        errors.push(`pageerror: ${err.message}`);
    });
    await page.addInitScript(() => {
        window.__cspViolations = [];
        document.addEventListener("securitypolicyviolation", (e) => {
            window.__cspViolations.push({
                directive: e.effectiveDirective,
                blockedURI: e.blockedURI,
                source: `${e.sourceFile}:${e.lineNumber}:${e.columnNumber}`,
            });
        });
    });
    return {
        errors,
        cspViolations: () => page.evaluate(() => window.__cspViolations ?? []),
    };
}
