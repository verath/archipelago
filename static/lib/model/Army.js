export const OWNER_SELF = Symbol("OWNER_SELF");
export const OWNER_NEUTRAL = Symbol("OWNER_NEUTRAL");
export const OWNER_ENEMY = Symbol("OWNER_ENEMY");

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
     * @returns {Symbol}
     */
    get owner() {
        let owningPlayer = this._gameModel.playerById(this._ownerId);
        if (owningPlayer.isSelf()) {
            return OWNER_SELF;
        } else if (owningPlayer.isNeutral()) {
            return OWNER_NEUTRAL;
        } else {
            return OWNER_ENEMY;
        }
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