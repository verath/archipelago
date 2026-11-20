import type { wire } from "../../wire/proto_bundle.js";
import Coordinate from "./Coordinate.ts";
import OwnableModel from "./OwnableModel.ts";

/**
 * The default airplane speed [tiles/ms], used when the server sends none. The
 * same as AirplaneDefaultSpeed on the server: 1 tile per 3 seconds.
 */
export const DEFAULT_AIRPLANE_SPEED = 1 / 3000;

/**
 * How fast a correction of the displayed position fades out [ms]: after this
 * long, 1/e (37%) of it remains.
 */
const CORRECTION_TIME_CONSTANT = 150;

/**
 * The data an AirplaneModel is updated from: the airplane as the server sent
 * it, and the game time [ms] that its position is at.
 */
export interface AirplaneData extends wire.msg.Airplane.$Properties {
    gameTime: number;
}

/**
 * An airplane flies in a straight line at a constant speed. The server sends
 * it once, with its position at some game time; the airplane computes where it
 * is at any later game time from that, stopping at its destination.
 */
export default class AirplaneModel extends OwnableModel<AirplaneData> {

    /**
     * The displayed position: the computed position plus a fading correction.
     */
    protected readonly _position = new Coordinate();

    /**
     * Where the airplane was at _startTime.
     */
    protected readonly _startPosition = new Coordinate();

    /**
     * [ms] game time.
     */
    protected _startTime = 0;

    protected _direction = 0;

    /**
     * [tiles/ms]
     */
    protected _speed = DEFAULT_AIRPLANE_SPEED;

    protected _destinationId: string | null = null;

    protected _launchSeq = 0;

    /**
     * Offset of the displayed position from the computed one, fading to 0.
     */
    private readonly _correction = new Coordinate(0, 0);

    /**
     * Distance from the start position to the destination island, null if
     * there is none (or we don't know it), undefined if not computed yet.
     * Islands don't move, so it is computed once.
     */
    private _toDestination: number | null | undefined = undefined;

    get position(): Coordinate {
        return this._position;
    }

    get direction(): number {
        return this._direction;
    }

    /**
     * [tiles/ms]
     */
    get speed(): number {
        return this._speed;
    }

    get destinationId(): string | null {
        return this._destinationId;
    }

    /**
     * The seq of our launch that created the airplane, 0 if not ours or not
     * created by a launch.
     */
    get launchSeq(): number {
        return this._launchSeq;
    }

    protected override _update(airplaneData: AirplaneData): boolean {
        super._update(airplaneData);
        if (airplaneData.position == null) {
            throw new Error("AirplaneModel: data has no position");
        }
        // Missing scalars are 0, as in a decoded protobuf message.
        this._startPosition.x = airplaneData.position.x ?? 0;
        this._startPosition.y = airplaneData.position.y ?? 0;
        this._startTime = airplaneData.gameTime;
        this._direction = airplaneData.direction ?? 0;
        this._speed = airplaneData.speed || DEFAULT_AIRPLANE_SPEED;
        this._destinationId = airplaneData.destinationId || null;
        this._launchSeq = airplaneData.launchSeq ?? 0;
        this._position.set(this._startPosition);
        this._correction.x = this._correction.y = 0;
        this._toDestination = undefined;
        return true;
    }

    /**
     * Returns where the airplane is at the given game time [ms]. Before its
     * start time it is at its start position; it never flies past its
     * destination island.
     */
    positionAt(gameTime: number): { x: number, y: number } {
        const distance = this._distanceAt(gameTime);
        return {
            x: this._startPosition.x + distance * Math.cos(this._direction),
            y: this._startPosition.y + distance * Math.sin(this._direction),
        };
    }

    /**
     * How far the airplane has flown from its start position at gameTime.
     */
    private _distanceAt(gameTime: number): number {
        const distance = this._speed * Math.max(gameTime - this._startTime, 0);
        if (this._toDestination === undefined) {
            const destination = this._gameModel.islandById(this._destinationId);
            this._toDestination = (destination == null) ? null : Math.hypot(
                destination.position.x - this._startPosition.x,
                destination.position.y - this._startPosition.y);
        }
        return (this._toDestination === null) ? distance : Math.min(distance, this._toDestination);
    }

    /**
     * Moves the displayed position to where the airplane is at the given game
     * time, and fades out any correction.
     * @param gameTime [ms]
     * @param delta [ms] Time since the previous call.
     */
    advance(gameTime: number, delta: number): void {
        const fade = Math.exp(-Math.max(delta, 0) / CORRECTION_TIME_CONSTANT);
        this._correction.x *= fade;
        this._correction.y *= fade;
        // Not positionAt, to not allocate every frame.
        const distance = this._distanceAt(gameTime);
        this._position.x = this._startPosition.x + distance * Math.cos(this._direction) + this._correction.x;
        this._position.y = this._startPosition.y + distance * Math.sin(this._direction) + this._correction.y;
        this._emitChanged();
    }

    /**
     * Displays the airplane at `from` and lets it smoothly catch up with where
     * it is. Used when it replaces the local airplane we showed for our
     * launch.
     */
    correctFrom(from: { x: number, y: number }, gameTime: number): void {
        const position = this.positionAt(gameTime);
        this._correction.x = from.x - position.x;
        this._correction.y = from.y - position.y;
        this._position.x = from.x;
        this._position.y = from.y;
        this._emitChanged();
    }
}
