import { wire } from "../../wire/proto_bundle.js";
import Coordinate from "./Coordinate.js";
import GameModel from "./GameModel.js";
import OwnableModel from "./OwnableModel.js";

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
     * @param {wire.game.IIsland} islandData
     * @override
     */
    _update(islandData) {
        let changed = super._update(islandData);
        if (!this._position.equals(islandData.position)) {
            this._position.set(islandData.position);
            changed = true;
        }
        const size = islandData.size || 0;
        if (this._size !== size) {
            this._size = size;
            changed = true;
        }
        return changed;
    }
}
