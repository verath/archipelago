import { test as base, expect } from "@playwright/test";

import { DIST_DIR, DIST_E2E_DIR } from "./paths.js";
import { startBackend, startPreview } from "./servers.js";

/**
 * Test fixtures. Every test gets its own Go backend, so games never mix
 * between tests. Options (set with test.use):
 * - backendArgs: extra backend flags, e.g. ["-aiPlayers", "0"].
 * - frontend: "e2e" (default) serves the test build (with the test hook);
 *   "production" serves the production build. Both are served by vite
 *   preview with the Firebase headers (incl. CSP) and a /app/ws proxy.
 *
 * Fixtures:
 * - backend: the running backend (see servers.js), e.g. backend.stop().
 * - baseURL: the frontend URL, so page.goto("/") opens the game.
 * - newPlayerPage({navigate = true}): a page for another player, in a new
 *   browser context; opens the game unless navigate is false.
 */
export const test = base.extend({
    backendArgs: [[], { option: true }],
    frontend: ["e2e", { option: true }],

    backend: async ({ backendArgs }, use, testInfo) => {
        const backend = await startBackend(backendArgs);
        try {
            await use(backend);
        } finally {
            await backend.stop();
            if (testInfo.status !== testInfo.expectedStatus) {
                await testInfo.attach("backend.log", { body: backend.logs(), contentType: "text/plain" });
            }
        }
    },

    baseURL: async ({ backend, frontend }, use) => {
        const previewServer = await startPreview(backend, frontend === "e2e" ? DIST_E2E_DIR : DIST_DIR);
        try {
            await use(previewServer.url);
        } finally {
            await previewServer.stop();
        }
    },

    newPlayerPage: async ({ browser, baseURL }, use) => {
        const contexts = [];
        await use(async ({ navigate = true } = {}) => {
            const context = await browser.newContext({ baseURL });
            contexts.push(context);
            const page = await context.newPage();
            if (navigate) {
                await page.goto("/");
            }
            return page;
        });
        await Promise.all(contexts.map((c) => c.close()));
    },
});

export { expect };
