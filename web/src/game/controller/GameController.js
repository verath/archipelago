import EventEmitter from "eventemitter3";
import * as PIXI from "pixi.js";

import Connection from "../../network/Connection.js";
import { wire } from "../../wire/proto_bundle.js";
import GameModel from "../model/GameModel.js";
import IslandModel from "../model/IslandModel.js";
import GameView from "../view/GameView.js";

const EVENT_GAME_START = Symbol("EVENT_GAME_START");

export default class GameController {

    /**
     * @param {Connection} connection
     * @param {GameModel} gameModel
     * @param {GameView} gameView
     */
    constructor(connection, gameModel, gameView) {
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
         * @member {GameView}
         * @private
         */
        this._gameView = gameView;

        /**
         * @type {PIXI.ticker.Ticker}
         * @private
         */
        this._ticker = new PIXI.ticker.Ticker();

        /**
         * @member {number}
         */
        this._lastUpdateMS = 0;

        /**
         * @member EventEmitter
         * @private
         */
        this._eventEmitter = new EventEmitter();

        // Setup event listeners
        this._connection.addServerEventListener(this._onServerEvent, this);
        this._connection.addDisconnectListener(this._onDisconnect, this);
        this._gameView.addIslandClickListener(this._onIslandClicked, this);
        this._ticker.add(this._onTick, this);
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
        let actEnvelope = new wire.ActionEnvelope();
        actEnvelope.actionGameLaunch = new wire.ActionGameLaunch({
            fromId: originIsland.id,
            toId: targetIsland.id
        });
        this._connection.sendAction(actEnvelope);
    }

    /**
     * @param {wire.EventGameStart} evtStart
     * @private
     */
    _onGameStartEvent(evtStart) {
        if (this._started) {
            throw new Error("Start event when already started");
        }
        this._started = true;
        this._gameModel.myPlayerId = evtStart.playerId;
        this._gameModel.serverTickInterval = evtStart.tickInterval;
        // Starts the ticker, calling this._onTick
        this._ticker.start();

        // Notify our listeners that the game is now actually started
        this._eventEmitter.emit(EVENT_GAME_START);
    }

    /**
     * @param {wire.EventGameTick} evtTick
     * @private
     */
    _onTickEvent(evtTick) {
        this._lastUpdateMS = performance.now();
        this._gameModel.update(evtTick.game);
    }

    /**
     * @param {wire.EventGameOver} evtGameOver
     * @private
     */
    _onGameOverEvent(evtGameOver) {
        this._onGameOver(evtGameOver.winnerId === this._gameModel.myPlayerId);
    }

    /**
     * @param {wire.EventEnvelope} envelope
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

    _onDisconnect() {
        this._onGameOver(false);
    }

    /**
     * @param {boolean} isWinner
     * @private
     */
    _onGameOver(isWinner) {
        // Remove listeners
        this._connection.removeServerEventListener(this._onServerEvent, this);
        this._connection.removeDisconnectListener(this._onDisconnect, this);
        this._gameView.removeIslandClickListener(this._onIslandClicked, this);
        // Close the connection, and stop view animation
        this._connection.disconnect();
        this._ticker.stop();

        this._gameView.render();
        // TODO: show game over screen...
        if (isWinner) {
            alert("Game Over\nYou Won!");
        } else {
            alert("Game Over\nYou Lost!");
        }
    }

    /**
     * @param {string} islandId
     * @private
     */
    _onIslandClicked(islandId) {
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

    _onTick() {
        let now = performance.now();
        let delta = now - (this._lastUpdateMS || now);
        this._lastUpdateMS = now;

        this._gameModel.interpolate(delta);
        this._gameView.render();
    }

    run() {
        this._connection.connect();
    }

    /**
     * @returns {Connection}
     */
    get connection() {
        return this._connection;
    }

    /**
     * @returns {GameModel}
     */
    get gameModel() {
        return this._gameModel;
    }

    /**
     * @returns {GameView}
     */
    get gameView() {
        return this._gameView;
    }

    addGameStartListener(listener, context = null) {
        this._eventEmitter.on(EVENT_GAME_START, listener, context);
    }

    removeGameStartListener(listener, context = null) {
        this._eventEmitter.off(EVENT_GAME_START, listener, context);
    }
}
