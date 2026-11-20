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

    /**
     * Updates only the army (owner and strength), as sent in a delta. A change
     * event is emitted if it changed.
     */
    updateArmy(armyData: wire.msg.Army.$Properties | null | undefined): void {
        if (this._applyArmy(armyData)) {
            this._emitChanged();
        }
    }

    protected override _update(data: TData): boolean {
        const changed = super._update(data);
        return this._applyArmy(data.army) || changed;
    }

    private _applyArmy(armyData: wire.msg.Army.$Properties | null | undefined): boolean {
        if (armyData == null) {
            throw new Error("OwnableModel: data has no army");
        }
        let changed = false;
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
