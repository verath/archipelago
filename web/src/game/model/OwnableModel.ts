import type { wire } from "../../wire/proto_bundle.js";
import type GameModel from "./GameModel.ts";
import type PlayerModel from "./PlayerModel.ts";

/**
 * The data an OwnableModel is updated from.
 */
export interface OwnableData {
    id?: string | null;
    army?: wire.msg.Army.$Properties | null;
}

export default class OwnableModel<TData extends OwnableData = OwnableData> {

    protected _gameModel: GameModel;

    protected _id: string | null = null;

    protected _ownerId: string | null = null;

    protected _strength = 0;

    constructor(gameModel: GameModel) {
        this._gameModel = gameModel;
    }

    get id(): string | null {
        return this._id;
    }

    get owner(): PlayerModel | null {
        if (this._ownerId === this._gameModel.playerNeutral.id) {
            return this._gameModel.playerNeutral;
        } else {
            return this._gameModel.playerById(this._ownerId);
        }
    }

    set owner(owner: PlayerModel | null) {
        this._ownerId = (owner != null) ? owner.id : null;
    }

    get strength(): number {
        return this._strength;
    }

    set strength(strength: number) {
        this._strength = strength;
    }

    /**
     * Updates the model from the given data.
     */
    update(data: TData): void {
        this._id = data.id ?? null;
        this.updateArmy(data.army);
    }

    /**
     * Updates only the army (owner and strength), as sent in a delta.
     */
    updateArmy(armyData: wire.msg.Army.$Properties | null | undefined): void {
        if (armyData == null) {
            throw new Error("OwnableModel: data has no army");
        }
        this._ownerId = armyData.ownerId ?? null;
        this._strength = armyData.strength || 0;
    }
}
