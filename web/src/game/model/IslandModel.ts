import type { wire } from "../../wire/proto_bundle.js";
import Coordinate from "./Coordinate.ts";
import OwnableModel from "./OwnableModel.ts";

export default class IslandModel extends OwnableModel<wire.msg.Island.$Properties> {

    private readonly _position = new Coordinate();

    private _size = 0;

    private _selected = false;

    get position(): Coordinate {
        return this._position;
    }

    get size(): number {
        return this._size;
    }

    get selected(): boolean {
        return this._selected;
    }

    set selected(isSelected: boolean) {
        if (this._selected !== isSelected) {
            this._selected = isSelected;
            this._emitChanged();
        }
    }

    protected override _update(islandData: wire.msg.Island.$Properties): boolean {
        let changed = super._update(islandData);
        if (!this._position.equals(islandData.position)) {
            if (islandData.position == null) {
                throw new Error("IslandModel: data has no position");
            }
            this._position.set(islandData.position);
            changed = true;
        }
        const size = islandData.size || 0;
        if (this._size !== size) {
            this._size = size;
            changed = true;
        }
        return changed;
    }
}
