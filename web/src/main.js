import "./main.css";

import * as OfflinePluginRuntime from "offline-plugin/runtime";
import * as PIXI from "pixijs";
import GameController from "./game/controller/GameController.js";
import GameModel from "./game/model/GameModel.js";
import GameView from "./game/view/GameView.js";
import Connection from "./network/Connection.js";
import ResourceLoader from "./resource/ResourceLoader.js";
import ProgressText from "./ProgressText.js";

OfflinePluginRuntime.install();

/**
 * The version of the websocket protocol we expect.
 * @type {string}
 */
const WS_VERSION = "2";

/**
 * The host for the websocket endpoint in production
 * @type {string}
 */
const PRODUCTION_WS_HOST = "ws.archipelago.rocks";

/**
 * List of hostnames that, when matched, should instead connect
 * to a websocket endpoint on the same host for development.
 * @type {[string]}
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
        let host = PRODUCTION_WS_HOST;
        if (DEVELOPMENT_HOSTNAMES.indexOf(window.location.hostname) !== -1) {
            host = window.location.host;
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
    let progressTextWrapElem = document.querySelector("#progress-text-wrap");
    let progressText = new ProgressText(progressTextWrapElem);

    ResourceLoader.load()
        .then(resourceHolder => {
            const main = new Main(progressText, resourceHolder);
            return main.run();
        })
        .catch(err => console.error("Caught error in main", err));
})();
