import * as PIXI from "pixijs";
import {TILE_HEIGHT, TILE_WIDTH} from "./GameView.js";
import BaseSprite from "./BaseSprite.js";
import {COLOR_FILL_ENEMY, COLOR_FILL_NEUTRAL, COLOR_FILL_SELF, COLOR_STROKE, FONT_FAMILY_DEFAULT} from "./constants.js";

import {TEXTURE_AIRPLANE} from "../../images";

/**
 * @extends BaseSprite
 */
export default class AirplaneSprite extends BaseSprite {

    /**
     * @param {ResourceHolder} resourceHolder
     */
    constructor(resourceHolder) {
        super(resourceHolder, TEXTURE_AIRPLANE);
        // Center our position anchor to the middle of the tile
        this.pivot.set(TILE_WIDTH / 2, TILE_HEIGHT / 2);

        /**
         * @type {PIXI.Text}
         * @private
         */
        this._strengthText = AirplaneSprite._createStrengthText();
        this.addChild(this._strengthText);
    }

    /**
     * @returns {PIXI.Text}
     * @private
     */
    static _createStrengthText() {
        let strengthText = new PIXI.Text("", {
            fontFamily: FONT_FAMILY_DEFAULT,
            fontSize: 50,
            align: 'center',
            fill: COLOR_FILL_NEUTRAL,
            stroke: COLOR_STROKE,
            strokeThickness: 3
        });
        strengthText.anchor.set(0.5, 0.5);
        strengthText.x = (TILE_WIDTH / 2);
        strengthText.y = (TILE_HEIGHT / 2);
        return strengthText;
    }

    _onAdded() {
        super._onAdded();
        let airplane = /** @type {AirplaneModel} */ (this._model);

        this._strengthText.text = "" + airplane.strength;

        // Set our scale depending on the strength we are carrying.
        // The scaling is capped to strength 60, and a scale factor
        // between 0.25 to 0.8.
        let size = Math.min(airplane.strength, 60) / 60;
        let scale = size * (0.8 - 0.25) + 0.25;
        this.scale.set(scale, scale);

        this.rotation = airplane.direction;
        // Negate for the text so that it is displayed non-rotated
        this._strengthText.rotation = -airplane.direction;

        if (airplane.owner.isSelf()) {
            this.tint = COLOR_FILL_SELF;
        } else {
            this.tint = COLOR_FILL_ENEMY;
        }
    }

    _onModelChanged() {
        let airplane = /** @type {AirplaneModel} */ (this._model);

        // Update our position, account for anchor being in the center
        let x = airplane.position.x * TILE_WIDTH + TILE_WIDTH / 2;
        let y = airplane.position.y * TILE_HEIGHT + TILE_HEIGHT / 2;
        this.position.set(x, y);
    }
}
