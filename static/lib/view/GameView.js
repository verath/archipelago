import * as PIXI from 'pixijs'
import IslandSprite from './IslandSprite'
import AirplaneSprite from "./AirplaneSprite";

export const TILE_WIDTH = 128;
export const TILE_HEIGHT = 128;

export default class GameView {
    /**
     * @param {GameModel} gameModel
     */
    constructor(gameModel) {
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
        this._renderer = PIXI.autoDetectRenderer(128 * 9, 128 * 9, {transparent: true});
        document.body.appendChild(this._renderer.view);

        /**
         * @member {Container}
         * @private
         */
        this._stage = new PIXI.Container();

        // Start listening for model changes
        this._gameModel.addChangeListener(this._onModelChange, this);
    }


    _onModelChange() {
        // Clear all current elements on the stage and re-create it
        // TODO: this just might be slightly inefficient... :)
        this._stage.removeChildren();

        this._stageWidth = this._gameModel.size.x * TILE_WIDTH;
        this._stageHeight = this._gameModel.size.y * TILE_HEIGHT;

        this._gameModel.islands
            .map(islandModel => new IslandSprite(islandModel))
            .forEach(sprite => this._stage.addChild(sprite));

        this._gameModel.airplanes
            .map(airplaneModel => new AirplaneSprite(airplaneModel))
            .forEach(sprite => this._stage.addChild(sprite));

        this.resize();
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