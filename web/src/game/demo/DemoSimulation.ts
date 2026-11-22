import { wire } from "../../wire/proto_bundle.js";

/**
 * [ms] The time between ticks of the simulation, as on the server.
 */
export const DEMO_TICK = 100;

/**
 * [ms] How long an island of size 1 takes to grow by 1. Twice as fast as
 * in a real game, so that there is more going on.
 */
const GROWTH_INTERVAL = 1000;

/**
 * Islands stop growing at this times their size (and growth factor), and
 * shrink back to it when above, so that armies stay small enough for
 * attacks to capture islands.
 */
const GROWTH_CAP = 60;

/**
 * The range of a player's growth factor, see _growthFactors.
 */
const MIN_GROWTH_FACTOR = 0.5;
const MAX_GROWTH_FACTOR = 3;

/**
 * [ms] How long a neutral island of size 0 takes to shrink by 1. Neutral
 * islands shrink by (1 - size) of this rate, as on the server.
 */
const NEUTRAL_DECAY_INTERVAL = 2000;

/**
 * [tiles/ms] A bit faster than in a real game (1 tile per 3 s).
 */
const AIRPLANE_SPEED = 1 / 2000;

/**
 * [tiles] Players only send airplanes this far, so that flights are short.
 */
const MAX_FLIGHT_DISTANCE = 4.5;

/**
 * [ms] The time between two decisions of a player, picked at random from
 * this range each time.
 */
const THINK_INTERVAL_MIN = 1200;
const THINK_INTERVAL_MAX = 3000;

/**
 * How likely a player that is ahead is to skip a decision: this times how
 * far its share of the islands that players own is above a fair share, at
 * most MAX_HOLD_BACK.
 */
const HOLD_BACK_RATE = 2.5;
const MAX_HOLD_BACK = 0.9;

/**
 * Islands need at least this strength to send an airplane.
 */
const MIN_LAUNCH_STRENGTH = 8;

const SIZE_LARGE = 1;
const NEUTRAL_SIZES = [0.4, 0.6, 0.8];

/**
 * Islands are placed on this share of the tiles, as on the server.
 */
const ISLAND_DENSITY = 0.45;

/**
 * Small boards get more islands, up to this many per player (where there
 * is room), so that one capture doesn't make a player far ahead.
 */
const MIN_ISLANDS_PER_PLAYER = 5;

const NEUTRAL_ID = "neutral";

/**
 * The player we watch the game as: one that is out of the game (DEAD), so
 * that the whole board shows, without fog of war.
 */
export const SPECTATOR_ID = "spectator";

/**
 * A random number in [0, 1), like Math.random.
 */
export type Random = () => number;

interface Island {
    id: string;
    x: number;
    y: number;
    size: number;
    ownerId: string;
    strength: number;
    /**
     * [ms] Time towards the next growth (or decay), scaled by size.
     */
    growth: number;
}

interface Airplane {
    id: string;
    ownerId: string;
    strength: number;
    x: number;
    y: number;
    direction: number;
    targetId: string;
}

interface Player {
    id: string;
    /**
     * [ms] The simulation time of the player's next decision.
     */
    nextThink: number;
}

/**
 * A made-up game between a few computer players, shown behind the lobby. It
 * follows the rules of a real game, sped up, but its players keep the game
 * balanced so that nobody wins: islands change owners back and forth, players
 * with more islands are attacked more, and attack more seldom,
 * players with few islands grow faster, and a player's last island is never
 * captured.
 *
 * It produces game state as the server sends it (snapshot()), so that the
 * real GameModel and GameView show it.
 */
export default class DemoSimulation {

    private readonly _random: Random;

    private readonly _cols: number;

    private readonly _rows: number;

    private readonly _players: Player[] = [];

    private readonly _islands: Island[] = [];

    private readonly _islandsById = new Map<string, Island>();

    private _airplanes: Airplane[] = [];

    private _nextAirplaneId = 1;

    private _time = 0;

    /**
     * The number of times an island changed owner, for tests.
     */
    captures = 0;

    /**
     * @param cols The board's width, in tiles.
     * @param rows The board's height, in tiles.
     */
    constructor(cols: number, rows: number, random: Random = Math.random) {
        this._cols = Math.max(3, Math.floor(cols));
        this._rows = Math.max(3, Math.floor(rows));
        this._random = random;
        this._createBoard();
    }

    /**
     * [ms] The simulation's game time.
     */
    get time(): number {
        return this._time;
    }

    get playerIds(): string[] {
        return this._players.map(p => p.id);
    }

    /**
     * The number of islands each player owns, by player id.
     */
    islandCounts(): Map<string, number> {
        const counts = new Map<string, number>(this._players.map(p => [p.id, 0]));
        for (const island of this._islands) {
            if (counts.has(island.ownerId)) {
                counts.set(island.ownerId, counts.get(island.ownerId)! + 1);
            }
        }
        return counts;
    }

    get numIslands(): number {
        return this._islands.length;
    }

    get numAirplanes(): number {
        return this._airplanes.length;
    }

    private _createBoard(): void {
        const numTiles = this._cols * this._rows;
        const numPlayers = (numTiles < 40) ? 3 : 4;
        for (let i = 0; i < numPlayers; i++) {
            this._players.push({
                id: `p${i + 1}`,
                // Spread out the players' first decisions.
                nextThink: THINK_INTERVAL_MIN * this._random(),
            });
        }

        // Leave the center free, about 3 tiles wide and 1 high: the Play
        // button and the lobby text are there.
        const free = (x: number, y: number) =>
            Math.abs(x + 0.5 - this._cols / 2) >= 1.6 || Math.abs(y + 0.5 - this._rows / 2) >= 1;
        const taken = new Set<string>();
        const addIsland = (x: number, y: number, size: number, ownerId: string, strength: number) => {
            const island: Island = { id: `i${this._islands.length + 1}`, x, y, size, ownerId, strength, growth: 0 };
            this._islands.push(island);
            this._islandsById.set(island.id, island);
            taken.add(`${x},${y}`);
        };

        // Each player starts with a large island in their own band of the
        // board, across its longer side, so that they start apart.
        const alongX = this._cols >= this._rows;
        const length = alongX ? this._cols : this._rows;
        const width = alongX ? this._rows : this._cols;
        this._players.forEach((player, i) => {
            const start = Math.floor(i * length / numPlayers);
            const end = Math.floor((i + 1) * length / numPlayers);
            for (let attempt = 0; attempt < 100; attempt++) {
                const along = start + Math.floor(this._random() * (end - start));
                const across = Math.floor(this._random() * width);
                const [x, y] = alongX ? [along, across] : [across, along];
                if (free(x, y) && !taken.has(`${x},${y}`)) {
                    addIsland(x, y, SIZE_LARGE, player.id, 20);
                    break;
                }
            }
        });

        const addNeutralIsland = (x: number, y: number) => {
            const size = NEUTRAL_SIZES[Math.floor(this._random() * NEUTRAL_SIZES.length)];
            addIsland(x, y, size, NEUTRAL_ID, 5 + Math.floor(this._random() * size * 30));
        };
        const empty: [number, number][] = [];
        for (let y = 0; y < this._rows; y++) {
            for (let x = 0; x < this._cols; x++) {
                if (!free(x, y) || taken.has(`${x},${y}`)) {
                    continue;
                }
                if (this._random() < ISLAND_DENSITY) {
                    addNeutralIsland(x, y);
                } else {
                    empty.push([x, y]);
                }
            }
        }
        while (this._islands.length < MIN_ISLANDS_PER_PLAYER * numPlayers && empty.length > 0) {
            const [[x, y]] = empty.splice(Math.floor(this._random() * empty.length), 1);
            addNeutralIsland(x, y);
        }
    }

    /**
     * Advances the simulation by one tick (DEMO_TICK).
     */
    tick(): void {
        this._time += DEMO_TICK;
        this._moveAirplanes();
        this._growIslands();
        for (const player of this._players) {
            if (player.nextThink <= this._time) {
                this._think(player);
                player.nextThink = this._time + THINK_INTERVAL_MIN +
                    this._random() * (THINK_INTERVAL_MAX - THINK_INTERVAL_MIN);
            }
        }
    }

    private _moveAirplanes(): void {
        const step = AIRPLANE_SPEED * DEMO_TICK;
        this._airplanes = this._airplanes.filter(airplane => {
            const target = this._islandsById.get(airplane.targetId)!;
            const distance = Math.hypot(target.x - airplane.x, target.y - airplane.y);
            if (distance <= step) {
                this._arrive(airplane, target);
                return false;
            }
            airplane.x += step * Math.cos(airplane.direction);
            airplane.y += step * Math.sin(airplane.direction);
            return true;
        });
    }

    /**
     * Resolves an airplane's arrival as on the server, except that a
     * player's last island is never captured (nor made neutral).
     */
    private _arrive(airplane: Airplane, target: Island): void {
        if (target.ownerId === airplane.ownerId) {
            target.strength += airplane.strength;
            return;
        }
        const remaining = target.strength - airplane.strength;
        if (remaining > 0) {
            target.strength = remaining;
        } else if (this._isLastIsland(target)) {
            target.strength = 0;
        } else if (remaining < 0) {
            target.ownerId = airplane.ownerId;
            target.strength = -remaining;
            target.growth = 0;
            this.captures++;
        } else {
            target.ownerId = NEUTRAL_ID;
            target.strength = 0;
            target.growth = 0;
            this.captures++;
        }
    }

    private _isLastIsland(island: Island): boolean {
        if (island.ownerId === NEUTRAL_ID) {
            return false;
        }
        return !this._islands.some(i => i !== island && i.ownerId === island.ownerId);
    }

    /**
     * The factor that each player's islands grow by, and their cap is
     * multiplied with: above 1 for players with less than their fair share
     * of the islands that players own, below 1 for those with more.
     */
    private _growthFactors(): Map<string, number> {
        const counts = this.islandCounts();
        let owned = 0;
        counts.forEach(count => { owned += count; });
        const fair = owned / this._players.length;
        const factors = new Map<string, number>();
        counts.forEach((count, playerId) => {
            const factor = fair / Math.max(count, 1);
            factors.set(playerId, Math.min(Math.max(factor, MIN_GROWTH_FACTOR), MAX_GROWTH_FACTOR));
        });
        return factors;
    }

    private _growIslands(): void {
        const factors = this._growthFactors();
        for (const island of this._islands) {
            if (island.ownerId === NEUTRAL_ID) {
                island.growth += (1 - island.size) * DEMO_TICK;
                while (island.growth >= NEUTRAL_DECAY_INTERVAL) {
                    island.growth -= NEUTRAL_DECAY_INTERVAL;
                    island.strength = Math.max(island.strength - 1, 0);
                }
            } else {
                const factor = factors.get(island.ownerId)!;
                const cap = GROWTH_CAP * island.size * factor;
                island.growth += island.size * factor * DEMO_TICK;
                while (island.growth >= GROWTH_INTERVAL) {
                    island.growth -= GROWTH_INTERVAL;
                    if (island.strength < cap) {
                        island.strength++;
                    } else if (island.strength > cap) {
                        island.strength--;
                    }
                }
            }
        }
    }

    /**
     * Lets a player send an airplane: to capture an island if it can, else
     * to gather strength on one of its own islands.
     */
    private _think(player: Player): void {
        const counts = this.islandCounts();
        const mine = counts.get(player.id)!;
        // Players with more than their fair share of the islands that
        // players own hold back, the more so the further ahead they are, so
        // that the others catch up.
        let owned = 0;
        counts.forEach(count => { owned += count; });
        const ahead = mine / owned - 1 / this._players.length;
        if (this._random() < Math.min(ahead * HOLD_BACK_RATE, MAX_HOLD_BACK)) {
            return;
        }

        const origins = this._islands.filter(i => i.ownerId === player.id && i.strength >= MIN_LAUNCH_STRENGTH);
        let best: { origin: Island, target: Island, score: number } | null = null;
        for (const origin of origins) {
            const strength = Math.floor(origin.strength / 2);
            for (const target of this._islands) {
                if (target.ownerId === player.id || this._isLastIsland(target)) {
                    continue;
                }
                const distance = Math.hypot(target.x - origin.x, target.y - origin.y);
                if (distance > MAX_FLIGHT_DISTANCE || strength <= target.strength) {
                    continue;
                }
                // Prefer close targets, and the islands of players with more
                // islands than us.
                const owner = counts.get(target.ownerId);
                const ownerWeight = (owner === undefined) ? 1 : 1 + 0.4 * (owner - mine);
                const score = ownerWeight - 0.15 * distance + 0.6 * this._random();
                if (best === null || score > best.score) {
                    best = { origin, target, score };
                }
            }
        }
        if (best !== null) {
            this._launch(best.origin, best.target);
            return;
        }

        // Nothing to capture: gather strength, from our strongest island to
        // another one of ours, so that a later attack can capture more.
        const strongest = origins.sort((a, b) => b.strength - a.strength)[0];
        if (strongest === undefined) {
            return;
        }
        const others = this._islands.filter(i => i.ownerId === player.id && i !== strongest &&
            Math.hypot(i.x - strongest.x, i.y - strongest.y) <= MAX_FLIGHT_DISTANCE);
        if (others.length > 0) {
            this._launch(strongest, others[Math.floor(this._random() * others.length)]);
        }
    }

    private _launch(origin: Island, target: Island): void {
        const strength = Math.floor(origin.strength / 2);
        origin.strength -= strength;
        this._airplanes.push({
            id: `a${this._nextAirplaneId++}`,
            ownerId: origin.ownerId,
            strength,
            x: origin.x,
            y: origin.y,
            direction: Math.atan2(target.y - origin.y, target.x - origin.x),
            targetId: target.id,
        });
    }

    /**
     * The current state, as the server would send it to the spectator.
     */
    snapshot(): wire.msg.EventGameSnapshot.$Properties {
        const army = (ownerId: string, strength: number) => ({ ownerId, strength });
        return {
            gameTime: this._time,
            game: {
                id: "demo",
                size: { x: this._cols, y: this._rows },
                playerNeutral: { id: NEUTRAL_ID },
                // The spectator first: player colors go by index, and the
                // first color is the dullest.
                players: [
                    { id: SPECTATOR_ID, state: wire.msg.PlayerState.DEAD },
                    ...this._players.map(p => ({ id: p.id, state: wire.msg.PlayerState.ALIVE })),
                ],
                islands: this._islands.map(i => ({
                    id: i.id,
                    army: army(i.ownerId, i.strength),
                    position: { x: i.x, y: i.y },
                    size: i.size,
                })),
                airplanes: this._airplanes.map(a => ({
                    id: a.id,
                    army: army(a.ownerId, a.strength),
                    position: { x: a.x, y: a.y },
                    direction: a.direction,
                    speed: AIRPLANE_SPEED,
                    destinationId: a.targetId,
                })),
            },
        };
    }
}
