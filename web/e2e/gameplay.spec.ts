import type { TestHookAirplane, TestHookIsland } from "../src/testHook.ts";
import { test, expect } from "./fixtures.ts";
import { gameState, myIsland, openAndPlay, waitForGameStarted } from "./helpers.ts";

// Non-null assertions (!) below: gameState is non-null once the game has
// started (the test hook is installed), waitForGameStarted waited for
// myIsland and its screen position, and islands and airplanes are looked up
// by ids the test got from the game. If one is wrong, the test fails with a
// TypeError, as it did in JavaScript.

test.describe("game against AI", () => {
    test.use({ backendArgs: ["-lobbyWait", "500ms"] });

    test("a single player gets a game with AI opponents that ticks", async ({ page }) => {
        await openAndPlay(page);
        const state = await waitForGameStarted(page);

        expect(state.connectionState).toBe("CONNECTED");
        expect(state.gameResult).toBeNull();
        // Default AI: fill up to 4 players, i.e. 3 AI opponents.
        const owners = new Set(state.islands.map((i) => i.ownerId));
        owners.delete(state.neutralPlayerId);
        expect(owners.size).toBe(4);
        expect(owners).toContain(state.myPlayerId);
        // Starting islands have a garrison, other islands none.
        for (const island of state.islands) {
            expect(island.garrison).toBe(island.ownerId === state.neutralPlayerId ? 0 : 20);
        }

        // All islands are rendered on the canvas (so it has a bounding box).
        const canvas = (await page.locator("canvas").boundingBox())!;
        for (const island of state.islands) {
            expect(island.screen).not.toBeNull();
            const screen = island.screen!;
            expect(screen.x).toBeGreaterThan(canvas.x);
            expect(screen.x).toBeLessThan(canvas.x + canvas.width);
            expect(screen.y).toBeGreaterThan(canvas.y);
            expect(screen.y).toBeLessThan(canvas.y + canvas.height);
        }

        // The model ticks: my (large) island grows by 1 every 2s.
        const mine = myIsland(state)!;
        await expect.poll(async () => {
            const island = (await gameState(page))!.islands.find((i) => i.id === mine.id)!;
            return island.ownerId === state.myPlayerId ? island.strength : -1;
        }, { message: "my island's strength grows", timeout: 20_000 }).toBeGreaterThan(mine.strength);
    });
});

test.describe("launching an airplane", () => {
    // Two humans and no AI, so nothing but our airplane affects the islands.
    test.use({ backendArgs: ["-aiPlayers", "0", "-lobbyWait", "0s"] });

    test("halves my island's strength and attacks the target on arrival", async ({ page, newPlayerPage }) => {
        await openAndPlay(page);
        await newPlayerPage();
        const state = await waitForGameStarted(page);
        const me = state.myPlayerId;
        const origin = myIsland(state)!;

        // Target the farthest neutral island in sight (strength >= 0; a
        // large island sees 2 tiles around it), so that the airplane flies
        // for several seconds (1 tile per 3s) while we sample it below.
        const dist = (i: TestHookIsland) => Math.hypot(i.position.x - origin.position.x, i.position.y - origin.position.y);
        const targets = state.islands
            .filter((i) => i.ownerId === state.neutralPlayerId && i.strength >= 0)
            .sort((a, b) => dist(b) - dist(a));
        expect(targets.length, "a neutral island in sight").toBeGreaterThan(0);
        const target = targets[0];

        // Select my island, then click the target.
        await page.mouse.click(origin.screen!.x, origin.screen!.y);
        await expect.poll(async () => (await gameState(page))!.islands.find((i) => i.id === origin.id)!.selected,
            { message: "my island is selected" }).toBe(true);
        const before = (await gameState(page))!.islands.find((i) => i.id === origin.id)!.strength;
        await page.mouse.click(target.screen!.x, target.screen!.y);

        // The server confirms an airplane carrying half my island's army (my
        // island may have grown by one before the server handled the launch).
        let reported: TestHookAirplane | null = null;
        await expect.poll(async () => {
            reported = (await gameState(page))!.airplanes.find((a) => !a.local && a.ownerId === me) ?? null;
            return reported != null;
        }, { message: "the server reports my airplane" }).toBe(true);
        // The poll passed, so its last call found my airplane.
        const airplane = reported!;
        expect(airplane.strength).toBeGreaterThanOrEqual(Math.floor(before / 2));
        expect(airplane.strength).toBeLessThanOrEqual(Math.floor((before + 1) / 2));
        const afterLaunch = (await gameState(page))!.islands.find((i) => i.id === origin.id)!;
        expect(afterLaunch.selected).toBe(false);
        expect(afterLaunch.strength).toBeLessThan(before);
        expect(afterLaunch.strength).toBeLessThanOrEqual(Math.ceil(before / 2) + 2);

        // The client moves the airplane itself: the server sends an airplane
        // once (later deltas only update its army), so any movement between
        // frames is the client's. Sampled on a number of animation frames,
        // not for a fixed time: headless Chromium renders WebGL in software,
        // and on a busy CI runner frames can be 100-500 ms apart. Sampled in
        // the page, as a gameState() round trip can take longer than a frame.
        //
        // First let the correction from the replaced local airplane fade
        // (time constant 150 ms, see AirplaneModel), as it can briefly move
        // the airplane back when the local one was ahead.
        const distances = await page.evaluate(({ id, target }) => new Promise<number[]>((resolve) => {
            const FRAMES = 8;
            const samples: number[] = [];
            const start = performance.now() + 500;
            const end = start + 5_000;
            const sample = () => {
                const now = performance.now();
                const a = window.__archipelagoTest!.airplanes().find((p) => p.id === id);
                if (a == null || samples.length >= FRAMES || now > end) {
                    resolve(samples); // Done, or arrived already.
                    return;
                }
                if (now >= start) {
                    samples.push(Math.hypot(a.position.x - target.x, a.position.y - target.y));
                }
                requestAnimationFrame(sample);
            };
            requestAnimationFrame(sample);
        }), { id: airplane.id, target: target.position });
        expect(distances.length, "frames sampled before arrival").toBeGreaterThanOrEqual(3);
        for (let i = 1; i < distances.length; i++) {
            expect(distances[i], `distance ${i} <= distance ${i - 1}: ${distances}`).toBeLessThanOrEqual(distances[i - 1]);
        }
        // A frame may render before the airplane moved (e.g. the first one),
        // but most frames move it.
        expect(new Set(distances).size, `distinct distances: ${distances}`).toBeGreaterThanOrEqual(Math.min(3, distances.length));

        // Airplanes fly 1 tile per 3s. Wait for the arrival.
        let landed: TestHookIsland | undefined;
        await expect.poll(async () => {
            const s = (await gameState(page))!;
            if (s.airplanes.some((a) => a.id === airplane.id)) {
                return false;
            }
            landed = s.islands.find((i) => i.id === target.id);
            return true;
        }, { message: "my airplane arrives", timeout: 40_000 }).toBe(true);
        // The poll passed, so its last call found the target after the arrival.
        const arrived = landed!;

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
