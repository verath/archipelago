import * as PIXI from 'pixi.js'
import $ from 'jquery'
import GameModel from '../model/game'

export default class GameController {

    /**
     *
     * @param {GameModel} gameModel
     * @param {GameView} gameView
     */
    constructor(gameModel, gameView) {
        this._gameModel = gameModel;
        this._gameView = gameView;
        this._playerId = null;

        this._ticker = new PIXI.ticker.Ticker();
        this._ticker.add(this._onTick, this);
    }

    _onGameCreatedEvent(data) {
        this._playerId = data;
        // Start drawing
        window.requestAnimationFrame(this._onAnimate);
    }

    _onTickEvent(data) {
        this._gameModel.update(data);
        this._lastUpdate = Date.now();
    }

    _onServerEvent(event) {
        let data = event.Data;
        switch (event.Name) {
            case "game_created":
                this._onGameCreatedEvent(data);
                break;
            case "tick":
                this._onTickEvent(data);
                break;
            default:
                console.log("Unknown event:", event.Name, event);
        }
    }

    _onTick(delta) {
        this._gameModel.interpolate(delta);
        this._gameView.render();
    }

    run() {
        //this._ticker.start();
        this._onServerEvent(gameCreatedEvent);
        this._onServerEvent(gameTickEvent);
    }
}


let gameCreatedEvent = {
    "Name": "game_created",
    "Data": "f398748e-b4d3-4481-71e3-9a734afb7417"
};

let gameTickEvent = {
    "Name": "tick",
    "Data": {
        "Airplanes": [
            {
                "ID": "cd1abe8e-0c81-4039-7a31-e8b63375113c",
                "Army": {
                    "OwnerID": "f398748e-b4d3-4481-71e3-9a734afb7417",
                    "Strength": 5
                },
                "Position": {
                    "X": 1.4142135623730951,
                    "Y": 1.4142135623730951
                },
                "Destination": {
                    "X": 9,
                    "Y": 9
                },
                "Speed": 0.001
            }
        ]
    }
};