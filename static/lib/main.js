import * as PIXI from 'pixijs'
import GameController from './controller/GameController'
import GameModel from "./model/GameModel";
import GameView from "./view/GameView";

(function main() {
    let renderer = PIXI.autoDetectRenderer(
        600, 600,
        {antialias: false, transparent: true, resolution: 1});

    let gameModel = new GameModel();
    let gameView = new GameView(gameModel, renderer);
    let gameController = new GameController(gameModel, gameView);
    gameController.run();
})();
