import EventEmitter from 'eventemitter3';

/** @type {Symbol}*/
const CHANGE_EVENT = Symbol("Change Event");

export default class BaseModel {

    constructor() {
        /**
         * @member {?string}
         * @private
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
        this._eventEmitter.addListener(CHANGE_EVENT, listener, context);
    }

    removeChangeListener(listener, context = null) {
        this._eventEmitter.removeListener(CHANGE_EVENT, listener, context)
    }

    /**
     * @param args
     * @protected
     */
    _emitChanged(...args) {
        console.log("Changed", this);
        this._eventEmitter.emit(CHANGE_EVENT, args)
    }

    /**
     * Updates the model from the given data. A change event
     * is emitted if the model was changed.
     *
     * @param {{id: string}} data
     * @returns {boolean} True if the model was changed
     */
    update(data) {
        let changed = false;
        if (this._id !== data.id) {
            this._id = data.id;
            changed = true;
        }
        return changed;
    }

    /**
     * Tells the model to interpolate movement over time delta
     */
    interpolate(delta) {
    }
}