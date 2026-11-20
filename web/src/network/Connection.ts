import EventEmitter from "eventemitter3";
import { wire } from "../wire/proto_bundle.js";

const EVENT_SERVER_EVENT = Symbol("EVENT_SERVER_EVENT");
const EVENT_CONNECTED = Symbol("EVENT_CONNECTED");
const EVENT_DISCONNECT = Symbol("EVENT_DISCONNECT");

/**
 * An event received from the server, as decoded from the wire. Switching on
 * its `event` narrows it to the event that is set.
 */
export type ServerEvent = wire.msg.EventEnvelope & wire.msg.EventEnvelope.$Shape;

export type ConnectionListener = () => void;

export default class Connection {

    private readonly _url: string;

    private _conn: WebSocket | null;

    private readonly _eventEmitter: EventEmitter<{
        [EVENT_SERVER_EVENT]: [];
        [EVENT_CONNECTED]: [];
        [EVENT_DISCONNECT]: [];
    }>;

    private readonly _serverEvents: ServerEvent[];

    constructor(url: string) {
        this._url = url;
        this._conn = null;
        this._eventEmitter = new EventEmitter();
        this._serverEvents = [];
    }

    /**
     * The socket's binaryType is "arraybuffer", so data is an ArrayBuffer.
     */
    private _onWSMessage(msgEvent: MessageEvent<ArrayBuffer>): void {
        const data = new Uint8Array(msgEvent.data);
        let eventEnvelope: ServerEvent;
        try {
            eventEnvelope = wire.msg.EventEnvelope.decode(data);
        } catch (err) {
            console.warn("Failed decoding server EventEnvelope:", err);
            return;
        }
        this._serverEvents.push(eventEnvelope);
        this._eventEmitter.emit(EVENT_SERVER_EVENT);
    }

    private _onWSError(): void {
        // The handler is only installed while connected, so _conn is set.
        this._conn?.close();
        this._eventEmitter.emit(EVENT_DISCONNECT);
    }

    private _onWSClose(): void {
        this._eventEmitter.emit(EVENT_DISCONNECT);
    }

    private _onWSOpen(): void {
        this._eventEmitter.emit(EVENT_CONNECTED);
    }

    addServerEventListener(listener: ConnectionListener, context: unknown = null): void {
        this._eventEmitter.on(EVENT_SERVER_EVENT, listener, context);
    }

    removeServerEventListener(listener: ConnectionListener, context: unknown = null): void {
        this._eventEmitter.off(EVENT_SERVER_EVENT, listener, context);
    }

    addDisconnectListener(listener: ConnectionListener, context: unknown = null): void {
        this._eventEmitter.on(EVENT_DISCONNECT, listener, context);
    }

    removeDisconnectListener(listener: ConnectionListener, context: unknown = null): void {
        this._eventEmitter.off(EVENT_DISCONNECT, listener, context);
    }

    addConnectedListener(listener: ConnectionListener, context: unknown = null): void {
        this._eventEmitter.on(EVENT_CONNECTED, listener, context);
    }

    removeConnectedListener(listener: ConnectionListener, context: unknown = null): void {
        this._eventEmitter.off(EVENT_CONNECTED, listener, context);
    }

    connect(): void {
        if (this._conn !== null) {
            console.warn("connect called when Connection already connected");
            return;
        }
        this._conn = new WebSocket(this._url);
        this._conn.binaryType = "arraybuffer";
        this._conn.onmessage = this._onWSMessage.bind(this);
        this._conn.onclose = this._onWSClose.bind(this);
        this._conn.onerror = this._onWSError.bind(this);
        this._conn.onopen = this._onWSOpen.bind(this);
    }

    disconnect(): void {
        if (this._conn === null) {
            console.warn("disconnect called when Connection was not connected");
            return;
        }
        this._conn.close();
        this._conn.onmessage = null;
        this._conn.onclose = null;
        this._conn.onerror = null;
        this._conn.onopen = null;
        this._conn = null;
    }

    hasNext(): boolean {
        return this._serverEvents.length > 0;
    }

    getNext(): ServerEvent {
        if (!this.hasNext()) {
            throw new Error("!hasNextServerEvent");
        }
        // Not undefined: hasNext() checked that the queue is not empty.
        return this._serverEvents.shift()!;
    }

    peekNext(): ServerEvent {
        if (!this.hasNext()) {
            throw new Error("!hasNextServerEvent");
        }
        return this._serverEvents[0];
    }

    async waitNext(): Promise<boolean> {
        // Definitely assigned: the Promise executor runs synchronously.
        let serverEventListener!: () => void;
        let disconnectListener!: () => void;
        const nextPromise = new Promise<void>((resolve, reject) => {
            serverEventListener = () => { resolve(); };
            disconnectListener = () => { reject(new Error("disconnected")); };
            this._eventEmitter.on(EVENT_SERVER_EVENT, serverEventListener);
            this._eventEmitter.on(EVENT_DISCONNECT, disconnectListener);
        });
        try {
            await nextPromise;
            return true;
        } catch (err) {
            console.log("error while awaiting next server event:", err);
            return false;
        } finally {
            this._eventEmitter.off(EVENT_SERVER_EVENT, serverEventListener);
            this._eventEmitter.off(EVENT_DISCONNECT, disconnectListener);
        }
    }

    sendAction(actionEnvelope: wire.msg.ActionEnvelope): void {
        if (this._conn === null) {
            console.warn("sendAction called when Connection was not connected");
            return;
        }
        // finish() is typed as returning a Uint8Array over any ArrayBufferLike,
        // which WebSocket.send does not accept (it may be a SharedArrayBuffer).
        // protobufjs allocates its buffers with new Uint8Array (or Node's
        // Buffer), so this is always a plain ArrayBuffer.
        const buffer = wire.msg.ActionEnvelope.encode(actionEnvelope).finish() as Uint8Array<ArrayBuffer>;
        this._conn.send(buffer);
    }
}
