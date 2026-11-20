import type { wire } from "../../wire/proto_bundle.js";
import Coordinate from "./Coordinate.ts";
import OwnableModel from "./OwnableModel.ts";


const NANOSECONDS_PER_SECOND = 1e9;
const MILLISECONDS_PER_NANOSECOND = 1e6;
export const DEFAULT_AIRPLANE_SPEED = (1 / (3 * NANOSECONDS_PER_SECOND)) * MILLISECONDS_PER_NANOSECOND;

export default class AirplaneModel extends OwnableModel<wire.msg.Airplane.$Properties> {

    protected readonly _position = new Coordinate();

    protected _direction = 0;

    /**
     * [tiles/ms]
     */
    protected _speed = 0;

    get position(): Coordinate {
        return this._position;
    }

    get direction(): number {
        return this._direction;
    }

    get speed(): number {
        return this._speed;
    }

    protected override _update(airplaneData: wire.msg.Airplane.$Properties): boolean {
        super._update({ id: airplaneData.id, army: airplaneData.army });
        if (airplaneData.position == null) {
            throw new Error("AirplaneModel: data has no position");
        }
        // Missing scalars are 0, as in a decoded protobuf message.
        const newX = airplaneData.position.x ?? 0;
        const newY = airplaneData.position.y ?? 0;
        // Force set our position to the current server position if
        // we are more than a tile away
        if (Math.hypot(newY - this._position.y, newX - this._position.x) > 1) {
            this._position.x = newX;
            this._position.y = newY;
        }
        // Calculate the position we believe the airplane will be at next
        // tick, and set our speed and direction to reach that point until
        // then. By doing this instead of setting position directly, we can
        // smooth out the change of position over the entire tickInterval,
        // making for less janky movement.
        const tickInterval = this._gameModel.serverTickInterval;
        const speed = airplaneData.speed || DEFAULT_AIRPLANE_SPEED;
        const direction = airplaneData.direction ?? 0;
        const nextX = newX + speed * Math.cos(direction) * tickInterval;
        const nextY = newY + speed * Math.sin(direction) * tickInterval;
        const diffX = nextX - this._position.x;
        const diffY = nextY - this._position.y;
        const distance = Math.hypot(diffY, diffX);
        this._speed = distance / tickInterval;
        this._direction = Math.atan2(diffY, diffX);
        return true;
    }

    /**
     * @param delta [ms]
     */
    override interpolate(delta: number): void {
        this._position.x += delta * this._speed * Math.cos(this._direction);
        this._position.y += delta * this._speed * Math.sin(this._direction);
        this._emitChanged();
    }
}
