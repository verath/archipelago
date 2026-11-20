import BaseModel from "./BaseModel.ts";
import type GameModel from "./GameModel.ts";
import { type PlayerColor, PLAYER_COLOR_NOT_SET, PLAYER_COLOR_SELF, PLAYER_COLOR_NEUTRAL } from "./PlayerColors.ts";
import { wire } from "../../wire/proto_bundle.js";

export type PlayerState = "ALIVE" | "PENDING_REVIVAL" | "DEAD" | "LEFT_GAME";

/**
 * The data a PlayerModel is updated from: the wire player, plus the color
 * assigned to it by the GameModel.
 */
export interface PlayerData extends wire.msg.Player.$Properties {
    color: PlayerColor;
}

export default class PlayerModel extends BaseModel<PlayerData> {

    private readonly _gameModel: GameModel;

    /**
     * The color of this player.
     */
    private _color: PlayerColor = PLAYER_COLOR_NOT_SET;

    private _state: PlayerState = "ALIVE";

    constructor(gameModel: GameModel) {
        super();
        this._gameModel = gameModel;
    }

    /**
     * Returns true if the PlayerModel represents our current player.
     */
    isSelf(): boolean {
        return (this.id === this._gameModel.myPlayerId);
    }

    /**
     * Returns true if the player is the neutral player.
     */
    isNeutral(): boolean {
        return (this.id === this._gameModel.playerNeutral.id);
    }

    /**
     * Returns true if the player is the enemy player
     */
    isEnemy(): boolean {
        return !(this.isSelf() || this.isNeutral());
    }

    /**
     * Returns PlayerColor for the player.
     */
    get color(): PlayerColor {
        if (this.isSelf()) {
            return PLAYER_COLOR_SELF;
        } else if (this.isNeutral()) {
            return PLAYER_COLOR_NEUTRAL;
        } else {
            return this._color;
        }
    }

    /**
     * Returns the current PlayerState of the player.
     */
    get state(): PlayerState {
        return this._state;
    }

    protected override _update(playerData: PlayerData): boolean {
        let changed = super._update(playerData);
        if (this._color !== playerData.color) {
            this._color = playerData.color;
            changed = true;
        }
        const playerState = decodePlayerState(playerData.state);
        if (this._state !== playerState) {
            this._state = playerState;
            changed = true;
        }
        return changed;
    }
}

/**
 * Decodes from wire representation of PlayerState to model PlayerState.
 */
function decodePlayerState(playerState: wire.msg.PlayerState | null | undefined): PlayerState {
    switch (playerState) {
        default: // Fallthrough, protobuf uses first entry as default.
        case wire.msg.PlayerState.ALIVE:
            return "ALIVE";
        case wire.msg.PlayerState.PENDING_REVIVAL:
            return "PENDING_REVIVAL";
        case wire.msg.PlayerState.DEAD:
            return "DEAD";
        case wire.msg.PlayerState.LEFT_GAME:
            return "LEFT_GAME";
    }
}
