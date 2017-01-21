import * as PIXI from "pixijs";
import GameController from "./game/controller/GameController";
import GameModel from "./game/model/GameModel";
import GameView from "./game/view/GameView";
import Connection from "./network/Connection";
import ResourceLoader from "./resource/ResourceLoader";

function hideLoadingText() {
    document.getElementById('loading').style.display = 'none';
}

/**
 * @param {ResourceHolder} resourceHolder
 */
function runGame(resourceHolder) {
    // Create the pixi renderer, and add its view to the document
    let renderer = PIXI.autoDetectRenderer(1, 1, {transparent: true});
    document.body.appendChild(renderer.view);

    let connection = new Connection("ws://" + location.host + "/ws");
    let gameModel = new GameModel();
    let gameView = new GameView(resourceHolder, renderer, gameModel);
    let gameController = new GameController(connection, gameModel, gameView);

    // Listen for window size changes
    window.addEventListener('resize', () => gameView.resize());
    window.addEventListener('deviceOrientation', () => gameView.resize());

    gameController.run();
}

(function main() {
    ResourceLoader.load()
        .then(resourceHolder => {
            hideLoadingText();
            runGame(resourceHolder);
        }, err => console.error("Caught error in main", err));
})();
