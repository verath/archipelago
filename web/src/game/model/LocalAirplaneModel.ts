import AirplaneModel, { DEFAULT_AIRPLANE_SPEED } from "./AirplaneModel.ts";
import type GameModel from "./GameModel.ts";
import type IslandModel from "./IslandModel.ts";

let airplane_id_count = 0;

/**
 * The airplane we show for one of our launches until the server has
 * processed the launch (see GameModel), so that it takes off right away.
 */
export default class LocalAirplaneModel extends AirplaneModel {

    /**
     * @param seq The seq of the launch, see ActionGameLaunch.seq.
     * @param gameTime [ms] The game time of the launch.
     */
    constructor(gameModel: GameModel, origin: IslandModel, target: IslandModel, strength: number, seq: number, gameTime: number) {
        super(gameModel);
        this._id = "local-" + (++airplane_id_count);
        this._startPosition.set(origin.position);
        this._startTime = gameTime;
        this._position.set(origin.position);
        this._ownerId = origin.owner?.id ?? null;
        this._strength = strength;
        this._speed = DEFAULT_AIRPLANE_SPEED;
        this._destinationId = target.id;
        this._launchSeq = seq;

        const dy = target.position.y - origin.position.y;
        const dx = target.position.x - origin.position.x;
        this._direction = Math.atan2(dy, dx);
    }
}
