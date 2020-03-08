export class PlayerColor {
    /**
     * 
     * @param {number} fill
     * @param {number} textStroke
     * @param {number} textFill
     */
    constructor(fill, textStroke, textFill) {
        /**
         * @type {number}
         * @private
         */
        this._fill = fill;

        /**
         * @type {number}
         * @private
         */
        this._textStroke = textStroke;

        /**
         * @type {number}
         * @private
         */
        this._textFill = textFill;
    }

    /**
     * @returns {number}
     */
    get fill() {
        return this._fill;
    }

    /**
     * @returns {number}
     */
    get textStroke() {
        return this._textStroke;
    }

    /**
     * @returns {number}
     */
    get textFill() {
        return this._textFill;
    }
}

/**
 * @type PlayerColor[]
 */
// Generated via https://mokole.com/palette.html.
export const PLAYER_COLORS = [
    // darkslategray
    new PlayerColor(0x2f4f4f, 0x000000, 0xeeeeee),
    // forestgreen
    new PlayerColor(0x228b22, 0x228b22, 0x000000),
    // indigo
    new PlayerColor(0x4b0082, 0x000000, 0xeeeeee),
    // darkorange
    new PlayerColor(0xff8c00, 0xff8c00, 0x000000),
    // burlywood
    new PlayerColor(0xdeb887, 0xdeb887, 0x000000),
    // lime
    new PlayerColor(0x00ff00, 0x00ff00, 0x000000),
    // deepskyblue
    new PlayerColor(0x00bfff, 0x00bfff, 0x000000),
    // [blue => PLAYER_COLOR_SELF]
    // fuchsia
    new PlayerColor(0xff00ff, 0xff00ff, 0x000000),
    // laserlemon
    new PlayerColor(0xffff54, 0xffff54, 0x000000),
    // plum
    new PlayerColor(0xdda0dd, 0xdda0dd, 0x000000),
    // deeppink
    new PlayerColor(0xff1493, 0xff1493, 0x000000),
    // aquamarine
    new PlayerColor(0x7fffd4, 0x7fffd4, 0x000000),
    // darkred
    new PlayerColor(0x8b0000, 0x8b0000, 0x000000),
];

/** @type PlayerColor */
export const PLAYER_COLOR_SELF = new PlayerColor(0x0000ff, 0x000000, 0xeeeeee);
/** @type PlayerColor */
export const PLAYER_COLOR_NEUTRAL = new PlayerColor(0xffffff, 0xeeeeee, 0x0000000);
/** @type PlayerColor */
export const PLAYER_COLOR_NOT_SET = new PlayerColor(0x0, 0x0, 0x0);
