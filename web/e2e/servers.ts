import { spawn } from "node:child_process";
import fs from "node:fs";
import net, { type AddressInfo } from "node:net";
import path from "node:path";
import { preview } from "vite";

import { BACKEND_BIN_ENV, DIST_DIR, REPO_DIR, WEB_DIR } from "./paths.ts";

const HOST = "127.0.0.1";
const BACKEND_START_TIMEOUT_MS = 15_000;
const START_ATTEMPTS = 5;
const HEALTHCHECK_TIMEOUT_MS = 2_000;
const BIND_GRACE_MS = 200;

/**
 * Returns a currently free TCP port on HOST.
 */
function getFreePort(): Promise<number> {
    return new Promise((resolve, reject) => {
        const srv = net.createServer();
        srv.unref();
        srv.on("error", reject);
        srv.listen(0, HOST, () => {
            // address() is an AddressInfo for a server listening on a TCP
            // port (a string only for pipes and sockets, null if not listening).
            const { port } = srv.address() as AddressInfo;
            srv.close(() => resolve(port));
        });
    });
}

export interface Backend {
    /**
     * Base URL, e.g. http://127.0.0.1:1234
     */
    url: string;
    port: number;
    /**
     * Backend stdout and stderr so far.
     */
    logs: () => string;
    /**
     * Kills the backend (SIGKILL, like a crash; idempotent) and waits for it
     * to exit.
     */
    stop: () => Promise<void>;
}

/**
 * Starts the Go backend built by global-setup.ts on a free port and waits
 * until it answers its healthcheck. Retries on another port if the backend
 * exits early (e.g. the port was taken between picking and binding it).
 * @param args Extra backend flags.
 */
export async function startBackend(args: string[]): Promise<Backend> {
    const bin = process.env[BACKEND_BIN_ENV];
    if (!bin) {
        throw new Error(`${BACKEND_BIN_ENV} not set; is e2e/global-setup.ts configured?`);
    }
    let lastErr: unknown;
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

async function startBackendOnPort(bin: string, port: number, args: string[]): Promise<Backend> {
    const child = spawn(bin, ["-debug", "-skipWSOriginCheck", "-addr", `${HOST}:${port}`, ...args], {
        cwd: REPO_DIR,
        stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (d: Buffer) => { output += d; });
    child.stderr.on("data", (d: Buffer) => { output += d; });
    const exited = new Promise<void>((resolve) => {
        child.once("exit", () => resolve());
        child.once("error", (err) => { output += `spawn error: ${err}\n`; resolve(); });
    });
    let hasExited = false;
    exited.then(() => { hasExited = true; });

    const stop = async (): Promise<void> => {
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
                await Promise.race([exited, new Promise<void>((r) => setTimeout(r, BIND_GRACE_MS))]);
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
        await Promise.race([exited, new Promise<void>((r) => setTimeout(r, 50))]);
    }
    return { url, port, logs: () => output, stop };
}

/**
 * The parts of web/firebase.json that firebaseHeaders reads.
 */
interface FirebaseConfig {
    hosting: {
        headers: {
            source: string;
            headers: { key: string; value: string }[];
        }[];
    };
}

/**
 * Returns the headers Firebase Hosting sends for every path ("**") as
 * configured in web/firebase.json, incl. the Content-Security-Policy.
 */
export function firebaseHeaders(): Record<string, string> {
    // Not validated: firebase.json is our own file, and Firebase checks it on
    // deploy. A wrong shape fails the tests with a TypeError.
    const config = JSON.parse(fs.readFileSync(path.join(WEB_DIR, "firebase.json"), "utf8")) as FirebaseConfig;
    const headers: Record<string, string> = {};
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

export interface PreviewServer {
    url: string;
    stop: () => Promise<void>;
}

/**
 * Serves a frontend build with vite preview, the way Firebase Hosting serves
 * production: with the Firebase Hosting headers (incl. the CSP), and with
 * /app/ws proxied to the backend.
 * @param outDir The build to serve, e.g. DIST_DIR.
 */
export async function startPreview(backend: Backend, outDir: string): Promise<PreviewServer> {
    let lastErr: unknown;
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
