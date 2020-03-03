import { wire } from "../../wire/proto_bundle.js";
import BaseModel from "./BaseModel.js";
import GameModel from "./GameModel.js";

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
     * @param {wire.game.Player} playerData
     * @override
     */
    _update(playerData) {
        return super._update(playerData);
    }
}
