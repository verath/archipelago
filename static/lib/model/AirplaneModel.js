import BaseModel from "./BaseModel";
import Coordinate from "./Coordinate";
import Army from "./Army";

export default class AirplaneModel extends BaseModel {

    /**
     * @param {GameModel} gameModel
     */
    constructor(gameModel) {
        super();

        /**
         * @member {Army}
         * @private
         */
        this._army = new Army(gameModel);

        /**
         * @member {Coordinate}
         * @private
         */
        this._position = new Coordinate();

        /**
         * @member {Number}
         * @private
         */
        this._direction = 0;

        /**
         * @member {Number}
         * @private
         */
        this._speed = 0;
    }

    /**
     * @returns {Army}
     */
    get army() {
        return this._army;
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
     * @returns {?PlayerModel}
     */
    get owner() {
        return this._army.owner;
    }

    /**
     * @param {AirplaneData} airplaneData
     */
    update(airplaneData) {
        let changed = super.update(airplaneData);

        if (!this._army.equals(airplaneData.army)) {
            this._army.set(airplaneData.army);
            changed = true;
        }

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

        if (changed) {
            this._emitChanged();
        }
        return changed;
    }

    interpolate(delta) {
        this._position.x += delta * this._speed * Math.cos(this._direction);
        this._position.y += delta * this._speed * Math.sin(this._direction);
        this._emitChanged();
    }
}