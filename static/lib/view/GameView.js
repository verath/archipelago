import * as PIXI from 'pixijs'
import IslandSprite from './IslandSprite'
import AirplaneSprite from "./AirplaneSprite";
import EventEmitter from 'eventemitter3';

/** @type {Symbol}*/
const EVENT_ISLAND_CLICKED = Symbol("EVENT_ISLAND_CLICKED");

export const TILE_WIDTH = 128;
export const TILE_HEIGHT = 128;

export default class GameView {
    /**
     * @param {WebGLRenderer|CanvasRenderer} renderer
     * @param {GameModel} gameModel
     */
    constructor(renderer, gameModel) {
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
         * @member {WebGLRenderer|CanvasRenderer}
         * @private
         */
        this._renderer = renderer;

        /**
         * @member {Container}
         * @private
         */
        this._stage = new PIXI.Container();

        /**
         * @member EventEmitter
         * @private
         */
        this._eventEmitter = new EventEmitter();

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

    _onModelChange() {
        // Clear all current elements on the stage and re-create it
        // TODO: this just might be slightly inefficient... :)
        this._stage.removeChildren();

        this._stageWidth = this._gameModel.size.x * TILE_WIDTH;
        this._stageHeight = this._gameModel.size.y * TILE_HEIGHT;

        this._gameModel.islands
            .map(islandModel => {
                let islandSprite = new IslandSprite(islandModel);
                islandSprite.addClickListener(this._onIslandClicked, this);
                return islandSprite;
            })
            .forEach(sprite => this._stage.addChild(sprite));

        this._gameModel.airplanes
            .map(airplaneModel => new AirplaneSprite(airplaneModel))
            .forEach(sprite => this._stage.addChild(sprite));

        this.resize();
    }

    addIslandClickListener(listener, context = null) {
        this._eventEmitter.on(EVENT_ISLAND_CLICKED, listener, context);
    }

    removeIslandClickListener(listener, context = null) {
        this._eventEmitter.off(EVENT_ISLAND_CLICKED, listener, context);
    }

    resize() {
        // See https://gist.github.com/wojciak/628f7aa166c4c770600e
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
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

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