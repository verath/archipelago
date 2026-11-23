import { test, expect } from "./fixtures.ts";
import { clickPlay, gameState, waitForGameStarted } from "./helpers.ts";

test.describe("Play button", () => {
    // With AI players, a single client gets a game once the lobby wait is
    // over, so a client that connected on load would be in a game by now.
    test.use({ backendArgs: ["-lobbyWait", "2s"] });

    test("players who click Play together get the same game, however long they waited before", async ({ page, newPlayerPage, backend }) => {
        await page.goto("/");
        const page2 = await newPlayerPage({ navigate: false });
        await page2.goto("/");
        for (const p of [page, page2]) {
            await expect(p.getByRole("button", { name: "Play!" })).toBeVisible();
            // A made-up game plays behind the button.
            await expect(p.locator(".lobby-background canvas")).toBeVisible();
        }

        // Wait for longer than the lobby wait: nobody connects before Play.
        await page.waitForTimeout(3_000);
        for (const p of [page, page2]) {
            expect((await gameState(p))!.connectionState).toBe("IDLE");
            await expect(p.getByRole("button", { name: "Play!" })).toBeVisible();
        }
        expect(backend.logs()).not.toContain("awaitClients: new client");

        await clickPlay(page);
        await clickPlay(page2);
        const state1 = await waitForGameStarted(page);
        const state2 = await waitForGameStarted(page2);
        // The same game: each sees the other's starting island.
        expect(state2.myPlayerId).not.toBe(state1.myPlayerId);
        const owners = new Set(state1.islands.map((i) => i.ownerId));
        expect(owners).toContain(state2.myPlayerId);
        // The made-up game is gone once the real one has started.
        for (const p of [page, page2]) {
            await expect(p.locator(".lobby-background")).toHaveCount(0);
            await expect(p.locator("canvas")).toHaveCount(1);
        }
    });
});
