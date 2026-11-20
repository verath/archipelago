// Read-only test hook for the end-to-end tests (web/e2e). Only called when
// built with `vite build --mode e2e`; the calls are guarded by
// `import.meta.env.MODE === "e2e"`, so production builds drop this module.

import type { ArchipelagoModel, ConnectionState } from "./Archipelago.tsx";
import type { GameResult } from "./game/controller/GameController.ts";
import type OwnableModel from "./game/model/OwnableModel.ts";
import type GameView from "./game/view/GameView.ts";

/**
 * A position, in tiles for model positions and in CSS pixels for screen
 * positions.
 */
export interface TestHookPosition {
    x: number;
    y: number;
}

export interface TestHookIsland {
    id: string | null;
    ownerId: string | null;
    /**
     * Negative when the island is in fog of war.
     */
    strength: number;
    size: number;
    position: TestHookPosition;
    selected: boolean;
    /**
     * The island's center in CSS pixels relative to the viewport, or null
     * if it is not rendered.
     */
    screen: TestHookPosition | null;
}

export interface TestHookAirplane {
    id: string | null;
    ownerId: string | null;
    strength: number;
    /**
     * The displayed position, in tiles.
     */
    position: TestHookPosition;
    /**
     * True for airplanes created locally until the server confirms them.
     */
    local: boolean;
}

/**
 * The shape of the read-only `window.__archipelagoTest` hook.
 */
export interface ArchipelagoTestHook {
    readonly connectionState: () => ConnectionState;
    readonly myPlayerId: () => string | null;
    readonly neutralPlayerId: () => string | null;
    readonly islands: () => TestHookIsland[];
    readonly airplanes: () => TestHookAirplane[];
    readonly gameResult: () => GameResult | null;
}

declare global {
    interface Window {
        /**
         * Installed by installTestHook, in e2e builds only.
         */
        __archipelagoTest?: ArchipelagoTestHook;
    }
}

let currentGameView: GameView | null = null;

/**
 * Sets the GameView whose sprites the test hook reports positions for.
 */
export function setTestHookGameView(gameView: GameView | null): void {
    currentGameView = gameView;
}

/**
 * Returns the center of an island in CSS pixels relative to the viewport (the
 * coordinates Playwright's page.mouse.click expects), or null if it is not
 * rendered.
 */
function islandScreenPosition(islandId: string | null): TestHookPosition | null {
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

function ownerId(ownable: OwnableModel): string | null {
    const owner = ownable.owner;
    return (owner != null) ? owner.id : null;
}

/**
 * Installs the read-only `window.__archipelagoTest` hook.
 */
export function installTestHook(getModel: () => ArchipelagoModel): void {
    const gameModel = () => getModel().gameModel;
    window.__archipelagoTest = Object.freeze({
        connectionState: () => getModel().connectionState,
        myPlayerId: () => gameModel()?.myPlayerId ?? null,
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
            position: { x: airplane.position.x, y: airplane.position.y },
            // Airplanes created locally until the server confirms them.
            local: airplane.id?.startsWith("local-") ?? false,
        })),
        gameResult: () => {
            const result = getModel().gameResult;
            return (result != null) ? { ...result } : null;
        },
    } satisfies ArchipelagoTestHook);
}
