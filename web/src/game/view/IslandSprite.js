import * as PIXI from "pixi.js";
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
         * @type {PIXI.Text}
         * @private
         */
        this._strengthText = IslandSprite._createStrengthText();
        this.addChild(this._strengthText);

        /**
         * @type {PIXI.Sprite}
         * @private
         */
        this._selectedIndicator = IslandSprite._createSelectedIndicator(resourceHolder);
        this._selectedIndicator.alpha = 0;
        this.addChild(this._selectedIndicator);

        // Listen for clicks
        this.interactive = true;
        this.on("mousedown", this._onClicked);
        this.on("touchstart", this._onClicked);
    }


    /**
     * @returns {PIXI.Text}
     * @private
     */
    static _createStrengthText() {
        let strengthText = new PIXI.Text("", {
            fontFamily: FONT_FAMILY_DEFAULT,
            fontSize: 50,
            align: "center",
            strokeThickness: 1,
        });
        strengthText.anchor.set(0.5, 0.5);
        strengthText.x = (TILE_WIDTH / 2);
        strengthText.y = (TILE_HEIGHT / 2);
        return strengthText;
    }

    /**
     * @param {ResourceHolder} resourceHolder
     * @returns {PIXI.Sprite}
     * @private
     */
    static _createSelectedIndicator(resourceHolder) {
        let selectedIndicator =  new PIXI.Sprite(resourceHolder.getTexture(SELECTED_TEXTURE));
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
        this._selectedIndicator.scale.set(1/scale, 1/scale);

        // Update our position, account for anchor being in the center
        let x = island.position.x * TILE_WIDTH + TILE_WIDTH / 2;
        let y = island.position.y * TILE_HEIGHT + TILE_HEIGHT / 2;
        this.position.set(x, y);

        this.tint = island.owner.color.fill;
        this._updateStrengthText(island);

        // Apply a random 90deg step rotation to sprite, to simulate variety.
        const rotations = [0, Math.PI * 1 / 2, Math.PI, Math.PI * 3 / 2];
        this.rotation = rotations[Math.floor(Math.random() * rotations.length)];
        this._strengthText.rotation -= this.rotation;
    }

    _onModelChanged() {
        let island = /** @type {IslandModel} */ (this._model);

        this.tint = island.owner.color.fill;
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
        this._strengthText.text = "" + island.strength;
        this._strengthText.style.fill = island.owner.color.textFill;
        this._strengthText.style.stroke = island.owner.color.textStroke;
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
