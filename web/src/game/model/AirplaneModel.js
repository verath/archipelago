import { wire } from "../../wire/proto_bundle.js";
import Coordinate from "./Coordinate.js";
import GameModel from "./GameModel.js";
import OwnableModel from "./OwnableModel.js";


const NANOSECONDS_PER_SECOND = 1e9;
const MILLISECONDS_PER_NANOSECOND = 1e6;
export const DEFAULT_AIRPLANE_SPEED = (1 / (3 * NANOSECONDS_PER_SECOND)) * MILLISECONDS_PER_NANOSECOND;

/**
 * @extends OwnableModel
 */
export default class AirplaneModel extends OwnableModel {

    /**
     * @param {GameModel} gameModel
     */
    constructor(gameModel) {
        super(gameModel);

        /**
         * @member {Coordinate}
         * @protected
         */
        this._position = new Coordinate();

        /**
         * @member {Number}
         * @protected
         */
        this._direction = 0;

        /**
         * [tiles/ms]
         * @member {Number}
         * @protected
         */
        this._speed = 0;
    }

    /**
     * @returns {Coordinate}
     */
    get position() {
        return this._position;
    }

    /**
     * @returns {Number}
     */
    get direction() {
        return this._direction;
    }

    /**
     * @returns {Number}
     */
    get speed() {
        return this._speed;
    }

    /**
     * @param {wire.msg.IAirplane} airplaneData
     * @override
     */
    _update(airplaneData) {
        super._update({ id: airplaneData.id, army: airplaneData.army });
        let newX = airplaneData.position.x;
        let newY = airplaneData.position.y;
        // Force set our position to the current server position if
        // we are more than a tile away
        if (Math.hypot(newY - this._position.y, newX - this._position.x) > 1) {
            this._position.x = airplaneData.position.x;
            this._position.y = airplaneData.position.y;
        }
        // Calculate the position we believe the airplane will be at next
        // tick, and set our speed and direction to reach that point until
        // then. By doing this instead of setting position directly, we can
        // smooth out the change of position over the entire tickInterval,
        // making for less janky movement.
        let tickInterval = this._gameModel.serverTickInterval;
        let speed = airplaneData.speed || DEFAULT_AIRPLANE_SPEED;
        let direction = airplaneData.direction;
        let nextX = newX + speed * Math.cos(direction) * tickInterval;
        let nextY = newY + speed * Math.sin(direction) * tickInterval;
        let diffX = nextX - this._position.x;
        let diffY = nextY - this._position.y;
        let distance = Math.hypot(diffY, diffX);
        this._speed = distance / tickInterval;
        this._direction = Math.atan2(diffY, diffX);
        return true;
    }

    /**
     * @param {number} delta [ms]
     */
    interpolate(delta) {
        this._position.x += delta * this._speed * Math.cos(this._direction);
        this._position.y += delta * this._speed * Math.sin(this._direction);
        this._emitChanged();
    }
}
