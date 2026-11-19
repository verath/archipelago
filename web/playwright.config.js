import { defineConfig, devices } from "@playwright/test";

// End-to-end tests: each test starts its own Go backend (see e2e/fixtures.js)
// and drives headless Chromium against the production build (served by
// vite preview with the Firebase headers) or the e2e test build (served by
// the backend). e2e/global-setup.js builds the backend and both frontends.
export default defineConfig({
    testDir: "e2e",
    globalSetup: "./e2e/global-setup.js",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    // Games use random maps and AI, so allow one retry on CI; a retried pass
    // is still reported as "flaky".
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,
    timeout: 60_000,
    expect: { timeout: 15_000 },
    reporter: process.env.CI
        ? [["list"], ["html", { open: "never" }], ["github"]]
        : [["list"], ["html", { open: "never" }]],
    use: {
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
