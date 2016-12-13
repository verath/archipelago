import * as PIXI from 'pixijs'

export default class GameController {

    /**
     *
     * @param {GameModel} gameModel
     * @param {GameView} gameView
     */
    constructor(gameModel, gameView) {
        this._gameModel = gameModel;
        this._gameView = gameView;

        this._ticker = new PIXI.ticker.Ticker();
        this._ticker.add(this._onTick, this);
    }

    /**
     * @param {GameStartEventData} data
     * @private
     */
    _onGameStartEvent(data) {
        if (this._started) {
            throw new Error("Start event when already started");
        }
        this._started = true;
        this._gameModel.playerId = data.player_id;
        // Starts the ticker, calling this._onTick
        this._ticker.start();
    }

    /**
     * @param {TickEventData} data
     * @private
     */
    _onTickEvent(data) {
        this._gameModel.update(data);
    }

    /**
     * @param {ServerEvent} event
     * @private
     */
    _onServerEvent(event) {
        switch (event.name) {
            case "game_start":
                this._onGameStartEvent(event.data);
                break;
            case "tick":
                this._onTickEvent(event.data);
                break;
            default:
                console.log("Unknown event:", event.name, event);
        }
    }

    _onTick(delta) {
        this._gameModel.interpolate(delta);
        this._gameView.render();
    }

    run() {
        this._onServerEvent(gameStartEvent);
        this._onServerEvent(gameTickEvent);
        window.setTimeout(() => {
            gameTickEvent.data.islands.pop();
            this._onServerEvent(gameTickEvent);
            this._gameModel.islands[2].selected = true;
        }, 2000);
    }
}


let gameStartEvent = {
    "name": "game_start",
    "data": {
        "player_id": "ae5d1b2d-4e84-4f26-4c37-46ba2e95adbb"
    }
};

let gameTickEvent = {
    "name": "tick",
    "data": {
        "id": "5019a71a-ebdd-4f7e-5242-2b3fa2cf80bb",
        "size": {
            "x": 9,
            "y": 9
        },
        "player1": {
            "id": "ae5d1b2d-4e84-4f26-4c37-46ba2e95adbb",
            "name": "player1"
        },
        "player2": {
            "id": "ca2c0a00-7dc6-43d2-673d-40eddc682113",
            "name": "player2"
        },
        "player_neutral": {
            "id": "fa5a3d69-edb7-476d-4277-c8aa1b2509a8",
            "name": "neutral"
        },
        "islands": [
            {
                "id": "6abdaae9-7533-4edf-7f2f-1d213f98dfbe",
                "army": {
                    "owner_id": "ae5d1b2d-4e84-4f26-4c37-46ba2e95adbb",
                    "strength": 15
                },
                "position": {
                    "x": 0,
                    "y": 0
                },
                "size": 1
            },
            {
                "id": "67e541e4-7be0-4607-681c-e050ebc31c43",
                "army": {
                    "owner_id": "ca2c0a00-7dc6-43d2-673d-40eddc682113",
                    "strength": 27
                },
                "position": {
                    "x": 8,
                    "y": 8
                },
                "size": 1
            },
            {
                "id": "a3cc146f-f6b5-4f50-68aa-09cb5b36f77d",
                "army": {
                    "owner_id": "fa5a3d69-edb7-476d-4277-c8aa1b2509a8",
                    "strength": 10
                },
                "position": {
                    "x": 4,
                    "y": 4
                },
                "size": 1
            },
            {
                "id": "d4dd446f-e6b5-5f50-77dd-19cb5b36f77d",
                "army": {
                    "owner_id": "fa5a3d69-edb7-476d-4277-c8aa1b2509a8",
                    "strength": 10
                },
                "position": {
                    "x": 0,
                    "y": 8
                },
                "size": 1
            },
            {
                "id": "adadad-ad-ad",
                "army": {
                    "owner_id": "fa5a3d69-edb7-476d-4277-c8aa1b2509a8",
                    "strength": 10
                },
                "position": {
                    "x": 8,
                    "y": 0
                },
                "size": 1
            }
        ],
        "airplanes": [
            {
                "id": "2310c7fd-c44c-415b-65c2-bdee8b0cd559",
                "army": {
                    "owner_id": "ae5d1b2d-4e84-4f26-4c37-46ba2e95adbb",
                    "strength": 12
                },
                "position": {
                    "x": 9.899494936611667,
                    "y": 9.899494936611667
                },
                "destination": "67e541e4-7be0-4607-681c-e050ebc31c43",
                "speed": 0.001
            }
        ]
    }
};