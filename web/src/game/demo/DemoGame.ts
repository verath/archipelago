import GameModel from "../model/GameModel.ts";
import DemoSimulation, { DEMO_TICK, SPECTATOR_ID, type Random } from "./DemoSimulation.ts";

/**
 * [ms] A longer frame than this (e.g. after the tab was in the background,
 * when browsers pause animation frames) only advances the game this much,
 * so that it doesn't jump.
 */
const MAX_FRAME_DELTA = 250;

/**
 * [CSS px] The range of tile sizes on screen, see demoBoardSize.
 */
const MIN_TILE_SIZE = 90;
const MAX_TILE_SIZE = 160;

/**
 * Returns a board size (in tiles) with about the aspect ratio of a screen of
 * the given size [CSS px], with tiles of a size that suits it: about 5 tiles
 * across the shorter side, more on large screens.
 */
export function demoBoardSize(width: number, height: number): { cols: number, rows: number } {
    const tileSize = Math.min(Math.max(Math.min(width, height) / 5, MIN_TILE_SIZE), MAX_TILE_SIZE);
    return {
        cols: Math.max(3, Math.round(width / tileSize)),
        rows: Math.max(3, Math.round(height / tileSize)),
    };
}

/**
 * Runs a DemoSimulation and shows it in a GameModel, for a GameView to
 * render, as GameController does for a real game.
 */
export default class DemoGame {

    private readonly _simulation: DemoSimulation;

    /**
     * [ms] The time the game has been running, which the model's clock
     * follows.
     */
    private _elapsed = 0;

    readonly model: GameModel;

    constructor(cols: number, rows: number, random?: Random) {
        this._simulation = new DemoSimulation(cols, rows, random);
        this.model = new GameModel(() => this._elapsed);
        this.model.myPlayerId = SPECTATOR_ID;
        this.model.applySnapshot(this._simulation.snapshot());
    }

    /**
     * Advances the game, and moves its airplanes, by a frame.
     * @param delta [ms] Time since the previous frame.
     */
    onFrame(delta: number): void {
        delta = Math.min(Math.max(delta, 0), MAX_FRAME_DELTA);
        this._elapsed += delta;
        let ticked = false;
        while (this._simulation.time + DEMO_TICK <= this._elapsed) {
            this._simulation.tick();
            ticked = true;
        }
        if (ticked) {
            this.model.applySnapshot(this._simulation.snapshot());
        }
        this.model.interpolate(delta);
    }
}
