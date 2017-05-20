export default class Coordinate {

    /**
     * Creates a new Coordinate. A coordinate represents
     * a location on the game board, where (0,0) is the
     * top left corner and (width-1, height-1) is the
     * bottom right corner.
     *
     * Default pos is to set the position way outside the
     * screen, so we don't accidentally draw something
     * that has not been positioned yet
     *
     * @param {Number} [x=-1000] The initial x value
     * @param {Number} [y=-1000] The initial y value
     */
    constructor(x = -1000, y = -1000) {
        /**
         * @member {Number}
         * @private
         */
        this._x = x;
        /**
         * @member {Number}
         * @private
         */
        this._y = y;
    }

    /**
     * @returns {Number}
     */
    get x() {
        return this._x;
    }

    /**
     * @returns {Number}
     */
    get y() {
        return this._y;
    }

    /**
     * @param {Number} newX
     */
    set x(newX) {
        this._x = newX;
    }

    /**
     * @param {Number} newY
     */
    set y(newY) {
        this._y = newY;
    }

    /**
     * @param {Number} newX
     * @param {Number} newY
     */
    set({x: newX, y: newY}) {
        this.x = newX;
        this.y = newY;
    }

    /**
     * @param {{x: Number, y:Number}} other
     */
    equals(other) {
        return (
            other !== null &&
            this._x === other.x &&
            this._y === other.y
        );
    }

}