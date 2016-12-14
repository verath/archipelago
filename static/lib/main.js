import * as PIXI from 'pixijs'
import GameController from './controller/GameController'
import GameModel from "./model/GameModel";
import GameView from "./view/GameView";
import Connection from "./network/Connection";

(function main() {
    // Create the pixi renderer, and add its view to the document
    let renderer = PIXI.autoDetectRenderer(0, 0, {transparent: true});
    document.body.appendChild(renderer.view);

    let connection = new Connection("ws://192.168.1.17:8080/ws");
    let gameModel = new GameModel();
    let gameView = new GameView(renderer, gameModel);
    let gameController = new GameController(connection, gameModel, gameView);

    // Listen for window size changes
    window.addEventListener('resize', () => gameView.resize());
    window.addEventListener('deviceOrientation', () => gameView.resize());

    gameController.run();
})();
