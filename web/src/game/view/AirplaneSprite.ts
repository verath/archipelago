import { Text } from "pixi.js";

import { TEXTURE_AIRPLANE } from "../../images/index.ts";
import type ResourceHolder from "../../resource/ResourceHolder.ts";
import type AirplaneModel from "../model/AirplaneModel.ts";
import BaseSprite, { ownerColor } from "./BaseSprite.ts";
import { FONT_FAMILY_DEFAULT } from "./constants.ts";
import { TILE_HEIGHT, TILE_WIDTH } from "./GameView.ts";


export default class AirplaneSprite extends BaseSprite<AirplaneModel> {

    private readonly _strengthText: Text;

    /**
     * The strength shown by the strength text, null before the first update.
     */
    private _shownStrength: number | null = null;

    constructor(resourceHolder: ResourceHolder, model: AirplaneModel) {
        super(resourceHolder, TEXTURE_AIRPLANE, model);
        // Center our position anchor to the middle of the tile
        this.pivot.set(TILE_WIDTH / 2, TILE_HEIGHT / 2);

        this._strengthText = AirplaneSprite._createStrengthText();
        this.addChild(this._strengthText);
    }

    private static _createStrengthText(): Text {
        const strengthText = new Text({
            text: "",
            style: {
                fontFamily: FONT_FAMILY_DEFAULT,
                fontSize: 50,
                align: "center",
                fill: 0xeeeeee,
                stroke: { color: 0x111111, width: 3 },
            },
        });
        strengthText.anchor.set(0.5, 0.5);
        strengthText.x = (TILE_WIDTH / 2);
        strengthText.y = (TILE_HEIGHT / 2);
        return strengthText;
    }

    update(): void {
        const airplane = this.model;
        // Update fill color.
        this._sprite.tint = ownerColor(airplane).fill;
        // Update our position, account for anchor being in the center
        const x = airplane.position.x * TILE_WIDTH + TILE_WIDTH / 2;
        const y = airplane.position.y * TILE_HEIGHT + TILE_HEIGHT / 2;
        this.position.set(x, y);
        // Update rotation to match the direction we are heading
        this.rotation = airplane.direction;

        this._updateStrengthText(airplane);
        this._updateScale(airplane);
    }

    private _updateStrengthText(airplane: AirplaneModel): void {
        // Only set the text when it changes, as Pixi re-renders it then.
        if (this._shownStrength !== airplane.strength) {
            this._shownStrength = airplane.strength;
            // Negative strength => in FoW.
            this._strengthText.text = (airplane.strength >= 0) ? "" + airplane.strength : "";
        }
        // Negate for the text so that it is displayed non-rotated
        this._strengthText.rotation = -airplane.direction;
    }

    private _updateScale(airplane: AirplaneModel): void {
        // Ratio by strength capped at strengthMax.
        const strengthMax = 100;
        const ratio = Math.min(airplane.strength, strengthMax) / strengthMax;
        // ratio -> reasonable scale for displaying.
        const scaleMax = 1;
        const scaleMin = 0.3;
        const scale = ratio * (scaleMax - scaleMin) + scaleMin;
        this.scale.set(scale, scale);
    }
}
