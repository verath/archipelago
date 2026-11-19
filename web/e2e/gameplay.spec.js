import { test, expect } from "./fixtures.js";
import { gameState, myIsland, waitForGameStarted } from "./helpers.js";

test.describe("game against AI", () => {
    test.use({ backendArgs: ["-lobbyWait", "500ms"] });

    test("a single player gets a game with AI opponents that ticks", async ({ page }) => {
        await page.goto("/");
        const state = await waitForGameStarted(page);

        expect(state.connectionState).toBe("CONNECTED");
        expect(state.gameResult).toBeNull();
        // Default AI: fill up to 4 players, i.e. 3 AI opponents.
        const owners = new Set(state.islands.map((i) => i.ownerId));
        owners.delete(state.neutralPlayerId);
        expect(owners.size).toBe(4);
        expect(owners).toContain(state.myPlayerId);

        // All islands are rendered on the canvas.
        const canvas = await page.locator("canvas").boundingBox();
        for (const island of state.islands) {
            expect(island.screen).not.toBeNull();
            expect(island.screen.x).toBeGreaterThan(canvas.x);
            expect(island.screen.x).toBeLessThan(canvas.x + canvas.width);
            expect(island.screen.y).toBeGreaterThan(canvas.y);
            expect(island.screen.y).toBeLessThan(canvas.y + canvas.height);
        }

        // The model ticks: my (large) island grows by 1 every 2s.
        const mine = myIsland(state);
        await expect.poll(async () => {
            const island = (await gameState(page)).islands.find((i) => i.id === mine.id);
            return island.ownerId === state.myPlayerId ? island.strength : -1;
        }, { message: "my island's strength grows", timeout: 20_000 }).toBeGreaterThan(mine.strength);
    });
});

test.describe("launching an airplane", () => {
    // Two humans and no AI, so nothing but our airplane affects the islands.
    test.use({ backendArgs: ["-aiPlayers", "0", "-lobbyWait", "0s"] });

    test("halves my island's strength and attacks the target on arrival", async ({ page, newPlayerPage }) => {
        await page.goto("/");
        await newPlayerPage();
        const state = await waitForGameStarted(page);
        const me = state.myPlayerId;
        const origin = myIsland(state);

        // Target the nearest neutral island in sight (strength >= 0).
        const dist = (i) => Math.hypot(i.position.x - origin.position.x, i.position.y - origin.position.y);
        const targets = state.islands
            .filter((i) => i.ownerId === state.neutralPlayerId && i.strength >= 0)
            .sort((a, b) => dist(a) - dist(b));
        expect(targets.length, "a neutral island in sight").toBeGreaterThan(0);
        const target = targets[0];

        // Select my island, then click the target.
        await page.mouse.click(origin.screen.x, origin.screen.y);
        await expect.poll(async () => (await gameState(page)).islands.find((i) => i.id === origin.id).selected,
            { message: "my island is selected" }).toBe(true);
        const before = (await gameState(page)).islands.find((i) => i.id === origin.id).strength;
        await page.mouse.click(target.screen.x, target.screen.y);

        // The server confirms an airplane carrying half my island's army (my
        // island may have grown by one before the server handled the launch).
        let airplane = null;
        await expect.poll(async () => {
            airplane = (await gameState(page)).airplanes.find((a) => !a.local && a.ownerId === me) ?? null;
            return airplane != null;
        }, { message: "the server reports my airplane" }).toBe(true);
        expect(airplane.strength).toBeGreaterThanOrEqual(Math.floor(before / 2));
        expect(airplane.strength).toBeLessThanOrEqual(Math.floor((before + 1) / 2));
        const afterLaunch = (await gameState(page)).islands.find((i) => i.id === origin.id);
        expect(afterLaunch.selected).toBe(false);
        expect(afterLaunch.strength).toBeLessThan(before);
        expect(afterLaunch.strength).toBeLessThanOrEqual(Math.ceil(before / 2) + 2);

        // Airplanes fly 1 tile per 3s. Wait for the arrival.
        let arrived = null;
        await expect.poll(async () => {
            const s = await gameState(page);
            if (s.airplanes.some((a) => a.id === airplane.id)) {
                return false;
            }
            arrived = s.islands.find((i) => i.id === target.id);
            return true;
        }, { message: "my airplane arrives", timeout: 40_000 }).toBe(true);

        // Neutral armies only shrink over time, so on arrival the target had
        // at most target.strength. Airplane stronger => captured with the
        // difference; equal => neutral with 0; weaker => neutral, reduced.
        if (arrived.ownerId === me) {
            expect(airplane.strength).toBeGreaterThanOrEqual(1);
            expect(arrived.strength).toBeGreaterThanOrEqual(airplane.strength - target.strength);
            expect(arrived.strength).toBeLessThanOrEqual(airplane.strength);
        } else {
            expect(arrived.ownerId).toBe(state.neutralPlayerId);
            expect(airplane.strength).toBeLessThanOrEqual(target.strength);
            expect(arrived.strength).toBeGreaterThanOrEqual(0);
            expect(arrived.strength).toBeLessThanOrEqual(target.strength - airplane.strength);
        }
    });
});
