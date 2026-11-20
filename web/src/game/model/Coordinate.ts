/**
 * Anything with an (optional) x and y, e.g. a wire.msg.Coordinate.
 */
export interface CoordinateLike {
    x?: number | null;
    y?: number | null;
}

export default class Coordinate {

    private _x: number;
    private _y: number;

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
     * @param x The initial x value
     * @param y The initial y value
     */
    constructor(x = -1000, y = -1000) {
        this._x = x || 0;
        this._y = y || 0;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    set x(newX: number) {
        this._x = newX || 0;
    }

    set y(newY: number) {
        this._y = newY || 0;
    }

    set({ x: newX, y: newY }: CoordinateLike): void {
        this.x = newX || 0;
        this.y = newY || 0;
    }

    equals(other: CoordinateLike | null | undefined): boolean {
        if (!other) {
            return false;
        }
        const otherX = other.x || 0;
        const otherY = other.y || 0;
        return (this._x === otherX && this._y === otherY);
    }
}
