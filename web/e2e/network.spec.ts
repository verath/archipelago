import { test, expect } from "./fixtures.ts";

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

    test("is compressed with permessage-deflate", async ({ page, backend }) => {
        // The websocket handshake response headers are only visible via CDP.
        const cdp = await page.context().newCDPSession(page);
        await cdp.send("Network.enable");
        const handshake = new Promise<Record<string, string>>((resolve) => {
            cdp.on("Network.webSocketHandshakeResponseReceived", (evt) => resolve(evt.response.headers));
        });

        await page.goto("/");
        const headers = await handshake;
        const extensions = Object.entries(headers)
            .find(([name]) => name.toLowerCase() === "sec-websocket-extensions")?.[1] ?? "";
        expect(extensions).toContain("permessage-deflate");

        // Play (well, watch) a few seconds of ticks, then disconnect so that
        // the backend logs the traffic of the connection.
        await expect(page.locator("canvas")).toBeVisible();
        await page.waitForTimeout(2_000);
        await page.close();

        await expect.poll(() => clientTrafficLogs(backend.logs()).length, {
            message: "backend logs the client's traffic",
        }).toBe(1);
        const [traffic] = clientTrafficLogs(backend.logs());
        expect(Number(traffic.msgsOut)).toBeGreaterThan(3);
        const payloadBytes = Number(traffic.payloadBytesOut);
        const wireBytes = Number(traffic.wireBytesOut);
        expect(payloadBytes).toBeGreaterThan(1_000);
        // Ticks deflate to ~55% on their own; leave room for the upgrade
        // response and framing.
        expect(wireBytes).toBeLessThan(payloadBytes * 0.8);
    });
});
