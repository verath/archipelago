import * as PIXI from 'pixijs'
import BaseSprite from "./BaseSprite";
import {COLOR_SELF, COLOR_NEUTRAL, COLOR_ENEMY} from "./colors";
import {TILE_WIDTH, TILE_HEIGHT} from "./GameView";

const EVENT_CLICK = Symbol("EVENT_CLICK");

const ISLAND_TEXTURES = [
    'assets/island.png',
];

/**
 * @extends BaseSprite
 */
export default class IslandSprite extends BaseSprite {

    constructor() {
        let textureIdx = Math.floor(Math.random() * ISLAND_TEXTURES.length);
        let texture = PIXI.Texture.fromImage(ISLAND_TEXTURES[textureIdx]);
        super(texture);

        // Center our anchor to the middle of the tile
        this.pivot.set(TILE_WIDTH / 2, TILE_HEIGHT / 2);

        this._strengthText = IslandSprite._createStrengthText();
        this.addChild(this._strengthText);

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
            fontFamily: 'Arial',
            fontSize: 50,
            align: 'center'
        });
        strengthText.anchor.set(0.5, 0.5);
        strengthText.x = (TILE_WIDTH / 2);
        strengthText.y = (TILE_HEIGHT / 2);
        return strengthText;
    }

    _onModelChanged() {
        let island = /** @type {IslandModel} */ (this._model);

        // Set scale depending on the island size. Island size is 0-1,
        // we scale that to make sure they are not too small.
        let scale = (island.size * 0.6 + 0.4);
        this.scale.set(scale, scale);

        // Update our position, account for anchor being in the center
        let x = island.position.x * TILE_WIDTH + TILE_WIDTH / 2;
        let y = island.position.y * TILE_HEIGHT + TILE_HEIGHT / 2;
        this.position.set(x, y);

        // Update the strength text number, and set its color depending
        // on who owns the island
        this._strengthText.text = "" + island.army.strength;
        if (island.owner.isSelf()) {
            this._strengthText.style.fill = COLOR_SELF;
        } else if (island.owner.isNeutral()) {
            this._strengthText.style.fill = COLOR_NEUTRAL;
        } else {
            this._strengthText.style.fill = COLOR_ENEMY;
        }

        // Show island selected indicator
        // TODO: indicator...
        if (island.selected) {
            this.alpha = 0.5;
        } else {
            this.alpha = 1;
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