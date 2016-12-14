export default class Army {
    /**
     * @param gameModel {GameModel}
     */
    constructor(gameModel) {
        /**
         * @member {GameModel}
         * @private
         */
        this._gameModel = gameModel;

        /**
         * @member {?string}
         * @private
         */
        this._ownerId = null;

        /**
         * @type {Number}
         * @private
         */
        this._strength = 0;
    }

    /**
     * @returns {?string}
     */
    get ownerId() {
        return this._ownerId;
    }

    /**
     * @returns {?string}
     */
    get owner_id() {
        return this.ownerId;
    }

    /**
     * @returns {Number}
     */
    get strength() {
        return this._strength;
    }

    /**
     * @returns {?PlayerModel}
     */
    get owner() {
        return this._gameModel.playerById(this._ownerId);
    }

    /**
     * @param {string} newOwnerId
     * @param {Number} newStrength
     */
    set({owner_id: newOwnerId, strength: newStrength}) {
        this._ownerId = newOwnerId;
        this._strength = newStrength;
    }

    /**
     * @param {{owner_id: string, strength: Number}} other
     * @returns {boolean}
     */
    equals(other) {
        return (
            other != null &&
            this._ownerId === other.owner_id &&
            this._strength === other.strength
        )
    }
}