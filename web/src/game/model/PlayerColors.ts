export class PlayerColor {
    private readonly _fill: number;
    private readonly _textStroke: number;
    private readonly _textFill: number;

    constructor(fill: number, textStroke: number, textFill: number) {
        this._fill = fill;
        this._textStroke = textStroke;
        this._textFill = textFill;
    }

    get fill(): number {
        return this._fill;
    }

    get textStroke(): number {
        return this._textStroke;
    }

    get textFill(): number {
        return this._textFill;
    }
}

// Generated via https://mokole.com/palette.html.
export const PLAYER_COLORS: PlayerColor[] = [
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

export const PLAYER_COLOR_SELF = new PlayerColor(0x0000ff, 0x000000, 0xeeeeee);
export const PLAYER_COLOR_NEUTRAL = new PlayerColor(0xffffff, 0xeeeeee, 0x0000000);
export const PLAYER_COLOR_NOT_SET = new PlayerColor(0x0, 0x0, 0x0);
