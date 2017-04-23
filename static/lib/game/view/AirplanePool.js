import AirplaneSprite from "./AirplaneSprite.js";

/**
 * @typedef {function} AirplaneCreatorFunc
 * @returns {AirplaneSprite}
 */

export default class AirplanePool {
    /**
     * @param {Number} initialSize
     * @param {AirplaneCreatorFunc} creatorFunc
     */
    constructor(initialSize, creatorFunc) {
        /**
         * @type {[AirplaneSprite]}
         * @private
         */
        this._sprites = [];

        /**
         * @type {AirplaneCreatorFunc}
         * @private
         */
        this._creatorFunc = creatorFunc;

        for (let i = 0; i < initialSize; i++) {
            this._sprites.push(creatorFunc.call(null));
        }
    }

    /**
     * @returns {AirplaneSprite}
     */
    get() {
        return this._sprites.pop() || this._creatorFunc.call(null);
    }

    /**
     * @param {AirplaneSprite} sprite
     */
    put(sprite) {
        sprite.model = null;
        this._sprites.push(sprite);
    }

}
