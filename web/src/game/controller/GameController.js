import * as PIXI from "pixi.js";

import Connection from "../../network/Connection.js";
import { wire } from "../../wire/proto_bundle.js";
import GameModel from "../model/GameModel.js";
import IslandModel from "../model/IslandModel.js";

/**
 * @typedef {(GameResultGameOver | GameResultError)} GameResult
 *
 * @typedef GameResultGameOver
 * @property {"GAME_OVER"} reason
 * @property {?string} winnerId
 *
 * @typedef GameResultError
 * @property {"ERROR"} reason
 */

/**
 * GameController
 */
export default class GameController {

    /**
     * @param {Connection} connection
     * @param {GameModel} gameModel
     */
    constructor(connection, gameModel) {
        /**
         * @member {Connection}
         * @private
         */
        this._connection = connection;

        /**
         * @member {GameModel}
         * @private
         */
        this._gameModel = gameModel;

        /**
         * @member {number}
         * @private
         */
        this._lastUpdateMS = 0;

        /**
         * @member {boolean}
         * @private
         */
        this._isGameOver = false;

        /**
         * @member {?string}
         * @private
         */
        this._winnerId = null;
    }


    /**
     * @param {IslandModel} originIsland
     * @param {IslandModel} targetIsland
     * @private
     */
    _launchAirplane(originIsland, targetIsland) {
        if (originIsland.id === targetIsland.id) {
            // Target cannot be the same as the origin
            return;
        }
        if (originIsland.strength < 2) {
            // Cannot send from island with less than 2 strength
            return;
        }
        // Launch a local dummy airplane, which will be replaced
        // once we hear back from the server.
        this._gameModel.launchAirplane(originIsland, targetIsland);

        // Create and send the action as an ActionEnvelope
        let actEnvelope = new wire.msg.ActionEnvelope();
        actEnvelope.actionGameLaunch = new wire.msg.ActionGameLaunch({
            fromId: originIsland.id,
            toId: targetIsland.id
        });
        this._connection.sendAction(actEnvelope);
    }

    _interpolate() {
        let now = performance.now();
        let delta = now - (this._lastUpdateMS || now);
        this._lastUpdateMS = now;
        this._gameModel.interpolate(delta);
    }

    /**
     * @param {?string} winnerId
     * @private
     */
    _onGameOver(winnerId) {
        this._winnerId = winnerId;
        this._isGameOver = true;
    }

    /**
     * @param {wire.msg.IEventGameStart} evtStart
     * @private
     */
    _onGameStartEvent(evtStart) {
        this._gameModel.myPlayerId = evtStart.playerId;
        this._gameModel.serverTickInterval = evtStart.tickInterval;
    }

    /**
     * @param {wire.msg.IEventGameTick} evtTick
     * @private
     */
    _onTickEvent(evtTick) {
        // TODO: Network latency compensation?
        this._lastUpdateMS = performance.now();
        this._gameModel.update(evtTick.game);
    }

    /**
     * @param {wire.msg.IEventGameOver} evtGameOver
     * @private
     */
    _onGameOverEvent(evtGameOver) {
        this._onGameOver(evtGameOver.winnerId);
    }

    /**
     * @param {wire.msg.EventEnvelope} envelope
     * @private
     */
    _onServerEvent(envelope) {
        switch (envelope.event) {
            case "eventGameStart":
                this._onGameStartEvent(envelope.eventGameStart);
                break;
            case "eventGameTick":
                this._onTickEvent(envelope.eventGameTick);
                break;
            case "eventGameOver":
                this._onGameOverEvent(envelope.eventGameOver);
                break;
            default:
                console.log("Unknown event type:", envelope.event, envelope);
        }
    }

    /**
     * @param {string} islandId
     */
    onIslandClicked(islandId) {
        if (this._isGameOver) {
            return;
        }

        let clickedIsland = this._gameModel.islandById(islandId);
        if (!clickedIsland) {
            console.warn("_onIslandClicked: clickedIsland does not exist");
            return;
        }

        let selectedIsland = this._gameModel.islands.find(island => island.selected);
        if (selectedIsland) {
            selectedIsland.selected = false;
            this._launchAirplane(selectedIsland, clickedIsland);
        } else {
            // If we didn't have an island select already, select the clicked island
            // if it is owned by us.
            if (clickedIsland.owner.isSelf()) {
                clickedIsland.selected = true;
            }
        }
    }

    /**
     * @returns {Promise<GameResult>}
     */
    async run() {
        let ticker = new PIXI.ticker.Ticker();
        ticker.add(this._interpolate, this);

        /**@type {GameResult} */
        let gameResult = null;
        ticker.start();
        for (; ;) {
            if (this._isGameOver) {
                gameResult = { reason: "GAME_OVER", winnerId: this._winnerId };
                break;
            }
            while (!this._connection.hasNext() && await this._connection.waitNext()) {
                //
            }
            if (!this._connection.hasNext()) {
                // TODO: reason: "ERROR".
                gameResult = { reason: "GAME_OVER", winnerId: "" };
                break;
            }
            this._onServerEvent(this._connection.getNext());
        }
        ticker.stop();

        return gameResult;
    }
}
