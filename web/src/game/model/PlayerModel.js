import BaseModel from "./BaseModel.js";
import GameModel from "./GameModel.js";
import { PlayerColor, PLAYER_COLOR_NOT_SET, PLAYER_COLOR_SELF, PLAYER_COLOR_NEUTRAL } from "./PlayerColors.js";

/**
 * @extends BaseModel
 */
export default class PlayerModel extends BaseModel {

    /**
     * @param {GameModel} gameModel
     */
    constructor(gameModel) {
        super();

        /**
         * @type {GameModel}
         * @private
         */
        this._gameModel = gameModel;

        /**
         * The color of this player.
         * @type {PlayerColor}
         * @private
         */
        this._color = PLAYER_COLOR_NOT_SET;
    }

    /**
     * Returns true if the PlayerModel represents our current player.
     * @returns {boolean}
     */
    isSelf() {
        return (this.id === this._gameModel.myPlayerId);
    }

    /**
     * Returns true if the player is the neutral player.
     * @returns {boolean}
     */
    isNeutral() {
        return (this.id === this._gameModel.playerNeutral.id);
    }

    /**
     * Returns true if the player is the enemy player
     * @returns {boolean}
     */
    isEnemy() {
        return !(this.isSelf() || this.isNeutral());
    }

    /**
     * Returns PlayerColor for the player.
     * @returns {PlayerColor}
     */
    get color() {
        if (this.isSelf()) {
            return PLAYER_COLOR_SELF;
        } else if (this.isNeutral()) {
            return PLAYER_COLOR_NEUTRAL;
        } else {
            return this._color;
        }
    }

    /**
     * @param {{id: string, color: PlayerColor}} playerData
     * @override
     */
    _update(playerData) {
        let changed = super._update(playerData);
        if (this._color !== playerData.color) {
            this._color = playerData.color;
            changed = true;
        }
        return changed;
    }
}
