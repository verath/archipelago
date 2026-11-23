import { expect, type Page, type Response } from "@playwright/test";

import type { ArchipelagoTestHook, TestHookIsland } from "../src/testHook.ts";

/**
 * A snapshot of the game, as reported by window.__archipelagoTest: the result
 * of each of its functions.
 */
export type GameState = {
    -readonly [K in keyof ArchipelagoTestHook]: ReturnType<ArchipelagoTestHook[K]>;
};

/**
 * Reads a snapshot of the game from window.__archipelagoTest (test build).
 * Resolves to null if the hook is not installed yet.
 */
export function gameState(page: Page): Promise<GameState | null> {
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
 * Opens the game and clicks "Play!" to join the next game, resolving to the
 * page's response.
 */
export async function openAndPlay(page: Page): Promise<Response> {
    // Non-null: goto returns null only for same-document navigations.
    const response = (await page.goto("/"))!;
    await clickPlay(page);
    return response;
}

/**
 * Clicks "Play!" on a page that shows it, which connects and joins the next
 * game.
 */
export async function clickPlay(page: Page): Promise<void> {
    await page.getByRole("button", { name: "Play!" }).click();
}

/**
 * Returns the island owned by me with the highest strength, if any.
 */
export function myIsland(state: GameState): TestHookIsland | null {
    const mine = state.islands.filter((i) => i.ownerId === state.myPlayerId);
    mine.sort((a, b) => b.strength - a.strength);
    return mine[0] ?? null;
}

/**
 * Waits until the game has started and is rendered: my player id is known,
 * islands are in the model, mine has a screen position on the canvas.
 */
export async function waitForGameStarted(page: Page): Promise<GameState> {
    let state: GameState | null = null;
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
    // The poll passed, so the last gameState call returned a started game.
    return state!;
}

export interface CSPViolation {
    /**
     * The effective directive, e.g. "script-src".
     */
    directive: string;
    /**
     * E.g. a URL, "inline", "eval" or "wasm-eval".
     */
    blockedURI: string;
    /**
     * file:line:column of the violation.
     */
    source: string;
}

declare global {
    interface Window {
        /**
         * Installed by collectPageProblems.
         */
        __cspViolations?: CSPViolation[];
    }
}

export interface PageProblems {
    errors: string[];
    cspViolations: () => Promise<CSPViolation[]>;
}

/**
 * Collects console errors, page errors and CSP violations of a page. Must
 * be called before the page navigates.
 */
export async function collectPageProblems(page: Page): Promise<PageProblems> {
    const errors: string[] = [];
    page.on("console", (msg) => {
        if (msg.type() === "error") {
            errors.push(`console.error: ${msg.text()}`);
        }
    });
    page.on("pageerror", (err) => {
        errors.push(`pageerror: ${err.message}`);
    });
    await page.addInitScript(() => {
        const violations: CSPViolation[] = [];
        window.__cspViolations = violations;
        document.addEventListener("securitypolicyviolation", (e) => {
            violations.push({
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
