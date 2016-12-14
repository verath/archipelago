import * as PIXI from 'pixijs'
import {TILE_WIDTH, TILE_HEIGHT} from "./GameView";
import BaseSprite from "./BaseSprite";

const AIRPLANE_WIDTH = 64;
const AIRPLANE_HEIGHT = 64;

/**
 * @extends BaseSprite
 */
export default class AirplaneSprite extends BaseSprite {

    /**
     * @param {AirplaneModel} airplaneModel
     */
    constructor(airplaneModel) {
        super(PIXI.Texture.fromImage('assets/airplane.png'), airplaneModel);
        // Center our position anchor to the middle of the tile
        this.pivot.set(TILE_WIDTH / 2, TILE_HEIGHT / 2);
        this.scale.set(AIRPLANE_WIDTH / TILE_WIDTH, AIRPLANE_HEIGHT / TILE_HEIGHT);
    }

    _onModelChanged() {
        let model = /** @type {AirplaneModel} */ (this._model);

        this.rotation = model.direction;
        // Scale the model position to the tile size, accounting for our
        // anchor being in the middle rather than top left.
        let x = (model.position.x * TILE_WIDTH) + (TILE_WIDTH / 2);
        let y = (model.position.y * TILE_HEIGHT) + (TILE_HEIGHT / 2);
        this.position.set(x, y);

        if(model.owner.isSelf()) {
            this.tint = 0x1010FF;
        } else {
            this.tint = 0xFF1010;
        }
    }
}