import BaseModel from "./BaseModel";
import AirplaneModel from "./AirplaneModel";
import Coordinate from "./Coordinate";
import PlayerModel from "./PlayerModel";
import IslandModel from "./IslandModel";

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
        this._player1 = new PlayerModel();

        /**
         * @member {PlayerModel}
         * @private
         */
        this._player2 = new PlayerModel();

        /**
         * @member {PlayerModel}
         * @private
         */
        this._playerNeutral = new PlayerModel();

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
    }

    /**
     * @param {string} airplaneId An id identifying the model
     * @returns {AirplaneModel | undefined} The model, if found.
     * @private
     */
    _airplaneById(airplaneId) {
        return this._airplanes.find(airplaneModel => airplaneModel.id === airplaneId);
    }

    /**
     * @param {string} islandId An id identifying the model
     * @returns {IslandModel | undefined} The model, if found.
     * @private
     */
    _islandById(islandId) {
        return this._islands.find(islandModel => islandModel.id === islandId);
    }

    /**
     * @param {[AirplaneData]} data
     * @returns {Boolean}
     * @private
     */
    _updateAirplanes(data) {
        let changed = false;
        let numAirplanes = this._airplanes.length;

        // Update each airplane, and create new ones if necessary
        this._airplanes = data.map(airplaneData => {
            let airplane = this._airplaneById(airplaneData.id);
            if (!airplane) {
                airplane = new AirplaneModel();
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
     * @param {[IslandData]} data
     * @returns {Boolean}
     * @private
     */
    _updateIslands(data) {
        let changed = false;
        let numIslands = this._islands.length;

        // Update each island, and create new ones if necessary
        this._islands = data.map(islandData => {
            let island = this._islandById(islandData.id);
            if (!island) {
                island = new IslandModel();
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
     * @returns {[IslandModel]}
     */
    get islands() {
        return this._islands;
    }

    /**
     * @returns {[AirplaneModel]}
     */
    get airplanes() {
        return this._airplanes;
    }

    /**
     * @param gameData {GameData}
     * @inheritDoc
     */
    update(gameData) {
        let changed = super.update(gameData);

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
        this._playerNeutral.update(gameData.player_neutral);

        if (changed) {
            this._emitChanged();
        }
        return changed;
    }
}
