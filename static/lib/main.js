import * as PIXI from 'pixi.js'
import GameController from './controller/game'
import GameModel from "./model/game";
import GameView from "./view/game";

(function main() {
    let renderer = PIXI.autoDetectRenderer(
        600, 600,
        {antialias: false, transparent: true, resolution: 1});

    let gameModel = new GameModel();
    let gameView = new GameView(gameModel, renderer);
    let gameController = new GameController(gameModel, gameView);
    gameController.run();
})();
