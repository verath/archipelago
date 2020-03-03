import BaseModel from "./BaseModel.js";
import AirplaneModel from "./AirplaneModel.js";
import Coordinate from "./Coordinate.js";
import PlayerModel from "./PlayerModel.js";
import IslandModel from "./IslandModel.js";
import LocalAirplaneModel from "./LocalAirplaneModel.js";
import { wire } from "../../wire/proto_bundle.js";

export default class GameModel extends BaseModel {

    constructor() {
        super();

        /**
         * @member {Coordinate}
         * @private
         */
        this._size = new Coordinate(0, 0);

        /**
         * @member {PlayerModel}
         * @private
         */
        this._player1 = new PlayerModel(this);

        /**
         * @member {PlayerModel}
         * @private
         */
        this._player2 = new PlayerModel(this);

        /**
         * @member {PlayerModel}
         * @private
         */
        this._playerNeutral = new PlayerModel(this);

        /**
         * @member [IslandModel]
         * @private
         */
        this._islands = [];

        /**
         * @member [AirplaneModel]
         * @private
         */
        this._airplanes = [];

        /**
         * Our player's id, i.e. the player we represent.
         * @type {?string}
         * @private
         */
        this._myPlayerId = null;

        /**
         * The approximate tick interval (i.e. time between ticks)
         * of the server, in nanoseconds.
         * @type {number}
         * @private
         */
        this._serverTickInterval = 1;
    }

    /**
     * @param {wire.game.IAirplane[]} airplanes
     * @returns {Boolean}
     * @private
     */
    _updateAirplanes(airplanes) {
        let changed = false;
        let numAirplanes = this._airplanes.length;

        // Update each airplane, and create new ones if necessary
        this._airplanes = airplanes.map(airplaneData => {
            let airplane = this.airplaneById(airplaneData.id);
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

    /**
     * @param {wire.game.IIsland[]} islands
     * @returns {Boolean}
     * @private
     */
    _updateIslands(islands) {
        let changed = false;
        let numIslands = this._islands.length;

        // Update each island, and create new ones if necessary
        this._islands = islands.map(islandData => {
            let island = this.islandById(islandData.id);
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

    /**
     * @param gameData {wire.game.Game}
     * @override
     * @inheritDoc
     */
    _update(gameData) {
        let changed = super._update(gameData);
        if (!this._size.equals(gameData.size)) {
            this._size.set(gameData.size);
            changed = true;
        }
        if (this._updateAirplanes(gameData.airplanes)) {
            changed = true;
        }
        if (this._updateIslands(gameData.islands)) {
            changed = true;
        }
        this._player1.update(gameData.player1);
        this._player2.update(gameData.player2);
        this._playerNeutral.update(gameData.playerNeutral);
        return changed;
    }

    /**
     * @returns {Coordinate}
     */
    get size() {
        return this._size;
    }

    /**
     * @returns {PlayerModel}
     */
    get player1() {
        return this._player1;
    }

    /**
     * @returns {PlayerModel}
     */
    get player2() {
        return this._player2;
    }

    /**
     * @returns {PlayerModel}
     */
    get playerNeutral() {
        return this._playerNeutral;
    }

    /**
     * @returns {IslandModel[]}
     */
    get islands() {
        return this._islands;
    }

    /**
     * @returns {AirplaneModel[]}
     */
    get airplanes() {
        return this._airplanes;
    }

    /**
     * Player id that we are representing.
     * @returns {?string}
     */
    get myPlayerId() {
        return this._myPlayerId;
    }

    /**
     * @param {?string} playerId
     */
    set myPlayerId(playerId) {
        if (this._myPlayerId !== playerId) {
            this._myPlayerId = playerId;
            this._emitChanged();
        }
    }

    /**
     * @param {number} tickInterval
     */
    set serverTickInterval(tickInterval) {
        if (this._serverTickInterval !== tickInterval) {
            this._serverTickInterval = tickInterval;
            this._emitChanged();
        }
    }

    /**
     * @returns {number}
     */
    get serverTickInterval() {
        return this._serverTickInterval;
    }

    /**
     * @param {string} airplaneId An id identifying the model
     * @returns {?AirplaneModel} The airplane, if found.
     */
    airplaneById(airplaneId) {
        return this._airplanes.find(airplaneModel => airplaneModel.id === airplaneId) || null;
    }

    /**
     * @param {string} islandId An id identifying the model
     * @returns {?IslandModel} The island, if found.
     */
    islandById(islandId) {
        return this._islands.find(islandModel => islandModel.id === islandId) || null;
    }

    /**
     * @param {string} playerId
     * @returns {?PlayerModel} The player, if found.
     */
    playerById(playerId) {
        if (this._player1.id === playerId) {
            return this._player1;
        } else if (this._player2.id === playerId) {
            return this._player2;
        } else if (this._playerNeutral.id === playerId) {
            return this._playerNeutral;
        }
        return null;
    }

    /**
     * @param {IslandModel} origin
     * @param {IslandModel} target
     */
    launchAirplane(origin, target) {
        // Take strength from the island
        let airplaneStrength = Math.floor(origin.strength / 2);
        origin.strength -= airplaneStrength;

        // Create a new "local" airplane
        let airplane = new LocalAirplaneModel(this, origin, target, airplaneStrength);
        this._airplanes.push(airplane);

        // Since we changed the airplane array, we notify
        // our change listeners
        this._emitChanged();
    }

    interpolate(delta) {
        this._airplanes.forEach(airplane => airplane.interpolate(delta));
        this._islands.forEach(island => island.interpolate(delta));
    }
}
