import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { createRoot, type Root } from "react-dom/client";
import EventEmitter from "eventemitter3";
import { autoDetectRenderer, type Renderer } from "pixi.js";

import Connection from "./network/Connection.ts";
import type ResourceHolder from "./resource/ResourceHolder.ts";
import ResourceLoader from "./resource/ResourceLoader.ts";
import GameController, { type GameResult } from "./game/controller/GameController.ts";
import GameModel from "./game/model/GameModel.ts";
import GameView, { type GameViewOptions } from "./game/view/GameView.ts";
import DemoGame, { demoBoardSize } from "./game/demo/DemoGame.ts";
import { installTestHook, setTestHookGameView } from "./testHook.ts";


/**
 * Dispatched when the player clicks "Play!": connects to the server, which
 * puts us in the next game.
 */
export interface UIActionGameStart {
    type: "game/start";
}

export interface UIActionGameClickIsland {
    type: "game/click-island";
    islandId: string | null;
}

/**
 * Dispatched every frame, right before the game view renders.
 */
export interface UIActionGameFrame {
    type: "game/frame";
    /**
     * [ms] Time since the previous frame.
     */
    delta: number;
}

export type UIAction = UIActionGameStart | UIActionGameClickIsland | UIActionGameFrame;

/**
 * IDLE is before the player clicked "Play!": we only connect then, as the
 * server puts each client in a game as soon as it connects. RECONNECTING is
 * while trying to resume a game after the connection broke.
 */
export type ConnectionState = "IDLE" | "CONNECTING" | "CONNECTED" | "RECONNECTING" | "DISCONNECTED";

export interface ArchipelagoModel {
    connectionState: ConnectionState;
    gameModel: GameModel | null;
    gameResult: GameResult | null;
}

export type ModelChangeListener = (model: ArchipelagoModel) => void;

const INITIAL_MODEL: ArchipelagoModel = {
    connectionState: "IDLE",
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
        this._addConnectionListeners();
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
                this._startGame();
                break;
            case "game/click-island":
                this._clickIsland(action.islandId);
                break;
            case "game/frame":
                this._gameController?.onFrame(action.delta);
                break;
            default:
                console.error("Unknown action", action);
                return;
        }
    }

    private _addConnectionListeners(): void {
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
    }

    private _startGame(): void {
        // Only the first click counts, e.g. not a double click.
        if (this._model.connectionState !== "IDLE") {
            return;
        }
        // Connect first: if that throws, we stay IDLE and can try again.
        this._connection.connect();
        this._setModel({ ...this._model, connectionState: "CONNECTING" });
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
    // render and subscription, e.g. a game starting, is not lost.
    const subscribe = useCallback((onChange: () => void) => {
        addModelChangeListener(onChange);
        return () => { removeModelChangeListener(onChange); };
    }, [addModelChangeListener, removeModelChangeListener]);
    const model = useSyncExternalStore(subscribe, getModel);

    // Load game view resources.
    const resourceHolder = useResourceHolder();

    // Loading resources -> Lobby -> Game.
    if (resourceHolder == null) {
        return (<LoadingText>Loading resources</LoadingText>);
    } else if (model.gameModel == null) {
        return (
            <>
                <LobbyBackground resourceHolder={resourceHolder} />
                <LobbyScreen connectionState={model.connectionState} dispatch={dispatch} />
            </>
        );
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
    // The inner div keeps the text and its dots on lines that wrap together.
    <div className="center-text-wrap"><div>{children}</div></div>
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
    dispatch: (action: UIAction) => void;
}

export const LobbyScreen = ({ connectionState, dispatch }: LobbyScreenProps): React.JSX.Element => {
    if (connectionState === "IDLE") {
        // Players who want to play together click at about the same time,
        // within the server's lobby wait, to end up in the same game.
        return (
            <CenterText>
                <button type="button" className="play-button"
                    onClick={() => { dispatch({ type: "game/start" }); }}>
                    Play!
                </button>
            </CenterText>
        );
    } else if (connectionState === "CONNECTING") {
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

const GameScreen = ({ gameModel, gameResult, reconnecting, resourceHolder, dispatch }: GameScreenProps): React.JSX.Element => {
    // Stable, as GameCanvas recreates the view when they change.
    const onFrame = useCallback((delta: number) => {
        dispatch({ type: "game/frame", delta });
    }, [dispatch]);
    const onIslandClick = useCallback((islandId: string | null) => {
        dispatch({ type: "game/click-island", islandId });
    }, [dispatch]);
    return (
        <>
            {(reconnecting && gameResult == null) ? <ReconnectingView /> : null}
            <GameResultView
                gameModel={gameModel}
                gameResult={gameResult} />
            <GameCanvas
                className="game-canvas"
                gameModel={gameModel}
                resourceHolder={resourceHolder}
                onFrame={onFrame}
                onIslandClick={onIslandClick}
                testHook />
        </>
    );
};

interface LobbyBackgroundProps {
    resourceHolder: ResourceHolder;
}

/**
 * A made-up game playing behind the lobby (see DemoGame), faded out and
 * ignoring clicks. Still if the user prefers reduced motion.
 */
const LobbyBackground = ({ resourceHolder }: LobbyBackgroundProps): React.JSX.Element => {
    const [demo, setDemo] = useState(newDemoGame);
    // A new game when the screen turns, e.g. a phone, as the board would
    // be mostly cropped away.
    useEffect(() => {
        const onResize = () => {
            const { cols, rows } = demoBoardSize(window.innerWidth, window.innerHeight);
            const { x, y } = demo.model.size;
            if ((cols > rows) !== (x > y)) {
                setDemo(newDemoGame());
            }
        };
        window.addEventListener("resize", onResize);
        return () => { window.removeEventListener("resize", onResize); };
    }, [demo]);
    const reducedMotion = usePrefersReducedMotion();
    const onFrame = useCallback((delta: number) => {
        if (!reducedMotion) {
            demo.onFrame(delta);
        }
    }, [demo, reducedMotion]);
    return (<GameCanvas
        className="lobby-background"
        gameModel={demo.model}
        resourceHolder={resourceHolder}
        onFrame={onFrame}
        fit="cover"
        maxPixelRatio={1.5}
        // Still with reduced motion: then only redrawn for resizes.
        maxFps={reducedMotion ? 1 : 30} />);
};

const newDemoGame = (): DemoGame => {
    const { cols, rows } = demoBoardSize(window.innerWidth, window.innerHeight);
    return new DemoGame(cols, rows);
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeReducedMotion = (onChange: () => void): (() => void) => {
    // matchMedia is missing in some test environments.
    const query = window.matchMedia?.(REDUCED_MOTION_QUERY);
    query?.addEventListener("change", onChange);
    return () => { query?.removeEventListener("change", onChange); };
};

/**
 * Whether the user prefers reduced motion, following changes.
 */
const usePrefersReducedMotion = (): boolean => useSyncExternalStore(subscribeReducedMotion,
    () => window.matchMedia?.(REDUCED_MOTION_QUERY).matches ?? false);

interface GameCanvasProps {
    className: string;
    gameModel: GameModel;
    resourceHolder: ResourceHolder;
    /**
     * Called every frame, right before the game view renders, with the time
     * since the previous frame [ms]. Must be stable (e.g. useCallback), as
     * the view is recreated when it changes.
     */
    onFrame: (delta: number) => void;
    /**
     * Called when an island (or, with null, the sea) is clicked. Must be
     * stable too, if given.
     */
    onIslandClick?: (islandId: string | null) => void;
    fit?: GameViewOptions["fit"];
    maxPixelRatio?: number;
    /**
     * Renders at most about this many frames per second, e.g. to save
     * battery. By default, at every animation frame.
     */
    maxFps?: number;
    /**
     * Whether the e2e test hook reports on this view.
     */
    testHook?: boolean;
}

/**
 * Renders a GameModel with a GameView, on a canvas in a div.
 */
const GameCanvas = ({ className, gameModel, resourceHolder, onFrame, onIslandClick, fit, maxPixelRatio, maxFps, testHook = false }: GameCanvasProps): React.JSX.Element => {
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

            // Create the GameView, which reads the GameModel as it renders.
            const gameView = new GameView(resourceHolder, renderer, gameModel, { fit, maxPixelRatio });
            if (import.meta.env.MODE === "e2e" && testHook) {
                setTestHookGameView(gameView);
                cleanup.unshift(() => { setTestHookGameView(null); });
            }

            // Forward island click events from GameView.
            if (onIslandClick != null) {
                gameView.addIslandClickListener(onIslandClick);
                cleanup.unshift(() => {
                    gameView.removeIslandClickListener(onIslandClick);
                });
            }

            // Forward window resize events to GameView.
            const resizeListener = gameView.resize.bind(gameView);
            window.addEventListener("resize", resizeListener);
            window.addEventListener("deviceOrientation", resizeListener);
            cleanup.unshift(() => {
                window.removeEventListener("resize", resizeListener);
                window.removeEventListener("deviceOrientation", resizeListener);
            });

            // Start the GameView rendering loop. Each frame first lets the
            // game controller move the airplanes, so that they don't lag a
            // frame behind.
            // A bit less than a frame at maxFps, as animation frames don't
            // come at exact intervals.
            const minFrameTime = (maxFps == null) ? 0 : 1000 / maxFps - 2;
            let renderRequestId: number;
            let lastTimestamp: DOMHighResTimeStamp | null = null;
            const render = (timestamp: DOMHighResTimeStamp) => {
                const delta = (lastTimestamp === null) ? 0 : timestamp - lastTimestamp;
                if (lastTimestamp === null || delta >= minFrameTime) {
                    lastTimestamp = timestamp;
                    onFrame(delta);
                    gameView.render();
                }
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
    }, [gameModel, resourceHolder, containerElement, onFrame, onIslandClick, fit, maxPixelRatio, maxFps, testHook]);

    return (<div ref={containerElement} className={className} />);
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
