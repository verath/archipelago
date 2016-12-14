import * as PIXI from 'pixijs'
import BaseSprite from "./BaseSprite";
import {COLOR_SELF, COLOR_NEUTRAL, COLOR_ENEMY} from "./colors";

const EVENT_CLICK = Symbol("EVENT_CLICK");

const ISLAND_WIDTH = 128;
const ISLAND_HEIGHT = 128;

/**
 * @extends BaseSprite
 */
export default class IslandSprite extends BaseSprite {

    /**
     * @param {IslandModel} islandModel
     */
    constructor(islandModel) {
        super(PIXI.Texture.fromImage('assets/island.png'), islandModel);

        // Listen for clicks
        this.interactive = true;
        this.on('mousedown', this._onClicked);
        this.on('touchstart', this._onClicked);

        this._strengthText = IslandSprite._createStrengthText();
        this.addChild(this._strengthText);
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
        strengthText.x = (ISLAND_WIDTH / 2);
        strengthText.y = (ISLAND_HEIGHT / 2);
        return strengthText;
    }

    _onModelChanged() {
        let island = /** @type {IslandModel} */ (this._model);

        let x = island.position.x * ISLAND_WIDTH;
        let y = island.position.y * ISLAND_HEIGHT;
        this.position.set(x, y);

        this._strengthText.text = "" + island.army.strength;

        if (island.owner.isSelf()) {
            this._strengthText.style.fill = COLOR_SELF;
        } else if (island.owner.isNeutral()) {
            this._strengthText.style.fill = COLOR_NEUTRAL;
        } else {
            this._strengthText.style.fill = COLOR_ENEMY;
        }

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