import path from "node:path";
import { fileURLToPath } from "node:url";

export const WEB_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const REPO_DIR = path.resolve(WEB_DIR, "..");
// Production build, exactly what Firebase Hosting serves (npm run build).
export const DIST_DIR = path.join(WEB_DIR, "dist");
// Test build including window.__archipelagoTest (npm run build:e2e).
export const DIST_E2E_DIR = path.join(WEB_DIR, "dist-e2e");

// Set by global-setup.js, inherited by the test workers.
export const BACKEND_BIN_ENV = "ARCHIPELAGO_E2E_BACKEND_BIN";
