import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true,
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
