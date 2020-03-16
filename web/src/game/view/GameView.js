import EventEmitter from "eventemitter3";
import * as PIXI from "pixi.js";
import { WebGLRenderer, CanvasRenderer } from "pixi.js/lib/core";

import ResourceHolder from "../../resource/ResourceHolder.js";
import AirplaneModel from "../model/AirplaneModel.js";
import GameModel from "../model/GameModel.js";
import IslandModel from "../model/IslandModel.js";
import AirplanePool from "./AirplanePool.js";
import AirplaneSprite from "./AirplaneSprite.js";
import IslandSprite from "./IslandSprite.js";
import FogOfWarSprite from "./FogOfWarSprite.js";

/** @type {symbol}*/
const EVENT_ISLAND_CLICKED = Symbol("EVENT_ISLAND_CLICKED");

export const TILE_WIDTH = 128;
export const TILE_HEIGHT = 128;

export default class GameView {
    /**
     * @param {ResourceHolder} resourceHolder
     * @param {WebGLRenderer|CanvasRenderer} renderer
     * @param {GameModel} gameModel
     */
    constructor(resourceHolder, renderer, gameModel) {

        /**
         * @type {ResourceHolder}
         * @private
         */
        this._resourceHolder = resourceHolder;

        /**
         * @member {WebGLRenderer|CanvasRenderer}
         * @private
         */
        this._renderer = renderer;

        /**
         * @member {GameModel}
         * @private
         */
        this._gameModel = gameModel;

        /**
         * @member {number}
         * @private
         */
        this._stageWidth = 0;

        /**
         * @member {number}
         * @private
         */
        this._stageHeight = 0;

        /**
         * The stage is the PIXI container that we render.
         * @type {PIXI.Container}
         * @private
         */
        this._stage = new PIXI.Container();
        
        /**
         * The "layer" holding island sprites.
         * @type {PIXI.Container}
         * @private
         */
        this._layerIslands = new PIXI.Container();

        /**
         * The "layer" holding airplane sprites
         * @type {PIXI.Container}
         * @private
         */
        this._layerAirplanes = new PIXI.Container();

        /**
         * The "layer" holding fog of war sprites
         * @type {PIXI.Container}
         * @private
         */
        this._layerFogOfWar = new PIXI.Container();

        /**
         * @member EventEmitter
         * @private
         */
        this._eventEmitter = new EventEmitter();

        /**
         * @type {AirplanePool}
         * @private
         */
        this._airplanePool = new AirplanePool(10, () => new AirplaneSprite(resourceHolder));

        /**
         * A map between island id and the island sprite representing it.
         * @type {Map<String, IslandSprite>}
         * @private
         */
        this._islands = new Map();

        /**
         * A map between airplane id and the airplane sprite representing it.
         * @type {Map<String, AirplaneSprite>}
         * @private
         */
        this._airplanes = new Map();

        // Add the layers to the stage, FoW > airplanes > islands.
        this._stage.addChild(this._layerIslands);
        this._stage.addChild(this._layerAirplanes);
        this._stage.addChild(this._layerFogOfWar);

        // Start listening for model changes
        this._gameModel.addChangeListener(this._onModelChange, this);
    }

    /**
     * @param {IslandModel} islandModel
     * @private
     */
    _onIslandClicked(islandModel) {
        this._eventEmitter.emit(EVENT_ISLAND_CLICKED, islandModel.id);
    }

    /**
     * @param {AirplaneModel} airplaneModel
     * @private
     */
    _addAirplane(airplaneModel) {
        let airplane = this._airplanePool.get();
        airplane.model = airplaneModel;
        this._layerAirplanes.addChild(airplane);
        this._airplanes.set(airplaneModel.id, airplane);
    }

    _removeAirplane(id) {
        if (!this._airplanes.has(id)) {
            return;
        }
        let airplane = this._airplanes.get(id);
        this._layerAirplanes.removeChild(airplane);
        this._airplanes.delete(id);
        this._airplanePool.put(airplane);
    }

    /**
     * @param {IslandModel} islandModel
     * @private
     */
    _addIsland(islandModel) {
        let island = new IslandSprite(this._resourceHolder);
        island.model = islandModel;
        island.addClickListener(this._onIslandClicked, this);
        this._layerIslands.addChild(island);
        this._islands.set(islandModel.id, island);
    }

    _onModelChange() {
        // Create island and airplane sprites for any islands or airplanes
        // that has not been added already.
        this._gameModel.islands
            .filter(islandModel => !this._islands.has(islandModel.id))
            .forEach(islandModel => this._addIsland(islandModel));
        this._gameModel.airplanes
            .filter(airplaneModel => !this._airplanes.has(airplaneModel.id))
            .forEach(airplaneModel => this._addAirplane(airplaneModel));


        // Remove any airplanes that are no longer part of the model
        if (this._airplanes.size > this._gameModel.airplanes.length) {
            let idsToRemove = [];
            for (let id of this._airplanes.keys()) {
                if (!this._gameModel.airplaneById(id)) {
                    idsToRemove.push(id);
                }
            }
            idsToRemove.forEach(id => this._removeAirplane(id));
        }

        // Check if the game model has changed size, if so we resize ourselves and
        // recreate the fog of war tiles.
        let newStageWidth = this._gameModel.size.x * TILE_WIDTH;
        let newStageHeight = this._gameModel.size.y * TILE_HEIGHT;
        if (newStageWidth !== this._stageWidth || newStageHeight !== this._stageHeight) {
            this._stageWidth = this._gameModel.size.x * TILE_WIDTH;
            this._stageHeight = this._gameModel.size.y * TILE_HEIGHT;
            this.resize();

            // Note that the FoW layer is created such that the child index
            // corresponds to the board position. I.e. given an (x, y) one can
            // lookup the FoW Sprite by index: y * boardSizeX + x.
            this._layerFogOfWar.removeChildren();
            for (let y = 0; y < this._gameModel.size.y; y++) {
                for (let x = 0; x < this._gameModel.size.x; x++) {
                    let fogOfWarSprite = new FogOfWarSprite(this._resourceHolder, x, y);
                    this._layerFogOfWar.addChild(fogOfWarSprite);
                }
            }
        }
        
        // Update fog of war sprite visibilities.
        for (let y = 0; y < this._gameModel.size.y; y++) {
            for (let x = 0; x < this._gameModel.size.x; x++) {
                let idx = y * this._gameModel.size.x + x;
                this._layerFogOfWar.getChildAt(idx).visible = false;
            }
        }
        this._gameModel.myFogOfWar.forEach(pos => {
            let idx = pos.y * this._gameModel.size.x + pos.x;
            this._layerFogOfWar.getChildAt(idx).visible = true;
        });
    }

    addIslandClickListener(listener, context = null) {
        this._eventEmitter.on(EVENT_ISLAND_CLICKED, listener, context);
    }

    removeIslandClickListener(listener, context = null) {
        this._eventEmitter.off(EVENT_ISLAND_CLICKED, listener, context);
    }

    resize() {
        let pixelRatio = (window.devicePixelRatio || 1);
        let canvas = this._renderer.view;

        // Center crop(?) the canvas, keep the aspect ratio
        let width, height;
        let widthRatio = this._stageWidth / window.innerWidth;
        let heightRatio = this._stageHeight / window.innerHeight;
        if (widthRatio > heightRatio) {
            width = Math.min(this._stageWidth, window.innerWidth);
            height = width * (this._stageWidth / this._stageHeight);
        } else {
            height = Math.min(this._stageHeight, window.innerHeight);
            width = height * (this._stageHeight / this._stageWidth);
        }

        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        // Notify pixi that the canvas has been resized
        this._renderer.resize(canvas.width, canvas.height);

        // Rescale our stage
        this._stage.scale.x = (width * pixelRatio) / this._stageWidth;
        this._stage.scale.y = (height * pixelRatio) / this._stageHeight;
    }

    render() {
        this._renderer.render(this._stage);
    }
}
