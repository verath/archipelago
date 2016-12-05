import EventEmitter from 'eventemitter3'

export default class GameModel {

    constructor() {
        this._eventEmitter = new EventEmitter();
        this._airplanes = [];
    }

    /**
     * @returns {AirplaneModel[]}
     */
    get airplanes() {
        return this._airplanes;
    }

    interpolate() {
    }

    /**
     * @param {string} jsonGame
     */
    update(jsonGame) {
        let gm = new GameModel();
        gm.airplanes = jsonGame.Airplanes.map(airplane => new AirplaneModel());
        this._eventEmitter.emit("change");
    }
}

