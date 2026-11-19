import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { preview } from "vite";

import { BACKEND_BIN_ENV, DIST_DIR, REPO_DIR, WEB_DIR } from "./paths.js";

const HOST = "127.0.0.1";
const BACKEND_START_TIMEOUT_MS = 15_000;
const START_ATTEMPTS = 5;
const HEALTHCHECK_TIMEOUT_MS = 2_000;
const BIND_GRACE_MS = 200;

/**
 * Returns a currently free TCP port on HOST.
 * @returns {Promise<number>}
 */
function getFreePort() {
    return new Promise((resolve, reject) => {
        const srv = net.createServer();
        srv.unref();
        srv.on("error", reject);
        srv.listen(0, HOST, () => {
            const { port } = srv.address();
            srv.close(() => resolve(port));
        });
    });
}

/**
 * @typedef Backend
 * @property {string} url Base URL, e.g. http://127.0.0.1:1234
 * @property {number} port
 * @property {function(): string} logs Backend stdout and stderr so far.
 * @property {function(): Promise<void>} stop Kills the backend (SIGKILL, like
 *     a crash; idempotent) and waits for it to exit.
 */

/**
 * Starts the Go backend built by global-setup.js on a free port and waits
 * until it answers its healthcheck. Retries on another port if the backend
 * exits early (e.g. the port was taken between picking and binding it).
 * @param {string[]} args Extra backend flags.
 * @returns {Promise<Backend>}
 */
export async function startBackend(args) {
    const bin = process.env[BACKEND_BIN_ENV];
    if (!bin) {
        throw new Error(`${BACKEND_BIN_ENV} not set; is e2e/global-setup.js configured?`);
    }
    let lastErr;
    for (let attempt = 0; attempt < START_ATTEMPTS; attempt++) {
        const port = await getFreePort();
        try {
            return await startBackendOnPort(bin, port, args);
        } catch (err) {
            lastErr = err;
        }
    }
    throw lastErr;
}

/**
 * @param {string} bin
 * @param {number} port
 * @param {string[]} args
 * @returns {Promise<Backend>}
 */
async function startBackendOnPort(bin, port, args) {
    const child = spawn(bin, ["-debug", "-skipWSOriginCheck", "-addr", `${HOST}:${port}`, ...args], {
        cwd: REPO_DIR,
        stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (d) => { output += d; });
    child.stderr.on("data", (d) => { output += d; });
    const exited = new Promise((resolve) => {
        child.once("exit", () => resolve());
        child.once("error", (err) => { output += `spawn error: ${err}\n`; resolve(); });
    });
    let hasExited = false;
    exited.then(() => { hasExited = true; });

    const stop = async () => {
        if (!hasExited) {
            child.kill("SIGKILL");
        }
        await exited;
    };
    const url = `http://${HOST}:${port}`;
    const deadline = Date.now() + BACKEND_START_TIMEOUT_MS;
    for (;;) {
        if (hasExited) {
            throw new Error(`backend exited during startup:\n${output}`);
        }
        try {
            const res = await fetch(`${url}/healthcheck`, { signal: AbortSignal.timeout(HEALTHCHECK_TIMEOUT_MS) });
            if (res.ok) {
                // Another process may have taken the port between picking and
                // binding it, in which case it answered instead of our backend,
                // which then exits with a bind error. Give that a moment to
                // show, so startBackend retries on another port.
                await Promise.race([exited, new Promise((r) => setTimeout(r, BIND_GRACE_MS))]);
                if (hasExited) {
                    throw new Error(`backend exited during startup:\n${output}`);
                }
                break;
            }
        } catch (err) {
            if (hasExited) {
                throw err;
            }
            // Not listening yet.
        }
        if (Date.now() > deadline) {
            await stop();
            throw new Error(`backend did not become healthy:\n${output}`);
        }
        await Promise.race([exited, new Promise((r) => setTimeout(r, 50))]);
    }
    return { url, port, logs: () => output, stop };
}

/**
 * Returns the headers Firebase Hosting sends for every path ("**") as
 * configured in web/firebase.json, incl. the Content-Security-Policy.
 * @returns {Record<string, string>}
 */
export function firebaseHeaders() {
    const config = JSON.parse(fs.readFileSync(path.join(WEB_DIR, "firebase.json"), "utf8"));
    const headers = {};
    for (const entry of config.hosting.headers) {
        if (entry.source !== "**") {
            continue;
        }
        for (const { key, value } of entry.headers) {
            headers[key] = value;
        }
    }
    if (!headers["Content-Security-Policy"]) {
        throw new Error("firebase.json has no Content-Security-Policy for **");
    }
    return headers;
}

/**
 * @typedef PreviewServer
 * @property {string} url
 * @property {function(): Promise<void>} stop
 */

/**
 * Serves a frontend build with vite preview, the way Firebase Hosting serves
 * production: with the Firebase Hosting headers (incl. the CSP), and with
 * /app/ws proxied to the backend.
 * @param {Backend} backend
 * @param {string} outDir The build to serve, e.g. DIST_DIR.
 * @returns {Promise<PreviewServer>}
 */
export async function startPreview(backend, outDir) {
    let lastErr;
    for (let attempt = 0; attempt < START_ATTEMPTS; attempt++) {
        const port = await getFreePort();
        try {
            const server = await preview({
                root: WEB_DIR,
                configFile: false,
                logLevel: "warn",
                build: { outDir },
                preview: {
                    host: HOST,
                    port,
                    strictPort: true,
                    open: false,
                    headers: firebaseHeaders(),
                    proxy: {
                        "/app/ws": {
                            target: `ws://${HOST}:${backend.port}`,
                            ws: true,
                        },
                    },
                },
            });
            return {
                url: `http://${HOST}:${port}`,
                stop: () => server.close(),
            };
        } catch (err) {
            lastErr = err;
        }
    }
    throw lastErr;
}
