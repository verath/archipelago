import EventEmitter from "eventemitter3";
import { Container, type Renderer } from "pixi.js";

import type ResourceHolder from "../../resource/ResourceHolder.ts";
import type GameModel from "../model/GameModel.ts";
import type IslandModel from "../model/IslandModel.ts";
import AirplaneSprite from "./AirplaneSprite.ts";
import IslandSprite from "./IslandSprite.ts";
import FogOfWarSprite from "./FogOfWarSprite.ts";

const EVENT_ISLAND_CLICKED = Symbol("EVENT_ISLAND_CLICKED");

export type IslandIdClickListener = (islandId: string | null) => void;

export const TILE_WIDTH = 128;
export const TILE_HEIGHT = 128;

export default class GameView {
    private readonly _resourceHolder: ResourceHolder;

    /**
     * Not private as the e2e test hook (testHook.ts) reads it, to map
     * sprite positions to screen coordinates. Not part of the API otherwise.
     */
    readonly _renderer: Renderer;

    private readonly _gameModel: GameModel;

    private _stageWidth: number;

    private _stageHeight: number;

    /**
     * The stage is the PIXI container that we render.
     */
    private readonly _stage: Container;

    /**
     * The "layer" holding island sprites.
     */
    private readonly _layerIslands: Container;

    /**
     * The "layer" holding airplane sprites
     */
    private readonly _layerAirplanes: Container;

    /**
     * The "layer" holding fog of war sprites
     */
    private readonly _layerFogOfWar: Container;

    private readonly _eventEmitter: EventEmitter<{ [EVENT_ISLAND_CLICKED]: [islandId: string | null] }>;

    /**
     * A map between island id and the island sprite representing it.
     *
     * Not private as the e2e test hook (testHook.ts) reads it, to find the
     * sprite of an island. Not part of the API otherwise.
     */
    readonly _islands: Map<string | null, IslandSprite>;

    /**
     * A map between airplane id and the airplane sprite representing it.
     */
    private readonly _airplanes: Map<string | null, AirplaneSprite>;

    constructor(resourceHolder: ResourceHolder, renderer: Renderer, gameModel: GameModel) {
        this._resourceHolder = resourceHolder;
        this._renderer = renderer;
        this._gameModel = gameModel;
        this._stageWidth = 0;
        this._stageHeight = 0;
        this._stage = new Container();
        this._layerIslands = new Container();
        this._layerAirplanes = new Container();
        this._layerFogOfWar = new Container();
        this._eventEmitter = new EventEmitter();
        this._islands = new Map();
        this._airplanes = new Map();

        // Add the layers to the stage, FoW > airplanes > islands.
        this._stage.addChild(this._layerIslands);
        this._stage.addChild(this._layerAirplanes);
        this._stage.addChild(this._layerFogOfWar);
    }

    private _onIslandClicked(islandModel: IslandModel): void {
        this._eventEmitter.emit(EVENT_ISLAND_CLICKED, islandModel.id);
    }

    private _addIsland(islandModel: IslandModel): void {
        const island = new IslandSprite(this._resourceHolder, islandModel);
        island.addClickListener(this._onIslandClicked, this);
        this._layerIslands.addChild(island);
        this._islands.set(islandModel.id, island);
    }

    /**
     * Brings the sprites in line with the model.
     */
    private _sync(): void {
        const gameModel = this._gameModel;
        // Create island and airplane sprites for any islands or airplanes
        // that has not been added already.
        for (const islandModel of gameModel.islands) {
            if (!this._islands.has(islandModel.id)) {
                this._addIsland(islandModel);
            }
        }
        // Remove sprites of airplanes that are no longer part of the model,
        // also when a new airplane model replaced one with the same id (a
        // delta may remove and re-add an airplane).
        for (const [id, sprite] of this._airplanes) {
            if (sprite.model !== gameModel.airplaneById(id)) {
                sprite.destroy({ children: true });
                this._airplanes.delete(id);
            }
        }
        for (const airplaneModel of gameModel.airplanes) {
            if (!this._airplanes.has(airplaneModel.id)) {
                const sprite = new AirplaneSprite(this._resourceHolder, airplaneModel);
                this._layerAirplanes.addChild(sprite);
                this._airplanes.set(airplaneModel.id, sprite);
            }
        }

        // Check if the game model has changed size, if so we resize ourselves and
        // recreate the fog of war tiles.
        const newStageWidth = gameModel.size.x * TILE_WIDTH;
        const newStageHeight = gameModel.size.y * TILE_HEIGHT;
        if (newStageWidth !== this._stageWidth || newStageHeight !== this._stageHeight) {
            this._stageWidth = newStageWidth;
            this._stageHeight = newStageHeight;
            this.resize();

            // Note that the FoW layer is created such that the child index
            // corresponds to the board position. I.e. given an (x, y) one can
            // lookup the FoW Sprite by index: y * boardSizeX + x.
            this._layerFogOfWar.removeChildren();
            for (let y = 0; y < gameModel.size.y; y++) {
                for (let x = 0; x < gameModel.size.x; x++) {
                    const fogOfWarSprite = new FogOfWarSprite(this._resourceHolder, x, y);
                    this._layerFogOfWar.addChild(fogOfWarSprite);
                }
            }
        }

        // Update fog of war sprite visibilities.
        const myFogOfWar = gameModel.myFogOfWar;
        const fogOfWarSprites = this._layerFogOfWar.children;
        for (let i = 0; i < fogOfWarSprites.length; i++) {
            fogOfWarSprites[i].visible = !!myFogOfWar[i];
        }

        this._islands.forEach(island => island.update());
        this._airplanes.forEach(airplane => airplane.update());
    }

    addIslandClickListener(listener: IslandIdClickListener, context: unknown = null): void {
        this._eventEmitter.on(EVENT_ISLAND_CLICKED, listener, context);
    }

    removeIslandClickListener(listener: IslandIdClickListener, context: unknown = null): void {
        this._eventEmitter.off(EVENT_ISLAND_CLICKED, listener, context);
    }

    resize(): void {
        const pixelRatio = (window.devicePixelRatio || 1);
        const canvas = this._renderer.canvas;

        // Center crop(?) the canvas, keep the aspect ratio
        let width, height;
        const widthRatio = this._stageWidth / window.innerWidth;
        const heightRatio = this._stageHeight / window.innerHeight;
        if (widthRatio > heightRatio) {
            width = Math.min(this._stageWidth, window.innerWidth);
            height = width * (this._stageWidth / this._stageHeight);
        } else {
            height = Math.min(this._stageHeight, window.innerHeight);
            width = height * (this._stageHeight / this._stageWidth);
        }

        // Resize the renderer (and the canvas) to the device pixel size, but
        // display the canvas at its CSS pixel size.
        this._renderer.resize(width * pixelRatio, height * pixelRatio);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        // Rescale our stage
        this._stage.scale.x = (width * pixelRatio) / this._stageWidth;
        this._stage.scale.y = (height * pixelRatio) / this._stageHeight;
    }

    /**
     * Updates the sprites from the model and renders them. Called every
     * frame.
     */
    render(): void {
        this._sync();
        this._renderer.render(this._stage);
    }
}
