import BaseModel from "./BaseModel";
import Coordinate from "./Coordinate";
import Army from "./Army";

export default class IslandModel extends BaseModel {

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
         * @member {number}
         * @private
         */
        this._size = 0;

        /**
         * @member {boolean}
         * @private
         */
        this._selected = false;
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
     * @returns {?PlayerModel}
     */
    get owner() {
        return this._army.owner;
    }

    /**
     * @returns {boolean}
     */
    get selected() {
        return this._selected;
    }

    /**
     * @param {boolean} isSelected
     */
    set selected(isSelected) {
        if (this._selected !== isSelected) {
            this._selected = isSelected;
            this._emitChanged();
        }
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