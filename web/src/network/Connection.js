import EventEmitter from "eventemitter3";
import { wire } from "../wire/proto_bundle.js";

const EVENT_SERVER_EVENT = Symbol("EVENT_SERVER_EVENT");
const EVENT_CONNECTED = Symbol("EVENT_CONNECTED");
const EVENT_DISCONNECT = Symbol("EVENT_DISCONNECT");

export default class Connection {

    /**
     * @param {string} url
     */
    constructor(url) {
        /**
         * @member {string}
         * @private
         */
        this._url = url;

        /**
         * @type {?WebSocket}
         * @private
         */
        this._conn = null;

        /**
         * @member {EventEmitter}
         * @private
         */
        this._eventEmitter = new EventEmitter();

        /**
         * @member {wire.EventEnvelope[]}
         * @private
         */
        this._serverEvents = [];
    }

    /**
     * @param {MessageEvent} msgEvent
     * @private
     */
    _onWSMessage(msgEvent) {
        let data = new Uint8Array(msgEvent.data);
        /** @type wire.EventEnvelope */
        let eventEnvelope;
        try {
            eventEnvelope = wire.EventEnvelope.decode(data);
        } catch (err) {
            console.warn("Failed decoding server EventEnvelope:", err);
            return;
        }
        this._serverEvents.push(eventEnvelope);
        this._eventEmitter.emit(EVENT_SERVER_EVENT);
    }

    _onWSError() {
        this._conn.close();
        this._eventEmitter.emit(EVENT_DISCONNECT);
    }

    _onWSClose() {
        this._eventEmitter.emit(EVENT_DISCONNECT);
    }

    _onWSOpen() {
        this._eventEmitter.emit(EVENT_CONNECTED);
    }

    addServerEventListener(listener, context = null) {
        this._eventEmitter.on(EVENT_SERVER_EVENT, listener, context);
    }

    removeServerEventListener(listener, context = null) {
        this._eventEmitter.off(EVENT_SERVER_EVENT, listener, context);
    }

    addDisconnectListener(listener, context = null) {
        this._eventEmitter.on(EVENT_DISCONNECT, listener, context);
    }

    removeDisconnectListener(listener, context = null) {
        this._eventEmitter.off(EVENT_DISCONNECT, listener, context);
    }

    addConnectedListener(listener, context = null) {
        this._eventEmitter.on(EVENT_CONNECTED, listener, context);
    }

    removeConnectedListener(listener, context = null) {
        this._eventEmitter.off(EVENT_CONNECTED, listener, context);
    }

    connect() {
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

    disconnect() {
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

    /**
     * @return {boolean}
     */
    hasNext() {
        return this._serverEvents.length > 0;
    }

    /**
     * @return {wire.EventEnvelope}
     */
    getNext() {
        if (!this.hasNext()) {
            throw new Error("!hasNextServerEvent");
        }
        return this._serverEvents.shift();
    }

    /**
     * @return {wire.EventEnvelope}
     */
    peekNext() {
        if (!this.hasNext()) {
            throw new Error("!hasNextServerEvent");
        }
        return this._serverEvents[0];
    }

    async waitNext() {
        let serverEventListener, disconnectListener;
        let nextPromise = new Promise((resolve, reject) => {
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

    /**
     * @param {wire.ActionEnvelope} actionEnvelope
     */
    sendAction(actionEnvelope) {
        if (this._conn === null) {
            console.warn("sendAction called when Connection was not connected");
            return;
        }
        let buffer = wire.ActionEnvelope.encode(actionEnvelope).finish();
        this._conn.send(buffer);
    }
}
