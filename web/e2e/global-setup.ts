import { execFileSync, execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { BACKEND_BIN_ENV, REPO_DIR, WEB_DIR } from "./paths.ts";

// Builds the Go backend once (to a temp dir) and both frontend builds.
// Set E2E_SKIP_FRONTEND_BUILD=1 to reuse existing dist/ and dist-e2e/.
export default function globalSetup(): () => void {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "archipelago-e2e-"));
    const binName = process.platform === "win32" ? "archipelago.exe" : "archipelago";
    const bin = path.join(tmpDir, binName);
    execFileSync("go", ["build", "-o", bin, "."], { cwd: REPO_DIR, stdio: "inherit" });
    process.env[BACKEND_BIN_ENV] = bin;

    if (!process.env.E2E_SKIP_FRONTEND_BUILD) {
        execSync("npm run build -- --logLevel warn", { cwd: WEB_DIR, stdio: "inherit" });
        execSync("npm run build:e2e -- --logLevel warn", { cwd: WEB_DIR, stdio: "inherit" });
    }

    return () => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    };
}
