import { wire } from "../../wire/proto_bundle.js";
import BaseModel from "./BaseModel.js";
import GameModel from "./GameModel.js";
import PlayerModel from "./PlayerModel.js";

/**
 * @extends BaseModel
 */
export default class OwnableModel extends BaseModel {

    /**
     * @param {GameModel} gameModel
     */
    constructor(gameModel) {
        super();

        /**
         * @member {GameModel}
         * @private
         */
        this._gameModel = gameModel;

        /**
         * @member {?string}
         * @protected
         */
        this._ownerId = null;

        /**
         * @type {Number}
         * @protected
         */
        this._strength = 0;
    }

    /**
     * @returns {?PlayerModel}
     */
    get owner() {
        return this._gameModel.playerById(this._ownerId);
    }

    /**
     * @param {?PlayerModel} owner
     */
    set owner(owner) {
        let newOwnerId = (owner != null) ? owner.id : null;
        if (this._ownerId !== newOwnerId) {
            this._ownerId = newOwnerId;
            this._emitChanged();
        }
    }

    /**
     * @returns {Number}
     */
    get strength() {
        return this._strength;
    }

    /**
     * @param {Number} strength
     */
    set strength(strength) {
        if (this._strength !== strength) {
            this._strength = strength;
            this._emitChanged();
        }
    }

    /**
     * @param {{army: wire.game.Army, id: string}} data
     * @override
     */
    _update(data) {
        let changed = super._update(data);
        let armyData = data.army;
        if (this._ownerId !== armyData.ownerId) {
            this._ownerId = armyData.ownerId;
            changed = true;
        }
        if (this._strength !== armyData.strength) {
            this._strength = armyData.strength;
            changed = true;
        }
        return changed;
    }

}
