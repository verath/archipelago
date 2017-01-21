import EventEmitter from 'eventemitter3';

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
        let message = /** @type {string} */ msgEvent.data;

        let serverEvent;
        try {
            serverEvent = JSON.parse(message);
        } catch (err) {
            console.warn("Failed decoding server message", err);
            return;
        }
        this._eventEmitter.emit(EVENT_SERVER_EVENT, serverEvent);
    }

    _onWSError(errEvent) {
        this._eventEmitter.emit(EVENT_DISCONNECT);
    }

    _onWSClose(closeEvent) {
        this._eventEmitter.emit(EVENT_DISCONNECT);
    }

    /**
     * @param {ServerPayload} payloadObj
     */
    sendAction(payloadObj) {
        let message = JSON.stringify(payloadObj);
        this._conn.send(message);
    }

    addServerEventListener(listener, context = null) {
        this._eventEmitter.on(EVENT_SERVER_EVENT, listener, context);
    }

    addDisconnectListener(listener, context = null) {
        this._eventEmitter.on(EVENT_DISCONNECT, listener, context);
    }

    removeDisconnectListener(listener, context=null) {
        this._eventEmitter.off(EVENT_DISCONNECT, listener, context);
    }

    connect() {
        if (this._conn != null) {
            console.warn("connect called when Connection already connected");
            return;
        }
        this._conn = new WebSocket(this._url);
        this._conn.onmessage = this._onWSMessage.bind(this);
        this._conn.onclose = this._onWSClose.bind(this);
        this._conn.onerror = this._onWSError.bind(this);
    }

    disconnect() {
        if(this._conn == null) {
            console.warn("disconnect called when Connection was not connected");
            return;
        }
        this._conn.close();
        this._conn.onmessage = null;
        this._conn.onclose = null;
        this._conn.onerror = null;
        this._conn = null;
    }
}