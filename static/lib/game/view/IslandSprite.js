/**
 * @extends BaseSprite
 */
import * as PIXI from "pixijs";
import BaseSprite from "./BaseSprite";
import {
    COLOR_FILL_ENEMY,
    COLOR_FILL_NEUTRAL,
    COLOR_FILL_SELF,
    FONT_FAMILY_DEFAULT
} from "./constants";
import {TILE_HEIGHT, TILE_WIDTH} from "./GameView";

const EVENT_CLICK = Symbol("EVENT_CLICK");

const ISLAND_TEXTURE_IDS = [
    'assets/island1.png',
    'assets/island2.png',
    'assets/island3.png',
    'assets/island4.png',
];
const SELECTED_TEXTURE_ID = 'assets/selected.png';

export default class IslandSprite extends BaseSprite {

    /**
     * @param {ResourceHolder} resourceHolder
     */
    constructor(resourceHolder) {
        let textureIdx = Math.floor(Math.random() * ISLAND_TEXTURE_IDS.length);
        let textureId = ISLAND_TEXTURE_IDS[textureIdx];
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
        this.on('mousedown', this._onClicked);
        this.on('touchstart', this._onClicked);
    }


    /**
     * @returns {PIXI.Text}
     * @private
     */
    static _createStrengthText() {
        let strengthText = new PIXI.Text("", {
            fontFamily: FONT_FAMILY_DEFAULT,
            fontSize: 50,
            align: 'center'
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
        return new PIXI.Sprite(resourceHolder.getTexture(SELECTED_TEXTURE_ID));
    }

    _onAdded() {
        super._onAdded();
        let island = /** @type {IslandModel} */ (this._model);

        // Set scale depending on the island size. Island size is 0-1,
        // we scale that to make sure they are not too small.
        let scale = (island.size * 0.6 + 0.4);
        this.scale.set(scale, scale);

        // Update our position, account for anchor being in the center
        let x = island.position.x * TILE_WIDTH + TILE_WIDTH / 2;
        let y = island.position.y * TILE_HEIGHT + TILE_HEIGHT / 2;
        this.position.set(x, y);

        this._updateStrengthText(island);
    }

    _onModelChanged() {
        let island = /** @type {IslandModel} */ (this._model);

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
        if (island.owner.isSelf()) {
            this._strengthText.style.fill = COLOR_FILL_SELF;
        } else if (island.owner.isNeutral()) {
            this._strengthText.style.fill = COLOR_FILL_NEUTRAL;
        } else {
            this._strengthText.style.fill = COLOR_FILL_ENEMY;
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
