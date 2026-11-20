import { test, expect } from "./fixtures.ts";
import { gameState, waitForGameStarted, type GameState } from "./helpers.ts";

/** The islands' owners and strengths, to see that the game goes on. */
const islandsKey = (state: GameState): string =>
    JSON.stringify(state.islands.map((i) => [i.id, i.ownerId, i.strength]));

test.describe("network drop", () => {
    // A game against AI, which goes on while we are disconnected.
    test.use({ backendArgs: ["-lobbyWait", "500ms", "-resumeGrace", "20s"] });

    test("the game resumes on a new connection when the connection breaks", async ({ page, backend, network }) => {
        await page.goto("/");
        const before = await waitForGameStarted(page);

        network.dropConnections();

        await expect.poll(() => backend.logs().includes("client resumed session"), {
            message: "the backend resumes the session",
        }).toBe(true);
        await expect.poll(async () => (await gameState(page))!.connectionState).toBe("CONNECTED");
        const after = (await gameState(page))!;
        expect(after.myPlayerId).toBe(before.myPlayerId);
        expect(after.gameResult).toBeNull();

        // The game goes on: islands grow (and shrink) every few seconds.
        await expect.poll(async () => islandsKey((await gameState(page))!), {
            message: "the game state changes after resuming", timeout: 20_000,
        }).not.toBe(islandsKey(after));
        await expect(page.getByText("Game Over")).toHaveCount(0);
    });

    test("shows that it is reconnecting while the network is down", async ({ page, network }) => {
        await page.goto("/");
        const before = await waitForGameStarted(page);

        network.setOffline(true);
        await expect(page.getByText("Reconnecting")).toBeVisible();
        expect((await gameState(page))!.connectionState).toBe("RECONNECTING");
        await page.waitForTimeout(3_000);
        network.setOffline(false);

        await expect(page.getByText("Reconnecting")).toHaveCount(0);
        await expect.poll(async () => (await gameState(page))!.connectionState).toBe("CONNECTED");
        const after = (await gameState(page))!;
        expect(after.myPlayerId).toBe(before.myPlayerId);
        expect(after.gameResult).toBeNull();
        await expect(page.getByText("Game Over")).toHaveCount(0);
    });
});
