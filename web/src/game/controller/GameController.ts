import { Ticker } from "pixi.js";

import type Connection from "../../network/Connection.ts";
import type { ServerEvent } from "../../network/Connection.ts";
import { wire } from "../../wire/proto_bundle.js";
import type GameModel from "../model/GameModel.ts";
import type IslandModel from "../model/IslandModel.ts";

export interface GameResultGameOver {
    reason: "GAME_OVER";
    winnerId: string | null;
}

export interface GameResultError {
    reason: "ERROR";
}

export type GameResult = GameResultGameOver | GameResultError;

/**
 * GameController
 */
export default class GameController {

    private readonly _connection: Connection;

    private readonly _gameModel: GameModel;

    private _lastUpdateMS = 0;

    private _isGameOver = false;

    private _winnerId: string | null = null;

    constructor(connection: Connection, gameModel: GameModel) {
        this._connection = connection;
        this._gameModel = gameModel;
    }


    private _launchAirplane(originIsland: IslandModel, targetIsland: IslandModel): void {
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
        const actEnvelope = new wire.msg.ActionEnvelope();
        actEnvelope.actionGameLaunch = new wire.msg.ActionGameLaunch({
            fromId: originIsland.id,
            toId: targetIsland.id
        });
        this._connection.sendAction(actEnvelope);
    }

    private _interpolate(): void {
        const now = performance.now();
        const delta = now - (this._lastUpdateMS || now);
        this._lastUpdateMS = now;
        this._gameModel.interpolate(delta);
    }

    private _onGameOver(winnerId: string | null): void {
        this._winnerId = winnerId;
        this._isGameOver = true;
    }

    private _onGameStartEvent(evtStart: wire.msg.EventGameStart.$Properties): void {
        // Missing scalars are their defaults, as in a decoded protobuf message.
        this._gameModel.myPlayerId = evtStart.playerId ?? null;
        this._gameModel.serverTickInterval = evtStart.tickInterval ?? 0;
    }

    private _onTickEvent(evtTick: wire.msg.EventGameTick.$Properties): void {
        // TODO: Network latency compensation?
        this._lastUpdateMS = performance.now();
        if (evtTick.game == null) {
            throw new Error("GameController: eventGameTick has no game");
        }
        this._gameModel.update(evtTick.game);
    }

    private _onGameOverEvent(evtGameOver: wire.msg.EventGameOver.$Properties): void {
        this._onGameOver(evtGameOver.winnerId ?? null);
    }

    private _onServerEvent(envelope: ServerEvent): void {
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

    onIslandClicked(islandId: string | null): void {
        if (this._isGameOver) {
            return;
        }

        const clickedIsland = this._gameModel.islandById(islandId);
        if (!clickedIsland) {
            console.warn("_onIslandClicked: clickedIsland does not exist");
            return;
        }

        const selectedIsland = this._gameModel.islands.find(island => island.selected);
        if (selectedIsland) {
            selectedIsland.selected = false;
            this._launchAirplane(selectedIsland, clickedIsland);
        } else {
            // If we didn't have an island select already, select the clicked island
            // if it is owned by us.
            if (clickedIsland.owner?.isSelf()) {
                clickedIsland.selected = true;
            }
        }
    }

    async run(): Promise<GameResult> {
        const ticker = new Ticker();
        ticker.add(this._interpolate, this);

        let gameResult: GameResult;
        ticker.start();
        try {
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
        } finally {
            // Also stop interpolating if handling a server event throws.
            ticker.destroy();
        }

        return gameResult;
    }
}
