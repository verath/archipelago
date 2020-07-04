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
     * @param {number} [x=-1000] The initial x value
     * @param {number} [y=-1000] The initial y value
     */
    constructor(x = -1000, y = -1000) {
        /**
         * @member {number}
         * @private
         */
        this._x = x || 0;
        /**
         * @member {number}
         * @private
         */
        this._y = y || 0;
    }

    /**
     * @returns {number}
     */
    get x() {
        return this._x;
    }

    /**
     * @returns {number}
     */
    get y() {
        return this._y;
    }

    /**
     * @param {number} newX
     */
    set x(newX) {
        this._x = newX || 0;
    }

    /**
     * @param {number} newY
     */
    set y(newY) {
        this._y = newY || 0;
    }

    /**
     * @param {{x: number?, y: number?}} newPos
     */
    set({ x: newX, y: newY }) {
        this.x = newX || 0;
        this.y = newY || 0;
    }

    /**
     * @param {{x: number?, y:number?}} other
     */
    equals(other) {
        if (!other) {
            return false;
        }
        const otherX = other.x || 0;
        const otherY = other.y || 0;
        return (this._x === otherX && this._y === otherY);
    }
}
