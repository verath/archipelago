import BaseModel from "./BaseModel.ts";
import AirplaneModel from "./AirplaneModel.ts";
import Coordinate from "./Coordinate.ts";
import GameClock from "./GameClock.ts";
import PlayerModel from "./PlayerModel.ts";
import { PLAYER_COLORS, PLAYER_COLOR_NEUTRAL } from "./PlayerColors.ts";
import IslandModel from "./IslandModel.ts";
import LocalAirplaneModel from "./LocalAirplaneModel.ts";
import type { wire } from "../../wire/proto_bundle.js";

/**
 * Thrown when a server message doesn't fit the game state, e.g. a delta
 * that updates an airplane we don't know.
 */
export class ProtocolError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ProtocolError";
    }
}

/**
 * GameModel is the client's copy of the game, as seen by our player. It is
 * built from the server's snapshot and deltas, and moves
 * airplanes itself in between, using a GameClock.
 *
 * Our own launches take effect right away: the island shows the strength
 * taken (IslandModel.addPendingLaunch) and a LocalAirplaneModel flies until
 * the server has processed the launch, as told by our player's
 * last_launch_seq. Then the local airplane is replaced by the server's (or
 * removed, if the launch failed) and the island shows the server's strength.
 */
export default class GameModel extends BaseModel<wire.msg.Game.$Properties> {

    private readonly _size = new Coordinate(0, 0);

    private readonly _playerNeutral: PlayerModel = new PlayerModel(this);

    private _players: PlayerModel[] = [];

    private readonly _playersById = new Map<string | null, PlayerModel>();

    private _islands: IslandModel[] = [];

    private readonly _islandsById = new Map<string | null, IslandModel>();

    /**
     * All airplanes, the server's and our local ones.
     */
    private _airplanes: AirplaneModel[] = [];

    private readonly _airplanesById = new Map<string | null, AirplaneModel>();

    /**
     * Array of FoW status for each tile in the game for the player we
     * represent. `true` if tile in FoW, otherwise `false`. Positions are
     * top-left to bottom-right.
     */
    private _myFogOfWar: boolean[] = [];

    /**
     * Our player's id, i.e. the player we represent.
     */
    private _myPlayerId: string | null = null;

    /**
     * The highest seq of our launches that the server has processed.
     */
    private _myLastLaunchSeq = 0;

    private readonly _clock = new GameClock();

    private readonly _now: () => number;

    /**
     * The game time [ms] of the server state being applied, i.e. what the
     * positions of added airplanes are at.
     */
    private _stateGameTime = 0;

    /**
     * @param now Returns the local time [ms], performance.now() by default.
     */
    constructor(now: () => number = () => performance.now()) {
        super();
        this._now = now;
    }

    private _updatePlayers(players: wire.msg.Player.$Properties[]): boolean {
        let changed = false;
        const numPlayers = this._players.length;

        // Update each player, create new ones if necessary.
        this._players = players.map((playerData, index) => {
            let player = this.playerById(playerData.id ?? null);
            if (!player) {
                player = new PlayerModel(this);
                // A player was added.
                changed = true;
            }
            const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
            const playerDataWithColor = { color, ...playerData };
            player.update(playerDataWithColor);
            this._onPlayerData(playerData);
            return player;
        });
        if (numPlayers !== this._players.length) {
            // A player was removed.
            changed = true;
        }
        this._playersById.clear();
        this._players.forEach(p => this._playersById.set(p.id, p));
        return changed;
    }

    /**
     * Picks up what a player message tells us about our own launches.
     */
    private _onPlayerData(playerData: wire.msg.Player.$Properties): void {
        if (playerData.id === this._myPlayerId) {
            this._myLastLaunchSeq = Math.max(this._myLastLaunchSeq, playerData.lastLaunchSeq ?? 0);
        }
    }

    private _updateAirplanes(airplanes: wire.msg.Airplane.$Properties[]): boolean {
        let changed = false;
        const numAirplanes = this._airplanes.length;

        // Update each airplane, and create new ones if necessary.
        const updated: AirplaneModel[] = airplanes.map(airplaneData => {
            let airplane = this.airplaneById(airplaneData.id ?? null);
            if (!airplane) {
                airplane = new AirplaneModel(this);
                // An airplane was added
                changed = true;
            }
            airplane.update({ ...airplaneData, gameTime: this._stateGameTime });
            return airplane;
        });
        // Keep our local airplanes, see _reconcileLaunches.
        this._airplanes = [...updated, ...this._airplanes.filter(a => a instanceof LocalAirplaneModel)];
        if (numAirplanes !== this._airplanes.length) {
            // An airplane was removed
            changed = true;
        }
        this._airplanesById.clear();
        this._airplanes.forEach(a => this._airplanesById.set(a.id, a));
        return changed;
    }

    private _updateIslands(islands: wire.msg.Island.$Properties[]): boolean {
        let changed = false;
        const numIslands = this._islands.length;

        // Update each island, and create new ones if necessary
        this._islands = islands.map(islandData => {
            let island = this.islandById(islandData.id ?? null);
            if (!island) {
                island = new IslandModel(this);
                // An island was added
                changed = true;
            }
            island.update(islandData);
            return island;
        });
        if (numIslands !== this._islands.length) {
            // An island was removed
            changed = true;
        }
        this._islandsById.clear();
        this._islands.forEach(i => this._islandsById.set(i.id, i));
        return changed;
    }

    private _addAirplane(airplane: AirplaneModel): void {
        this._airplanes.push(airplane);
        this._airplanesById.set(airplane.id, airplane);
    }

    private _removeAirplane(airplane: AirplaneModel): void {
        this._airplanes = this._airplanes.filter(a => a !== airplane);
        this._airplanesById.delete(airplane.id);
    }

    /**
     * Drops what we predicted for our launches that the server has processed:
     * a local airplane is replaced by the server's airplane for the launch
     * (which takes over smoothly from where the local one is), or removed if
     * there is none (the launch failed, or the airplane already arrived).
     * @returns True if an airplane was removed.
     */
    private _reconcileLaunches(): boolean {
        const lastSeq = this._myLastLaunchSeq;
        const processed = this._airplanes.filter(
            (a): a is LocalAirplaneModel => a instanceof LocalAirplaneModel && a.launchSeq <= lastSeq);
        if (processed.length > 0) {
            const gameTime = this.gameTime;
            for (const local of processed) {
                const real = this._airplanes.find(
                    a => !(a instanceof LocalAirplaneModel) && a.launchSeq === local.launchSeq);
                real?.correctFrom(local.position, gameTime);
                this._removeAirplane(local);
            }
        }
        this._islands.forEach(island => island.removePendingLaunches(lastSeq));
        return processed.length > 0;
    }

    private _updateMyFogOfWar(): boolean {
        let changed = false;
        if (this._myFogOfWar.length !== (this._size.x * this._size.y)) {
            this._myFogOfWar = Array<boolean>(this._size.x * this._size.y).fill(false);
            changed = true;
        }
        const myPlayer = this._players.find(p => p.id === this._myPlayerId);
        if (myPlayer === undefined) {
            throw new Error("GameModel: our player is not in the game");
        }
        switch (myPlayer.state) {
            case "ALIVE": {
                const myIslands = this._islands.filter(island => island.owner?.id === this._myPlayerId);
                const myAirplanes = this._airplanes.filter(airplane => airplane.owner?.id === this._myPlayerId);
                const fogOfWar = generateFogOfWar(this._size, myIslands, myAirplanes);
                for (let i = 0; i < fogOfWar.length; i++) {
                    if (this._myFogOfWar[i] !== fogOfWar[i]) {
                        this._myFogOfWar[i] = fogOfWar[i];
                        changed = true;
                    }
                }
                break;
            }
            case "PENDING_REVIVAL": {
                // Pending revival has no vision.
                const anyFalse = (this._myFogOfWar.find(v => !v) !== undefined);
                if (anyFalse) {
                    this._myFogOfWar.fill(true);
                    changed = true;
                }
                break;
            }
            case "DEAD": // Fallthrough.
            case "LEFT_GAME": // Fallthrough.
            default: {
                // Dead has full vision.
                const anyTrue = (this._myFogOfWar.find(v => v) !== undefined);
                if (anyTrue) {
                    this._myFogOfWar.fill(false);
                    changed = true;
                }
                break;
            }
        }
        return changed;
    }

    /**
     * Replaces the game state with the given full state. Its airplanes'
     * positions are at the game time of the snapshot being applied (0 if
     * none), see applySnapshot.
     */
    protected override _update(gameData: wire.msg.Game.$Properties): boolean {
        let changed = super._update(gameData);
        if (!this._size.equals(gameData.size)) {
            if (gameData.size == null) {
                throw new Error("GameModel: data has no size");
            }
            this._size.set(gameData.size);
            changed = true;
        }
        const playerNeutralData = gameData.playerNeutral;
        const playerNeutralDataWithColor = { color: PLAYER_COLOR_NEUTRAL, ...playerNeutralData };
        this._playerNeutral.update(playerNeutralDataWithColor);
        // Missing repeated fields are empty, as in a decoded protobuf message.
        if (this._updatePlayers(gameData.players ?? [])) {
            changed = true;
        }
        // Islands before airplanes, which stop at their destination island.
        if (this._updateIslands(gameData.islands ?? [])) {
            changed = true;
        }
        if (this._updateAirplanes(gameData.airplanes ?? [])) {
            changed = true;
        }
        if (this._reconcileLaunches()) {
            changed = true;
        }
        if (this._updateMyFogOfWar()) {
            changed = true;
        }
        return changed;
    }

    /**
     * Records that a server message with a state at the given game time [ms]
     * arrived now.
     */
    private _onServerTime(gameTime: number | null | undefined): void {
        this._stateGameTime = gameTime ?? 0;
        this._clock.onServerTime(this._stateGameTime, this._now());
    }

    /**
     * Replaces the game state with an EventGameSnapshot's.
     */
    applySnapshot(snapshot: wire.msg.EventGameSnapshot.$Properties): void {
        if (snapshot.game == null) {
            throw new ProtocolError("snapshot has no game");
        }
        this._onServerTime(snapshot.gameTime);
        this.update(snapshot.game);
    }

    /**
     * Applies an EventGameDelta to the game state. Throws a ProtocolError if
     * the delta refers to players, islands or airplanes we don't know (or
     * adds one we do), leaving the state partly updated.
     */
    applyDelta(delta: wire.msg.EventGameDelta.$Properties): void {
        this._onServerTime(delta.gameTime);
        let changed = false;
        for (const playerData of delta.players ?? []) {
            const player = this._playersById.get(playerData.id ?? null);
            if (player == null) {
                throw new ProtocolError(`delta updates unknown player ${playerData.id}`);
            }
            player.updateState(playerData.state);
            this._onPlayerData(playerData);
        }
        for (const islandData of delta.islands ?? []) {
            const island = this._islandsById.get(islandData.id ?? null);
            if (island == null) {
                throw new ProtocolError(`delta updates unknown island ${islandData.id}`);
            }
            island.updateArmy(islandData.army);
        }
        // Removed before added, see EventGameDelta.
        for (const id of delta.airplanesRemoved ?? []) {
            const airplane = this._airplanesById.get(id);
            if (airplane == null || airplane instanceof LocalAirplaneModel) {
                throw new ProtocolError(`delta removes unknown airplane ${id}`);
            }
            this._removeAirplane(airplane);
            changed = true;
        }
        for (const airplaneData of delta.airplanesAdded ?? []) {
            if (this._airplanesById.has(airplaneData.id ?? null)) {
                throw new ProtocolError(`delta adds known airplane ${airplaneData.id}`);
            }
            const airplane = new AirplaneModel(this);
            airplane.update({ ...airplaneData, gameTime: this._stateGameTime });
            this._addAirplane(airplane);
            changed = true;
        }
        for (const airplaneData of delta.airplanesUpdated ?? []) {
            const airplane = this._airplanesById.get(airplaneData.id ?? null);
            if (airplane == null || airplane instanceof LocalAirplaneModel) {
                throw new ProtocolError(`delta updates unknown airplane ${airplaneData.id}`);
            }
            airplane.updateArmy(airplaneData.army);
        }
        if (this._reconcileLaunches()) {
            changed = true;
        }
        if (this._updateMyFogOfWar()) {
            changed = true;
        }
        if (changed) {
            this._emitChanged();
        }
    }

    get size(): Coordinate {
        return this._size;
    }

    get playerNeutral(): PlayerModel {
        return this._playerNeutral;
    }

    get islands(): IslandModel[] {
        return this._islands;
    }

    get airplanes(): AirplaneModel[] {
        return this._airplanes;
    }

    get myFogOfWar(): boolean[] {
        return this._myFogOfWar;
    }

    /**
     * Player id that we are representing.
     */
    get myPlayerId(): string | null {
        return this._myPlayerId;
    }

    set myPlayerId(playerId: string | null) {
        if (this._myPlayerId !== playerId) {
            this._myPlayerId = playerId;
            this._emitChanged();
        }
    }

    /**
     * The highest seq of our launches that the server has processed.
     */
    get myLastLaunchSeq(): number {
        return this._myLastLaunchSeq;
    }

    /**
     * The estimated game time [ms] now, see GameClock.
     */
    get gameTime(): number {
        return this._clock.gameTimeAt(this._now());
    }

    /**
     * @param airplaneId An id identifying the model
     * @returns The airplane, if found.
     */
    airplaneById(airplaneId: string | null): AirplaneModel | null {
        return this._airplanesById.get(airplaneId) ?? null;
    }

    /**
     * @param islandId An id identifying the model
     * @returns The island, if found.
     */
    islandById(islandId: string | null): IslandModel | null {
        return this._islandsById.get(islandId) ?? null;
    }

    /**
     * @returns The player, if found.
     */
    playerById(playerId: string | null): PlayerModel | null {
        return this._playersById.get(playerId) ?? null;
    }

    /**
     * Shows our launch `seq` from origin to target right away: takes half
     * the origin's strength (rounded down) into a local airplane, until the
     * server has processed the launch.
     */
    launchAirplane(origin: IslandModel, target: IslandModel, seq: number): void {
        const airplaneStrength = Math.floor(origin.strength / 2);
        origin.addPendingLaunch(seq, airplaneStrength);

        const airplane = new LocalAirplaneModel(this, origin, target, airplaneStrength, seq, this.gameTime);
        this._addAirplane(airplane);

        // Since we changed the airplane array, we notify
        // our change listeners
        this._emitChanged();
    }

    /**
     * Drops what we predicted for our launches that the server hasn't
     * processed yet: their local airplanes, and the strength they took from
     * islands. Used when reconnecting, as such launches may have been lost
     * with the old connection; the snapshot then shows what happened.
     */
    dropLocalLaunches(): void {
        const locals = this._airplanes.filter(a => a instanceof LocalAirplaneModel);
        locals.forEach(local => this._removeAirplane(local));
        this._islands.forEach(island => island.clearPendingLaunches());
        if (locals.length > 0) {
            this._emitChanged();
        }
    }

    /**
     * Moves airplanes to where they are now.
     * @param delta [ms] Time since the previous call.
     */
    interpolate(delta: number): void {
        const gameTime = this.gameTime;
        this._airplanes.forEach(airplane => airplane.advance(gameTime, delta));
    }
}

function generateFogOfWar(gameSize: Coordinate, playerIslands: IslandModel[], playerAirplanes: AirplaneModel[]): boolean[] {
    const fogOfWar = Array<boolean>(gameSize.x * gameSize.y).fill(true);
    const roundAwayZero = (n: number): number => Math.sign(n) * Math.round(Math.abs(n));
    const clearArea = (center: Coordinate, radius: number) => {
        const [cx, cy] = [roundAwayZero(center.x), roundAwayZero(center.y)];
        const [xStart, xEnd] = [Math.max(cx - radius, 0), Math.min(cx + radius, gameSize.x - 1)];
        const [yStart, yEnd] = [Math.max(cy - radius, 0), Math.min(cy + radius, gameSize.y - 1)];
        for (let x = xStart; x <= xEnd; x++) {
            for (let y = yStart; y <= yEnd; y++) {
                const idx = y * gameSize.x + x;
                fogOfWar[idx] = false;
            }
        }
    };
    playerIslands.forEach(island => {
        const isLargeIsland = (island.size === 1);
        clearArea(island.position, (isLargeIsland ? 2 : 1));
    });
    playerAirplanes.forEach(airplane => {
        clearArea(airplane.position, 1);
    });
    return fogOfWar;
}
