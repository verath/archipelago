/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const wire = $root.wire = (() => {

    /**
     * Namespace wire.
     * @exports wire
     * @namespace
     */
    const wire = {};

    wire.msg = (function() {

        /**
         * Namespace msg.
         * @memberof wire
         * @namespace
         */
        const msg = {};

        msg.Coordinate = (function() {

            /**
             * Properties of a Coordinate.
             * @memberof wire.msg
             * @interface ICoordinate
             * @property {number|null} [x] Coordinate x
             * @property {number|null} [y] Coordinate y
             */

            /**
             * Constructs a new Coordinate.
             * @memberof wire.msg
             * @classdesc Represents a Coordinate.
             * @implements ICoordinate
             * @constructor
             * @param {wire.msg.ICoordinate=} [properties] Properties to set
             */
            function Coordinate(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Coordinate x.
             * @member {number} x
             * @memberof wire.msg.Coordinate
             * @instance
             */
            Coordinate.prototype.x = 0;

            /**
             * Coordinate y.
             * @member {number} y
             * @memberof wire.msg.Coordinate
             * @instance
             */
            Coordinate.prototype.y = 0;

            /**
             * Creates a new Coordinate instance using the specified properties.
             * @function create
             * @memberof wire.msg.Coordinate
             * @static
             * @param {wire.msg.ICoordinate=} [properties] Properties to set
             * @returns {wire.msg.Coordinate} Coordinate instance
             */
            Coordinate.create = function create(properties) {
                return new Coordinate(properties);
            };

            /**
             * Encodes the specified Coordinate message. Does not implicitly {@link wire.msg.Coordinate.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.Coordinate
             * @static
             * @param {wire.msg.ICoordinate} message Coordinate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Coordinate.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.x);
                if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.y);
                return writer;
            };

            /**
             * Encodes the specified Coordinate message, length delimited. Does not implicitly {@link wire.msg.Coordinate.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.Coordinate
             * @static
             * @param {wire.msg.ICoordinate} message Coordinate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Coordinate.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Coordinate message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.Coordinate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.Coordinate} Coordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Coordinate.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.msg.Coordinate();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.x = reader.int32();
                        break;
                    case 2:
                        message.y = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Coordinate message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.Coordinate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.Coordinate} Coordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Coordinate.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Coordinate message.
             * @function verify
             * @memberof wire.msg.Coordinate
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Coordinate.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.x != null && message.hasOwnProperty("x"))
                    if (!$util.isInteger(message.x))
                        return "x: integer expected";
                if (message.y != null && message.hasOwnProperty("y"))
                    if (!$util.isInteger(message.y))
                        return "y: integer expected";
                return null;
            };

            /**
             * Creates a Coordinate message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.Coordinate
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.Coordinate} Coordinate
             */
            Coordinate.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.msg.Coordinate)
                    return object;
                let message = new $root.wire.msg.Coordinate();
                if (object.x != null)
                    message.x = object.x | 0;
                if (object.y != null)
                    message.y = object.y | 0;
                return message;
            };

            /**
             * Creates a plain object from a Coordinate message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.Coordinate
             * @static
             * @param {wire.msg.Coordinate} message Coordinate
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Coordinate.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.x = 0;
                    object.y = 0;
                }
                if (message.x != null && message.hasOwnProperty("x"))
                    object.x = message.x;
                if (message.y != null && message.hasOwnProperty("y"))
                    object.y = message.y;
                return object;
            };

            /**
             * Converts this Coordinate to JSON.
             * @function toJSON
             * @memberof wire.msg.Coordinate
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Coordinate.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Coordinate;
        })();

        msg.FloatCoordinate = (function() {

            /**
             * Properties of a FloatCoordinate.
             * @memberof wire.msg
             * @interface IFloatCoordinate
             * @property {number|null} [x] FloatCoordinate x
             * @property {number|null} [y] FloatCoordinate y
             */

            /**
             * Constructs a new FloatCoordinate.
             * @memberof wire.msg
             * @classdesc Represents a FloatCoordinate.
             * @implements IFloatCoordinate
             * @constructor
             * @param {wire.msg.IFloatCoordinate=} [properties] Properties to set
             */
            function FloatCoordinate(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FloatCoordinate x.
             * @member {number} x
             * @memberof wire.msg.FloatCoordinate
             * @instance
             */
            FloatCoordinate.prototype.x = 0;

            /**
             * FloatCoordinate y.
             * @member {number} y
             * @memberof wire.msg.FloatCoordinate
             * @instance
             */
            FloatCoordinate.prototype.y = 0;

            /**
             * Creates a new FloatCoordinate instance using the specified properties.
             * @function create
             * @memberof wire.msg.FloatCoordinate
             * @static
             * @param {wire.msg.IFloatCoordinate=} [properties] Properties to set
             * @returns {wire.msg.FloatCoordinate} FloatCoordinate instance
             */
            FloatCoordinate.create = function create(properties) {
                return new FloatCoordinate(properties);
            };

            /**
             * Encodes the specified FloatCoordinate message. Does not implicitly {@link wire.msg.FloatCoordinate.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.FloatCoordinate
             * @static
             * @param {wire.msg.IFloatCoordinate} message FloatCoordinate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FloatCoordinate.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                    writer.uint32(/* id 1, wireType 5 =*/13).float(message.x);
                if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                    writer.uint32(/* id 2, wireType 5 =*/21).float(message.y);
                return writer;
            };

            /**
             * Encodes the specified FloatCoordinate message, length delimited. Does not implicitly {@link wire.msg.FloatCoordinate.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.FloatCoordinate
             * @static
             * @param {wire.msg.IFloatCoordinate} message FloatCoordinate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FloatCoordinate.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FloatCoordinate message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.FloatCoordinate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.FloatCoordinate} FloatCoordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FloatCoordinate.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.msg.FloatCoordinate();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.x = reader.float();
                        break;
                    case 2:
                        message.y = reader.float();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a FloatCoordinate message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.FloatCoordinate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.FloatCoordinate} FloatCoordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FloatCoordinate.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FloatCoordinate message.
             * @function verify
             * @memberof wire.msg.FloatCoordinate
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FloatCoordinate.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.x != null && message.hasOwnProperty("x"))
                    if (typeof message.x !== "number")
                        return "x: number expected";
                if (message.y != null && message.hasOwnProperty("y"))
                    if (typeof message.y !== "number")
                        return "y: number expected";
                return null;
            };

            /**
             * Creates a FloatCoordinate message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.FloatCoordinate
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.FloatCoordinate} FloatCoordinate
             */
            FloatCoordinate.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.msg.FloatCoordinate)
                    return object;
                let message = new $root.wire.msg.FloatCoordinate();
                if (object.x != null)
                    message.x = Number(object.x);
                if (object.y != null)
                    message.y = Number(object.y);
                return message;
            };

            /**
             * Creates a plain object from a FloatCoordinate message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.FloatCoordinate
             * @static
             * @param {wire.msg.FloatCoordinate} message FloatCoordinate
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FloatCoordinate.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.x = 0;
                    object.y = 0;
                }
                if (message.x != null && message.hasOwnProperty("x"))
                    object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
                if (message.y != null && message.hasOwnProperty("y"))
                    object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
                return object;
            };

            /**
             * Converts this FloatCoordinate to JSON.
             * @function toJSON
             * @memberof wire.msg.FloatCoordinate
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FloatCoordinate.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return FloatCoordinate;
        })();

        /**
         * PlayerState enum.
         * @name wire.msg.PlayerState
         * @enum {number}
         * @property {number} ALIVE=0 ALIVE value
         * @property {number} PENDING_REVIVAL=1 PENDING_REVIVAL value
         * @property {number} DEAD=2 DEAD value
         * @property {number} LEFT_GAME=3 LEFT_GAME value
         */
        msg.PlayerState = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "ALIVE"] = 0;
            values[valuesById[1] = "PENDING_REVIVAL"] = 1;
            values[valuesById[2] = "DEAD"] = 2;
            values[valuesById[3] = "LEFT_GAME"] = 3;
            return values;
        })();

        msg.Player = (function() {

            /**
             * Properties of a Player.
             * @memberof wire.msg
             * @interface IPlayer
             * @property {string|null} [id] Player id
             * @property {wire.msg.PlayerState|null} [state] Player state
             */

            /**
             * Constructs a new Player.
             * @memberof wire.msg
             * @classdesc Represents a Player.
             * @implements IPlayer
             * @constructor
             * @param {wire.msg.IPlayer=} [properties] Properties to set
             */
            function Player(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Player id.
             * @member {string} id
             * @memberof wire.msg.Player
             * @instance
             */
            Player.prototype.id = "";

            /**
             * Player state.
             * @member {wire.msg.PlayerState} state
             * @memberof wire.msg.Player
             * @instance
             */
            Player.prototype.state = 0;

            /**
             * Creates a new Player instance using the specified properties.
             * @function create
             * @memberof wire.msg.Player
             * @static
             * @param {wire.msg.IPlayer=} [properties] Properties to set
             * @returns {wire.msg.Player} Player instance
             */
            Player.create = function create(properties) {
                return new Player(properties);
            };

            /**
             * Encodes the specified Player message. Does not implicitly {@link wire.msg.Player.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.Player
             * @static
             * @param {wire.msg.IPlayer} message Player message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Player.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.state != null && Object.hasOwnProperty.call(message, "state"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.state);
                return writer;
            };

            /**
             * Encodes the specified Player message, length delimited. Does not implicitly {@link wire.msg.Player.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.Player
             * @static
             * @param {wire.msg.IPlayer} message Player message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Player.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Player message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.Player
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.Player} Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Player.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.msg.Player();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.state = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Player message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.Player
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.Player} Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Player.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Player message.
             * @function verify
             * @memberof wire.msg.Player
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Player.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.state != null && message.hasOwnProperty("state"))
                    switch (message.state) {
                    default:
                        return "state: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                return null;
            };

            /**
             * Creates a Player message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.Player
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.Player} Player
             */
            Player.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.msg.Player)
                    return object;
                let message = new $root.wire.msg.Player();
                if (object.id != null)
                    message.id = String(object.id);
                switch (object.state) {
                case "ALIVE":
                case 0:
                    message.state = 0;
                    break;
                case "PENDING_REVIVAL":
                case 1:
                    message.state = 1;
                    break;
                case "DEAD":
                case 2:
                    message.state = 2;
                    break;
                case "LEFT_GAME":
                case 3:
                    message.state = 3;
                    break;
                }
                return message;
            };

            /**
             * Creates a plain object from a Player message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.Player
             * @static
             * @param {wire.msg.Player} message Player
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Player.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.id = "";
                    object.state = options.enums === String ? "ALIVE" : 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.state != null && message.hasOwnProperty("state"))
                    object.state = options.enums === String ? $root.wire.msg.PlayerState[message.state] : message.state;
                return object;
            };

            /**
             * Converts this Player to JSON.
             * @function toJSON
             * @memberof wire.msg.Player
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Player.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Player;
        })();

        msg.Army = (function() {

            /**
             * Properties of an Army.
             * @memberof wire.msg
             * @interface IArmy
             * @property {string|null} [ownerId] Army ownerId
             * @property {number|null} [strength] Army strength
             */

            /**
             * Constructs a new Army.
             * @memberof wire.msg
             * @classdesc Represents an Army.
             * @implements IArmy
             * @constructor
             * @param {wire.msg.IArmy=} [properties] Properties to set
             */
            function Army(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Army ownerId.
             * @member {string} ownerId
             * @memberof wire.msg.Army
             * @instance
             */
            Army.prototype.ownerId = "";

            /**
             * Army strength.
             * @member {number} strength
             * @memberof wire.msg.Army
             * @instance
             */
            Army.prototype.strength = 0;

            /**
             * Creates a new Army instance using the specified properties.
             * @function create
             * @memberof wire.msg.Army
             * @static
             * @param {wire.msg.IArmy=} [properties] Properties to set
             * @returns {wire.msg.Army} Army instance
             */
            Army.create = function create(properties) {
                return new Army(properties);
            };

            /**
             * Encodes the specified Army message. Does not implicitly {@link wire.msg.Army.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.Army
             * @static
             * @param {wire.msg.IArmy} message Army message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Army.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.ownerId != null && Object.hasOwnProperty.call(message, "ownerId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.ownerId);
                if (message.strength != null && Object.hasOwnProperty.call(message, "strength"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.strength);
                return writer;
            };

            /**
             * Encodes the specified Army message, length delimited. Does not implicitly {@link wire.msg.Army.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.Army
             * @static
             * @param {wire.msg.IArmy} message Army message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Army.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Army message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.Army
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.Army} Army
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Army.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.msg.Army();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.ownerId = reader.string();
                        break;
                    case 2:
                        message.strength = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Army message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.Army
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.Army} Army
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Army.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Army message.
             * @function verify
             * @memberof wire.msg.Army
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Army.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.ownerId != null && message.hasOwnProperty("ownerId"))
                    if (!$util.isString(message.ownerId))
                        return "ownerId: string expected";
                if (message.strength != null && message.hasOwnProperty("strength"))
                    if (!$util.isInteger(message.strength))
                        return "strength: integer expected";
                return null;
            };

            /**
             * Creates an Army message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.Army
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.Army} Army
             */
            Army.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.msg.Army)
                    return object;
                let message = new $root.wire.msg.Army();
                if (object.ownerId != null)
                    message.ownerId = String(object.ownerId);
                if (object.strength != null)
                    message.strength = object.strength | 0;
                return message;
            };

            /**
             * Creates a plain object from an Army message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.Army
             * @static
             * @param {wire.msg.Army} message Army
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Army.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.ownerId = "";
                    object.strength = 0;
                }
                if (message.ownerId != null && message.hasOwnProperty("ownerId"))
                    object.ownerId = message.ownerId;
                if (message.strength != null && message.hasOwnProperty("strength"))
                    object.strength = message.strength;
                return object;
            };

            /**
             * Converts this Army to JSON.
             * @function toJSON
             * @memberof wire.msg.Army
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Army.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Army;
        })();

        msg.Airplane = (function() {

            /**
             * Properties of an Airplane.
             * @memberof wire.msg
             * @interface IAirplane
             * @property {string|null} [id] Airplane id
             * @property {wire.msg.IArmy|null} [army] Airplane army
             * @property {wire.msg.IFloatCoordinate|null} [position] Airplane position
             * @property {number|null} [direction] Airplane direction
             * @property {number|null} [speed] Airplane speed
             */

            /**
             * Constructs a new Airplane.
             * @memberof wire.msg
             * @classdesc Represents an Airplane.
             * @implements IAirplane
             * @constructor
             * @param {wire.msg.IAirplane=} [properties] Properties to set
             */
            function Airplane(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Airplane id.
             * @member {string} id
             * @memberof wire.msg.Airplane
             * @instance
             */
            Airplane.prototype.id = "";

            /**
             * Airplane army.
             * @member {wire.msg.IArmy|null|undefined} army
             * @memberof wire.msg.Airplane
             * @instance
             */
            Airplane.prototype.army = null;

            /**
             * Airplane position.
             * @member {wire.msg.IFloatCoordinate|null|undefined} position
             * @memberof wire.msg.Airplane
             * @instance
             */
            Airplane.prototype.position = null;

            /**
             * Airplane direction.
             * @member {number} direction
             * @memberof wire.msg.Airplane
             * @instance
             */
            Airplane.prototype.direction = 0;

            /**
             * Airplane speed.
             * @member {number} speed
             * @memberof wire.msg.Airplane
             * @instance
             */
            Airplane.prototype.speed = 0;

            /**
             * Creates a new Airplane instance using the specified properties.
             * @function create
             * @memberof wire.msg.Airplane
             * @static
             * @param {wire.msg.IAirplane=} [properties] Properties to set
             * @returns {wire.msg.Airplane} Airplane instance
             */
            Airplane.create = function create(properties) {
                return new Airplane(properties);
            };

            /**
             * Encodes the specified Airplane message. Does not implicitly {@link wire.msg.Airplane.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.Airplane
             * @static
             * @param {wire.msg.IAirplane} message Airplane message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Airplane.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.army != null && Object.hasOwnProperty.call(message, "army"))
                    $root.wire.msg.Army.encode(message.army, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                    $root.wire.msg.FloatCoordinate.encode(message.position, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                    writer.uint32(/* id 4, wireType 5 =*/37).float(message.direction);
                if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                    writer.uint32(/* id 5, wireType 5 =*/45).float(message.speed);
                return writer;
            };

            /**
             * Encodes the specified Airplane message, length delimited. Does not implicitly {@link wire.msg.Airplane.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.Airplane
             * @static
             * @param {wire.msg.IAirplane} message Airplane message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Airplane.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Airplane message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.Airplane
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.Airplane} Airplane
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Airplane.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.msg.Airplane();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.army = $root.wire.msg.Army.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.position = $root.wire.msg.FloatCoordinate.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.direction = reader.float();
                        break;
                    case 5:
                        message.speed = reader.float();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Airplane message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.Airplane
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.Airplane} Airplane
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Airplane.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Airplane message.
             * @function verify
             * @memberof wire.msg.Airplane
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Airplane.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.army != null && message.hasOwnProperty("army")) {
                    let error = $root.wire.msg.Army.verify(message.army);
                    if (error)
                        return "army." + error;
                }
                if (message.position != null && message.hasOwnProperty("position")) {
                    let error = $root.wire.msg.FloatCoordinate.verify(message.position);
                    if (error)
                        return "position." + error;
                }
                if (message.direction != null && message.hasOwnProperty("direction"))
                    if (typeof message.direction !== "number")
                        return "direction: number expected";
                if (message.speed != null && message.hasOwnProperty("speed"))
                    if (typeof message.speed !== "number")
                        return "speed: number expected";
                return null;
            };

            /**
             * Creates an Airplane message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.Airplane
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.Airplane} Airplane
             */
            Airplane.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.msg.Airplane)
                    return object;
                let message = new $root.wire.msg.Airplane();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.army != null) {
                    if (typeof object.army !== "object")
                        throw TypeError(".wire.msg.Airplane.army: object expected");
                    message.army = $root.wire.msg.Army.fromObject(object.army);
                }
                if (object.position != null) {
                    if (typeof object.position !== "object")
                        throw TypeError(".wire.msg.Airplane.position: object expected");
                    message.position = $root.wire.msg.FloatCoordinate.fromObject(object.position);
                }
                if (object.direction != null)
                    message.direction = Number(object.direction);
                if (object.speed != null)
                    message.speed = Number(object.speed);
                return message;
            };

            /**
             * Creates a plain object from an Airplane message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.Airplane
             * @static
             * @param {wire.msg.Airplane} message Airplane
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Airplane.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.id = "";
                    object.army = null;
                    object.position = null;
                    object.direction = 0;
                    object.speed = 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.army != null && message.hasOwnProperty("army"))
                    object.army = $root.wire.msg.Army.toObject(message.army, options);
                if (message.position != null && message.hasOwnProperty("position"))
                    object.position = $root.wire.msg.FloatCoordinate.toObject(message.position, options);
                if (message.direction != null && message.hasOwnProperty("direction"))
                    object.direction = options.json && !isFinite(message.direction) ? String(message.direction) : message.direction;
                if (message.speed != null && message.hasOwnProperty("speed"))
                    object.speed = options.json && !isFinite(message.speed) ? String(message.speed) : message.speed;
                return object;
            };

            /**
             * Converts this Airplane to JSON.
             * @function toJSON
             * @memberof wire.msg.Airplane
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Airplane.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Airplane;
        })();

        msg.Island = (function() {

            /**
             * Properties of an Island.
             * @memberof wire.msg
             * @interface IIsland
             * @property {string|null} [id] Island id
             * @property {wire.msg.IArmy|null} [army] Island army
             * @property {wire.msg.ICoordinate|null} [position] Island position
             * @property {number|null} [size] Island size
             */

            /**
             * Constructs a new Island.
             * @memberof wire.msg
             * @classdesc Represents an Island.
             * @implements IIsland
             * @constructor
             * @param {wire.msg.IIsland=} [properties] Properties to set
             */
            function Island(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Island id.
             * @member {string} id
             * @memberof wire.msg.Island
             * @instance
             */
            Island.prototype.id = "";

            /**
             * Island army.
             * @member {wire.msg.IArmy|null|undefined} army
             * @memberof wire.msg.Island
             * @instance
             */
            Island.prototype.army = null;

            /**
             * Island position.
             * @member {wire.msg.ICoordinate|null|undefined} position
             * @memberof wire.msg.Island
             * @instance
             */
            Island.prototype.position = null;

            /**
             * Island size.
             * @member {number} size
             * @memberof wire.msg.Island
             * @instance
             */
            Island.prototype.size = 0;

            /**
             * Creates a new Island instance using the specified properties.
             * @function create
             * @memberof wire.msg.Island
             * @static
             * @param {wire.msg.IIsland=} [properties] Properties to set
             * @returns {wire.msg.Island} Island instance
             */
            Island.create = function create(properties) {
                return new Island(properties);
            };

            /**
             * Encodes the specified Island message. Does not implicitly {@link wire.msg.Island.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.Island
             * @static
             * @param {wire.msg.IIsland} message Island message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Island.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.army != null && Object.hasOwnProperty.call(message, "army"))
                    $root.wire.msg.Army.encode(message.army, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                    $root.wire.msg.Coordinate.encode(message.position, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                    writer.uint32(/* id 4, wireType 5 =*/37).float(message.size);
                return writer;
            };

            /**
             * Encodes the specified Island message, length delimited. Does not implicitly {@link wire.msg.Island.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.Island
             * @static
             * @param {wire.msg.IIsland} message Island message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Island.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Island message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.Island
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.Island} Island
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Island.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.msg.Island();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.army = $root.wire.msg.Army.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.position = $root.wire.msg.Coordinate.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.size = reader.float();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Island message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.Island
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.Island} Island
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Island.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Island message.
             * @function verify
             * @memberof wire.msg.Island
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Island.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.army != null && message.hasOwnProperty("army")) {
                    let error = $root.wire.msg.Army.verify(message.army);
                    if (error)
                        return "army." + error;
                }
                if (message.position != null && message.hasOwnProperty("position")) {
                    let error = $root.wire.msg.Coordinate.verify(message.position);
                    if (error)
                        return "position." + error;
                }
                if (message.size != null && message.hasOwnProperty("size"))
                    if (typeof message.size !== "number")
                        return "size: number expected";
                return null;
            };

            /**
             * Creates an Island message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.Island
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.Island} Island
             */
            Island.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.msg.Island)
                    return object;
                let message = new $root.wire.msg.Island();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.army != null) {
                    if (typeof object.army !== "object")
                        throw TypeError(".wire.msg.Island.army: object expected");
                    message.army = $root.wire.msg.Army.fromObject(object.army);
                }
                if (object.position != null) {
                    if (typeof object.position !== "object")
                        throw TypeError(".wire.msg.Island.position: object expected");
                    message.position = $root.wire.msg.Coordinate.fromObject(object.position);
                }
                if (object.size != null)
                    message.size = Number(object.size);
                return message;
            };

            /**
             * Creates a plain object from an Island message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.Island
             * @static
             * @param {wire.msg.Island} message Island
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Island.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.id = "";
                    object.army = null;
                    object.position = null;
                    object.size = 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.army != null && message.hasOwnProperty("army"))
                    object.army = $root.wire.msg.Army.toObject(message.army, options);
                if (message.position != null && message.hasOwnProperty("position"))
                    object.position = $root.wire.msg.Coordinate.toObject(message.position, options);
                if (message.size != null && message.hasOwnProperty("size"))
                    object.size = options.json && !isFinite(message.size) ? String(message.size) : message.size;
                return object;
            };

            /**
             * Converts this Island to JSON.
             * @function toJSON
             * @memberof wire.msg.Island
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Island.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Island;
        })();

        msg.Game = (function() {

            /**
             * Properties of a Game.
             * @memberof wire.msg
             * @interface IGame
             * @property {string|null} [id] Game id
             * @property {wire.msg.ICoordinate|null} [size] Game size
             * @property {wire.msg.IPlayer|null} [playerNeutral] Game playerNeutral
             * @property {Array.<wire.msg.IPlayer>|null} [players] Game players
             * @property {Array.<wire.msg.IIsland>|null} [islands] Game islands
             * @property {Array.<wire.msg.IAirplane>|null} [airplanes] Game airplanes
             */

            /**
             * Constructs a new Game.
             * @memberof wire.msg
             * @classdesc Represents a Game.
             * @implements IGame
             * @constructor
             * @param {wire.msg.IGame=} [properties] Properties to set
             */
            function Game(properties) {
                this.players = [];
                this.islands = [];
                this.airplanes = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Game id.
             * @member {string} id
             * @memberof wire.msg.Game
             * @instance
             */
            Game.prototype.id = "";

            /**
             * Game size.
             * @member {wire.msg.ICoordinate|null|undefined} size
             * @memberof wire.msg.Game
             * @instance
             */
            Game.prototype.size = null;

            /**
             * Game playerNeutral.
             * @member {wire.msg.IPlayer|null|undefined} playerNeutral
             * @memberof wire.msg.Game
             * @instance
             */
            Game.prototype.playerNeutral = null;

            /**
             * Game players.
             * @member {Array.<wire.msg.IPlayer>} players
             * @memberof wire.msg.Game
             * @instance
             */
            Game.prototype.players = $util.emptyArray;

            /**
             * Game islands.
             * @member {Array.<wire.msg.IIsland>} islands
             * @memberof wire.msg.Game
             * @instance
             */
            Game.prototype.islands = $util.emptyArray;

            /**
             * Game airplanes.
             * @member {Array.<wire.msg.IAirplane>} airplanes
             * @memberof wire.msg.Game
             * @instance
             */
            Game.prototype.airplanes = $util.emptyArray;

            /**
             * Creates a new Game instance using the specified properties.
             * @function create
             * @memberof wire.msg.Game
             * @static
             * @param {wire.msg.IGame=} [properties] Properties to set
             * @returns {wire.msg.Game} Game instance
             */
            Game.create = function create(properties) {
                return new Game(properties);
            };

            /**
             * Encodes the specified Game message. Does not implicitly {@link wire.msg.Game.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.Game
             * @static
             * @param {wire.msg.IGame} message Game message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Game.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                    $root.wire.msg.Coordinate.encode(message.size, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.playerNeutral != null && Object.hasOwnProperty.call(message, "playerNeutral"))
                    $root.wire.msg.Player.encode(message.playerNeutral, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.players != null && message.players.length)
                    for (let i = 0; i < message.players.length; ++i)
                        $root.wire.msg.Player.encode(message.players[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.islands != null && message.islands.length)
                    for (let i = 0; i < message.islands.length; ++i)
                        $root.wire.msg.Island.encode(message.islands[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.airplanes != null && message.airplanes.length)
                    for (let i = 0; i < message.airplanes.length; ++i)
                        $root.wire.msg.Airplane.encode(message.airplanes[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Game message, length delimited. Does not implicitly {@link wire.msg.Game.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.Game
             * @static
             * @param {wire.msg.IGame} message Game message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Game.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Game message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.Game
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.Game} Game
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Game.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.msg.Game();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.size = $root.wire.msg.Coordinate.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.playerNeutral = $root.wire.msg.Player.decode(reader, reader.uint32());
                        break;
                    case 4:
                        if (!(message.players && message.players.length))
                            message.players = [];
                        message.players.push($root.wire.msg.Player.decode(reader, reader.uint32()));
                        break;
                    case 5:
                        if (!(message.islands && message.islands.length))
                            message.islands = [];
                        message.islands.push($root.wire.msg.Island.decode(reader, reader.uint32()));
                        break;
                    case 6:
                        if (!(message.airplanes && message.airplanes.length))
                            message.airplanes = [];
                        message.airplanes.push($root.wire.msg.Airplane.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Game message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.Game
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.Game} Game
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Game.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Game message.
             * @function verify
             * @memberof wire.msg.Game
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Game.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.size != null && message.hasOwnProperty("size")) {
                    let error = $root.wire.msg.Coordinate.verify(message.size);
                    if (error)
                        return "size." + error;
                }
                if (message.playerNeutral != null && message.hasOwnProperty("playerNeutral")) {
                    let error = $root.wire.msg.Player.verify(message.playerNeutral);
                    if (error)
                        return "playerNeutral." + error;
                }
                if (message.players != null && message.hasOwnProperty("players")) {
                    if (!Array.isArray(message.players))
                        return "players: array expected";
                    for (let i = 0; i < message.players.length; ++i) {
                        let error = $root.wire.msg.Player.verify(message.players[i]);
                        if (error)
                            return "players." + error;
                    }
                }
                if (message.islands != null && message.hasOwnProperty("islands")) {
                    if (!Array.isArray(message.islands))
                        return "islands: array expected";
                    for (let i = 0; i < message.islands.length; ++i) {
                        let error = $root.wire.msg.Island.verify(message.islands[i]);
                        if (error)
                            return "islands." + error;
                    }
                }
                if (message.airplanes != null && message.hasOwnProperty("airplanes")) {
                    if (!Array.isArray(message.airplanes))
                        return "airplanes: array expected";
                    for (let i = 0; i < message.airplanes.length; ++i) {
                        let error = $root.wire.msg.Airplane.verify(message.airplanes[i]);
                        if (error)
                            return "airplanes." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Game message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.Game
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.Game} Game
             */
            Game.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.msg.Game)
                    return object;
                let message = new $root.wire.msg.Game();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.size != null) {
                    if (typeof object.size !== "object")
                        throw TypeError(".wire.msg.Game.size: object expected");
                    message.size = $root.wire.msg.Coordinate.fromObject(object.size);
                }
                if (object.playerNeutral != null) {
                    if (typeof object.playerNeutral !== "object")
                        throw TypeError(".wire.msg.Game.playerNeutral: object expected");
                    message.playerNeutral = $root.wire.msg.Player.fromObject(object.playerNeutral);
                }
                if (object.players) {
                    if (!Array.isArray(object.players))
                        throw TypeError(".wire.msg.Game.players: array expected");
                    message.players = [];
                    for (let i = 0; i < object.players.length; ++i) {
                        if (typeof object.players[i] !== "object")
                            throw TypeError(".wire.msg.Game.players: object expected");
                        message.players[i] = $root.wire.msg.Player.fromObject(object.players[i]);
                    }
                }
                if (object.islands) {
                    if (!Array.isArray(object.islands))
                        throw TypeError(".wire.msg.Game.islands: array expected");
                    message.islands = [];
                    for (let i = 0; i < object.islands.length; ++i) {
                        if (typeof object.islands[i] !== "object")
                            throw TypeError(".wire.msg.Game.islands: object expected");
                        message.islands[i] = $root.wire.msg.Island.fromObject(object.islands[i]);
                    }
                }
                if (object.airplanes) {
                    if (!Array.isArray(object.airplanes))
                        throw TypeError(".wire.msg.Game.airplanes: array expected");
                    message.airplanes = [];
                    for (let i = 0; i < object.airplanes.length; ++i) {
                        if (typeof object.airplanes[i] !== "object")
                            throw TypeError(".wire.msg.Game.airplanes: object expected");
                        message.airplanes[i] = $root.wire.msg.Airplane.fromObject(object.airplanes[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a Game message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.Game
             * @static
             * @param {wire.msg.Game} message Game
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Game.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults) {
                    object.players = [];
                    object.islands = [];
                    object.airplanes = [];
                }
                if (options.defaults) {
                    object.id = "";
                    object.size = null;
                    object.playerNeutral = null;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.size != null && message.hasOwnProperty("size"))
                    object.size = $root.wire.msg.Coordinate.toObject(message.size, options);
                if (message.playerNeutral != null && message.hasOwnProperty("playerNeutral"))
                    object.playerNeutral = $root.wire.msg.Player.toObject(message.playerNeutral, options);
                if (message.players && message.players.length) {
                    object.players = [];
                    for (let j = 0; j < message.players.length; ++j)
                        object.players[j] = $root.wire.msg.Player.toObject(message.players[j], options);
                }
                if (message.islands && message.islands.length) {
                    object.islands = [];
                    for (let j = 0; j < message.islands.length; ++j)
                        object.islands[j] = $root.wire.msg.Island.toObject(message.islands[j], options);
                }
                if (message.airplanes && message.airplanes.length) {
                    object.airplanes = [];
                    for (let j = 0; j < message.airplanes.length; ++j)
                        object.airplanes[j] = $root.wire.msg.Airplane.toObject(message.airplanes[j], options);
                }
                return object;
            };

            /**
             * Converts this Game to JSON.
             * @function toJSON
             * @memberof wire.msg.Game
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Game.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Game;
        })();

        msg.EventEnvelope = (function() {

            /**
             * Properties of an EventEnvelope.
             * @memberof wire.msg
             * @interface IEventEnvelope
             * @property {wire.msg.IEventGameStart|null} [eventGameStart] EventEnvelope eventGameStart
             * @property {wire.msg.IEventGameOver|null} [eventGameOver] EventEnvelope eventGameOver
             * @property {wire.msg.IEventGameTick|null} [eventGameTick] EventEnvelope eventGameTick
             */

            /**
             * Constructs a new EventEnvelope.
             * @memberof wire.msg
             * @classdesc Represents an EventEnvelope.
             * @implements IEventEnvelope
             * @constructor
             * @param {wire.msg.IEventEnvelope=} [properties] Properties to set
             */
            function EventEnvelope(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EventEnvelope eventGameStart.
             * @member {wire.msg.IEventGameStart|null|undefined} eventGameStart
             * @memberof wire.msg.EventEnvelope
             * @instance
             */
            EventEnvelope.prototype.eventGameStart = null;

            /**
             * EventEnvelope eventGameOver.
             * @member {wire.msg.IEventGameOver|null|undefined} eventGameOver
             * @memberof wire.msg.EventEnvelope
             * @instance
             */
            EventEnvelope.prototype.eventGameOver = null;

            /**
             * EventEnvelope eventGameTick.
             * @member {wire.msg.IEventGameTick|null|undefined} eventGameTick
             * @memberof wire.msg.EventEnvelope
             * @instance
             */
            EventEnvelope.prototype.eventGameTick = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * EventEnvelope event.
             * @member {"eventGameStart"|"eventGameOver"|"eventGameTick"|undefined} event
             * @memberof wire.msg.EventEnvelope
             * @instance
             */
            Object.defineProperty(EventEnvelope.prototype, "event", {
                get: $util.oneOfGetter($oneOfFields = ["eventGameStart", "eventGameOver", "eventGameTick"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new EventEnvelope instance using the specified properties.
             * @function create
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {wire.msg.IEventEnvelope=} [properties] Properties to set
             * @returns {wire.msg.EventEnvelope} EventEnvelope instance
             */
            EventEnvelope.create = function create(properties) {
                return new EventEnvelope(properties);
            };

            /**
             * Encodes the specified EventEnvelope message. Does not implicitly {@link wire.msg.EventEnvelope.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {wire.msg.IEventEnvelope} message EventEnvelope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventEnvelope.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.eventGameStart != null && Object.hasOwnProperty.call(message, "eventGameStart"))
                    $root.wire.msg.EventGameStart.encode(message.eventGameStart, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.eventGameOver != null && Object.hasOwnProperty.call(message, "eventGameOver"))
                    $root.wire.msg.EventGameOver.encode(message.eventGameOver, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.eventGameTick != null && Object.hasOwnProperty.call(message, "eventGameTick"))
                    $root.wire.msg.EventGameTick.encode(message.eventGameTick, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified EventEnvelope message, length delimited. Does not implicitly {@link wire.msg.EventEnvelope.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {wire.msg.IEventEnvelope} message EventEnvelope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventEnvelope.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EventEnvelope message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.EventEnvelope} EventEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventEnvelope.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.msg.EventEnvelope();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.eventGameStart = $root.wire.msg.EventGameStart.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.eventGameOver = $root.wire.msg.EventGameOver.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.eventGameTick = $root.wire.msg.EventGameTick.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an EventEnvelope message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.EventEnvelope} EventEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventEnvelope.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EventEnvelope message.
             * @function verify
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventEnvelope.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.eventGameStart != null && message.hasOwnProperty("eventGameStart")) {
                    properties.event = 1;
                    {
                        let error = $root.wire.msg.EventGameStart.verify(message.eventGameStart);
                        if (error)
                            return "eventGameStart." + error;
                    }
                }
                if (message.eventGameOver != null && message.hasOwnProperty("eventGameOver")) {
                    if (properties.event === 1)
                        return "event: multiple values";
                    properties.event = 1;
                    {
                        let error = $root.wire.msg.EventGameOver.verify(message.eventGameOver);
                        if (error)
                            return "eventGameOver." + error;
                    }
                }
                if (message.eventGameTick != null && message.hasOwnProperty("eventGameTick")) {
                    if (properties.event === 1)
                        return "event: multiple values";
                    properties.event = 1;
                    {
                        let error = $root.wire.msg.EventGameTick.verify(message.eventGameTick);
                        if (error)
                            return "eventGameTick." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an EventEnvelope message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.EventEnvelope} EventEnvelope
             */
            EventEnvelope.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.msg.EventEnvelope)
                    return object;
                let message = new $root.wire.msg.EventEnvelope();
                if (object.eventGameStart != null) {
                    if (typeof object.eventGameStart !== "object")
                        throw TypeError(".wire.msg.EventEnvelope.eventGameStart: object expected");
                    message.eventGameStart = $root.wire.msg.EventGameStart.fromObject(object.eventGameStart);
                }
                if (object.eventGameOver != null) {
                    if (typeof object.eventGameOver !== "object")
                        throw TypeError(".wire.msg.EventEnvelope.eventGameOver: object expected");
                    message.eventGameOver = $root.wire.msg.EventGameOver.fromObject(object.eventGameOver);
                }
                if (object.eventGameTick != null) {
                    if (typeof object.eventGameTick !== "object")
                        throw TypeError(".wire.msg.EventEnvelope.eventGameTick: object expected");
                    message.eventGameTick = $root.wire.msg.EventGameTick.fromObject(object.eventGameTick);
                }
                return message;
            };

            /**
             * Creates a plain object from an EventEnvelope message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {wire.msg.EventEnvelope} message EventEnvelope
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EventEnvelope.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.eventGameStart != null && message.hasOwnProperty("eventGameStart")) {
                    object.eventGameStart = $root.wire.msg.EventGameStart.toObject(message.eventGameStart, options);
                    if (options.oneofs)
                        object.event = "eventGameStart";
                }
                if (message.eventGameOver != null && message.hasOwnProperty("eventGameOver")) {
                    object.eventGameOver = $root.wire.msg.EventGameOver.toObject(message.eventGameOver, options);
                    if (options.oneofs)
                        object.event = "eventGameOver";
                }
                if (message.eventGameTick != null && message.hasOwnProperty("eventGameTick")) {
                    object.eventGameTick = $root.wire.msg.EventGameTick.toObject(message.eventGameTick, options);
                    if (options.oneofs)
                        object.event = "eventGameTick";
                }
                return object;
            };

            /**
             * Converts this EventEnvelope to JSON.
             * @function toJSON
             * @memberof wire.msg.EventEnvelope
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EventEnvelope.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return EventEnvelope;
        })();

        msg.EventGameStart = (function() {

            /**
             * Properties of an EventGameStart.
             * @memberof wire.msg
             * @interface IEventGameStart
             * @property {string|null} [playerId] EventGameStart playerId
             * @property {number|null} [tickInterval] EventGameStart tickInterval
             */

            /**
             * Constructs a new EventGameStart.
             * @memberof wire.msg
             * @classdesc Represents an EventGameStart.
             * @implements IEventGameStart
             * @constructor
             * @param {wire.msg.IEventGameStart=} [properties] Properties to set
             */
            function EventGameStart(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EventGameStart playerId.
             * @member {string} playerId
             * @memberof wire.msg.EventGameStart
             * @instance
             */
            EventGameStart.prototype.playerId = "";

            /**
             * EventGameStart tickInterval.
             * @member {number} tickInterval
             * @memberof wire.msg.EventGameStart
             * @instance
             */
            EventGameStart.prototype.tickInterval = 0;

            /**
             * Creates a new EventGameStart instance using the specified properties.
             * @function create
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {wire.msg.IEventGameStart=} [properties] Properties to set
             * @returns {wire.msg.EventGameStart} EventGameStart instance
             */
            EventGameStart.create = function create(properties) {
                return new EventGameStart(properties);
            };

            /**
             * Encodes the specified EventGameStart message. Does not implicitly {@link wire.msg.EventGameStart.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {wire.msg.IEventGameStart} message EventGameStart message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameStart.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.playerId);
                if (message.tickInterval != null && Object.hasOwnProperty.call(message, "tickInterval"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.tickInterval);
                return writer;
            };

            /**
             * Encodes the specified EventGameStart message, length delimited. Does not implicitly {@link wire.msg.EventGameStart.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {wire.msg.IEventGameStart} message EventGameStart message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameStart.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EventGameStart message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.EventGameStart} EventGameStart
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameStart.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.msg.EventGameStart();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.playerId = reader.string();
                        break;
                    case 2:
                        message.tickInterval = reader.uint32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an EventGameStart message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.EventGameStart} EventGameStart
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameStart.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EventGameStart message.
             * @function verify
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventGameStart.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.playerId != null && message.hasOwnProperty("playerId"))
                    if (!$util.isString(message.playerId))
                        return "playerId: string expected";
                if (message.tickInterval != null && message.hasOwnProperty("tickInterval"))
                    if (!$util.isInteger(message.tickInterval))
                        return "tickInterval: integer expected";
                return null;
            };

            /**
             * Creates an EventGameStart message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.EventGameStart} EventGameStart
             */
            EventGameStart.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.msg.EventGameStart)
                    return object;
                let message = new $root.wire.msg.EventGameStart();
                if (object.playerId != null)
                    message.playerId = String(object.playerId);
                if (object.tickInterval != null)
                    message.tickInterval = object.tickInterval >>> 0;
                return message;
            };

            /**
             * Creates a plain object from an EventGameStart message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {wire.msg.EventGameStart} message EventGameStart
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EventGameStart.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.playerId = "";
                    object.tickInterval = 0;
                }
                if (message.playerId != null && message.hasOwnProperty("playerId"))
                    object.playerId = message.playerId;
                if (message.tickInterval != null && message.hasOwnProperty("tickInterval"))
                    object.tickInterval = message.tickInterval;
                return object;
            };

            /**
             * Converts this EventGameStart to JSON.
             * @function toJSON
             * @memberof wire.msg.EventGameStart
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EventGameStart.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return EventGameStart;
        })();

        msg.EventGameOver = (function() {

            /**
             * Properties of an EventGameOver.
             * @memberof wire.msg
             * @interface IEventGameOver
             * @property {string|null} [winnerId] EventGameOver winnerId
             */

            /**
             * Constructs a new EventGameOver.
             * @memberof wire.msg
             * @classdesc Represents an EventGameOver.
             * @implements IEventGameOver
             * @constructor
             * @param {wire.msg.IEventGameOver=} [properties] Properties to set
             */
            function EventGameOver(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EventGameOver winnerId.
             * @member {string} winnerId
             * @memberof wire.msg.EventGameOver
             * @instance
             */
            EventGameOver.prototype.winnerId = "";

            /**
             * Creates a new EventGameOver instance using the specified properties.
             * @function create
             * @memberof wire.msg.EventGameOver
             * @static
             * @param {wire.msg.IEventGameOver=} [properties] Properties to set
             * @returns {wire.msg.EventGameOver} EventGameOver instance
             */
            EventGameOver.create = function create(properties) {
                return new EventGameOver(properties);
            };

            /**
             * Encodes the specified EventGameOver message. Does not implicitly {@link wire.msg.EventGameOver.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.EventGameOver
             * @static
             * @param {wire.msg.IEventGameOver} message EventGameOver message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameOver.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.winnerId != null && Object.hasOwnProperty.call(message, "winnerId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.winnerId);
                return writer;
            };

            /**
             * Encodes the specified EventGameOver message, length delimited. Does not implicitly {@link wire.msg.EventGameOver.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.EventGameOver
             * @static
             * @param {wire.msg.IEventGameOver} message EventGameOver message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameOver.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EventGameOver message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.EventGameOver
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.EventGameOver} EventGameOver
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameOver.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.msg.EventGameOver();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.winnerId = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an EventGameOver message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.EventGameOver
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.EventGameOver} EventGameOver
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameOver.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EventGameOver message.
             * @function verify
             * @memberof wire.msg.EventGameOver
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventGameOver.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.winnerId != null && message.hasOwnProperty("winnerId"))
                    if (!$util.isString(message.winnerId))
                        return "winnerId: string expected";
                return null;
            };

            /**
             * Creates an EventGameOver message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.EventGameOver
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.EventGameOver} EventGameOver
             */
            EventGameOver.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.msg.EventGameOver)
                    return object;
                let message = new $root.wire.msg.EventGameOver();
                if (object.winnerId != null)
                    message.winnerId = String(object.winnerId);
                return message;
            };

            /**
             * Creates a plain object from an EventGameOver message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.EventGameOver
             * @static
             * @param {wire.msg.EventGameOver} message EventGameOver
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EventGameOver.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.winnerId = "";
                if (message.winnerId != null && message.hasOwnProperty("winnerId"))
                    object.winnerId = message.winnerId;
                return object;
            };

            /**
             * Converts this EventGameOver to JSON.
             * @function toJSON
             * @memberof wire.msg.EventGameOver
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EventGameOver.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return EventGameOver;
        })();

        msg.EventGameTick = (function() {

            /**
             * Properties of an EventGameTick.
             * @memberof wire.msg
             * @interface IEventGameTick
             * @property {wire.msg.IGame|null} [game] EventGameTick game
             */

            /**
             * Constructs a new EventGameTick.
             * @memberof wire.msg
             * @classdesc Represents an EventGameTick.
             * @implements IEventGameTick
             * @constructor
             * @param {wire.msg.IEventGameTick=} [properties] Properties to set
             */
            function EventGameTick(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EventGameTick game.
             * @member {wire.msg.IGame|null|undefined} game
             * @memberof wire.msg.EventGameTick
             * @instance
             */
            EventGameTick.prototype.game = null;

            /**
             * Creates a new EventGameTick instance using the specified properties.
             * @function create
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {wire.msg.IEventGameTick=} [properties] Properties to set
             * @returns {wire.msg.EventGameTick} EventGameTick instance
             */
            EventGameTick.create = function create(properties) {
                return new EventGameTick(properties);
            };

            /**
             * Encodes the specified EventGameTick message. Does not implicitly {@link wire.msg.EventGameTick.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {wire.msg.IEventGameTick} message EventGameTick message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameTick.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.game != null && Object.hasOwnProperty.call(message, "game"))
                    $root.wire.msg.Game.encode(message.game, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified EventGameTick message, length delimited. Does not implicitly {@link wire.msg.EventGameTick.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {wire.msg.IEventGameTick} message EventGameTick message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameTick.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an EventGameTick message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.EventGameTick} EventGameTick
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameTick.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.msg.EventGameTick();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.game = $root.wire.msg.Game.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an EventGameTick message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.EventGameTick} EventGameTick
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameTick.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EventGameTick message.
             * @function verify
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventGameTick.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.game != null && message.hasOwnProperty("game")) {
                    let error = $root.wire.msg.Game.verify(message.game);
                    if (error)
                        return "game." + error;
                }
                return null;
            };

            /**
             * Creates an EventGameTick message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.EventGameTick} EventGameTick
             */
            EventGameTick.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.msg.EventGameTick)
                    return object;
                let message = new $root.wire.msg.EventGameTick();
                if (object.game != null) {
                    if (typeof object.game !== "object")
                        throw TypeError(".wire.msg.EventGameTick.game: object expected");
                    message.game = $root.wire.msg.Game.fromObject(object.game);
                }
                return message;
            };

            /**
             * Creates a plain object from an EventGameTick message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {wire.msg.EventGameTick} message EventGameTick
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EventGameTick.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.game = null;
                if (message.game != null && message.hasOwnProperty("game"))
                    object.game = $root.wire.msg.Game.toObject(message.game, options);
                return object;
            };

            /**
             * Converts this EventGameTick to JSON.
             * @function toJSON
             * @memberof wire.msg.EventGameTick
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EventGameTick.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return EventGameTick;
        })();

        msg.ActionEnvelope = (function() {

            /**
             * Properties of an ActionEnvelope.
             * @memberof wire.msg
             * @interface IActionEnvelope
             * @property {wire.msg.IActionGameLeave|null} [actionGameLeave] ActionEnvelope actionGameLeave
             * @property {wire.msg.IActionGameLaunch|null} [actionGameLaunch] ActionEnvelope actionGameLaunch
             */

            /**
             * Constructs a new ActionEnvelope.
             * @memberof wire.msg
             * @classdesc Represents an ActionEnvelope.
             * @implements IActionEnvelope
             * @constructor
             * @param {wire.msg.IActionEnvelope=} [properties] Properties to set
             */
            function ActionEnvelope(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ActionEnvelope actionGameLeave.
             * @member {wire.msg.IActionGameLeave|null|undefined} actionGameLeave
             * @memberof wire.msg.ActionEnvelope
             * @instance
             */
            ActionEnvelope.prototype.actionGameLeave = null;

            /**
             * ActionEnvelope actionGameLaunch.
             * @member {wire.msg.IActionGameLaunch|null|undefined} actionGameLaunch
             * @memberof wire.msg.ActionEnvelope
             * @instance
             */
            ActionEnvelope.prototype.actionGameLaunch = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * ActionEnvelope action.
             * @member {"actionGameLeave"|"actionGameLaunch"|undefined} action
             * @memberof wire.msg.ActionEnvelope
             * @instance
             */
            Object.defineProperty(ActionEnvelope.prototype, "action", {
                get: $util.oneOfGetter($oneOfFields = ["actionGameLeave", "actionGameLaunch"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ActionEnvelope instance using the specified properties.
             * @function create
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {wire.msg.IActionEnvelope=} [properties] Properties to set
             * @returns {wire.msg.ActionEnvelope} ActionEnvelope instance
             */
            ActionEnvelope.create = function create(properties) {
                return new ActionEnvelope(properties);
            };

            /**
             * Encodes the specified ActionEnvelope message. Does not implicitly {@link wire.msg.ActionEnvelope.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {wire.msg.IActionEnvelope} message ActionEnvelope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ActionEnvelope.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.actionGameLeave != null && Object.hasOwnProperty.call(message, "actionGameLeave"))
                    $root.wire.msg.ActionGameLeave.encode(message.actionGameLeave, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.actionGameLaunch != null && Object.hasOwnProperty.call(message, "actionGameLaunch"))
                    $root.wire.msg.ActionGameLaunch.encode(message.actionGameLaunch, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ActionEnvelope message, length delimited. Does not implicitly {@link wire.msg.ActionEnvelope.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {wire.msg.IActionEnvelope} message ActionEnvelope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ActionEnvelope.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an ActionEnvelope message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.ActionEnvelope} ActionEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ActionEnvelope.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.msg.ActionEnvelope();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.actionGameLeave = $root.wire.msg.ActionGameLeave.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.actionGameLaunch = $root.wire.msg.ActionGameLaunch.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an ActionEnvelope message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.ActionEnvelope} ActionEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ActionEnvelope.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ActionEnvelope message.
             * @function verify
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ActionEnvelope.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.actionGameLeave != null && message.hasOwnProperty("actionGameLeave")) {
                    properties.action = 1;
                    {
                        let error = $root.wire.msg.ActionGameLeave.verify(message.actionGameLeave);
                        if (error)
                            return "actionGameLeave." + error;
                    }
                }
                if (message.actionGameLaunch != null && message.hasOwnProperty("actionGameLaunch")) {
                    if (properties.action === 1)
                        return "action: multiple values";
                    properties.action = 1;
                    {
                        let error = $root.wire.msg.ActionGameLaunch.verify(message.actionGameLaunch);
                        if (error)
                            return "actionGameLaunch." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an ActionEnvelope message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.ActionEnvelope} ActionEnvelope
             */
            ActionEnvelope.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.msg.ActionEnvelope)
                    return object;
                let message = new $root.wire.msg.ActionEnvelope();
                if (object.actionGameLeave != null) {
                    if (typeof object.actionGameLeave !== "object")
                        throw TypeError(".wire.msg.ActionEnvelope.actionGameLeave: object expected");
                    message.actionGameLeave = $root.wire.msg.ActionGameLeave.fromObject(object.actionGameLeave);
                }
                if (object.actionGameLaunch != null) {
                    if (typeof object.actionGameLaunch !== "object")
                        throw TypeError(".wire.msg.ActionEnvelope.actionGameLaunch: object expected");
                    message.actionGameLaunch = $root.wire.msg.ActionGameLaunch.fromObject(object.actionGameLaunch);
                }
                return message;
            };

            /**
             * Creates a plain object from an ActionEnvelope message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {wire.msg.ActionEnvelope} message ActionEnvelope
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ActionEnvelope.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (message.actionGameLeave != null && message.hasOwnProperty("actionGameLeave")) {
                    object.actionGameLeave = $root.wire.msg.ActionGameLeave.toObject(message.actionGameLeave, options);
                    if (options.oneofs)
                        object.action = "actionGameLeave";
                }
                if (message.actionGameLaunch != null && message.hasOwnProperty("actionGameLaunch")) {
                    object.actionGameLaunch = $root.wire.msg.ActionGameLaunch.toObject(message.actionGameLaunch, options);
                    if (options.oneofs)
                        object.action = "actionGameLaunch";
                }
                return object;
            };

            /**
             * Converts this ActionEnvelope to JSON.
             * @function toJSON
             * @memberof wire.msg.ActionEnvelope
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ActionEnvelope.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ActionEnvelope;
        })();

        msg.ActionGameLeave = (function() {

            /**
             * Properties of an ActionGameLeave.
             * @memberof wire.msg
             * @interface IActionGameLeave
             */

            /**
             * Constructs a new ActionGameLeave.
             * @memberof wire.msg
             * @classdesc Represents an ActionGameLeave.
             * @implements IActionGameLeave
             * @constructor
             * @param {wire.msg.IActionGameLeave=} [properties] Properties to set
             */
            function ActionGameLeave(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new ActionGameLeave instance using the specified properties.
             * @function create
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {wire.msg.IActionGameLeave=} [properties] Properties to set
             * @returns {wire.msg.ActionGameLeave} ActionGameLeave instance
             */
            ActionGameLeave.create = function create(properties) {
                return new ActionGameLeave(properties);
            };

            /**
             * Encodes the specified ActionGameLeave message. Does not implicitly {@link wire.msg.ActionGameLeave.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {wire.msg.IActionGameLeave} message ActionGameLeave message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ActionGameLeave.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified ActionGameLeave message, length delimited. Does not implicitly {@link wire.msg.ActionGameLeave.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {wire.msg.IActionGameLeave} message ActionGameLeave message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ActionGameLeave.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an ActionGameLeave message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.ActionGameLeave} ActionGameLeave
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ActionGameLeave.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.msg.ActionGameLeave();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an ActionGameLeave message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.ActionGameLeave} ActionGameLeave
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ActionGameLeave.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ActionGameLeave message.
             * @function verify
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ActionGameLeave.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates an ActionGameLeave message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.ActionGameLeave} ActionGameLeave
             */
            ActionGameLeave.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.msg.ActionGameLeave)
                    return object;
                return new $root.wire.msg.ActionGameLeave();
            };

            /**
             * Creates a plain object from an ActionGameLeave message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {wire.msg.ActionGameLeave} message ActionGameLeave
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ActionGameLeave.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this ActionGameLeave to JSON.
             * @function toJSON
             * @memberof wire.msg.ActionGameLeave
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ActionGameLeave.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ActionGameLeave;
        })();

        msg.ActionGameLaunch = (function() {

            /**
             * Properties of an ActionGameLaunch.
             * @memberof wire.msg
             * @interface IActionGameLaunch
             * @property {string|null} [fromId] ActionGameLaunch fromId
             * @property {string|null} [toId] ActionGameLaunch toId
             */

            /**
             * Constructs a new ActionGameLaunch.
             * @memberof wire.msg
             * @classdesc Represents an ActionGameLaunch.
             * @implements IActionGameLaunch
             * @constructor
             * @param {wire.msg.IActionGameLaunch=} [properties] Properties to set
             */
            function ActionGameLaunch(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ActionGameLaunch fromId.
             * @member {string} fromId
             * @memberof wire.msg.ActionGameLaunch
             * @instance
             */
            ActionGameLaunch.prototype.fromId = "";

            /**
             * ActionGameLaunch toId.
             * @member {string} toId
             * @memberof wire.msg.ActionGameLaunch
             * @instance
             */
            ActionGameLaunch.prototype.toId = "";

            /**
             * Creates a new ActionGameLaunch instance using the specified properties.
             * @function create
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {wire.msg.IActionGameLaunch=} [properties] Properties to set
             * @returns {wire.msg.ActionGameLaunch} ActionGameLaunch instance
             */
            ActionGameLaunch.create = function create(properties) {
                return new ActionGameLaunch(properties);
            };

            /**
             * Encodes the specified ActionGameLaunch message. Does not implicitly {@link wire.msg.ActionGameLaunch.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {wire.msg.IActionGameLaunch} message ActionGameLaunch message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ActionGameLaunch.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.fromId != null && Object.hasOwnProperty.call(message, "fromId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.fromId);
                if (message.toId != null && Object.hasOwnProperty.call(message, "toId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.toId);
                return writer;
            };

            /**
             * Encodes the specified ActionGameLaunch message, length delimited. Does not implicitly {@link wire.msg.ActionGameLaunch.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {wire.msg.IActionGameLaunch} message ActionGameLaunch message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ActionGameLaunch.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an ActionGameLaunch message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.ActionGameLaunch} ActionGameLaunch
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ActionGameLaunch.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.msg.ActionGameLaunch();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.fromId = reader.string();
                        break;
                    case 2:
                        message.toId = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an ActionGameLaunch message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.ActionGameLaunch} ActionGameLaunch
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ActionGameLaunch.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ActionGameLaunch message.
             * @function verify
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ActionGameLaunch.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.fromId != null && message.hasOwnProperty("fromId"))
                    if (!$util.isString(message.fromId))
                        return "fromId: string expected";
                if (message.toId != null && message.hasOwnProperty("toId"))
                    if (!$util.isString(message.toId))
                        return "toId: string expected";
                return null;
            };

            /**
             * Creates an ActionGameLaunch message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.ActionGameLaunch} ActionGameLaunch
             */
            ActionGameLaunch.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.msg.ActionGameLaunch)
                    return object;
                let message = new $root.wire.msg.ActionGameLaunch();
                if (object.fromId != null)
                    message.fromId = String(object.fromId);
                if (object.toId != null)
                    message.toId = String(object.toId);
                return message;
            };

            /**
             * Creates a plain object from an ActionGameLaunch message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {wire.msg.ActionGameLaunch} message ActionGameLaunch
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ActionGameLaunch.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.fromId = "";
                    object.toId = "";
                }
                if (message.fromId != null && message.hasOwnProperty("fromId"))
                    object.fromId = message.fromId;
                if (message.toId != null && message.hasOwnProperty("toId"))
                    object.toId = message.toId;
                return object;
            };

            /**
             * Converts this ActionGameLaunch to JSON.
             * @function toJSON
             * @memberof wire.msg.ActionGameLaunch
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ActionGameLaunch.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ActionGameLaunch;
        })();

        return msg;
    })();

    return wire;
})();

export { $root as default };
