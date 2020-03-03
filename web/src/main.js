import * as PIXI from "pixi.js";
import GameController from "./game/controller/GameController.js";
import GameModel from "./game/model/GameModel.js";
import GameView from "./game/view/GameView.js";
import "./main.css";
import Connection from "./network/Connection.js";
import ProgressText from "./ProgressText.js";
import ResourceHolder from "./resource/ResourceHolder";
import ResourceLoader from "./resource/ResourceLoader.js";
import { WebGLRenderer, CanvasRenderer } from "pixi.js/lib/core";


/**
 * The version of the websocket protocol we expect.
 * @type {string}
 */
const WS_VERSION = "3";

/**
 * The host for the websocket endpoint in production
 * @type {string}
 */
const WS_HOST_PROD = "ws.playarchipelago.com";

/**
 * List of hostnames that indicates that the site is hosted locally and
 * should connect to the development websocket endpoint.
 * @type string[]
 */
const DEVELOPMENT_HOSTNAMES = ["localhost", "127.0.0.1"];

class Main {

    /**
     * @param {ProgressText} progressText
     * @param {ResourceHolder} resourceHolder
     */
    constructor(progressText, resourceHolder) {
        /**
         * @type {ProgressText}
         * @private
         */
        this._progressText = progressText;

        /**
         * @type {ResourceHolder}
         * @private
         */
        this._resourceHolder = resourceHolder;

        /**
         * @type {WebGLRenderer|CanvasRenderer}
         * @private
         */
        this._renderer = PIXI.autoDetectRenderer(1, 1, {transparent: true});

        /**
         * The currently active game controller, or null if a game is not yet running.
         * @type {?GameController}
         * @private
         */
        this._gameController = null;

        // Add the renderer view to the document. Since we might want to show
        // text elements when the game is not running, the view is hidden, and
        // only shown while the game is running.
        this._renderer.view.style.display = "none";
        document.body.appendChild(this._renderer.view);

        // Listen for window size changes
        window.addEventListener("resize", this._onWindowResize.bind(this));
        window.addEventListener("deviceOrientation", this._onWindowResize.bind(this));
    }

    _onWindowResize() {
        if (this._gameController !== null) {
            this._gameController.gameView.resize();
        }
    }

    _onGameStart() {
        this._progressText.hide();
        this._renderer.view.style.display = "block";
        this._gameController.removeGameStartListener(this._onGameStart, this);
    }

    run() {
        this._progressText.setText("Finding a game");

        let protocol = (window.location.protocol === "https:") ? "wss://" : "ws://";
        let host = WS_HOST_PROD;
        if (DEVELOPMENT_HOSTNAMES.indexOf(window.location.hostname) !== -1) {
            host = window.location.hostname + ":" + window.location.port;
        }
        let connection = new Connection(protocol + host + "/ws?v=" + WS_VERSION);
        let gameModel = new GameModel();
        let gameView = new GameView(this._resourceHolder, this._renderer, gameModel);
        this._gameController = new GameController(connection, gameModel, gameView);

        this._gameController.addGameStartListener(this._onGameStart, this);
        this._gameController.run();
    }
}

(function main() {
    /**@type {HTMLDivElement}*/ 
    let progressTextWrapElem = document.querySelector("#progress-text-wrap");
    let progressText = new ProgressText(progressTextWrapElem);

    ResourceLoader.load()
        .then(resourceHolder => {
            const main = new Main(progressText, resourceHolder);
            return main.run();
        })
        .catch(err => console.error("Caught error in main", err));
})();
