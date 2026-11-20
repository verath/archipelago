import type { wire } from "../../wire/proto_bundle.js";
import BaseModel, { type ModelData } from "./BaseModel.ts";
import type GameModel from "./GameModel.ts";
import type PlayerModel from "./PlayerModel.ts";

/**
 * The data an OwnableModel is updated from.
 */
export interface OwnableData extends ModelData {
    army?: wire.msg.Army.$Properties | null;
}

export default class OwnableModel<TData extends OwnableData = OwnableData> extends BaseModel<TData> {

    protected _gameModel: GameModel;

    protected _ownerId: string | null = null;

    protected _strength = 0;

    constructor(gameModel: GameModel) {
        super();
        this._gameModel = gameModel;
    }

    get owner(): PlayerModel | null {
        if (this._ownerId === this._gameModel.playerNeutral.id) {
            return this._gameModel.playerNeutral;
        } else {
            return this._gameModel.playerById(this._ownerId);
        }
    }

    set owner(owner: PlayerModel | null) {
        const newOwnerId = (owner != null) ? owner.id : null;
        if (this._ownerId !== newOwnerId) {
            this._ownerId = newOwnerId;
            this._emitChanged();
        }
    }

    get strength(): number {
        return this._strength;
    }

    set strength(strength: number) {
        if (this._strength !== strength) {
            this._strength = strength;
            this._emitChanged();
        }
    }

    protected override _update(data: TData): boolean {
        let changed = super._update(data);
        const armyData = data.army;
        if (armyData == null) {
            throw new Error("OwnableModel: data has no army");
        }
        const ownerId = armyData.ownerId ?? null;
        if (this._ownerId !== ownerId) {
            this._ownerId = ownerId;
            changed = true;
        }
        const strength = armyData.strength || 0;
        if (this._strength !== strength) {
            this._strength = strength;
            changed = true;
        }
        return changed;
    }

}
