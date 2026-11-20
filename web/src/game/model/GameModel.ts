import BaseModel from "./BaseModel.ts";
import AirplaneModel from "./AirplaneModel.ts";
import Coordinate from "./Coordinate.ts";
import PlayerModel from "./PlayerModel.ts";
import { PLAYER_COLORS, PLAYER_COLOR_NEUTRAL } from "./PlayerColors.ts";
import IslandModel from "./IslandModel.ts";
import LocalAirplaneModel from "./LocalAirplaneModel.ts";
import type { wire } from "../../wire/proto_bundle.js";

export default class GameModel extends BaseModel<wire.msg.Game.$Properties> {

    private readonly _size = new Coordinate(0, 0);

    private readonly _playerNeutral: PlayerModel = new PlayerModel(this);

    private _players: PlayerModel[] = [];

    private _islands: IslandModel[] = [];

    private _airplanes: AirplaneModel[] = [];

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
     * The approximate tick interval (i.e. time between ticks)
     * of the server, in milliseconds.
     */
    private _serverTickInterval = 1;

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
            return player;
        });
        if (numPlayers !== this._players.length) {
            // A player was removed.
            changed = true;
        }
        return changed;
    }

    private _updateAirplanes(airplanes: wire.msg.Airplane.$Properties[]): boolean {
        let changed = false;
        const numAirplanes = this._airplanes.length;

        // Update each airplane, and create new ones if necessary
        this._airplanes = airplanes.map(airplaneData => {
            let airplane = this.airplaneById(airplaneData.id ?? null);
            if (!airplane) {
                airplane = new AirplaneModel(this);
                // An airplane was added
                changed = true;
            }
            airplane.update(airplaneData);
            return airplane;
        });
        if (numAirplanes !== this._airplanes.length) {
            // An airplane was removed
            changed = true;
        }
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
        return changed;
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
        if (this._updateAirplanes(gameData.airplanes ?? [])) {
            changed = true;
        }
        if (this._updateIslands(gameData.islands ?? [])) {
            changed = true;
        }
        if (this._updateMyFogOfWar()) {
            changed = true;
        }
        return changed;
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
     * @param tickInterval [ms]
     */
    set serverTickInterval(tickInterval: number) {
        if (this._serverTickInterval !== tickInterval) {
            this._serverTickInterval = tickInterval;
            this._emitChanged();
        }
    }

    /**
     * @returns [ms]
     */
    get serverTickInterval(): number {
        return this._serverTickInterval;
    }

    /**
     * @param airplaneId An id identifying the model
     * @returns The airplane, if found.
     */
    airplaneById(airplaneId: string | null): AirplaneModel | null {
        return this._airplanes.find(airplaneModel => airplaneModel.id === airplaneId) || null;
    }

    /**
     * @param islandId An id identifying the model
     * @returns The island, if found.
     */
    islandById(islandId: string | null): IslandModel | null {
        return this._islands.find(islandModel => islandModel.id === islandId) || null;
    }

    /**
     * @returns The player, if found.
     */
    playerById(playerId: string | null): PlayerModel | null {
        return this._players.find(playerModel => playerModel.id === playerId) || null;
    }

    launchAirplane(origin: IslandModel, target: IslandModel): void {
        // Take strength from the island
        const airplaneStrength = Math.floor(origin.strength / 2);
        origin.strength -= airplaneStrength;

        // Create a new "local" airplane
        const airplane = new LocalAirplaneModel(this, origin, target, airplaneStrength);
        this._airplanes.push(airplane);

        // Since we changed the airplane array, we notify
        // our change listeners
        this._emitChanged();
    }

    /**
     * @param delta [ms]
     */
    override interpolate(delta: number): void {
        this._airplanes.forEach(airplane => airplane.interpolate(delta));
        this._islands.forEach(island => island.interpolate(delta));
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
