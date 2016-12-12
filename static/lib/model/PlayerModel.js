import BaseModel from "./BaseModel";

export default class PlayerModel extends BaseModel {

    constructor() {
        super();

        /**
         * @member {?string}
         * @private
         */
        this._name = null;
    }

    /**
     * @returns {?string}
     */
    get name() {
        return this._name;
    }

    /**
     * @param {PlayerData} playerData
     */
    update(playerData) {
        let changed = super.update(playerData);

        if (this._name !== playerData.name) {
            this._name = playerData.name;
            changed = true;
        }

        if (changed) {
            this._emitChanged();
        }
        return changed;
    }
}