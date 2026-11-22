import type { wire } from "../../wire/proto_bundle.js";
import Coordinate from "./Coordinate.ts";
import OwnableModel from "./OwnableModel.ts";

export default class IslandModel extends OwnableModel<wire.msg.Island.$Properties> {

    private readonly _position = new Coordinate();

    private _size = 0;

    private _garrison = 0;

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
        this._strength = strength;
    }

    /**
     * Records that our launch `seq` took `strength` from the island, until
     * the server has processed it (see removePendingLaunches).
     */
    addPendingLaunch(seq: number, strength: number): void {
        this._pendingLaunches.set(seq, strength);
    }

    /**
     * Forgets the pending launches with a seq <= upToSeq, i.e. those that
     * the server has processed, so that the server's strength includes them.
     */
    removePendingLaunches(upToSeq: number): void {
        for (const seq of this._pendingLaunches.keys()) {
            if (seq <= upToSeq) {
                this._pendingLaunches.delete(seq);
            }
        }
    }

    /**
     * Forgets all pending launches.
     */
    clearPendingLaunches(): void {
        this._pendingLaunches.clear();
    }

    get position(): Coordinate {
        return this._position;
    }

    get size(): number {
        return this._size;
    }

    /**
     * The island's garrison, 0 if none: an extra defence force that absorbs
     * attacks before the army does, never grows and never joins a launch.
     */
    get garrison(): number {
        return this._garrison;
    }

    /**
     * Updates the garrison, as sent in a delta.
     */
    updateGarrison(garrison: number | null | undefined): void {
        this._garrison = garrison || 0;
    }

    get selected(): boolean {
        return this._selected;
    }

    set selected(isSelected: boolean) {
        this._selected = isSelected;
    }

    override update(islandData: wire.msg.Island.$Properties): void {
        super.update(islandData);
        if (islandData.position == null) {
            throw new Error("IslandModel: data has no position");
        }
        this._position.set(islandData.position);
        this._size = islandData.size || 0;
        this.updateGarrison(islandData.garrison);
    }
}
