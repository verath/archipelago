import BaseModel from "./BaseModel";
import Coordinate from "./Coordinate";
import Army from "./Army";

export default class IslandModel extends BaseModel {
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
         * @member {number}
         * @private
         */
        this._size = 0;
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
    get size() {
        return this._size;
    }

    /**
     * @param {IslandData} islandData
     */
    update(islandData) {
        let changed = super.update(islandData);

        if (!this._army.equals(islandData.army)) {
            this._army.set(islandData.army);
            changed = true;
        }

        if (!this._position.equals(islandData.position)) {
            this._position.set(islandData.position);
            changed = true;
        }

        if (this._size !== islandData.size) {
            this._size = islandData.size;
            changed = true;
        }

        if (changed) {
            this._emitChanged();
        }
        return changed;
    }
}