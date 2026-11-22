// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, afterEach, onTestFinished } from "vitest";
import { render, screen, cleanup, act, waitFor, fireEvent } from "@testing-library/react";

// The game canvas is covered by the end-to-end tests: stub out Pixi and the
// view built on it, and the resource loading that needs a browser.
vi.mock("pixi.js", () => ({
    autoDetectRenderer: vi.fn(async () => ({
        canvas: document.createElement("canvas"),
        destroy: vi.fn(),
    })),
}));
vi.mock("./game/view/GameView.ts", () => ({
    default: class {
        onModelChanged() { }
        addIslandClickListener() { }
        removeIslandClickListener() { }
        resize() { }
        render() { }
    },
}));
vi.mock("./resource/ResourceLoader.ts", () => ({
    default: { load: vi.fn(async () => ({ fake: "resources" })) },
}));

import {
    Archipelago, ArchipelagoView, GameResultView, LobbyScreen,
    type ArchipelagoModel, type ConnectionState, type ModelChangeListener, type UIAction,
} from "./Archipelago.tsx";
import GameModel from "./game/model/GameModel.ts";

afterEach(cleanup);

/** A minimal external store with the shape ArchipelagoView expects. */
function makeStore(initialModel: ArchipelagoModel) {
    let model = initialModel;
    const listeners = new Set<ModelChangeListener>();
    return {
        getModel: () => model,
        addModelChangeListener: (l: ModelChangeListener) => { listeners.add(l); },
        removeModelChangeListener: (l: ModelChangeListener) => { listeners.delete(l); },
        dispatch: vi.fn<(action: UIAction) => void>(),
        listenerCount: () => listeners.size,
        // Change the model without telling anyone, as if it happened earlier.
        setSilently: (m: ArchipelagoModel) => { model = m; },
        set: (m: ArchipelagoModel) => { model = m; listeners.forEach(l => l(model)); },
    };
}

type Store = ReturnType<typeof makeStore>;

const lobbyModel = (connectionState: ConnectionState): ArchipelagoModel => (
    { connectionState, gameModel: null, gameResult: null });

function renderView(store: Store) {
    return render(<ArchipelagoView
        getModel={store.getModel}
        addModelChangeListener={store.addModelChangeListener}
        removeModelChangeListener={store.removeModelChangeListener}
        dispatch={store.dispatch}
    />);
}

describe("LobbyScreen", () => {
    it("shows a Play button before connecting, that starts the game", () => {
        const dispatch = vi.fn<(action: UIAction) => void>();
        render(<LobbyScreen connectionState="IDLE" dispatch={dispatch} />);
        fireEvent.click(screen.getByRole("button", { name: "Play!" }));
        expect(dispatch).toHaveBeenCalledExactlyOnceWith({ type: "game/start" });
    });

    it("shows text for each other connection state", () => {
        const dispatch = vi.fn<(action: UIAction) => void>();
        const { container, rerender } = render(<LobbyScreen connectionState="CONNECTING" dispatch={dispatch} />);
        expect(container.textContent).toContain("Connecting");

        rerender(<LobbyScreen connectionState="CONNECTED" dispatch={dispatch} />);
        expect(container.textContent).toContain("Finding a game");

        rerender(<LobbyScreen connectionState="DISCONNECTED" dispatch={dispatch} />);
        expect(container.textContent).toContain("Disconnected!");
        expect(screen.queryByRole("button")).toBeNull();
    });
});

describe("GameResultView", () => {
    const gameModelFor = (myPlayerId: string): GameModel => {
        const gm = new GameModel();
        gm.myPlayerId = myPlayerId;
        return gm;
    };

    it("renders nothing without a result", () => {
        const { container } = render(<GameResultView gameModel={gameModelFor("me")} gameResult={null} />);
        expect(container.innerHTML).toBe("");
    });

    it("tells the winner they won", () => {
        const { container } = render(<GameResultView
            gameModel={gameModelFor("me")}
            gameResult={{ reason: "GAME_OVER", winnerId: "me" }} />);
        expect(screen.getByText("Game Over")).toBeTruthy();
        expect(screen.getByText("You Won!")).toBeTruthy();
        expect(container.querySelector(".game-over-winner")).not.toBeNull();
    });

    it("tells everyone else they lost", () => {
        const { container } = render(<GameResultView
            gameModel={gameModelFor("me")}
            gameResult={{ reason: "GAME_OVER", winnerId: "someone-else" }} />);
        expect(screen.getByText("You Lost!")).toBeTruthy();
        expect(container.querySelector(".game-over-loser")).not.toBeNull();
    });

    it("counts a game ended by connection loss (empty winner) as a loss", () => {
        render(<GameResultView
            gameModel={gameModelFor("me")}
            gameResult={{ reason: "GAME_OVER", winnerId: "" }} />);
        expect(screen.getByText("You Lost!")).toBeTruthy();
    });

    it("shows the raw reason for errors", () => {
        render(<GameResultView gameModel={gameModelFor("me")} gameResult={{ reason: "ERROR" }} />);
        expect(screen.getByText("ERROR")).toBeTruthy();
    });
});

describe("ArchipelagoView", () => {
    it("shows loading text until resources are loaded, then the Play button", async () => {
        const store = makeStore(lobbyModel("IDLE"));
        renderView(store);
        expect(screen.getByText("Loading resources")).toBeTruthy();
        expect(screen.queryByRole("button", { name: "Play!" })).toBeNull();
        expect(await screen.findByRole("button", { name: "Play!" })).toBeTruthy();
    });

    it("starts the game only when Play is clicked", async () => {
        const store = makeStore(lobbyModel("IDLE"));
        renderView(store);
        const play = await screen.findByRole("button", { name: "Play!" });
        expect(store.dispatch).not.toHaveBeenCalled();

        fireEvent.click(play);
        expect(store.dispatch).toHaveBeenCalledExactlyOnceWith({ type: "game/start" });

        act(() => store.set(lobbyModel("CONNECTING")));
        expect(screen.getByText("Connecting")).toBeTruthy();
        expect(screen.queryByRole("button", { name: "Play!" })).toBeNull();
    });

    it("follows model changes", async () => {
        const store = makeStore(lobbyModel("CONNECTING"));
        renderView(store);
        await screen.findByText("Connecting");

        act(() => store.set(lobbyModel("CONNECTED")));
        expect(screen.getByText("Finding a game")).toBeTruthy();

        act(() => store.set(lobbyModel("DISCONNECTED")));
        expect(screen.getByText("Disconnected!")).toBeTruthy();
    });

    it("shows a model change made before the view subscribed", async () => {
        // The model changes (e.g. the WebSocket connects) while React is yet to
        // subscribe, and no change event reaches the view.
        const store = makeStore(lobbyModel("CONNECTING"));
        const subscribe = store.addModelChangeListener;
        store.addModelChangeListener = (l) => {
            store.setSilently(lobbyModel("CONNECTED"));
            subscribe(l);
        };
        renderView(store);
        expect(await screen.findByText("Finding a game")).toBeTruthy();
        expect(screen.queryByText("Connecting")).toBeNull();
    });

    it("shows the result over the game when it ends", async () => {
        const gameModel = new GameModel();
        gameModel.myPlayerId = "me";
        const inGame: ArchipelagoModel = { connectionState: "CONNECTED", gameModel, gameResult: null };
        const store = makeStore(inGame);
        renderView(store);
        // The (mocked) game canvas gets attached once the renderer is created.
        await waitFor(() => expect(document.querySelector("canvas")).not.toBeNull());
        expect(screen.queryByText("Game Over")).toBeNull();

        act(() => store.set({ ...inGame, gameResult: { reason: "GAME_OVER", winnerId: "me" } }));
        expect(screen.getByText("You Won!")).toBeTruthy();
    });

    it("unsubscribes when unmounted", async () => {
        const store = makeStore(lobbyModel("CONNECTING"));
        const { unmount } = renderView(store);
        await screen.findByText("Connecting");
        expect(store.listenerCount()).toBe(1);
        unmount();
        expect(store.listenerCount()).toBe(0);
    });
});

describe("Archipelago", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("connects only once Play is clicked, and only once", async () => {
        const sockets: string[] = [];
        vi.stubGlobal("WebSocket", class {
            constructor(url: string) { sockets.push(url); }
            close() { }
        });
        const warn = vi.spyOn(console, "warn").mockImplementation(() => { });
        const root = document.createElement("div");
        document.body.appendChild(root);
        onTestFinished(() => { root.remove(); });
        const archipelago = new Archipelago(root, "ws://localhost/app/ws?v=5");
        act(() => { archipelago.init(); });

        const play = await screen.findByRole("button", { name: "Play!" });
        expect(sockets).toEqual([]);

        // A double click, before React re-renders without the button.
        act(() => {
            play.click();
            play.click();
        });
        expect(sockets).toEqual(["ws://localhost/app/ws?v=5"]);
        // Connection.connect() would also ignore a second call, but warn.
        expect(warn).not.toHaveBeenCalled();
        expect(screen.getByText("Connecting")).toBeTruthy();
        expect(screen.queryByRole("button", { name: "Play!" })).toBeNull();
    });
});
