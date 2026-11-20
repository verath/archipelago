import { Ticker } from "pixi.js";

import type Connection from "../../network/Connection.ts";
import type { ServerEvent } from "../../network/Connection.ts";
import { wire } from "../../wire/proto_bundle.js";
import { ProtocolError } from "../model/GameModel.ts";
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
 * Delay before the first retry to resume after the connection broke [ms];
 * doubled after each failed retry, up to RESUME_MAX_RETRY_DELAY.
 */
const RESUME_FIRST_RETRY_DELAY = 250;

const RESUME_MAX_RETRY_DELAY = 2000;

/**
 * GameController
 */
export default class GameController {

    private readonly _connection: Connection;

    private readonly _gameModel: GameModel;

    private _lastUpdateMS = 0;

    private _isGameOver = false;

    private _winnerId: string | null = null;

    /**
     * The seq of the last snapshot or delta, null before the first snapshot.
     */
    private _lastStateSeq: number | null = null;

    /**
     * The seq of our next launch, see ActionGameLaunch.seq.
     */
    private _nextLaunchSeq = 1;

    /**
     * The token to resume the game with if the connection breaks, null if
     * the server gave none (EventGameStart.resume_token).
     */
    private _resumeToken: string | null = null;

    /**
     * How long after the connection broke we may resume [ms].
     */
    private _resumeTimeout = 0;

    /**
     * Until when we try to resume [performance.now() ms], null while the
     * game is running on a connection.
     */
    private _resumeDeadline: number | null = null;

    constructor(connection: Connection, gameModel: GameModel) {
        this._connection = connection;
        this._gameModel = gameModel;
    }


    private _launchAirplane(originIsland: IslandModel, targetIsland: IslandModel): void {
        if (originIsland.id === targetIsland.id) {
            // Target cannot be the same as the origin
            return;
        }
        if (!originIsland.owner?.isSelf()) {
            // The island was taken from us after we selected it.
            return;
        }
        if (originIsland.strength < 2) {
            // Cannot send from island with less than 2 strength
            return;
        }
        // Launch a local airplane, which is replaced once the server has
        // processed the launch.
        // Continue after the server's count, see ActionGameLaunch.seq.
        const seq = Math.max(this._nextLaunchSeq, this._gameModel.myLastLaunchSeq + 1);
        this._nextLaunchSeq = seq + 1;
        this._gameModel.launchAirplane(originIsland, targetIsland, seq);

        // Create and send the action as an ActionEnvelope
        const actEnvelope = new wire.msg.ActionEnvelope();
        actEnvelope.actionGameLaunch = new wire.msg.ActionGameLaunch({
            fromId: originIsland.id,
            toId: targetIsland.id,
            seq,
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
        this._resumeToken = evtStart.resumeToken || null;
        this._resumeTimeout = evtStart.resumeTimeout ?? 0;
        // The server sends the game start again when we resumed.
        this._resumeDeadline = null;
    }

    /**
     * Tries to resume the game on a new connection after the connection
     * broke, retrying until the resume timeout (counted from when it first
     * broke). Resolves to true once a new connection is open; the server
     * then sends the game start and a snapshot.
     */
    private async _resume(): Promise<boolean> {
        if (this._resumeToken === null) {
            return false;
        }
        if (this._resumeDeadline === null) {
            this._resumeDeadline = performance.now() + this._resumeTimeout;
        }
        let retryDelay = RESUME_FIRST_RETRY_DELAY;
        while (performance.now() < this._resumeDeadline) {
            if (await this._connection.resume(this._resumeToken)) {
                // Launches not processed by now may have been lost.
                this._gameModel.dropLocalLaunches();
                return true;
            }
            const wait = Math.min(retryDelay, this._resumeDeadline - performance.now());
            await new Promise(resolve => setTimeout(resolve, Math.max(wait, 0)));
            retryDelay = Math.min(retryDelay * 2, RESUME_MAX_RETRY_DELAY);
        }
        return false;
    }

    private _onSnapshotEvent(snapshot: wire.msg.EventGameSnapshot.$Properties): void {
        asProtocolError(() => this._gameModel.applySnapshot(snapshot));
        this._lastStateSeq = snapshot.seq ?? 0;
    }

    private _onDeltaEvent(delta: wire.msg.EventGameDelta.$Properties): void {
        const seq = delta.seq ?? 0;
        if (this._lastStateSeq === null) {
            throw new ProtocolError("delta before snapshot");
        }
        if (seq !== this._lastStateSeq + 1) {
            // We missed a message, our state is no longer the server's.
            throw new ProtocolError(`delta seq ${seq}, expected ${this._lastStateSeq + 1}`);
        }
        asProtocolError(() => this._gameModel.applyDelta(delta));
        this._lastStateSeq = seq;
    }

    private _onGameOverEvent(evtGameOver: wire.msg.EventGameOver.$Properties): void {
        this._onGameOver(evtGameOver.winnerId ?? null);
    }

    private _onServerEvent(envelope: ServerEvent): void {
        switch (envelope.event) {
            case "eventGameStart":
                this._onGameStartEvent(envelope.eventGameStart);
                break;
            case "eventGameSnapshot":
                this._onSnapshotEvent(envelope.eventGameSnapshot);
                break;
            case "eventGameDelta":
                this._onDeltaEvent(envelope.eventGameDelta);
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
                    // The connection broke. Resume the game on a new one if
                    // we can, otherwise the game is over for us.
                    if (await this._resume()) {
                        continue;
                    }
                    gameResult = { reason: "GAME_OVER", winnerId: "" };
                    break;
                }
                try {
                    this._onServerEvent(this._connection.getNext());
                } catch (err) {
                    if (!(err instanceof ProtocolError)) {
                        throw err;
                    }
                    // Our state is no longer the server's, so the game can't
                    // go on.
                    console.error("GameController:", err);
                    gameResult = { reason: "ERROR" };
                    break;
                }
            }
        } finally {
            // Also stop interpolating if handling a server event throws.
            ticker.destroy();
        }

        return gameResult;
    }
}

/**
 * Runs apply, turning any error into a ProtocolError: a snapshot or delta
 * the model can't apply (e.g. missing fields) leaves the state broken.
 */
function asProtocolError(apply: () => void): void {
    try {
        apply();
    } catch (err) {
        if (err instanceof ProtocolError) {
            throw err;
        }
        throw new ProtocolError(`can't apply server state: ${String(err)}`);
    }
}
