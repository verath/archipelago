import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Connection from "./Connection.ts";
import { wire } from "../wire/proto_bundle.js";
import { defined, encodeEvent } from "../test/fixtures.ts";

type FakeHandler<E> = ((event: E) => void) | null;

/**
 * Stands in for the global WebSocket (via vi.stubGlobal, which is untyped).
 * It has the members Connection uses, with the events reduced to what
 * Connection reads from them.
 */
class FakeWebSocket {
    static instances: FakeWebSocket[] = [];
    static readonly CONNECTING = 0;
    static readonly OPEN = 1;
    static readonly CLOSING = 2;
    static readonly CLOSED = 3;

    readonly url: string;
    binaryType: BinaryType = "blob";
    readonly sent: Uint8Array[] = [];
    closed = false;
    readyState = FakeWebSocket.CONNECTING;
    onopen: FakeHandler<object> = null;
    onmessage: FakeHandler<{ data: ArrayBuffer }> = null;
    onclose: FakeHandler<object> = null;
    onerror: FakeHandler<object> = null;

    constructor(url: string) {
        this.url = url;
        FakeWebSocket.instances.push(this);
    }

    send(data: Uint8Array): void {
        if (this.readyState === FakeWebSocket.CONNECTING) {
            throw new Error("InvalidStateError");
        }
        this.sent.push(data);
    }
    close(): void { this.closed = true; this.readyState = FakeWebSocket.CLOSED; }

    // Helpers for tests to play the server / network.
    open(): void { this.readyState = FakeWebSocket.OPEN; this.onopen?.({}); }
    receive(data: ArrayBuffer): void { this.onmessage?.({ data }); }
    drop(): void { this.readyState = FakeWebSocket.CLOSED; this.onclose?.({}); }
    fail(): void { this.onerror?.({}); }
}

const lastSocket = (): FakeWebSocket => defined(FakeWebSocket.instances.at(-1));

/** A connected Connection together with its fake socket. */
function connected(url = "ws://example/app/ws"): { conn: Connection; ws: FakeWebSocket } {
    const conn = new Connection(url);
    conn.connect();
    lastSocket().open();
    return { conn, ws: lastSocket() };
}

beforeEach(() => {
    FakeWebSocket.instances = [];
    vi.stubGlobal("WebSocket", FakeWebSocket);
    vi.spyOn(console, "warn").mockImplementation(() => { });
    vi.spyOn(console, "log").mockImplementation(() => { });
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("Connection.connect", () => {
    it("opens a WebSocket to the url, receiving binary as ArrayBuffer", () => {
        const conn = new Connection("ws://example/app/ws");
        expect(FakeWebSocket.instances).toHaveLength(0);
        conn.connect();
        expect(FakeWebSocket.instances).toHaveLength(1);
        expect(lastSocket().url).toBe("ws://example/app/ws");
        expect(lastSocket().binaryType).toBe("arraybuffer");
    });

    it("warns and does not open a second socket when already connected", () => {
        const conn = new Connection("ws://x");
        conn.connect();
        conn.connect();
        expect(FakeWebSocket.instances).toHaveLength(1);
        expect(console.warn).toHaveBeenCalled();
    });

    it("emits connected when the socket opens", () => {
        const conn = new Connection("ws://x");
        const onConnected = vi.fn();
        conn.addConnectedListener(onConnected);
        conn.connect();
        expect(onConnected).not.toHaveBeenCalled();
        lastSocket().open();
        expect(onConnected).toHaveBeenCalledTimes(1);
    });

    it("emits disconnect when the socket closes", () => {
        const { conn, ws } = connected();
        const onDisconnect = vi.fn();
        conn.addDisconnectListener(onDisconnect);
        ws.drop();
        expect(onDisconnect).toHaveBeenCalledTimes(1);
    });

    it("closes the socket and emits disconnect on a socket error", () => {
        const { conn, ws } = connected();
        const onDisconnect = vi.fn();
        conn.addDisconnectListener(onDisconnect);
        ws.fail();
        expect(ws.closed).toBe(true);
        expect(onDisconnect).toHaveBeenCalledTimes(1);
    });

    it("stops delivering listener callbacks once removed", () => {
        const { conn, ws } = connected();
        const onDisconnect = vi.fn();
        conn.addDisconnectListener(onDisconnect);
        conn.removeDisconnectListener(onDisconnect);
        ws.drop();
        expect(onDisconnect).not.toHaveBeenCalled();
    });
});

describe("Connection.disconnect", () => {
    it("closes the socket and ignores anything it does afterwards", () => {
        const { conn, ws } = connected();
        const onDisconnect = vi.fn();
        conn.addDisconnectListener(onDisconnect);

        conn.disconnect();

        expect(ws.closed).toBe(true);
        expect(ws.onclose).toBeNull();
        expect(ws.onmessage).toBeNull();
        // A late close event must not reach listeners (the handlers are gone).
        ws.drop();
        expect(onDisconnect).not.toHaveBeenCalled();
    });

    it("can connect again afterwards, with a new socket", () => {
        const { conn } = connected();
        conn.disconnect();
        conn.connect();
        expect(FakeWebSocket.instances).toHaveLength(2);
    });

    it("warns when not connected", () => {
        new Connection("ws://x").disconnect();
        expect(console.warn).toHaveBeenCalled();
    });
});

describe("Connection receiving events", () => {
    it("decodes EventEnvelopes and queues them in order", () => {
        const { conn, ws } = connected();
        expect(conn.hasNext()).toBe(false);

        ws.receive(encodeEvent("eventGameStart", { playerId: "p1", tickInterval: 250 }));
        ws.receive(encodeEvent("eventGameOver", { winnerId: "p2" }));

        expect(conn.hasNext()).toBe(true);
        const first = conn.peekNext();
        expect(first).toBeInstanceOf(wire.msg.EventEnvelope);
        expect(first.event).toBe("eventGameStart");
        expect(first.eventGameStart?.playerId).toBe("p1");
        expect(first.eventGameStart?.tickInterval).toBe(250);

        // peek does not consume.
        expect(conn.getNext()).toBe(first);
        const second = conn.getNext();
        expect(second.event).toBe("eventGameOver");
        expect(second.eventGameOver?.winnerId).toBe("p2");
        expect(conn.hasNext()).toBe(false);
    });

    it("throws when reading from an empty queue", () => {
        const { conn } = connected();
        expect(() => conn.getNext()).toThrow();
        expect(() => conn.peekNext()).toThrow();
    });

    it("emits a server event notification per message", () => {
        const { conn, ws } = connected();
        const onEvent = vi.fn();
        conn.addServerEventListener(onEvent);
        ws.receive(encodeEvent("eventGameOver", { winnerId: "x" }));
        expect(onEvent).toHaveBeenCalledTimes(1);
    });

    it("drops undecodable messages with a warning", () => {
        const { conn, ws } = connected();
        const onEvent = vi.fn();
        conn.addServerEventListener(onEvent);
        // Field 1 with wire type 2 (length-delimited) claiming 50 bytes, but none follow.
        ws.receive(new Uint8Array([0x0a, 0x32]).buffer);
        expect(conn.hasNext()).toBe(false);
        expect(onEvent).not.toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalled();
    });
});

describe("Connection.waitNext", () => {
    it("resolves true when an event arrives", async () => {
        const { conn, ws } = connected();
        const pending = conn.waitNext();
        ws.receive(encodeEvent("eventGameOver", { winnerId: "x" }));
        await expect(pending).resolves.toBe(true);
        expect(conn.hasNext()).toBe(true);
    });

    it("resolves false when the connection drops", async () => {
        const { conn, ws } = connected();
        const pending = conn.waitNext();
        ws.drop();
        await expect(pending).resolves.toBe(false);
    });

    it("resolves false when the socket errors", async () => {
        const { conn, ws } = connected();
        const pending = conn.waitNext();
        ws.fail();
        await expect(pending).resolves.toBe(false);
    });

    it("does not leak listeners", async () => {
        const { conn, ws } = connected();
        // Bracket access reaches the private emitter, keeping its type.
        const emitter = conn["_eventEmitter"];
        const before = emitter.eventNames().map(n => emitter.listenerCount(n));

        const pending = conn.waitNext();
        ws.receive(encodeEvent("eventGameOver", { winnerId: "x" }));
        await pending;

        expect(emitter.eventNames().map(n => emitter.listenerCount(n))).toEqual(before);
    });

    it("keeps events that were queued while disconnected", async () => {
        const { conn, ws } = connected();
        ws.receive(encodeEvent("eventGameOver", { winnerId: "x" }));
        ws.drop();
        expect(conn.hasNext()).toBe(true);
        expect(conn.getNext().eventGameOver?.winnerId).toBe("x");
    });
});

describe("Connection.sendAction", () => {
    it("sends the encoded ActionEnvelope", () => {
        const { conn, ws } = connected();
        const action = new wire.msg.ActionEnvelope();
        action.actionGameLaunch = new wire.msg.ActionGameLaunch({ fromId: "a", toId: "b" });

        conn.sendAction(action);

        expect(ws.sent).toHaveLength(1);
        const decoded = wire.msg.ActionEnvelope.decode(ws.sent[0]);
        expect(decoded.action).toBe("actionGameLaunch");
        expect(decoded.actionGameLaunch?.fromId).toBe("a");
        expect(decoded.actionGameLaunch?.toId).toBe("b");
    });

    it("sends nothing while the socket is still connecting", () => {
        const conn = new Connection("ws://x");
        conn.connect();
        conn.sendAction(wire.msg.ActionEnvelope.create({ actionGameLeave: {} }));
        expect(lastSocket().sent).toHaveLength(0);
        expect(console.warn).toHaveBeenCalled();
    });

    it("warns and sends nothing when not connected", () => {
        const conn = new Connection("ws://x");
        conn.sendAction(new wire.msg.ActionEnvelope());
        expect(console.warn).toHaveBeenCalled();
        expect(FakeWebSocket.instances).toHaveLength(0);
    });
});

describe("Connection.resume", () => {
    it("opens a new socket with the resume token and resolves true when it opens", async () => {
        const { conn, ws } = connected("ws://example/app/ws?v=5");
        const reconnecting = vi.fn();
        conn.addReconnectingListener(reconnecting);
        ws.drop();

        const resumed = conn.resume("tok/en");
        expect(reconnecting).toHaveBeenCalledTimes(1);
        const url = new URL(lastSocket().url);
        expect(url.searchParams.get("v")).toBe("5");
        expect(url.searchParams.get("resume")).toBe("tok/en");
        expect(lastSocket()).not.toBe(ws);
        lastSocket().open();
        await expect(resumed).resolves.toBe(true);
    });

    it("resolves false when the new socket closes before opening", async () => {
        const { conn, ws } = connected();
        ws.drop();
        const resumed = conn.resume("t");
        lastSocket().fail();
        lastSocket().drop();
        await expect(resumed).resolves.toBe(false);
    });

    it("ignores the old socket", async () => {
        const { conn, ws } = connected();
        const resumed = conn.resume("t");
        expect(ws.closed).toBe(true);
        // A late close of the old socket doesn't fail the resume.
        ws.onclose?.({});
        lastSocket().open();
        await expect(resumed).resolves.toBe(true);
    });

    it("keeps events received before", async () => {
        const { conn, ws } = connected();
        ws.receive(encodeEvent("eventGameOver", { winnerId: "w" }));
        ws.drop();
        conn.resume("t");
        expect(conn.hasNext()).toBe(true);
    });
});
