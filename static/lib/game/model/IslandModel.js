import Coordinate from "./Coordinate";
import OwnableModel from "./OwnableModel";

export default class IslandModel extends OwnableModel {

    /**
     * @param {GameModel} gameModel
     */
    constructor(gameModel) {
        super(gameModel);

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
     * @override
     */
    _update(islandData) {
        let changed = super._update(islandData);

        if (!this._position.equals(islandData.position)) {
            this._position.set(islandData.position);
            changed = true;
        }

        if (this._size !== islandData.size) {
            this._size = islandData.size;
            changed = true;
        }

        return changed;
    }
}