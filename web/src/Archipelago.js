import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import EventEmitter from "eventemitter3";
import * as PIXI from "pixi.js";

import Connection from "./network/Connection";
import ResourceHolder from "./resource/ResourceHolder";
import ResourceLoader from "./resource/ResourceLoader";
import GameController from "./game/controller/GameController";
import GameModel from "./game/model/GameModel";
import GameView from "./game/view/GameView";


/**
 * @typedef {(UIActionGameStart | UIActionGameClickIsland)} UIAction
 * 
 * @typedef UIActionGameStart
 * @property {"game/start"} type
 * 
 * @typedef UIActionGameClickIsland
 * @property {"game/click-island"} type
 * @property {string} islandId
 */

/**
 * @typedef ArchipelagoModel
 * @property {ConnectionState} connectionState
 * @property {?GameModel} gameModel
 * @property {?GameResult} gameResult
 * 
 * @typedef {("CONNECTING" | "CONNECTED" | "DISCONNECTED")} ConnectionState
 * @typedef {import('./game/controller/GameController').GameResult} GameResult
 */

/** @type {ArchipelagoModel} */
const INITIAL_MODEL = {
    connectionState: "CONNECTING",
    gameModel: null,
    gameResult: null,
};

const EVENT_MODEL_CHANGE = Symbol("EVENT_MODEL_CHANGE");


export class Archipelago {
    /**
     * 
     * @param {HTMLElement} rootElement 
     * @param {string} wsURL 
     */
    constructor(rootElement, wsURL) {
        /**
         * @member {HTMLElement}
         * @private
         */
        this._rootElement = rootElement;

        /**
         * @member {ArchipelagoModel}
         * @private
         */
        this._model = INITIAL_MODEL;

        /**
         * @member {EventEmitter}
         * @private
         */
        this._eventEmitter = new EventEmitter();

        /**
         * @member {Connection}
         * @private
         */
        this._connection = new Connection(wsURL);

        /**
         * @member {GameController | null}
         * @private
         */
        this._gameController = null;
    }

    init() {
        this._connectToServer();
        // Render our react app into the root element.
        const archipelagoView = React.createElement(ArchipelagoView, {
            initialModel: this._model,
            addModelChangeListener: this._addModelChangeListener.bind(this),
            removeModelChangeListener: this._removeModelChangeListener.bind(this),
            dispatch: this._dispatch.bind(this),
        }, null);
        ReactDOM.render(archipelagoView, this._rootElement);
    }

    _addModelChangeListener(listener) {
        this._eventEmitter.on(EVENT_MODEL_CHANGE, listener, null);
    }

    _removeModelChangeListener(listener) {
        this._eventEmitter.off(EVENT_MODEL_CHANGE, listener, null);
    }

    _emitModelChanged() {
        this._eventEmitter.emit(EVENT_MODEL_CHANGE, this._model);
    }

    /**
     * @param {ArchipelagoModel} model
     */
    _setModel(model) {
        this._model = model;
        this._emitModelChanged();
    }

    /**
     * @param {UIAction} action 
     */
    _dispatch(action) {
        switch (action.type) {
            case "game/start":
                this._joinAndRunGame();
                break;
            case "game/click-island":
                this._clickIsland(action.islandId);
                break;
            default:
                console.error("Unknown action", action);
                return;
        }
    }

    _connectToServer() {
        this._connection.addDisconnectListener(() => {
            this._setModel({ ...this._model, connectionState: "DISCONNECTED" });
        });
        this._connection.addConnectedListener(() => {
            this._setModel({ ...this._model, connectionState: "CONNECTED" });
        });
        this._connection.connect();
    }

    _joinAndRunGame() {
        (async () => {
            await this._joinGame();
            await this._runGame();
        })().catch(err => console.error(err));
    }

    /**
     * @param {string} islandId
     */
    _clickIsland(islandId) {
        if (this._gameController == null) {
            throw new Error("this._gameController == null");
        }
        this._gameController.onIslandClicked(islandId);
    }

    async _joinGame() {
        // The server automatically assigns us to a game as we connect, so we
        // wait here until the game has started.
        while (!this._connection.hasNext() && await this._connection.waitNext()) {
            //
        }
        if (!this._connection.hasNext()) {
            throw new Error("error awaiting eventGameStart");
        }
        let evt = this._connection.peekNext();
        if (evt.event !== "eventGameStart") {
            throw new Error(`unexpected server event '${evt.event}'`);
        }
    }

    async _runGame() {
        let gameModel = new GameModel();
        let gameResult = null;
        this._setModel({ ...this._model, gameModel, gameResult });

        this._gameController = new GameController(this._connection, gameModel);
        gameResult = await this._gameController.run();
        this._setModel({ ...this._model, gameResult });
    }
}

/**
 * @param {Object} props Props
 * @param {ArchipelagoModel} props.initialModel
 * @param {any} props.addModelChangeListener
 * @param {any} props.removeModelChangeListener
 * @param {function(UIAction):void} props.dispatch
 */
const ArchipelagoView = ({ initialModel, addModelChangeListener, removeModelChangeListener, dispatch }) => {
    // Listen for "model changed" events.
    const [model, setModel] = useState(initialModel);
    useEffect(() => {
        const onModelChange = (model) => { setModel(model); };
        addModelChangeListener(onModelChange);
        return () => { removeModelChangeListener(onModelChange); };
    }, [setModel, addModelChangeListener, removeModelChangeListener]);

    // Load game view resources.
    const resourceHolder = useResourceHolder();

    // Once resources are loaded, request to start the game.
    // TODO: Maybe a button would be nice...
    useEffect(() => {
        if (resourceHolder != null) {
            dispatch({ type: "game/start" });
        }
    }, [resourceHolder, dispatch]);

    // Loading resources -> Lobby -> Game.
    if (resourceHolder == null) {
        return (<LoadingText>Loading resources</LoadingText>);
    } else if (model.gameModel == null) {
        return <LobbyScreen connectionState={model.connectionState} />;
    } else {
        return (<GameScreen
            gameModel={model.gameModel}
            gameResult={model.gameResult}
            resourceHolder={resourceHolder}
            dispatch={dispatch}
        />);
    }
};

/**
 * @returns {ResourceHolder | null}
 */
const useResourceHolder = () => {
    const [resourceHolder, setResourceHolder] = useState(null);
    useEffect(() => {
        let abort = false;
        (async () => {
            let resourceHolder = await ResourceLoader.load();
            if (!abort) {
                setResourceHolder(resourceHolder);
            }
        })().catch(err => { console.error(err); });
        return () => { abort = true; };
    }, [setResourceHolder]);
    return resourceHolder;
};

const CenterText = ({ children }) => (
    <div className="center-text-wrap">{children}</div>
);

const LoadingText = ({ children }) => (
    <CenterText>
        <span className="progressText">{children}</span>
        <span className="progress-text-dot progress-text-dot1">.</span>
        <span className="progress-text-dot progress-text-dot2">.</span>
        <span className="progress-text-dot progress-text-dot3">.</span>
    </CenterText>
);

/**
 * @param {Object} props Props
 * @param {ConnectionState} props.connectionState
 */
const LobbyScreen = ({ connectionState }) => {
    if (connectionState === "CONNECTING") {
        return <LoadingText>Connecting</LoadingText>;
    } else if (connectionState === "CONNECTED") {
        return <LoadingText>Finding a game</LoadingText>;
    } else {
        return <CenterText>Disconnected!</CenterText>;
    }
};

/**
 * @param {Object} props Props
 * @param {GameModel} props.gameModel
 * @param {GameResult} props.gameResult
 * @param {ResourceHolder} props.resourceHolder
 * @param {function(UIAction):void} props.dispatch
 */
const GameScreen = ({ gameModel, gameResult, resourceHolder, dispatch }) => (
    <>
        <GameResultView
            gameModel={gameModel}
            gameResult={gameResult} />
        <GameViewWrapper
            gameModel={gameModel}
            resourceHolder={resourceHolder}
            dispatch={dispatch} />
    </>
);

/**
 * @param {Object} props Props
 * @param {GameModel} props.gameModel
 * @param {ResourceHolder} props.resourceHolder
 * @param {function(UIAction):void} props.dispatch
 */
const GameViewWrapper = ({ gameModel, resourceHolder, dispatch }) => {
    /**@type {React.MutableRefObject<HTMLDivElement>} */
    let containerElement = useRef(null);

    useEffect(() => {
        /**@type {(() => void)[]} */
        let cleanup = [];

        // Create a PIXI.js renderer and append to DOM.
        let renderer = PIXI.autoDetectRenderer(1, 1, { transparent: true });
        containerElement.current.appendChild(renderer.view);
        cleanup.unshift(() => {
            containerElement.current.removeChild(renderer.view);
        });

        // Create the GameView and connect it to the GameModel.
        let gameView = new GameView(resourceHolder, renderer, gameModel);
        let modelChangeListener = gameView.onModelChanged.bind(gameView);
        gameModel.addChangeListener(modelChangeListener);
        cleanup.unshift(() => {
            gameModel.removeChangeListener(modelChangeListener);
        });

        // Listen and dispatch island click events from GameView.
        let islandClickListener = (islandId) => {
            dispatch({ type: "game/click-island", islandId });
        };
        gameView.addIslandClickListener(islandClickListener);
        cleanup.unshift(() => {
            gameView.removeIslandClickListener(islandClickListener);
        });

        // Forward window resize events to GameView.
        let resizeListener = gameView.resize.bind(gameView);
        window.addEventListener("resize", resizeListener);
        window.addEventListener("deviceOrientation", resizeListener);
        cleanup.unshift(() => {
            window.removeEventListener("resize", resizeListener);
            window.removeEventListener("deviceOrientation", resizeListener);
        });

        // Start the GameView rendering loop.
        let renderRequestId;
        let render = (_timestamp) => {
            gameView.render();
            renderRequestId = window.requestAnimationFrame(render);
        };
        renderRequestId = window.requestAnimationFrame(render);
        cleanup.unshift(() => {
            window.cancelAnimationFrame(renderRequestId);
        });

        return () => { cleanup.forEach(f => f()); };
    }, [gameModel, resourceHolder, containerElement, dispatch]);

    return (<div ref={containerElement} />);
};

/**
 * @param {Object} props Props
 * @param {GameModel} props.gameModel
 * @param {?GameResult} props.gameResult
 */
const GameResultView = ({ gameModel, gameResult }) => {
    if (gameResult == null) {
        return null;
    }

    let reasonMsg = "";
    let wrapClassName = "game-over-wrap";
    switch (gameResult.reason) {
        case "GAME_OVER":
            if (gameModel.myPlayerId === gameResult.winnerId) {
                reasonMsg = "You Won!";
                wrapClassName += " game-over-winner";
            } else {
                reasonMsg = "You Lost!";
                wrapClassName += " game-over-loser";
            }
            break;
        case "ERROR": // Fallthrough
        default:
            reasonMsg = gameResult.reason;
            break;
    }

    return (
        <div className={wrapClassName}>
            <h1>Game Over</h1>
            <p>{reasonMsg}</p>
        </div>
    );
};
