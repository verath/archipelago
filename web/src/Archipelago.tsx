import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { createRoot, type Root } from "react-dom/client";
import EventEmitter from "eventemitter3";
import { autoDetectRenderer, type Renderer } from "pixi.js";

import Connection from "./network/Connection.ts";
import type ResourceHolder from "./resource/ResourceHolder.ts";
import ResourceLoader from "./resource/ResourceLoader.ts";
import GameController, { type GameResult } from "./game/controller/GameController.ts";
import GameModel from "./game/model/GameModel.ts";
import GameView from "./game/view/GameView.ts";
import { installTestHook, setTestHookGameView } from "./testHook.ts";


export interface UIActionGameStart {
    type: "game/start";
}

export interface UIActionGameClickIsland {
    type: "game/click-island";
    islandId: string | null;
}

export type UIAction = UIActionGameStart | UIActionGameClickIsland;

/**
 * RECONNECTING is while trying to resume a game after the connection broke.
 */
export type ConnectionState = "CONNECTING" | "CONNECTED" | "RECONNECTING" | "DISCONNECTED";

export interface ArchipelagoModel {
    connectionState: ConnectionState;
    gameModel: GameModel | null;
    gameResult: GameResult | null;
}

export type ModelChangeListener = (model: ArchipelagoModel) => void;

const INITIAL_MODEL: ArchipelagoModel = {
    connectionState: "CONNECTING",
    gameModel: null,
    gameResult: null,
};

const EVENT_MODEL_CHANGE = Symbol("EVENT_MODEL_CHANGE");


export class Archipelago {

    private readonly _rootElement: HTMLElement;

    private _model: ArchipelagoModel = INITIAL_MODEL;

    private readonly _eventEmitter = new EventEmitter<{ [EVENT_MODEL_CHANGE]: [model: ArchipelagoModel] }>();

    private readonly _connection: Connection;

    private _gameController: GameController | null = null;

    private _reactRoot: Root | null = null;

    constructor(rootElement: HTMLElement, wsURL: string) {
        this._rootElement = rootElement;
        this._connection = new Connection(wsURL);
    }

    init(): void {
        if (import.meta.env.MODE === "e2e") {
            installTestHook(() => this._model);
        }
        this._connectToServer();
        // Render our react app into the root element.
        const archipelagoView = React.createElement(ArchipelagoView, {
            getModel: () => this._model,
            addModelChangeListener: this._addModelChangeListener.bind(this),
            removeModelChangeListener: this._removeModelChangeListener.bind(this),
            dispatch: this._dispatch.bind(this),
        }, null);
        if (this._reactRoot == null) {
            this._reactRoot = createRoot(this._rootElement);
        }
        this._reactRoot.render(archipelagoView);
    }

    private _addModelChangeListener(listener: ModelChangeListener): void {
        this._eventEmitter.on(EVENT_MODEL_CHANGE, listener, null);
    }

    private _removeModelChangeListener(listener: ModelChangeListener): void {
        this._eventEmitter.off(EVENT_MODEL_CHANGE, listener, null);
    }

    private _emitModelChanged(): void {
        this._eventEmitter.emit(EVENT_MODEL_CHANGE, this._model);
    }

    private _setModel(model: ArchipelagoModel): void {
        this._model = model;
        this._emitModelChanged();
    }

    private _dispatch(action: UIAction): void {
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

    private _connectToServer(): void {
        this._connection.addDisconnectListener(() => {
            // While reconnecting, a failed attempt is followed by another
            // one, until the game controller gives up (see _runGame).
            if (this._model.connectionState !== "RECONNECTING") {
                this._setModel({ ...this._model, connectionState: "DISCONNECTED" });
            }
        });
        this._connection.addReconnectingListener(() => {
            this._setModel({ ...this._model, connectionState: "RECONNECTING" });
        });
        this._connection.addConnectedListener(() => {
            this._setModel({ ...this._model, connectionState: "CONNECTED" });
        });
        this._connection.connect();
    }

    private _joinAndRunGame(): void {
        (async () => {
            await this._joinGame();
            await this._runGame();
        })().catch(err => console.error(err));
    }

    private _clickIsland(islandId: string | null): void {
        if (this._gameController == null) {
            throw new Error("this._gameController == null");
        }
        this._gameController.onIslandClicked(islandId);
    }

    private async _joinGame(): Promise<void> {
        // The server automatically assigns us to a game as we connect, so we
        // wait here until the game has started.
        // Peek, so that GameController consumes the game start.
        const evt = await this._connection.peek();
        if (evt === null) {
            throw new Error("error awaiting eventGameStart");
        }
        if (evt.event !== "eventGameStart") {
            throw new Error(`unexpected server event '${evt.event}'`);
        }
    }

    private async _runGame(): Promise<void> {
        const gameModel = new GameModel();
        let gameResult: GameResult | null = null;
        this._setModel({ ...this._model, gameModel, gameResult });

        this._gameController = new GameController(this._connection, gameModel);
        gameResult = await this._gameController.run();
        // If the game ended while reconnecting, we gave up reconnecting.
        const connectionState = (this._model.connectionState === "RECONNECTING") ? "DISCONNECTED" : this._model.connectionState;
        this._setModel({ ...this._model, gameResult, connectionState });
    }
}

export interface ArchipelagoViewProps {
    getModel: () => ArchipelagoModel;
    addModelChangeListener: (listener: ModelChangeListener) => void;
    removeModelChangeListener: (listener: ModelChangeListener) => void;
    dispatch: (action: UIAction) => void;
}

export const ArchipelagoView = ({ getModel, addModelChangeListener, removeModelChangeListener, dispatch }: ArchipelagoViewProps): React.JSX.Element => {
    // Subscribe to "model changed" events. useSyncExternalStore re-reads the
    // model after subscribing, so a change made before the (deferred) first
    // render and subscription, e.g. the WebSocket connecting, is not lost.
    const subscribe = useCallback((onChange: () => void) => {
        addModelChangeListener(onChange);
        return () => { removeModelChangeListener(onChange); };
    }, [addModelChangeListener, removeModelChangeListener]);
    const model = useSyncExternalStore(subscribe, getModel);

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
            reconnecting={model.connectionState === "RECONNECTING"}
            resourceHolder={resourceHolder}
            dispatch={dispatch}
        />);
    }
};

const useResourceHolder = (): ResourceHolder | null => {
    const [resourceHolder, setResourceHolder] = useState<ResourceHolder | null>(null);
    useEffect(() => {
        let abort = false;
        (async () => {
            const resourceHolder = await ResourceLoader.load();
            if (!abort) {
                setResourceHolder(resourceHolder);
            }
        })().catch(err => { console.error(err); });
        return () => { abort = true; };
    }, [setResourceHolder]);
    return resourceHolder;
};

interface TextProps {
    children?: React.ReactNode;
}

const CenterText = ({ children }: TextProps): React.JSX.Element => (
    <div className="center-text-wrap">{children}</div>
);

const LoadingText = ({ children }: TextProps): React.JSX.Element => (
    <CenterText>
        <span className="progressText">{children}</span>
        <span className="progress-text-dot progress-text-dot1">.</span>
        <span className="progress-text-dot progress-text-dot2">.</span>
        <span className="progress-text-dot progress-text-dot3">.</span>
    </CenterText>
);

export interface LobbyScreenProps {
    connectionState: ConnectionState;
}

export const LobbyScreen = ({ connectionState }: LobbyScreenProps): React.JSX.Element => {
    if (connectionState === "CONNECTING") {
        return <LoadingText>Connecting</LoadingText>;
    } else if (connectionState === "CONNECTED") {
        return <LoadingText>Finding a game</LoadingText>;
    } else {
        return <CenterText>Disconnected!</CenterText>;
    }
};

interface GameScreenProps {
    gameModel: GameModel;
    gameResult: GameResult | null;
    reconnecting: boolean;
    resourceHolder: ResourceHolder;
    dispatch: (action: UIAction) => void;
}

const GameScreen = ({ gameModel, gameResult, reconnecting, resourceHolder, dispatch }: GameScreenProps): React.JSX.Element => (
    <>
        {(reconnecting && gameResult == null) ? <ReconnectingView /> : null}
        <GameResultView
            gameModel={gameModel}
            gameResult={gameResult} />
        <GameViewWrapper
            gameModel={gameModel}
            resourceHolder={resourceHolder}
            dispatch={dispatch} />
    </>
);

interface GameViewWrapperProps {
    gameModel: GameModel;
    resourceHolder: ResourceHolder;
    dispatch: (action: UIAction) => void;
}

const GameViewWrapper = ({ gameModel, resourceHolder, dispatch }: GameViewWrapperProps): React.JSX.Element => {
    const containerElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cleanup: (() => void)[] = [];
        let aborted = false;

        const setupGameView = (renderer: Renderer) => {
            // Append the renderer's canvas to DOM.
            const parentElement = containerElement.current;
            if (parentElement == null) {
                throw new Error("containerElement.current == null");
            }
            parentElement.appendChild(renderer.canvas);
            cleanup.unshift(() => {
                parentElement.removeChild(renderer.canvas);
                renderer.destroy();
            });

            // Create the GameView and connect it to the GameModel.
            const gameView = new GameView(resourceHolder, renderer, gameModel);
            const modelChangeListener = gameView.onModelChanged.bind(gameView);
            gameModel.addChangeListener(modelChangeListener);
            cleanup.unshift(() => {
                gameModel.removeChangeListener(modelChangeListener);
            });
            // The renderer is created asynchronously, so the model may already
            // have changed. Sync the view with the current model.
            gameView.onModelChanged();
            if (import.meta.env.MODE === "e2e") {
                setTestHookGameView(gameView);
                cleanup.unshift(() => { setTestHookGameView(null); });
            }

            // Listen and dispatch island click events from GameView.
            const islandClickListener = (islandId: string | null) => {
                dispatch({ type: "game/click-island", islandId });
            };
            gameView.addIslandClickListener(islandClickListener);
            cleanup.unshift(() => {
                gameView.removeIslandClickListener(islandClickListener);
            });

            // Forward window resize events to GameView.
            const resizeListener = gameView.resize.bind(gameView);
            window.addEventListener("resize", resizeListener);
            window.addEventListener("deviceOrientation", resizeListener);
            cleanup.unshift(() => {
                window.removeEventListener("resize", resizeListener);
                window.removeEventListener("deviceOrientation", resizeListener);
            });

            // Start the GameView rendering loop.
            // Interpolating right before rendering keeps the airplanes from
            // lagging a frame behind.
            let renderRequestId: number;
            let lastTimestamp: DOMHighResTimeStamp | null = null;
            const render = (timestamp: DOMHighResTimeStamp) => {
                gameModel.interpolate(lastTimestamp === null ? 0 : timestamp - lastTimestamp);
                lastTimestamp = timestamp;
                gameView.render();
                renderRequestId = window.requestAnimationFrame(render);
            };
            renderRequestId = window.requestAnimationFrame(render);
            cleanup.unshift(() => {
                window.cancelAnimationFrame(renderRequestId);
            });
        };

        // Creating a renderer is asynchronous in Pixi v8.
        (async () => {
            const renderer = await autoDetectRenderer({
                width: 1,
                height: 1,
                backgroundAlpha: 0,
                // GameView.resize handles devicePixelRatio itself.
                resolution: 1,
            });
            if (aborted) {
                renderer.destroy();
                return;
            }
            setupGameView(renderer);
        })().catch(err => console.error(err));

        return () => {
            aborted = true;
            cleanup.forEach(f => f());
        };
    }, [gameModel, resourceHolder, containerElement, dispatch]);

    return (<div ref={containerElement} />);
};

export interface GameResultViewProps {
    gameModel: GameModel;
    gameResult: GameResult | null;
}

/**
 * Shown over the game while trying to resume it on a new connection.
 */
export const ReconnectingView = (): React.JSX.Element => (
    <div className="reconnecting-wrap">
        <span className="progressText">Reconnecting</span>
        <span className="progress-text-dot progress-text-dot1">.</span>
        <span className="progress-text-dot progress-text-dot2">.</span>
        <span className="progress-text-dot progress-text-dot3">.</span>
    </div>
);

export const GameResultView = ({ gameModel, gameResult }: GameResultViewProps): React.JSX.Element | null => {
    if (gameResult == null) {
        return null;
    }

    let reasonMsg: string;
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
