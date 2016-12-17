import AirplaneSprite from "./AirplaneSprite";
export default class AirplanePool {

    constructor(initialSize) {
        /**
         * @type {[AirplaneSprite]}
         * @private
         */
        this._sprites = [];

        for (let i = 0; i < initialSize; i++) {
            this._sprites.push(new AirplaneSprite());
        }
    }

    /**
     * @returns {AirplaneSprite}
     */
    get() {
        return this._sprites.pop() || new AirplaneSprite();
    }

    /**
     * @param {AirplaneSprite} sprite
     */
    put(sprite) {
        sprite.model = null;
        this._sprites.push(sprite);
    }

}