import { test, expect } from "./fixtures.ts";
import { openAndPlay } from "./helpers.ts";

/**
 * Parses the backend's "client traffic" log lines (logged when a websocket
 * client disconnects) into key/value records.
 */
function clientTrafficLogs(logs: string): Record<string, string>[] {
    return logs.split("\n")
        .filter((line) => line.includes("msg=\"client traffic\""))
        .map((line) => Object.fromEntries(
            [...line.matchAll(/(\w+)=("[^"]*"|\S+)/g)].map(([, k, v]) => [k, v.replace(/^"|"$/g, "")]),
        ));
}

test.describe("websocket traffic", () => {
    // Production build, so the request goes through the same headers and
    // proxying as in the smoke test.
    test.use({ frontend: "production", backendArgs: ["-lobbyWait", "0s"] });

    test("uses protocol version 5 with permessage-deflate, and is small", async ({ page, backend }) => {
        // The websocket handshake response headers are only visible via CDP.
        const cdp = await page.context().newCDPSession(page);
        await cdp.send("Network.enable");
        const handshake = new Promise<{ url: string, headers: Record<string, string> }>((resolve) => {
            let url = "";
            cdp.on("Network.webSocketCreated", (evt) => { url = evt.url; });
            cdp.on("Network.webSocketHandshakeResponseReceived", (evt) => resolve({ url, headers: evt.response.headers }));
        });

        await openAndPlay(page);
        const { url, headers } = await handshake;
        expect(new URL(url).searchParams.get("v")).toBe("5");
        const extensions = Object.entries(headers)
            .find(([name]) => name.toLowerCase() === "sec-websocket-extensions")?.[1] ?? "";
        expect(extensions).toContain("permessage-deflate");

        // Watch a few seconds of ticks, then disconnect so that the backend
        // logs the traffic of the connection.
        await expect(page.locator(".game-canvas canvas")).toBeVisible();
        await page.waitForTimeout(3_000);
        await page.close();

        await expect.poll(() => clientTrafficLogs(backend.logs()).length, {
            message: "backend logs the client's traffic",
        }).toBe(1);
        const [traffic] = clientTrafficLogs(backend.logs());
        const messages = Number(traffic.msgsOut);
        const wireBytes = Number(traffic.wireBytesOut);
        // Game start, snapshot and ~3 deltas a second.
        expect(messages).toBeGreaterThan(5);
        // The full state of this game (4 players) is ~1 KB, sent once as a
        // snapshot (~0.6 KB compressed), then deltas of mostly < 128 B. Incl. the upgrade response, that averages well below
        // 300 B per message over a few seconds.
        expect(wireBytes / messages).toBeLessThan(300);
    });
});
