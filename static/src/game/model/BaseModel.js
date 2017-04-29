import EventEmitter from "eventemitter3";

/** @type {Symbol}*/
const EVENT_CHANGE = Symbol("Change Event");

export default class BaseModel {

    constructor() {
        /**
         * @member {?string}
         * @protected
         */
        this._id = null;

        /**
         * @member EventEmitter
         * @private
         */
        this._eventEmitter = new EventEmitter();
    }

    /**
     * @returns {?string}
     */
    get id() {
        return this._id;
    }

    addChangeListener(listener, context = null) {
        this._eventEmitter.on(EVENT_CHANGE, listener, context);
    }

    removeChangeListener(listener, context = null) {
        this._eventEmitter.off(EVENT_CHANGE, listener, context);
    }

    /**
     * @param args
     * @protected
     */
    _emitChanged(...args) {
        this._eventEmitter.emit(EVENT_CHANGE, args);
    }


    /**
     * Updates the model from the given data.
     * @param {{id: string}} data
     * @returns {boolean} True if the model was changed
     * @protected
     */
    _update(data) {
        let changed = false;
        if (this._id !== data.id) {
            this._id = data.id;
            changed = true;
        }
        return changed;
    }

    /**
     * Updates the model from the given data. A change event
     * is emitted if the model was changed.
     *
     * @param {*} data
     */
    update(data) {
        if (this._update(data)) {
            this._emitChanged();
        }
    }

    /**
     * Tells the model to interpolate movement over time delta
     */
    interpolate(delta) {
    }
}