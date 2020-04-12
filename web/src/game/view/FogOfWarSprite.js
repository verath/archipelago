import * as PIXI from "pixi.js";

import ResourceHolder from "../../resource/ResourceHolder.js";
import { TEXTURE_FOG } from "../../images";
import { TILE_WIDTH, TILE_HEIGHT } from "./GameView";

/**
 * FogOfWarSprite is a static sprite representing a tile covered in fog of war.
 */
export default class FogOfWarSprite extends PIXI.Sprite {

    /**
     * @param {ResourceHolder} resourceHolder
     * @param {number} x
     * @param {number} y
     */
    constructor(resourceHolder, x, y) {
        super(resourceHolder.getTexture(TEXTURE_FOG));
        this.pivot.set(TILE_WIDTH / 2, TILE_HEIGHT / 2);

        x = x * TILE_WIDTH + TILE_WIDTH / 2;
        y = y * TILE_HEIGHT + TILE_HEIGHT / 2;
        this.position.set(x, y);
        this.alpha = 0.4;
    }
}
