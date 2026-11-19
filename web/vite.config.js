import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true,
    },
    test: {
        include: ["src/**/*.test.{js,jsx}"],
        // Tests needing a DOM opt in with a "@vitest-environment jsdom" comment.
        environment: "node",
    },
    server: {
        proxy: {
            // Forward the game websocket to the locally running Go backend
            // (go run main.go -debug -serveStatic -skipWSOriginCheck).
            "/app/ws": {
                target: "ws://localhost:8080",
                ws: true,
            },
        },
    },
});
