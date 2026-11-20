import type { wire } from "../../wire/proto_bundle.js";
import Coordinate from "./Coordinate.ts";
import OwnableModel from "./OwnableModel.ts";

export default class IslandModel extends OwnableModel<wire.msg.Island.$Properties> {

    private readonly _position = new Coordinate();

    private _size = 0;

    private _selected = false;

    /**
     * The strength taken by each of our launches from this island that the
     * server hasn't processed yet, by launch seq.
     */
    private readonly _pendingLaunches = new Map<number, number>();

    /**
     * The strength to show: the server's, minus what our pending launches
     * from the island took. Those only count while we own the island, as
     * they won't happen if we lost it.
     */
    override get strength(): number {
        let strength = this._strength;
        if (this._pendingLaunches.size > 0 && this.owner?.isSelf()) {
            for (const taken of this._pendingLaunches.values()) {
                strength -= taken;
            }
        }
        return strength;
    }

    /**
     * Sets the server's strength.
     */
    override set strength(strength: number) {
        if (this._strength !== strength) {
            this._strength = strength;
            this._emitChanged();
        }
    }

    /**
     * Records that our launch `seq` took `strength` from the island, until
     * the server has processed it (see removePendingLaunches).
     */
    addPendingLaunch(seq: number, strength: number): void {
        this._pendingLaunches.set(seq, strength);
        this._emitChanged();
    }

    /**
     * Forgets the pending launches with a seq <= upToSeq, i.e. those that
     * the server has processed, so that the server's strength includes them.
     */
    removePendingLaunches(upToSeq: number): void {
        let changed = false;
        for (const seq of this._pendingLaunches.keys()) {
            if (seq <= upToSeq) {
                this._pendingLaunches.delete(seq);
                changed = true;
            }
        }
        if (changed) {
            this._emitChanged();
        }
    }

    /**
     * Forgets all pending launches.
     */
    clearPendingLaunches(): void {
        if (this._pendingLaunches.size > 0) {
            this._pendingLaunches.clear();
            this._emitChanged();
        }
    }

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
