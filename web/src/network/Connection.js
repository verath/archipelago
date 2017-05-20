import EventEmitter from "eventemitter3";
import {wire} from "../wire/proto_bundle.js";

const EVENT_SERVER_EVENT = Symbol("EVENT_SERVER_EVENT");
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
         * @member EventEmitter
         * @private
         */
        this._eventEmitter = new EventEmitter();
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
        this._eventEmitter.emit(EVENT_SERVER_EVENT, eventEnvelope);
    }

    _onWSError() {
        this._eventEmitter.emit(EVENT_DISCONNECT);
    }

    _onWSClose() {
        this._eventEmitter.emit(EVENT_DISCONNECT);
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
        this._conn = null;
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
