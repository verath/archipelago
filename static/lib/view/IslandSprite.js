import * as PIXI from 'pixijs'
import BaseSprite from "./BaseSprite";
import {OWNER_SELF, OWNER_NEUTRAL, OWNER_ENEMY} from "../model/Army";

const ISLAND_WIDTH = 128;
const ISLAND_HEIGHT = 128;
const STRENGTH_COLOR_SELF = 0x1010ff;
const STRENGTH_COLOR_NEUTRAL = 0x101010;
const STRENGTH_COLOR_ENEMY = 0xff1010;

/**
 * @extends BaseSprite
 */
export default class IslandSprite extends BaseSprite {

    /**
     * @param {IslandModel} islandModel
     */
    constructor(islandModel) {
        super(PIXI.Texture.fromImage('assets/island.png'), islandModel);

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
            fontSize: 34,
            align: 'center'
        });
        strengthText.anchor.set(0.5, 0.5);
        strengthText.x = (ISLAND_WIDTH / 2);
        strengthText.y = (ISLAND_HEIGHT / 2);
        return strengthText;
    }

    _onModelChanged() {
        let model = /** @type {IslandModel} */ (this._model);

        let x = model.position.x * ISLAND_WIDTH;
        let y = model.position.y * ISLAND_HEIGHT;
        this.position.set(x, y);

        this._strengthText.text = "" + model.army.strength;

        switch(model.army.owner) {
            case OWNER_SELF:
                this._strengthText.style.fill = STRENGTH_COLOR_SELF;
                break;
            case OWNER_NEUTRAL:
                this._strengthText.style.fill = STRENGTH_COLOR_NEUTRAL;
                break;
            case OWNER_ENEMY:
                this._strengthText.style.fill = STRENGTH_COLOR_ENEMY;
                break;
        }

        if (model.selected) {
            this.alpha = 0.5;
        }
    }
}