/// <reference types="vitest/config" />
import { defineConfig } from "vite";

// Forward the game websocket to the locally running Go backend
// (go run main.go -debug -skipWSOriginCheck), for both the dev server
// (npm run dev) and the production build preview (npm run preview).
const backendProxy = {
    "/app/ws": {
        target: "ws://localhost:8080",
        ws: true,
    },
};

export default defineConfig({
    build: {
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true,
    },
    test: {
        include: ["src/**/*.test.{js,jsx,ts,tsx}"],
        // Tests needing a DOM opt in with a "@vitest-environment jsdom" comment.
        environment: "node",
    },
    server: {
        proxy: backendProxy,
    },
    preview: {
        proxy: backendProxy,
    },
});
