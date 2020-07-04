import BaseModel from "./BaseModel.js";
import GameModel from "./GameModel.js";
import { PlayerColor, PLAYER_COLOR_NOT_SET, PLAYER_COLOR_SELF, PLAYER_COLOR_NEUTRAL } from "./PlayerColors.js";
import { wire } from "../../wire/proto_bundle.js";

/**
 * @typedef {"ALIVE" | "PENDING_REVIVAL" | "DEAD" | "LEFT_GAME"} PlayerState
 */

/**
 * @extends BaseModel
 */
export default class PlayerModel extends BaseModel {

    /**
     * @param {GameModel} gameModel
     */
    constructor(gameModel) {
        super();

        /**
         * @type {GameModel}
         * @private
         */
        this._gameModel = gameModel;

        /**
         * The color of this player.
         * @type {PlayerColor}
         * @private
         */
        this._color = PLAYER_COLOR_NOT_SET;

        /**
         * @type {PlayerState} 
         */
        this._state = "ALIVE";
    }

    /**
     * Returns true if the PlayerModel represents our current player.
     * @returns {boolean}
     */
    isSelf() {
        return (this.id === this._gameModel.myPlayerId);
    }

    /**
     * Returns true if the player is the neutral player.
     * @returns {boolean}
     */
    isNeutral() {
        return (this.id === this._gameModel.playerNeutral.id);
    }

    /**
     * Returns true if the player is the enemy player
     * @returns {boolean}
     */
    isEnemy() {
        return !(this.isSelf() || this.isNeutral());
    }

    /**
     * Returns PlayerColor for the player.
     * @returns {PlayerColor}
     */
    get color() {
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
     * @returns {PlayerState}
     */
    get state() {
        return this._state;
    }

    /**
     * @param {{id: string, state: wire.game.PlayerState, color: PlayerColor}} playerData
     * @override
     */
    _update(playerData) {
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
 * @param {wire.game.PlayerState} playerState 
 * @return {PlayerState}
 */
function decodePlayerState(playerState) {
    switch (playerState) {
        default: // Fallthrough, protobuf uses first entry as default.
        case wire.game.PlayerState.ALIVE:
            return "ALIVE";
        case wire.game.PlayerState.PENDING_REVIVAL:
            return "PENDING_REVIVAL";
        case wire.game.PlayerState.DEAD:
            return "DEAD";
        case wire.game.PlayerState.LEFT_GAME:
            return "LEFT_GAME";
    }
}
