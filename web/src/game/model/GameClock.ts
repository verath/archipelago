/**
 * How fast the clock's offset may grow [ms per ms]: if the network got slower
 * (e.g. wifi to mobile data), the clock adapts by 10 ms per second. Between
 * two messages that arrive on time, which is several times a second, the
 * clock falls behind by at most a few ms.
 */
const OFFSET_RELAX_RATE = 0.01;

/**
 * GameClock estimates the server's game time from local time, so that the
 * client can move airplanes itself between server messages.
 *
 * Every server message carries the game time of its state. The clock keeps
 * the smallest offset `localTime - gameTime` seen, i.e. the offset of the
 * fastest message, so a message that is late (network jitter) doesn't pull
 * the clock back. Because a network can also get slower for good, the offset
 * slowly relaxes towards larger values.
 */
export default class GameClock {

    /**
     * localTime - gameTime [ms], or null before the first message.
     */
    private _offset: number | null = null;

    /**
     * The local time the offset was last updated at [ms].
     */
    private _offsetTime = 0;

    /**
     * Records that a server message with the given game time was received at
     * localTime.
     * @param gameTime [ms]
     * @param localTime [ms], e.g. performance.now()
     */
    onServerTime(gameTime: number, localTime: number): void {
        const offset = localTime - gameTime;
        const current = this._offsetAt(localTime);
        this._offset = (current === null) ? offset : Math.min(offset, current);
        this._offsetTime = localTime;
    }

    /**
     * The offset at localTime: relaxed continuously since it was last set,
     * so that the game time never steps back (it runs 1% slow instead).
     */
    private _offsetAt(localTime: number): number | null {
        if (this._offset === null) {
            return null;
        }
        return this._offset + Math.max(localTime - this._offsetTime, 0) * OFFSET_RELAX_RATE;
    }

    /**
     * Returns the estimated game time at localTime [ms]. 0 before the first
     * server message.
     * @param localTime [ms], e.g. performance.now()
     */
    gameTimeAt(localTime: number): number {
        const offset = this._offsetAt(localTime);
        return (offset === null) ? 0 : localTime - offset;
    }

    /**
     * Forgets all server messages, e.g. when reconnecting.
     */
    reset(): void {
        this._offset = null;
        this._offsetTime = 0;
    }
}
