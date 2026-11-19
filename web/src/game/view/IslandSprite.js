import { Sprite, Text } from "pixi.js";

import * as images from "../../images";
import ResourceHolder from "../../resource/ResourceHolder.js";
import IslandModel from "../model/IslandModel.js";
import BaseSprite from "./BaseSprite.js";
import { FONT_FAMILY_DEFAULT } from "./constants.js";
import { TILE_HEIGHT, TILE_WIDTH } from "./GameView.js";


const EVENT_CLICK = Symbol("EVENT_CLICK");

const ISLAND_TEXTURES = [
    images.TEXTURE_ISLAND1,
    images.TEXTURE_ISLAND2,
    images.TEXTURE_ISLAND3,
    images.TEXTURE_ISLAND4,
    images.TEXTURE_ISLAND5,
    images.TEXTURE_ISLAND6
];
const SELECTED_TEXTURE = images.TEXTURE_SELECTED;
const STRENGTH_TEXT_STROKE_WIDTH = 1;

/**
 * @extends BaseSprite
 */
export default class IslandSprite extends BaseSprite {

    /**
     * @param {ResourceHolder} resourceHolder
     */
    constructor(resourceHolder) {
        let textureIdx = Math.floor(Math.random() * ISLAND_TEXTURES.length);
        let textureId = ISLAND_TEXTURES[textureIdx];
        super(resourceHolder, textureId);

        // Center our anchor to the middle of the tile
        this.pivot.set(TILE_WIDTH / 2, TILE_HEIGHT / 2);

        /**
         * @type {Text}
         * @private
         */
        this._strengthText = IslandSprite._createStrengthText();
        this.addChild(this._strengthText);

        /**
         * The player color currently applied to the strength text.
         * @type {?import("../model/PlayerColors.js").PlayerColor}
         * @private
         */
        this._strengthTextColor = null;

        /**
         * @type {Sprite}
         * @private
         */
        this._selectedIndicator = IslandSprite._createSelectedIndicator(resourceHolder);
        this._selectedIndicator.alpha = 0;
        this.addChild(this._selectedIndicator);

        // Listen for clicks (pointer events cover both mouse and touch)
        this.eventMode = "static";
        this.on("pointerdown", this._onClicked);
    }


    /**
     * @returns {Text}
     * @private
     */
    static _createStrengthText() {
        let strengthText = new Text({
            text: "",
            style: {
                fontFamily: FONT_FAMILY_DEFAULT,
                fontSize: 50,
                align: "center",
                fill: 0x000000,
                stroke: { color: 0x000000, width: STRENGTH_TEXT_STROKE_WIDTH },
            },
        });
        strengthText.anchor.set(0.5, 0.5);
        strengthText.x = (TILE_WIDTH / 2);
        strengthText.y = (TILE_HEIGHT / 2);
        return strengthText;
    }

    /**
     * @param {ResourceHolder} resourceHolder
     * @returns {Sprite}
     * @private
     */
    static _createSelectedIndicator(resourceHolder) {
        let selectedIndicator = new Sprite(resourceHolder.getTexture(SELECTED_TEXTURE));
        selectedIndicator.anchor.set(0.5, 0.5);
        selectedIndicator.x = (TILE_WIDTH / 2);
        selectedIndicator.y = (TILE_HEIGHT / 2);
        return selectedIndicator;
    }

    _onAdded() {
        super._onAdded();
        let island = /** @type {IslandModel} */ (this._model);

        // Set scale depending on the island size. Island size is 0-1,
        // we scale that to make sure they are not too small.
        let scale = (island.size * 0.8 + 0.2);
        this.scale.set(scale, scale);
        // Undo scale for selected indicator, implicitly use it as a larger
        // touch target.
        this._selectedIndicator.scale.set(1 / scale, 1 / scale);

        // Update our position, account for anchor being in the center
        let x = island.position.x * TILE_WIDTH + TILE_WIDTH / 2;
        let y = island.position.y * TILE_HEIGHT + TILE_HEIGHT / 2;
        this.position.set(x, y);

        this._sprite.tint = island.owner.color.fill;
        this._updateStrengthText(island);

        // Apply a random 90deg step rotation to sprite, to simulate variety.
        const rotations = [0, Math.PI * 1 / 2, Math.PI, Math.PI * 3 / 2];
        this.rotation = rotations[Math.floor(Math.random() * rotations.length)];
        this._strengthText.rotation -= this.rotation;
    }

    _onModelChanged() {
        let island = /** @type {IslandModel} */ (this._model);

        this._sprite.tint = island.owner.color.fill;
        this._updateStrengthText(island);
        // Show island selected indicator
        if (island.selected) {
            this._selectedIndicator.alpha = 1;
        } else {
            this._selectedIndicator.alpha = 0;
        }
    }

    /**
     * Update the strength text number, and set its color depending
     * on who owns the island
     * @param {IslandModel} island
     * @private
     */
    _updateStrengthText(island) {
        if (island.strength >= 0) {
            this._strengthText.text = "" + island.strength;
        } else {
            // Negative strength => in FoW.
            this._strengthText.text = "";
        }
        // Only touch the style when the color changes, as any style change
        // makes Pixi re-render the text.
        const color = island.owner.color;
        if (this._strengthTextColor !== color) {
            this._strengthTextColor = color;
            this._strengthText.style.fill = color.textFill;
            this._strengthText.style.stroke = { color: color.textStroke, width: STRENGTH_TEXT_STROKE_WIDTH };
        }
    }

    _onClicked() {
        let island = /** @type {IslandModel} */ (this._model);
        this.emit(EVENT_CLICK, island);
    }

    addClickListener(listener, context = null) {
        this.on(EVENT_CLICK, listener, context);
    }

    removeClickListener(listener, context = null) {
        this.off(EVENT_CLICK, listener, context);
    }
}
