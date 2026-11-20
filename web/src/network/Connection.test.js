import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Connection from "./Connection.ts";
import { wire } from "../wire/proto_bundle.js";
import { encodeEvent } from "../test/fixtures.js";

class FakeWebSocket {
    constructor(url) {
        this.url = url;
        this.binaryType = "blob";
        this.sent = [];
        this.closed = false;
        this.onopen = null;
        this.onmessage = null;
        this.onclose = null;
        this.onerror = null;
        FakeWebSocket.instances.push(this);
    }

    send(data) { this.sent.push(data); }
    close() { this.closed = true; }

    // Helpers for tests to play the server / network.
    open() { this.onopen?.({}); }
    receive(data) { this.onmessage?.({ data }); }
    drop() { this.onclose?.({}); }
    fail() { this.onerror?.({}); }
}

FakeWebSocket.instances = [];

const lastSocket = () => FakeWebSocket.instances.at(-1);

/** A connected Connection together with its fake socket. */
function connected(url = "ws://example/app/ws") {
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
        expect(first.eventGameStart.playerId).toBe("p1");
        expect(first.eventGameStart.tickInterval).toBe(250);

        // peek does not consume.
        expect(conn.getNext()).toBe(first);
        const second = conn.getNext();
        expect(second.event).toBe("eventGameOver");
        expect(second.eventGameOver.winnerId).toBe("p2");
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
        const emitter = conn._eventEmitter;
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
        expect(conn.getNext().eventGameOver.winnerId).toBe("x");
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
        expect(decoded.actionGameLaunch.fromId).toBe("a");
        expect(decoded.actionGameLaunch.toId).toBe("b");
    });

    it("warns and sends nothing when not connected", () => {
        const conn = new Connection("ws://x");
        conn.sendAction(new wire.msg.ActionEnvelope());
        expect(console.warn).toHaveBeenCalled();
        expect(FakeWebSocket.instances).toHaveLength(0);
    });
});
