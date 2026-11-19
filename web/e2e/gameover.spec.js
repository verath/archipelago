import { test, expect } from "./fixtures.js";
import { gameState, waitForGameStarted } from "./helpers.js";

test.describe("human vs human", () => {
    test.use({ backendArgs: ["-aiPlayers", "0", "-lobbyWait", "2s"] });

    test("the remaining player wins when the other one leaves", async ({ page, newPlayerPage }) => {
        await page.goto("/");
        const page2 = await newPlayerPage();
        const state1 = await waitForGameStarted(page);
        const state2 = await waitForGameStarted(page2);
        // Both are in the same game, against each other only.
        expect(state2.myPlayerId).not.toBe(state1.myPlayerId);
        const players = new Set(state1.islands.map((i) => i.ownerId));
        players.delete(state1.neutralPlayerId);
        expect([...players].sort()).toEqual([state1.myPlayerId, state2.myPlayerId].sort());

        await page2.close();

        await expect(page.getByText("Game Over")).toBeVisible();
        await expect(page.getByText("You Won!")).toBeVisible();
        expect((await gameState(page)).gameResult)
            .toEqual({ reason: "GAME_OVER", winnerId: state1.myPlayerId });
    });
});

test.describe("server gone", () => {
    test.use({ backendArgs: ["-lobbyWait", "500ms"] });

    test("stopping the backend mid-game ends the game instead of hanging", async ({ page, backend }) => {
        await page.goto("/");
        await waitForGameStarted(page);

        await backend.stop();

        await expect(page.getByText("Game Over")).toBeVisible();
        await expect.poll(async () => (await gameState(page)).connectionState).toBe("DISCONNECTED");
        // Connection loss is reported as a game over without a winner.
        expect((await gameState(page)).gameResult).toEqual({ reason: "GAME_OVER", winnerId: "" });
        await expect(page.getByText("You Lost!")).toBeVisible();
    });
});
