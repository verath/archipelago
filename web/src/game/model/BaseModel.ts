import EventEmitter from "eventemitter3";

const EVENT_CHANGE = Symbol("Change Event");

/**
 * A listener for model changes. It is called with the (usually empty)
 * array of arguments passed to `_emitChanged`.
 */
export type ChangeListener = (args: unknown[]) => void;

/**
 * The data every model is updated from.
 */
export interface ModelData {
    id?: string | null;
}

export default class BaseModel<TData extends ModelData = ModelData> {

    protected _id: string | null = null;

    private readonly _eventEmitter = new EventEmitter<{ [EVENT_CHANGE]: [args: unknown[]] }>();

    get id(): string | null {
        return this._id;
    }

    addChangeListener(listener: ChangeListener, context: unknown = null): void {
        this._eventEmitter.on(EVENT_CHANGE, listener, context);
    }

    removeChangeListener(listener: ChangeListener, context: unknown = null): void {
        this._eventEmitter.off(EVENT_CHANGE, listener, context);
    }

    protected _emitChanged(...args: unknown[]): void {
        this._eventEmitter.emit(EVENT_CHANGE, args);
    }

    /**
     * Updates the model from the given data.
     * @returns True if the model was changed
     */
    protected _update(data: TData): boolean {
        let changed = false;
        const id = data.id ?? null;
        if (this._id !== id) {
            this._id = id;
            changed = true;
        }
        return changed;
    }

    /**
     * Updates the model from the given data. A change event
     * is emitted if the model was changed.
     */
    update(data: TData): void {
        if (this._update(data)) {
            this._emitChanged();
        }
    }
}
