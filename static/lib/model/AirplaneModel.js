import BaseModel from "./BaseModel";
import Coordinate from "./Coordinate";
import Army from "./Army";

export default class AirplaneModel extends BaseModel {

    constructor() {
        super();

        /**
         * @member {Army}
         * @private
         */
        this._army = new Army();

        /**
         * @member {Coordinate}
         * @private
         */
        this._position = new Coordinate();

        /**
         * @member {Coordinate}
         * @private
         */
        this._destination = new Coordinate();

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
     * @returns {Coordinate}
     */
    get destination() {
        return this._destination;
    }

    /**
     * @returns {Number}
     */
    get speed() {
        return this._speed;
    }

    /**
     * @param {AirplaneData} airplaneData
     */
    update(airplaneData) {
        let changed = super.update(airplaneData);

        if(!this._army.equals(airplaneData.army)) {
            this._army.set(airplaneData.army);
            changed = true;
        }

        if(!this._position.equals(airplaneData.position)) {
            this._position.set(airplaneData.position);
            changed = true;
        }

        if(!this._destination.equals(airplaneData.destination)) {
            this._destination.set(airplaneData.destination);
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
}