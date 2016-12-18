import BaseModel from "./BaseModel";

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
         * @member {?string}
         * @private
         */
        this._name = null;
    }

    /**
     * @returns {?string}
     */
    get name() {
        return this._name;
    }

    /**
     * Returns true if the PlayerModel represents our current player.
     * @returns {boolean}
     */
    isSelf() {
        return (this.id === this._gameModel.playerId)
    }

    /**
     * Returns true if the player is the neutral player.
     * @returns {boolean}
     */
    isNeutral() {
        return (this.id === this._gameModel.playerNeutral.id)
    }

    /**
     * Returns true if the player is the enemy player
     * @returns {boolean}
     */
    isEnemy() {
        return !(this.isSelf() || this.isNeutral());
    }

    /**
     * @param {PlayerData} playerData
     * @override
     */
    _update(playerData) {
        let changed = super._update(playerData);
        if (this._name !== playerData.name) {
            this._name = playerData.name;
            changed = true;
        }
        return changed;
    }
}