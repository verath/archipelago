import { Sprite } from "pixi.js";

import type ResourceHolder from "../../resource/ResourceHolder.ts";
import { TEXTURE_FOG } from "../../images/index.ts";
import { TILE_WIDTH, TILE_HEIGHT } from "./GameView.ts";

/**
 * FogOfWarSprite is a static sprite representing a tile covered in fog of war.
 */
export default class FogOfWarSprite extends Sprite {

    constructor(resourceHolder: ResourceHolder, x: number, y: number) {
        super(resourceHolder.getTexture(TEXTURE_FOG));
        this.pivot.set(TILE_WIDTH / 2, TILE_HEIGHT / 2);

        x = x * TILE_WIDTH + TILE_WIDTH / 2;
        y = y * TILE_HEIGHT + TILE_HEIGHT / 2;
        this.position.set(x, y);
        this.alpha = 0.4;
    }
}
