import * as PIXI from 'pixijs'
import GameController from './controller/GameController'
import GameModel from "./model/GameModel";
import GameView from "./view/GameView";

(function main() {
    let gameModel = new GameModel();
    let gameView = new GameView(gameModel);
    let gameController = new GameController(gameModel, gameView);

    // Listen for window size changes
    window.addEventListener('resize', () => gameView.resize());
    window.addEventListener('deviceOrientation', () => gameView.resize());

    gameController.run();
})();
