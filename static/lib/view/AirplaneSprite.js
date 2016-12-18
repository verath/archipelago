import * as PIXI from "pixijs";
import {TILE_WIDTH, TILE_HEIGHT} from "./GameView";
import BaseSprite from "./BaseSprite";

const AIRPLANE_WIDTH = 64;
const AIRPLANE_HEIGHT = 64;

/**
 * @extends BaseSprite
 */
export default class AirplaneSprite extends BaseSprite {

    constructor() {
        let texture = PIXI.Texture.fromImage('assets/airplane.png');
        super(texture);
        // Center our position anchor to the middle of the tile
        this.pivot.set(TILE_WIDTH / 2, TILE_HEIGHT / 2);
    }

    _onModelChanged() {
        let airplane = /** @type {AirplaneModel} */ (this._model);

        // Set our scale depending on the strength we are carrying.
        // The scaling is capped to strength 60, and a scale factor
        // between 0.25 to 0.8.
        let size = Math.min(airplane.strength, 60) / 60;
        let scale = size * (0.8 - 0.25) + 0.25;
        this.scale.set(scale, scale);

        this.rotation = airplane.direction;

        // Update our position, account for anchor being in the center
        let x = airplane.position.x * TILE_WIDTH + TILE_WIDTH / 2;
        let y = airplane.position.y * TILE_HEIGHT + TILE_HEIGHT / 2;
        this.position.set(x, y);

        if (airplane.owner.isSelf()) {
            this.tint = 0x1010FF;
        } else {
            this.tint = 0xFF1010;
        }
    }
}
