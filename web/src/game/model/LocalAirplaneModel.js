import AirplaneModel from "./AirplaneModel.js";
import GameModel from "./GameModel.js";
import IslandModel from "./IslandModel.js";

const NANOSECONDS_PER_SECOND = 1e9;
export const DEFAULT_AIRPLANE_SPEED = 1 / (2 * NANOSECONDS_PER_SECOND);

let airplane_id_count = 0;

/**
 * @extends AirplaneModel
 */
export default class LocalAirplaneModel extends AirplaneModel {

    /**
     * @param {GameModel} gameModel
     * @param {IslandModel} origin
     * @param {IslandModel} target
     * @param {Number} strength
     */
    constructor(gameModel, origin, target, strength) {
        super(gameModel);
        this._id = "local-" + (++airplane_id_count);
        this._position.x = origin.position.x;
        this._position.y = origin.position.y;
        this.owner = origin.owner;
        this.strength = strength;
        this._speed = DEFAULT_AIRPLANE_SPEED;

        let dy = target.position.y - origin.position.y;
        let dx = target.position.x - origin.position.x;
        this._direction = Math.atan2(dy, dx);
    }
}
