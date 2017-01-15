// This file holds typedefs that is picked up by intellij.
// Note that the data is never enforced to follow these.

/**
 * @typedef {object} ServerPayload
 * @property {string} type
 * @property {*} data
 */

/**
 * @typedef {object} GameStartEventData
 * @property {string} player_id
 */

/**
 * @typedef {GameData} TickEventData
 */

/**
 * @typedef {object} CoordinateData
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {object} ArmyData
 * @property {string} owner_id
 * @property {number} strength
 */

/**
 * @typedef {object} GameData
 * @property {string} id
 * @property {CoordinateData} size
 * @property {PlayerData} player1
 * @property {PlayerData} player2
 * @property {PlayerData} player_neutral
 * @property {[IslandData]} islands
 * @property {[AirplaneData]} airplanes
 */

/**
 * @typedef {object} PlayerData
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {object} IslandData
 * @property {string} id
 * @property {ArmyData} army
 * @property {CoordinateData} position
 * @property {number} size
 *
 */

/**
 * @typedef {object} AirplaneData
 * @property {string} id
 * @property {ArmyData} army
 * @property {CoordinateData} position
 * @property {number} direction
 * @property {number} speed
 */
