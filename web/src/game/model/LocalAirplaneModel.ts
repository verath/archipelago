import AirplaneModel, { DEFAULT_AIRPLANE_SPEED } from "./AirplaneModel.ts";
import type GameModel from "./GameModel.ts";
import type IslandModel from "./IslandModel.ts";

let airplane_id_count = 0;

export default class LocalAirplaneModel extends AirplaneModel {

    constructor(gameModel: GameModel, origin: IslandModel, target: IslandModel, strength: number) {
        super(gameModel);
        this._id = "local-" + (++airplane_id_count);
        this._position.x = origin.position.x;
        this._position.y = origin.position.y;
        this.owner = origin.owner;
        this.strength = strength;
        this._speed = DEFAULT_AIRPLANE_SPEED;

        const dy = target.position.y - origin.position.y;
        const dx = target.position.x - origin.position.x;
        this._direction = Math.atan2(dy, dx);
    }
}
