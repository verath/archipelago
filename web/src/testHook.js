// Read-only test hook for the end-to-end tests (web/e2e). Only called when
// built with `vite build --mode e2e`; the calls are guarded by
// `import.meta.env.MODE === "e2e"`, so production builds drop this module.

/** @type {?import("./game/view/GameView").default} */
let currentGameView = null;

/**
 * Sets the GameView whose sprites the test hook reports positions for.
 * @param {?import("./game/view/GameView").default} gameView
 */
export function setTestHookGameView(gameView) {
    currentGameView = gameView;
}

/**
 * Returns the center of an island in CSS pixels relative to the viewport (the
 * coordinates Playwright's page.mouse.click expects), or null if it is not
 * rendered.
 * @param {string} islandId
 * @returns {?{x: number, y: number}}
 */
function islandScreenPosition(islandId) {
    const gameView = currentGameView;
    if (gameView == null) {
        return null;
    }
    const sprite = gameView._islands.get(islandId);
    const canvas = gameView._renderer.canvas;
    if (sprite == null || canvas.width === 0 || canvas.height === 0) {
        return null;
    }
    // The sprite's pivot is the island center; its global position is in
    // renderer (device) pixels, the canvas is displayed at its CSS size.
    const global = sprite.getGlobalPosition();
    const rect = canvas.getBoundingClientRect();
    return {
        x: rect.left + global.x * (rect.width / canvas.width),
        y: rect.top + global.y * (rect.height / canvas.height),
    };
}

/**
 * @param {import("./game/model/OwnableModel").default} ownable
 * @returns {?string}
 */
function ownerId(ownable) {
    const owner = ownable.owner;
    return (owner != null) ? owner.id : null;
}

/**
 * Installs the read-only `window.__archipelagoTest` hook.
 * @param {function(): import("./Archipelago.jsx").ArchipelagoModel} getModel
 */
export function installTestHook(getModel) {
    const gameModel = () => getModel().gameModel;
    window.__archipelagoTest = Object.freeze({
        /** @returns {string} "CONNECTING", "CONNECTED" or "DISCONNECTED". */
        connectionState: () => getModel().connectionState,
        /** @returns {?string} */
        myPlayerId: () => gameModel()?.myPlayerId ?? null,
        /** @returns {?string} */
        neutralPlayerId: () => gameModel()?.playerNeutral.id ?? null,
        islands: () => (gameModel()?.islands ?? []).map(island => ({
            id: island.id,
            ownerId: ownerId(island),
            // Negative when the island is in fog of war.
            strength: island.strength,
            size: island.size,
            position: { x: island.position.x, y: island.position.y },
            selected: island.selected,
            screen: islandScreenPosition(island.id),
        })),
        airplanes: () => (gameModel()?.airplanes ?? []).map(airplane => ({
            id: airplane.id,
            ownerId: ownerId(airplane),
            strength: airplane.strength,
            // Airplanes created locally until the server confirms them.
            local: airplane.id.startsWith("local-"),
        })),
        /** @returns {?import("./Archipelago.jsx").GameResult} */
        gameResult: () => {
            const result = getModel().gameResult;
            return (result != null) ? { ...result } : null;
        },
    });
}
