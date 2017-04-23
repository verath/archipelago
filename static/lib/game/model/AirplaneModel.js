import Coordinate from "./Coordinate.js";
import OwnableModel from "./OwnableModel.js";

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
     * @param {AirplaneData} airplaneData
     * @override
     */
    _update(airplaneData) {
        let changed = super._update(airplaneData);

        if (!this._position.equals(airplaneData.position)) {
            this._position.set(airplaneData.position);
            changed = true;
        }

        if (this._direction !== airplaneData.direction) {
            this._direction = airplaneData.direction;
            changed = true;
        }

        if (this._speed !== airplaneData.speed) {
            this._speed = airplaneData.speed;
            changed = true;
        }

        return changed;
    }

    interpolate(delta) {
        this._position.x += delta * this._speed * Math.cos(this._direction);
        this._position.y += delta * this._speed * Math.sin(this._direction);
        this._emitChanged();
    }
}