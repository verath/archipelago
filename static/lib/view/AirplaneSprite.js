import * as PIXI from 'pixijs'
import {TILE_WIDTH, TILE_HEIGHT} from "./GameView";
import BaseSprite from "./BaseSprite";

/**
 * @extends BaseSprite
 */
export default class AirplaneSprite extends BaseSprite {

    /**
     * @param {AirplaneModel} airplaneModel
     */
    constructor(airplaneModel) {
        super(PIXI.Texture.fromImage('assets/island.png'), airplaneModel);
        this.scale.set(0.75, 0.75);
    }

    _onModelChanged() {
        let model = /** @type {AirplaneModel} */ (this._model);

        let x = model.position.x * TILE_WIDTH;
        let y = model.position.y * TILE_HEIGHT;
        this.position.set(x, y);
    }
}