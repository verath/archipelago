/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-mixed-operators, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, default-case, jsdoc/require-param*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
const $Object = $util.global.Object, $undefined = $util.global.undefined, $Error = $util.global.Error, $RangeError = $util.global.RangeError, $TypeError = $util.global.TypeError, $Number = $util.global.Number, $isFinite = $util.global.isFinite, $String = $util.global.String, $Array = $util.global.Array;

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
             * @typedef {Object} wire.msg.Coordinate.$Properties
             * @property {number|null} [x] Coordinate x
             * @property {number|null} [y] Coordinate y
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a Coordinate.
             * @memberof wire.msg
             * @interface ICoordinate
             * @augments wire.msg.Coordinate.$Properties
             * @deprecated Use wire.msg.Coordinate.$Properties instead.
             */

            /**
             * Shape of a Coordinate.
             * @typedef {wire.msg.Coordinate.$Properties} wire.msg.Coordinate.$Shape
             */

            /**
             * Constructs a new Coordinate.
             * @memberof wire.msg
             * @classdesc Represents a Coordinate.
             * @constructor
             * @param {wire.msg.Coordinate.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const Coordinate = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

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
             * @param {wire.msg.Coordinate.$Properties=} [properties] Properties to set
             * @returns {wire.msg.Coordinate} Coordinate instance
             * @type {{
             *   (properties: wire.msg.Coordinate.$Shape): wire.msg.Coordinate & wire.msg.Coordinate.$Shape;
             *   (properties?: wire.msg.Coordinate.$Properties): wire.msg.Coordinate;
             * }}
             */
            Coordinate.create = function(properties) {
                return new Coordinate(properties);
            };

            /**
             * Encodes the specified Coordinate message. Does not implicitly {@link wire.msg.Coordinate.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.Coordinate
             * @static
             * @param {wire.msg.Coordinate.$Properties} message Coordinate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Coordinate.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.x != null && $Object.hasOwnProperty.call(message, "x") && message.x !== 0)
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.x);
                if (message.y != null && $Object.hasOwnProperty.call(message, "y") && message.y !== 0)
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.y);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Coordinate message, length delimited. Does not implicitly {@link wire.msg.Coordinate.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.Coordinate
             * @static
             * @param {wire.msg.Coordinate.$Properties} message Coordinate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Coordinate.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a Coordinate message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.Coordinate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.Coordinate & wire.msg.Coordinate.$Shape} Coordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Coordinate.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.Coordinate();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.int32())
                                message.x = value;
                            else
                                delete message.x;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.int32())
                                message.y = value;
                            else
                                delete message.y;
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a Coordinate message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.Coordinate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.Coordinate & wire.msg.Coordinate.$Shape} Coordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Coordinate.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies a Coordinate message.
             * @function verify
             * @memberof wire.msg.Coordinate
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Coordinate.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.x != null && $Object.hasOwnProperty.call(message, "x"))
                    if (!$util.isInteger(message.x))
                        return "x: integer expected";
                if (message.y != null && $Object.hasOwnProperty.call(message, "y"))
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
            Coordinate.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.Coordinate)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.Coordinate: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.Coordinate();
                if (object.x != null)
                    if ($Number(object.x) !== 0)
                        message.x = object.x | 0;
                if (object.y != null)
                    if ($Number(object.y) !== 0)
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
            Coordinate.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (options.defaults) {
                    object.x = 0;
                    object.y = 0;
                }
                if (message.x != null && $Object.hasOwnProperty.call(message, "x"))
                    object.x = message.x;
                if (message.y != null && $Object.hasOwnProperty.call(message, "y"))
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
            Coordinate.prototype.toJSON = function() {
                return Coordinate.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Coordinate
             * @function getTypeUrl
             * @memberof wire.msg.Coordinate
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Coordinate.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.Coordinate";
            };

            return Coordinate;
        })();

        msg.FloatCoordinate = (function() {

            /**
             * Properties of a FloatCoordinate.
             * @typedef {Object} wire.msg.FloatCoordinate.$Properties
             * @property {number|null} [x] FloatCoordinate x
             * @property {number|null} [y] FloatCoordinate y
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a FloatCoordinate.
             * @memberof wire.msg
             * @interface IFloatCoordinate
             * @augments wire.msg.FloatCoordinate.$Properties
             * @deprecated Use wire.msg.FloatCoordinate.$Properties instead.
             */

            /**
             * Shape of a FloatCoordinate.
             * @typedef {wire.msg.FloatCoordinate.$Properties} wire.msg.FloatCoordinate.$Shape
             */

            /**
             * Constructs a new FloatCoordinate.
             * @memberof wire.msg
             * @classdesc Represents a FloatCoordinate.
             * @constructor
             * @param {wire.msg.FloatCoordinate.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const FloatCoordinate = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

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
             * @param {wire.msg.FloatCoordinate.$Properties=} [properties] Properties to set
             * @returns {wire.msg.FloatCoordinate} FloatCoordinate instance
             * @type {{
             *   (properties: wire.msg.FloatCoordinate.$Shape): wire.msg.FloatCoordinate & wire.msg.FloatCoordinate.$Shape;
             *   (properties?: wire.msg.FloatCoordinate.$Properties): wire.msg.FloatCoordinate;
             * }}
             */
            FloatCoordinate.create = function(properties) {
                return new FloatCoordinate(properties);
            };

            /**
             * Encodes the specified FloatCoordinate message. Does not implicitly {@link wire.msg.FloatCoordinate.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.FloatCoordinate
             * @static
             * @param {wire.msg.FloatCoordinate.$Properties} message FloatCoordinate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FloatCoordinate.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.x != null && $Object.hasOwnProperty.call(message, "x") && !$Object.is(message.x, 0))
                    writer.uint32(/* id 1, wireType 5 =*/13).float(message.x);
                if (message.y != null && $Object.hasOwnProperty.call(message, "y") && !$Object.is(message.y, 0))
                    writer.uint32(/* id 2, wireType 5 =*/21).float(message.y);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified FloatCoordinate message, length delimited. Does not implicitly {@link wire.msg.FloatCoordinate.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.FloatCoordinate
             * @static
             * @param {wire.msg.FloatCoordinate.$Properties} message FloatCoordinate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FloatCoordinate.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a FloatCoordinate message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.FloatCoordinate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.FloatCoordinate & wire.msg.FloatCoordinate.$Shape} FloatCoordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FloatCoordinate.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.FloatCoordinate();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 5)
                                break;
                            if (!$Object.is(value = reader.float(), 0))
                                message.x = value;
                            else
                                delete message.x;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 5)
                                break;
                            if (!$Object.is(value = reader.float(), 0))
                                message.y = value;
                            else
                                delete message.y;
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a FloatCoordinate message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.FloatCoordinate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.FloatCoordinate & wire.msg.FloatCoordinate.$Shape} FloatCoordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FloatCoordinate.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies a FloatCoordinate message.
             * @function verify
             * @memberof wire.msg.FloatCoordinate
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FloatCoordinate.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.x != null && $Object.hasOwnProperty.call(message, "x"))
                    if (typeof message.x !== "number")
                        return "x: number expected";
                if (message.y != null && $Object.hasOwnProperty.call(message, "y"))
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
            FloatCoordinate.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.FloatCoordinate)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.FloatCoordinate: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.FloatCoordinate();
                if (object.x != null)
                    if (!$Object.is($Number(object.x), 0))
                        message.x = $Number(object.x);
                if (object.y != null)
                    if (!$Object.is($Number(object.y), 0))
                        message.y = $Number(object.y);
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
            FloatCoordinate.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (options.defaults) {
                    object.x = 0;
                    object.y = 0;
                }
                if (message.x != null && $Object.hasOwnProperty.call(message, "x"))
                    object.x = options.json && !$isFinite(message.x) ? $String(message.x) : message.x;
                if (message.y != null && $Object.hasOwnProperty.call(message, "y"))
                    object.y = options.json && !$isFinite(message.y) ? $String(message.y) : message.y;
                return object;
            };

            /**
             * Converts this FloatCoordinate to JSON.
             * @function toJSON
             * @memberof wire.msg.FloatCoordinate
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FloatCoordinate.prototype.toJSON = function() {
                return FloatCoordinate.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for FloatCoordinate
             * @function getTypeUrl
             * @memberof wire.msg.FloatCoordinate
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            FloatCoordinate.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.FloatCoordinate";
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
            const valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[0] = "ALIVE"] = 0;
            values[valuesById[1] = "PENDING_REVIVAL"] = 1;
            values[valuesById[2] = "DEAD"] = 2;
            values[valuesById[3] = "LEFT_GAME"] = 3;
            return values;
        })();

        msg.Player = (function() {

            /**
             * Properties of a Player.
             * @typedef {Object} wire.msg.Player.$Properties
             * @property {string|null} [id] Player id
             * @property {wire.msg.PlayerState|null} [state] Player state
             * @property {number|null} [lastLaunchSeq] Player lastLaunchSeq
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a Player.
             * @memberof wire.msg
             * @interface IPlayer
             * @augments wire.msg.Player.$Properties
             * @deprecated Use wire.msg.Player.$Properties instead.
             */

            /**
             * Shape of a Player.
             * @typedef {wire.msg.Player.$Properties} wire.msg.Player.$Shape
             */

            /**
             * Constructs a new Player.
             * @memberof wire.msg
             * @classdesc Represents a Player.
             * @constructor
             * @param {wire.msg.Player.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const Player = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

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
             * Player lastLaunchSeq.
             * @member {number} lastLaunchSeq
             * @memberof wire.msg.Player
             * @instance
             */
            Player.prototype.lastLaunchSeq = 0;

            /**
             * Creates a new Player instance using the specified properties.
             * @function create
             * @memberof wire.msg.Player
             * @static
             * @param {wire.msg.Player.$Properties=} [properties] Properties to set
             * @returns {wire.msg.Player} Player instance
             * @type {{
             *   (properties: wire.msg.Player.$Shape): wire.msg.Player & wire.msg.Player.$Shape;
             *   (properties?: wire.msg.Player.$Properties): wire.msg.Player;
             * }}
             */
            Player.create = function(properties) {
                return new Player(properties);
            };

            /**
             * Encodes the specified Player message. Does not implicitly {@link wire.msg.Player.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.Player
             * @static
             * @param {wire.msg.Player.$Properties} message Player message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Player.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.id != null && $Object.hasOwnProperty.call(message, "id") && message.id !== "")
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.state != null && $Object.hasOwnProperty.call(message, "state") && message.state !== 0)
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.state);
                if (message.lastLaunchSeq != null && $Object.hasOwnProperty.call(message, "lastLaunchSeq") && message.lastLaunchSeq !== 0)
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.lastLaunchSeq);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Player message, length delimited. Does not implicitly {@link wire.msg.Player.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.Player
             * @static
             * @param {wire.msg.Player.$Properties} message Player message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Player.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a Player message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.Player
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.Player & wire.msg.Player.$Shape} Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Player.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.Player();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if ((value = reader.stringVerify()).length)
                                message.id = value;
                            else
                                delete message.id;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.int32())
                                message.state = value;
                            else
                                delete message.state;
                            continue;
                        }
                    case 3: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.uint32())
                                message.lastLaunchSeq = value;
                            else
                                delete message.lastLaunchSeq;
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a Player message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.Player
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.Player & wire.msg.Player.$Shape} Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Player.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies a Player message.
             * @function verify
             * @memberof wire.msg.Player
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Player.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.state != null && $Object.hasOwnProperty.call(message, "state"))
                    if (typeof message.state !== "number" || (message.state | 0) !== message.state)
                        return "state: enum value expected";
                if (message.lastLaunchSeq != null && $Object.hasOwnProperty.call(message, "lastLaunchSeq"))
                    if (!$util.isInteger(message.lastLaunchSeq))
                        return "lastLaunchSeq: integer expected";
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
            Player.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.Player)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.Player: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.Player();
                if (object.id != null)
                    if (typeof object.id !== "string" || object.id.length)
                        message.id = $String(object.id);
                if (object.state !== 0 && (typeof object.state !== "string" || $root.wire.msg.PlayerState[object.state] !== 0))
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
                    default:
                        if (typeof object.state === "number" && (object.state | 0) === object.state)
                            message.state = object.state;
                    }
                if (object.lastLaunchSeq != null)
                    if ($Number(object.lastLaunchSeq) !== 0)
                        message.lastLaunchSeq = object.lastLaunchSeq >>> 0;
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
            Player.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (options.defaults) {
                    object.id = "";
                    object.state = options.enums === $String ? "ALIVE" : 0;
                    object.lastLaunchSeq = 0;
                }
                if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                    object.id = message.id;
                if (message.state != null && $Object.hasOwnProperty.call(message, "state"))
                    object.state = options.enums === $String ? $root.wire.msg.PlayerState[message.state] === $undefined ? message.state : $root.wire.msg.PlayerState[message.state] : message.state;
                if (message.lastLaunchSeq != null && $Object.hasOwnProperty.call(message, "lastLaunchSeq"))
                    object.lastLaunchSeq = message.lastLaunchSeq;
                return object;
            };

            /**
             * Converts this Player to JSON.
             * @function toJSON
             * @memberof wire.msg.Player
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Player.prototype.toJSON = function() {
                return Player.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Player
             * @function getTypeUrl
             * @memberof wire.msg.Player
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Player.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.Player";
            };

            return Player;
        })();

        msg.Army = (function() {

            /**
             * Properties of an Army.
             * @typedef {Object} wire.msg.Army.$Properties
             * @property {string|null} [ownerId] Army ownerId
             * @property {number|null} [strength] Army strength
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an Army.
             * @memberof wire.msg
             * @interface IArmy
             * @augments wire.msg.Army.$Properties
             * @deprecated Use wire.msg.Army.$Properties instead.
             */

            /**
             * Shape of an Army.
             * @typedef {wire.msg.Army.$Properties} wire.msg.Army.$Shape
             */

            /**
             * Constructs a new Army.
             * @memberof wire.msg
             * @classdesc Represents an Army.
             * @constructor
             * @param {wire.msg.Army.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const Army = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

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
             * @param {wire.msg.Army.$Properties=} [properties] Properties to set
             * @returns {wire.msg.Army} Army instance
             * @type {{
             *   (properties: wire.msg.Army.$Shape): wire.msg.Army & wire.msg.Army.$Shape;
             *   (properties?: wire.msg.Army.$Properties): wire.msg.Army;
             * }}
             */
            Army.create = function(properties) {
                return new Army(properties);
            };

            /**
             * Encodes the specified Army message. Does not implicitly {@link wire.msg.Army.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.Army
             * @static
             * @param {wire.msg.Army.$Properties} message Army message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Army.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.ownerId != null && $Object.hasOwnProperty.call(message, "ownerId") && message.ownerId !== "")
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.ownerId);
                if (message.strength != null && $Object.hasOwnProperty.call(message, "strength") && message.strength !== 0)
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.strength);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Army message, length delimited. Does not implicitly {@link wire.msg.Army.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.Army
             * @static
             * @param {wire.msg.Army.$Properties} message Army message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Army.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an Army message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.Army
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.Army & wire.msg.Army.$Shape} Army
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Army.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.Army();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if ((value = reader.stringVerify()).length)
                                message.ownerId = value;
                            else
                                delete message.ownerId;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.int32())
                                message.strength = value;
                            else
                                delete message.strength;
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes an Army message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.Army
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.Army & wire.msg.Army.$Shape} Army
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Army.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies an Army message.
             * @function verify
             * @memberof wire.msg.Army
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Army.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.ownerId != null && $Object.hasOwnProperty.call(message, "ownerId"))
                    if (!$util.isString(message.ownerId))
                        return "ownerId: string expected";
                if (message.strength != null && $Object.hasOwnProperty.call(message, "strength"))
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
            Army.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.Army)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.Army: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.Army();
                if (object.ownerId != null)
                    if (typeof object.ownerId !== "string" || object.ownerId.length)
                        message.ownerId = $String(object.ownerId);
                if (object.strength != null)
                    if ($Number(object.strength) !== 0)
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
            Army.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (options.defaults) {
                    object.ownerId = "";
                    object.strength = 0;
                }
                if (message.ownerId != null && $Object.hasOwnProperty.call(message, "ownerId"))
                    object.ownerId = message.ownerId;
                if (message.strength != null && $Object.hasOwnProperty.call(message, "strength"))
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
            Army.prototype.toJSON = function() {
                return Army.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Army
             * @function getTypeUrl
             * @memberof wire.msg.Army
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Army.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.Army";
            };

            return Army;
        })();

        msg.Airplane = (function() {

            /**
             * Properties of an Airplane.
             * @typedef {Object} wire.msg.Airplane.$Properties
             * @property {string|null} [id] Airplane id
             * @property {wire.msg.Army.$Properties|null} [army] Airplane army
             * @property {wire.msg.FloatCoordinate.$Properties|null} [position] Airplane position
             * @property {number|null} [direction] Airplane direction
             * @property {number|null} [speed] Airplane speed
             * @property {string|null} [destinationId] Airplane destinationId
             * @property {number|null} [launchSeq] Airplane launchSeq
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an Airplane.
             * @memberof wire.msg
             * @interface IAirplane
             * @augments wire.msg.Airplane.$Properties
             * @deprecated Use wire.msg.Airplane.$Properties instead.
             */

            /**
             * Shape of an Airplane.
             * @typedef {wire.msg.Airplane.$Properties} wire.msg.Airplane.$Shape
             */

            /**
             * Constructs a new Airplane.
             * @memberof wire.msg
             * @classdesc Represents an Airplane.
             * @constructor
             * @param {wire.msg.Airplane.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const Airplane = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Airplane id.
             * @member {string} id
             * @memberof wire.msg.Airplane
             * @instance
             */
            Airplane.prototype.id = "";

            /**
             * Airplane army.
             * @member {wire.msg.Army.$Properties|null|undefined} army
             * @memberof wire.msg.Airplane
             * @instance
             */
            Airplane.prototype.army = null;

            /**
             * Airplane position.
             * @member {wire.msg.FloatCoordinate.$Properties|null|undefined} position
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
             * Airplane destinationId.
             * @member {string} destinationId
             * @memberof wire.msg.Airplane
             * @instance
             */
            Airplane.prototype.destinationId = "";

            /**
             * Airplane launchSeq.
             * @member {number} launchSeq
             * @memberof wire.msg.Airplane
             * @instance
             */
            Airplane.prototype.launchSeq = 0;

            /**
             * Creates a new Airplane instance using the specified properties.
             * @function create
             * @memberof wire.msg.Airplane
             * @static
             * @param {wire.msg.Airplane.$Properties=} [properties] Properties to set
             * @returns {wire.msg.Airplane} Airplane instance
             * @type {{
             *   (properties: wire.msg.Airplane.$Shape): wire.msg.Airplane & wire.msg.Airplane.$Shape;
             *   (properties?: wire.msg.Airplane.$Properties): wire.msg.Airplane;
             * }}
             */
            Airplane.create = function(properties) {
                return new Airplane(properties);
            };

            /**
             * Encodes the specified Airplane message. Does not implicitly {@link wire.msg.Airplane.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.Airplane
             * @static
             * @param {wire.msg.Airplane.$Properties} message Airplane message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Airplane.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.id != null && $Object.hasOwnProperty.call(message, "id") && message.id !== "")
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.army != null && $Object.hasOwnProperty.call(message, "army"))
                    $root.wire.msg.Army.encode(message.army, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                if (message.position != null && $Object.hasOwnProperty.call(message, "position"))
                    $root.wire.msg.FloatCoordinate.encode(message.position, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                if (message.direction != null && $Object.hasOwnProperty.call(message, "direction") && !$Object.is(message.direction, 0))
                    writer.uint32(/* id 4, wireType 5 =*/37).float(message.direction);
                if (message.speed != null && $Object.hasOwnProperty.call(message, "speed") && !$Object.is(message.speed, 0))
                    writer.uint32(/* id 5, wireType 5 =*/45).float(message.speed);
                if (message.destinationId != null && $Object.hasOwnProperty.call(message, "destinationId") && message.destinationId !== "")
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.destinationId);
                if (message.launchSeq != null && $Object.hasOwnProperty.call(message, "launchSeq") && message.launchSeq !== 0)
                    writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.launchSeq);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Airplane message, length delimited. Does not implicitly {@link wire.msg.Airplane.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.Airplane
             * @static
             * @param {wire.msg.Airplane.$Properties} message Airplane message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Airplane.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an Airplane message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.Airplane
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.Airplane & wire.msg.Airplane.$Shape} Airplane
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Airplane.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.Airplane();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if ((value = reader.stringVerify()).length)
                                message.id = value;
                            else
                                delete message.id;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.army = $root.wire.msg.Army.decode(reader, reader.size(), $undefined, _depth + 1, message.army);
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.position = $root.wire.msg.FloatCoordinate.decode(reader, reader.size(), $undefined, _depth + 1, message.position);
                            continue;
                        }
                    case 4: {
                            if (wireType !== 5)
                                break;
                            if (!$Object.is(value = reader.float(), 0))
                                message.direction = value;
                            else
                                delete message.direction;
                            continue;
                        }
                    case 5: {
                            if (wireType !== 5)
                                break;
                            if (!$Object.is(value = reader.float(), 0))
                                message.speed = value;
                            else
                                delete message.speed;
                            continue;
                        }
                    case 6: {
                            if (wireType !== 2)
                                break;
                            if ((value = reader.stringVerify()).length)
                                message.destinationId = value;
                            else
                                delete message.destinationId;
                            continue;
                        }
                    case 7: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.uint32())
                                message.launchSeq = value;
                            else
                                delete message.launchSeq;
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes an Airplane message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.Airplane
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.Airplane & wire.msg.Airplane.$Shape} Airplane
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Airplane.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies an Airplane message.
             * @function verify
             * @memberof wire.msg.Airplane
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Airplane.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.army != null && $Object.hasOwnProperty.call(message, "army")) {
                    let error = $root.wire.msg.Army.verify(message.army, _depth + 1);
                    if (error)
                        return "army." + error;
                }
                if (message.position != null && $Object.hasOwnProperty.call(message, "position")) {
                    let error = $root.wire.msg.FloatCoordinate.verify(message.position, _depth + 1);
                    if (error)
                        return "position." + error;
                }
                if (message.direction != null && $Object.hasOwnProperty.call(message, "direction"))
                    if (typeof message.direction !== "number")
                        return "direction: number expected";
                if (message.speed != null && $Object.hasOwnProperty.call(message, "speed"))
                    if (typeof message.speed !== "number")
                        return "speed: number expected";
                if (message.destinationId != null && $Object.hasOwnProperty.call(message, "destinationId"))
                    if (!$util.isString(message.destinationId))
                        return "destinationId: string expected";
                if (message.launchSeq != null && $Object.hasOwnProperty.call(message, "launchSeq"))
                    if (!$util.isInteger(message.launchSeq))
                        return "launchSeq: integer expected";
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
            Airplane.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.Airplane)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.Airplane: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.Airplane();
                if (object.id != null)
                    if (typeof object.id !== "string" || object.id.length)
                        message.id = $String(object.id);
                if (object.army != null) {
                    if (!$util.isObject(object.army))
                        throw $TypeError(".wire.msg.Airplane.army: object expected");
                    message.army = $root.wire.msg.Army.fromObject(object.army, _depth + 1);
                }
                if (object.position != null) {
                    if (!$util.isObject(object.position))
                        throw $TypeError(".wire.msg.Airplane.position: object expected");
                    message.position = $root.wire.msg.FloatCoordinate.fromObject(object.position, _depth + 1);
                }
                if (object.direction != null)
                    if (!$Object.is($Number(object.direction), 0))
                        message.direction = $Number(object.direction);
                if (object.speed != null)
                    if (!$Object.is($Number(object.speed), 0))
                        message.speed = $Number(object.speed);
                if (object.destinationId != null)
                    if (typeof object.destinationId !== "string" || object.destinationId.length)
                        message.destinationId = $String(object.destinationId);
                if (object.launchSeq != null)
                    if ($Number(object.launchSeq) !== 0)
                        message.launchSeq = object.launchSeq >>> 0;
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
            Airplane.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (options.defaults) {
                    object.id = "";
                    object.army = null;
                    object.position = null;
                    object.direction = 0;
                    object.speed = 0;
                    object.destinationId = "";
                    object.launchSeq = 0;
                }
                if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                    object.id = message.id;
                if (message.army != null && $Object.hasOwnProperty.call(message, "army"))
                    object.army = $root.wire.msg.Army.toObject(message.army, options, _depth + 1);
                if (message.position != null && $Object.hasOwnProperty.call(message, "position"))
                    object.position = $root.wire.msg.FloatCoordinate.toObject(message.position, options, _depth + 1);
                if (message.direction != null && $Object.hasOwnProperty.call(message, "direction"))
                    object.direction = options.json && !$isFinite(message.direction) ? $String(message.direction) : message.direction;
                if (message.speed != null && $Object.hasOwnProperty.call(message, "speed"))
                    object.speed = options.json && !$isFinite(message.speed) ? $String(message.speed) : message.speed;
                if (message.destinationId != null && $Object.hasOwnProperty.call(message, "destinationId"))
                    object.destinationId = message.destinationId;
                if (message.launchSeq != null && $Object.hasOwnProperty.call(message, "launchSeq"))
                    object.launchSeq = message.launchSeq;
                return object;
            };

            /**
             * Converts this Airplane to JSON.
             * @function toJSON
             * @memberof wire.msg.Airplane
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Airplane.prototype.toJSON = function() {
                return Airplane.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Airplane
             * @function getTypeUrl
             * @memberof wire.msg.Airplane
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Airplane.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.Airplane";
            };

            return Airplane;
        })();

        msg.Island = (function() {

            /**
             * Properties of an Island.
             * @typedef {Object} wire.msg.Island.$Properties
             * @property {string|null} [id] Island id
             * @property {wire.msg.Army.$Properties|null} [army] Island army
             * @property {wire.msg.Coordinate.$Properties|null} [position] Island position
             * @property {number|null} [size] Island size
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an Island.
             * @memberof wire.msg
             * @interface IIsland
             * @augments wire.msg.Island.$Properties
             * @deprecated Use wire.msg.Island.$Properties instead.
             */

            /**
             * Shape of an Island.
             * @typedef {wire.msg.Island.$Properties} wire.msg.Island.$Shape
             */

            /**
             * Constructs a new Island.
             * @memberof wire.msg
             * @classdesc Represents an Island.
             * @constructor
             * @param {wire.msg.Island.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const Island = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Island id.
             * @member {string} id
             * @memberof wire.msg.Island
             * @instance
             */
            Island.prototype.id = "";

            /**
             * Island army.
             * @member {wire.msg.Army.$Properties|null|undefined} army
             * @memberof wire.msg.Island
             * @instance
             */
            Island.prototype.army = null;

            /**
             * Island position.
             * @member {wire.msg.Coordinate.$Properties|null|undefined} position
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
             * @param {wire.msg.Island.$Properties=} [properties] Properties to set
             * @returns {wire.msg.Island} Island instance
             * @type {{
             *   (properties: wire.msg.Island.$Shape): wire.msg.Island & wire.msg.Island.$Shape;
             *   (properties?: wire.msg.Island.$Properties): wire.msg.Island;
             * }}
             */
            Island.create = function(properties) {
                return new Island(properties);
            };

            /**
             * Encodes the specified Island message. Does not implicitly {@link wire.msg.Island.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.Island
             * @static
             * @param {wire.msg.Island.$Properties} message Island message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Island.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.id != null && $Object.hasOwnProperty.call(message, "id") && message.id !== "")
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.army != null && $Object.hasOwnProperty.call(message, "army"))
                    $root.wire.msg.Army.encode(message.army, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                if (message.position != null && $Object.hasOwnProperty.call(message, "position"))
                    $root.wire.msg.Coordinate.encode(message.position, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                if (message.size != null && $Object.hasOwnProperty.call(message, "size") && !$Object.is(message.size, 0))
                    writer.uint32(/* id 4, wireType 5 =*/37).float(message.size);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Island message, length delimited. Does not implicitly {@link wire.msg.Island.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.Island
             * @static
             * @param {wire.msg.Island.$Properties} message Island message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Island.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an Island message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.Island
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.Island & wire.msg.Island.$Shape} Island
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Island.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.Island();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if ((value = reader.stringVerify()).length)
                                message.id = value;
                            else
                                delete message.id;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.army = $root.wire.msg.Army.decode(reader, reader.size(), $undefined, _depth + 1, message.army);
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.position = $root.wire.msg.Coordinate.decode(reader, reader.size(), $undefined, _depth + 1, message.position);
                            continue;
                        }
                    case 4: {
                            if (wireType !== 5)
                                break;
                            if (!$Object.is(value = reader.float(), 0))
                                message.size = value;
                            else
                                delete message.size;
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes an Island message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.Island
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.Island & wire.msg.Island.$Shape} Island
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Island.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies an Island message.
             * @function verify
             * @memberof wire.msg.Island
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Island.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.army != null && $Object.hasOwnProperty.call(message, "army")) {
                    let error = $root.wire.msg.Army.verify(message.army, _depth + 1);
                    if (error)
                        return "army." + error;
                }
                if (message.position != null && $Object.hasOwnProperty.call(message, "position")) {
                    let error = $root.wire.msg.Coordinate.verify(message.position, _depth + 1);
                    if (error)
                        return "position." + error;
                }
                if (message.size != null && $Object.hasOwnProperty.call(message, "size"))
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
            Island.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.Island)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.Island: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.Island();
                if (object.id != null)
                    if (typeof object.id !== "string" || object.id.length)
                        message.id = $String(object.id);
                if (object.army != null) {
                    if (!$util.isObject(object.army))
                        throw $TypeError(".wire.msg.Island.army: object expected");
                    message.army = $root.wire.msg.Army.fromObject(object.army, _depth + 1);
                }
                if (object.position != null) {
                    if (!$util.isObject(object.position))
                        throw $TypeError(".wire.msg.Island.position: object expected");
                    message.position = $root.wire.msg.Coordinate.fromObject(object.position, _depth + 1);
                }
                if (object.size != null)
                    if (!$Object.is($Number(object.size), 0))
                        message.size = $Number(object.size);
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
            Island.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (options.defaults) {
                    object.id = "";
                    object.army = null;
                    object.position = null;
                    object.size = 0;
                }
                if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                    object.id = message.id;
                if (message.army != null && $Object.hasOwnProperty.call(message, "army"))
                    object.army = $root.wire.msg.Army.toObject(message.army, options, _depth + 1);
                if (message.position != null && $Object.hasOwnProperty.call(message, "position"))
                    object.position = $root.wire.msg.Coordinate.toObject(message.position, options, _depth + 1);
                if (message.size != null && $Object.hasOwnProperty.call(message, "size"))
                    object.size = options.json && !$isFinite(message.size) ? $String(message.size) : message.size;
                return object;
            };

            /**
             * Converts this Island to JSON.
             * @function toJSON
             * @memberof wire.msg.Island
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Island.prototype.toJSON = function() {
                return Island.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Island
             * @function getTypeUrl
             * @memberof wire.msg.Island
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Island.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.Island";
            };

            return Island;
        })();

        msg.Game = (function() {

            /**
             * Properties of a Game.
             * @typedef {Object} wire.msg.Game.$Properties
             * @property {string|null} [id] Game id
             * @property {wire.msg.Coordinate.$Properties|null} [size] Game size
             * @property {wire.msg.Player.$Properties|null} [playerNeutral] Game playerNeutral
             * @property {Array.<wire.msg.Player.$Properties>|null} [players] Game players
             * @property {Array.<wire.msg.Island.$Properties>|null} [islands] Game islands
             * @property {Array.<wire.msg.Airplane.$Properties>|null} [airplanes] Game airplanes
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a Game.
             * @memberof wire.msg
             * @interface IGame
             * @augments wire.msg.Game.$Properties
             * @deprecated Use wire.msg.Game.$Properties instead.
             */

            /**
             * Shape of a Game.
             * @typedef {wire.msg.Game.$Properties} wire.msg.Game.$Shape
             */

            /**
             * Constructs a new Game.
             * @memberof wire.msg
             * @classdesc Represents a Game.
             * @constructor
             * @param {wire.msg.Game.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const Game = function (properties) {
                this.players = [];
                this.islands = [];
                this.airplanes = [];
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Game id.
             * @member {string} id
             * @memberof wire.msg.Game
             * @instance
             */
            Game.prototype.id = "";

            /**
             * Game size.
             * @member {wire.msg.Coordinate.$Properties|null|undefined} size
             * @memberof wire.msg.Game
             * @instance
             */
            Game.prototype.size = null;

            /**
             * Game playerNeutral.
             * @member {wire.msg.Player.$Properties|null|undefined} playerNeutral
             * @memberof wire.msg.Game
             * @instance
             */
            Game.prototype.playerNeutral = null;

            /**
             * Game players.
             * @member {Array.<wire.msg.Player.$Properties>} players
             * @memberof wire.msg.Game
             * @instance
             */
            Game.prototype.players = $util.emptyArray;

            /**
             * Game islands.
             * @member {Array.<wire.msg.Island.$Properties>} islands
             * @memberof wire.msg.Game
             * @instance
             */
            Game.prototype.islands = $util.emptyArray;

            /**
             * Game airplanes.
             * @member {Array.<wire.msg.Airplane.$Properties>} airplanes
             * @memberof wire.msg.Game
             * @instance
             */
            Game.prototype.airplanes = $util.emptyArray;

            /**
             * Creates a new Game instance using the specified properties.
             * @function create
             * @memberof wire.msg.Game
             * @static
             * @param {wire.msg.Game.$Properties=} [properties] Properties to set
             * @returns {wire.msg.Game} Game instance
             * @type {{
             *   (properties: wire.msg.Game.$Shape): wire.msg.Game & wire.msg.Game.$Shape;
             *   (properties?: wire.msg.Game.$Properties): wire.msg.Game;
             * }}
             */
            Game.create = function(properties) {
                return new Game(properties);
            };

            /**
             * Encodes the specified Game message. Does not implicitly {@link wire.msg.Game.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.Game
             * @static
             * @param {wire.msg.Game.$Properties} message Game message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Game.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.id != null && $Object.hasOwnProperty.call(message, "id") && message.id !== "")
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.size != null && $Object.hasOwnProperty.call(message, "size"))
                    $root.wire.msg.Coordinate.encode(message.size, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                if (message.playerNeutral != null && $Object.hasOwnProperty.call(message, "playerNeutral"))
                    $root.wire.msg.Player.encode(message.playerNeutral, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                if (message.players != null && message.players.length)
                    for (let i = 0; i < message.players.length; ++i)
                        $root.wire.msg.Player.encode(message.players[i], writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                if (message.islands != null && message.islands.length)
                    for (let i = 0; i < message.islands.length; ++i)
                        $root.wire.msg.Island.encode(message.islands[i], writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                if (message.airplanes != null && message.airplanes.length)
                    for (let i = 0; i < message.airplanes.length; ++i)
                        $root.wire.msg.Airplane.encode(message.airplanes[i], writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Game message, length delimited. Does not implicitly {@link wire.msg.Game.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.Game
             * @static
             * @param {wire.msg.Game.$Properties} message Game message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Game.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a Game message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.Game
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.Game & wire.msg.Game.$Shape} Game
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Game.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.Game();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if ((value = reader.stringVerify()).length)
                                message.id = value;
                            else
                                delete message.id;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.size = $root.wire.msg.Coordinate.decode(reader, reader.size(), $undefined, _depth + 1, message.size);
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.playerNeutral = $root.wire.msg.Player.decode(reader, reader.size(), $undefined, _depth + 1, message.playerNeutral);
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            if (!(message.players && message.players.length))
                                message.players = [];
                            message.players.push($root.wire.msg.Player.decode(reader, reader.size(), $undefined, _depth + 1));
                            continue;
                        }
                    case 5: {
                            if (wireType !== 2)
                                break;
                            if (!(message.islands && message.islands.length))
                                message.islands = [];
                            message.islands.push($root.wire.msg.Island.decode(reader, reader.size(), $undefined, _depth + 1));
                            continue;
                        }
                    case 6: {
                            if (wireType !== 2)
                                break;
                            if (!(message.airplanes && message.airplanes.length))
                                message.airplanes = [];
                            message.airplanes.push($root.wire.msg.Airplane.decode(reader, reader.size(), $undefined, _depth + 1));
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a Game message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.Game
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.Game & wire.msg.Game.$Shape} Game
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Game.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies a Game message.
             * @function verify
             * @memberof wire.msg.Game
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Game.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.size != null && $Object.hasOwnProperty.call(message, "size")) {
                    let error = $root.wire.msg.Coordinate.verify(message.size, _depth + 1);
                    if (error)
                        return "size." + error;
                }
                if (message.playerNeutral != null && $Object.hasOwnProperty.call(message, "playerNeutral")) {
                    let error = $root.wire.msg.Player.verify(message.playerNeutral, _depth + 1);
                    if (error)
                        return "playerNeutral." + error;
                }
                if (message.players != null && $Object.hasOwnProperty.call(message, "players")) {
                    if (!$Array.isArray(message.players))
                        return "players: array expected";
                    for (let i = 0; i < message.players.length; ++i) {
                        let error = $root.wire.msg.Player.verify(message.players[i], _depth + 1);
                        if (error)
                            return "players." + error;
                    }
                }
                if (message.islands != null && $Object.hasOwnProperty.call(message, "islands")) {
                    if (!$Array.isArray(message.islands))
                        return "islands: array expected";
                    for (let i = 0; i < message.islands.length; ++i) {
                        let error = $root.wire.msg.Island.verify(message.islands[i], _depth + 1);
                        if (error)
                            return "islands." + error;
                    }
                }
                if (message.airplanes != null && $Object.hasOwnProperty.call(message, "airplanes")) {
                    if (!$Array.isArray(message.airplanes))
                        return "airplanes: array expected";
                    for (let i = 0; i < message.airplanes.length; ++i) {
                        let error = $root.wire.msg.Airplane.verify(message.airplanes[i], _depth + 1);
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
            Game.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.Game)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.Game: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.Game();
                if (object.id != null)
                    if (typeof object.id !== "string" || object.id.length)
                        message.id = $String(object.id);
                if (object.size != null) {
                    if (!$util.isObject(object.size))
                        throw $TypeError(".wire.msg.Game.size: object expected");
                    message.size = $root.wire.msg.Coordinate.fromObject(object.size, _depth + 1);
                }
                if (object.playerNeutral != null) {
                    if (!$util.isObject(object.playerNeutral))
                        throw $TypeError(".wire.msg.Game.playerNeutral: object expected");
                    message.playerNeutral = $root.wire.msg.Player.fromObject(object.playerNeutral, _depth + 1);
                }
                if (object.players) {
                    if (!$Array.isArray(object.players))
                        throw $TypeError(".wire.msg.Game.players: array expected");
                    message.players = $Array(object.players.length);
                    for (let i = 0; i < object.players.length; ++i) {
                        if (!$util.isObject(object.players[i]))
                            throw $TypeError(".wire.msg.Game.players: object expected");
                        message.players[i] = $root.wire.msg.Player.fromObject(object.players[i], _depth + 1);
                    }
                }
                if (object.islands) {
                    if (!$Array.isArray(object.islands))
                        throw $TypeError(".wire.msg.Game.islands: array expected");
                    message.islands = $Array(object.islands.length);
                    for (let i = 0; i < object.islands.length; ++i) {
                        if (!$util.isObject(object.islands[i]))
                            throw $TypeError(".wire.msg.Game.islands: object expected");
                        message.islands[i] = $root.wire.msg.Island.fromObject(object.islands[i], _depth + 1);
                    }
                }
                if (object.airplanes) {
                    if (!$Array.isArray(object.airplanes))
                        throw $TypeError(".wire.msg.Game.airplanes: array expected");
                    message.airplanes = $Array(object.airplanes.length);
                    for (let i = 0; i < object.airplanes.length; ++i) {
                        if (!$util.isObject(object.airplanes[i]))
                            throw $TypeError(".wire.msg.Game.airplanes: object expected");
                        message.airplanes[i] = $root.wire.msg.Airplane.fromObject(object.airplanes[i], _depth + 1);
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
            Game.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
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
                if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                    object.id = message.id;
                if (message.size != null && $Object.hasOwnProperty.call(message, "size"))
                    object.size = $root.wire.msg.Coordinate.toObject(message.size, options, _depth + 1);
                if (message.playerNeutral != null && $Object.hasOwnProperty.call(message, "playerNeutral"))
                    object.playerNeutral = $root.wire.msg.Player.toObject(message.playerNeutral, options, _depth + 1);
                if (message.players && message.players.length) {
                    object.players = $Array(message.players.length);
                    for (let j = 0; j < message.players.length; ++j)
                        object.players[j] = $root.wire.msg.Player.toObject(message.players[j], options, _depth + 1);
                }
                if (message.islands && message.islands.length) {
                    object.islands = $Array(message.islands.length);
                    for (let j = 0; j < message.islands.length; ++j)
                        object.islands[j] = $root.wire.msg.Island.toObject(message.islands[j], options, _depth + 1);
                }
                if (message.airplanes && message.airplanes.length) {
                    object.airplanes = $Array(message.airplanes.length);
                    for (let j = 0; j < message.airplanes.length; ++j)
                        object.airplanes[j] = $root.wire.msg.Airplane.toObject(message.airplanes[j], options, _depth + 1);
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
            Game.prototype.toJSON = function() {
                return Game.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Game
             * @function getTypeUrl
             * @memberof wire.msg.Game
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Game.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.Game";
            };

            return Game;
        })();

        msg.EventEnvelope = (function() {

            /**
             * Properties of an EventEnvelope.
             * @typedef {Object} wire.msg.EventEnvelope.$Properties
             * @property {wire.msg.EventGameStart.$Properties|null} [eventGameStart] EventEnvelope eventGameStart
             * @property {wire.msg.EventGameOver.$Properties|null} [eventGameOver] EventEnvelope eventGameOver
             * @property {wire.msg.EventGameTick.$Properties|null} [eventGameTick] EventEnvelope eventGameTick
             * @property {wire.msg.EventGameSnapshot.$Properties|null} [eventGameSnapshot] EventEnvelope eventGameSnapshot
             * @property {wire.msg.EventGameDelta.$Properties|null} [eventGameDelta] EventEnvelope eventGameDelta
             * @property {"eventGameStart"|"eventGameOver"|"eventGameTick"|"eventGameSnapshot"|"eventGameDelta"} [event] EventEnvelope event
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an EventEnvelope.
             * @memberof wire.msg
             * @interface IEventEnvelope
             * @augments wire.msg.EventEnvelope.$Properties
             * @deprecated Use wire.msg.EventEnvelope.$Properties instead.
             */

            /**
             * Narrowed shape of an EventEnvelope.
             * @typedef {{
             *   eventGameStart?: wire.msg.EventGameStart.$Shape|null;
             *   eventGameOver?: wire.msg.EventGameOver.$Shape|null;
             *   eventGameTick?: wire.msg.EventGameTick.$Shape|null;
             *   eventGameSnapshot?: wire.msg.EventGameSnapshot.$Shape|null;
             *   eventGameDelta?: wire.msg.EventGameDelta.$Shape|null;
             *   $unknowns?: Array.<Uint8Array>;
             * } & (
             *   ({ event?: undefined; eventGameStart?: null; eventGameOver?: null; eventGameTick?: null; eventGameSnapshot?: null; eventGameDelta?: null }|{ event?: "eventGameStart"; eventGameStart: wire.msg.EventGameStart.$Shape; eventGameOver?: null; eventGameTick?: null; eventGameSnapshot?: null; eventGameDelta?: null }|{ event?: "eventGameOver"; eventGameStart?: null; eventGameOver: wire.msg.EventGameOver.$Shape; eventGameTick?: null; eventGameSnapshot?: null; eventGameDelta?: null }|{ event?: "eventGameTick"; eventGameStart?: null; eventGameOver?: null; eventGameTick: wire.msg.EventGameTick.$Shape; eventGameSnapshot?: null; eventGameDelta?: null }|{ event?: "eventGameSnapshot"; eventGameStart?: null; eventGameOver?: null; eventGameTick?: null; eventGameSnapshot: wire.msg.EventGameSnapshot.$Shape; eventGameDelta?: null }|{ event?: "eventGameDelta"; eventGameStart?: null; eventGameOver?: null; eventGameTick?: null; eventGameSnapshot?: null; eventGameDelta: wire.msg.EventGameDelta.$Shape })
             * )} wire.msg.EventEnvelope.$Shape
             */

            /**
             * Constructs a new EventEnvelope.
             * @memberof wire.msg
             * @classdesc Represents an EventEnvelope.
             * @constructor
             * @param {wire.msg.EventEnvelope.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const EventEnvelope = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * EventEnvelope eventGameStart.
             * @member {wire.msg.EventGameStart.$Properties|null|undefined} eventGameStart
             * @memberof wire.msg.EventEnvelope
             * @instance
             */
            EventEnvelope.prototype.eventGameStart = null;

            /**
             * EventEnvelope eventGameOver.
             * @member {wire.msg.EventGameOver.$Properties|null|undefined} eventGameOver
             * @memberof wire.msg.EventEnvelope
             * @instance
             */
            EventEnvelope.prototype.eventGameOver = null;

            /**
             * EventEnvelope eventGameTick.
             * @member {wire.msg.EventGameTick.$Properties|null|undefined} eventGameTick
             * @memberof wire.msg.EventEnvelope
             * @instance
             */
            EventEnvelope.prototype.eventGameTick = null;

            /**
             * EventEnvelope eventGameSnapshot.
             * @member {wire.msg.EventGameSnapshot.$Properties|null|undefined} eventGameSnapshot
             * @memberof wire.msg.EventEnvelope
             * @instance
             */
            EventEnvelope.prototype.eventGameSnapshot = null;

            /**
             * EventEnvelope eventGameDelta.
             * @member {wire.msg.EventGameDelta.$Properties|null|undefined} eventGameDelta
             * @memberof wire.msg.EventEnvelope
             * @instance
             */
            EventEnvelope.prototype.eventGameDelta = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * EventEnvelope event.
             * @member {"eventGameStart"|"eventGameOver"|"eventGameTick"|"eventGameSnapshot"|"eventGameDelta"|undefined} event
             * @memberof wire.msg.EventEnvelope
             * @instance
             */
            $Object.defineProperty(EventEnvelope.prototype, "event", {
                get: $util.oneOfGetter($oneOfFields = ["eventGameStart", "eventGameOver", "eventGameTick", "eventGameSnapshot", "eventGameDelta"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new EventEnvelope instance using the specified properties.
             * @function create
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {wire.msg.EventEnvelope.$Properties=} [properties] Properties to set
             * @returns {wire.msg.EventEnvelope} EventEnvelope instance
             * @type {{
             *   (properties: wire.msg.EventEnvelope.$Shape): wire.msg.EventEnvelope & wire.msg.EventEnvelope.$Shape;
             *   (properties?: wire.msg.EventEnvelope.$Properties): wire.msg.EventEnvelope;
             * }}
             */
            EventEnvelope.create = function(properties) {
                return new EventEnvelope(properties);
            };

            /**
             * Encodes the specified EventEnvelope message. Does not implicitly {@link wire.msg.EventEnvelope.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {wire.msg.EventEnvelope.$Properties} message EventEnvelope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventEnvelope.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.eventGameStart != null && $Object.hasOwnProperty.call(message, "eventGameStart"))
                    $root.wire.msg.EventGameStart.encode(message.eventGameStart, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                if (message.eventGameOver != null && $Object.hasOwnProperty.call(message, "eventGameOver"))
                    $root.wire.msg.EventGameOver.encode(message.eventGameOver, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                if (message.eventGameTick != null && $Object.hasOwnProperty.call(message, "eventGameTick"))
                    $root.wire.msg.EventGameTick.encode(message.eventGameTick, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                if (message.eventGameSnapshot != null && $Object.hasOwnProperty.call(message, "eventGameSnapshot"))
                    $root.wire.msg.EventGameSnapshot.encode(message.eventGameSnapshot, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                if (message.eventGameDelta != null && $Object.hasOwnProperty.call(message, "eventGameDelta"))
                    $root.wire.msg.EventGameDelta.encode(message.eventGameDelta, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified EventEnvelope message, length delimited. Does not implicitly {@link wire.msg.EventEnvelope.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {wire.msg.EventEnvelope.$Properties} message EventEnvelope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventEnvelope.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an EventEnvelope message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.EventEnvelope & wire.msg.EventEnvelope.$Shape} EventEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventEnvelope.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.EventEnvelope();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.eventGameStart = $root.wire.msg.EventGameStart.decode(reader, reader.size(), $undefined, _depth + 1, message.eventGameStart);
                            message.event = "eventGameStart";
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.eventGameOver = $root.wire.msg.EventGameOver.decode(reader, reader.size(), $undefined, _depth + 1, message.eventGameOver);
                            message.event = "eventGameOver";
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.eventGameTick = $root.wire.msg.EventGameTick.decode(reader, reader.size(), $undefined, _depth + 1, message.eventGameTick);
                            message.event = "eventGameTick";
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            message.eventGameSnapshot = $root.wire.msg.EventGameSnapshot.decode(reader, reader.size(), $undefined, _depth + 1, message.eventGameSnapshot);
                            message.event = "eventGameSnapshot";
                            continue;
                        }
                    case 5: {
                            if (wireType !== 2)
                                break;
                            message.eventGameDelta = $root.wire.msg.EventGameDelta.decode(reader, reader.size(), $undefined, _depth + 1, message.eventGameDelta);
                            message.event = "eventGameDelta";
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes an EventEnvelope message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.EventEnvelope & wire.msg.EventEnvelope.$Shape} EventEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventEnvelope.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies an EventEnvelope message.
             * @function verify
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventEnvelope.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                let properties = {};
                if (message.eventGameStart != null && $Object.hasOwnProperty.call(message, "eventGameStart")) {
                    properties.event = 1;
                    {
                        let error = $root.wire.msg.EventGameStart.verify(message.eventGameStart, _depth + 1);
                        if (error)
                            return "eventGameStart." + error;
                    }
                }
                if (message.eventGameOver != null && $Object.hasOwnProperty.call(message, "eventGameOver")) {
                    if (properties.event === 1)
                        return "event: multiple values";
                    properties.event = 1;
                    {
                        let error = $root.wire.msg.EventGameOver.verify(message.eventGameOver, _depth + 1);
                        if (error)
                            return "eventGameOver." + error;
                    }
                }
                if (message.eventGameTick != null && $Object.hasOwnProperty.call(message, "eventGameTick")) {
                    if (properties.event === 1)
                        return "event: multiple values";
                    properties.event = 1;
                    {
                        let error = $root.wire.msg.EventGameTick.verify(message.eventGameTick, _depth + 1);
                        if (error)
                            return "eventGameTick." + error;
                    }
                }
                if (message.eventGameSnapshot != null && $Object.hasOwnProperty.call(message, "eventGameSnapshot")) {
                    if (properties.event === 1)
                        return "event: multiple values";
                    properties.event = 1;
                    {
                        let error = $root.wire.msg.EventGameSnapshot.verify(message.eventGameSnapshot, _depth + 1);
                        if (error)
                            return "eventGameSnapshot." + error;
                    }
                }
                if (message.eventGameDelta != null && $Object.hasOwnProperty.call(message, "eventGameDelta")) {
                    if (properties.event === 1)
                        return "event: multiple values";
                    properties.event = 1;
                    {
                        let error = $root.wire.msg.EventGameDelta.verify(message.eventGameDelta, _depth + 1);
                        if (error)
                            return "eventGameDelta." + error;
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
            EventEnvelope.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.EventEnvelope)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.EventEnvelope: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.EventEnvelope();
                if (object.eventGameStart != null) {
                    if (!$util.isObject(object.eventGameStart))
                        throw $TypeError(".wire.msg.EventEnvelope.eventGameStart: object expected");
                    message.eventGameStart = $root.wire.msg.EventGameStart.fromObject(object.eventGameStart, _depth + 1);
                }
                if (object.eventGameOver != null) {
                    if (!$util.isObject(object.eventGameOver))
                        throw $TypeError(".wire.msg.EventEnvelope.eventGameOver: object expected");
                    message.eventGameOver = $root.wire.msg.EventGameOver.fromObject(object.eventGameOver, _depth + 1);
                }
                if (object.eventGameTick != null) {
                    if (!$util.isObject(object.eventGameTick))
                        throw $TypeError(".wire.msg.EventEnvelope.eventGameTick: object expected");
                    message.eventGameTick = $root.wire.msg.EventGameTick.fromObject(object.eventGameTick, _depth + 1);
                }
                if (object.eventGameSnapshot != null) {
                    if (!$util.isObject(object.eventGameSnapshot))
                        throw $TypeError(".wire.msg.EventEnvelope.eventGameSnapshot: object expected");
                    message.eventGameSnapshot = $root.wire.msg.EventGameSnapshot.fromObject(object.eventGameSnapshot, _depth + 1);
                }
                if (object.eventGameDelta != null) {
                    if (!$util.isObject(object.eventGameDelta))
                        throw $TypeError(".wire.msg.EventEnvelope.eventGameDelta: object expected");
                    message.eventGameDelta = $root.wire.msg.EventGameDelta.fromObject(object.eventGameDelta, _depth + 1);
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
            EventEnvelope.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (message.eventGameStart != null && $Object.hasOwnProperty.call(message, "eventGameStart")) {
                    object.eventGameStart = $root.wire.msg.EventGameStart.toObject(message.eventGameStart, options, _depth + 1);
                    if (options.oneofs)
                        object.event = "eventGameStart";
                }
                if (message.eventGameOver != null && $Object.hasOwnProperty.call(message, "eventGameOver")) {
                    object.eventGameOver = $root.wire.msg.EventGameOver.toObject(message.eventGameOver, options, _depth + 1);
                    if (options.oneofs)
                        object.event = "eventGameOver";
                }
                if (message.eventGameTick != null && $Object.hasOwnProperty.call(message, "eventGameTick")) {
                    object.eventGameTick = $root.wire.msg.EventGameTick.toObject(message.eventGameTick, options, _depth + 1);
                    if (options.oneofs)
                        object.event = "eventGameTick";
                }
                if (message.eventGameSnapshot != null && $Object.hasOwnProperty.call(message, "eventGameSnapshot")) {
                    object.eventGameSnapshot = $root.wire.msg.EventGameSnapshot.toObject(message.eventGameSnapshot, options, _depth + 1);
                    if (options.oneofs)
                        object.event = "eventGameSnapshot";
                }
                if (message.eventGameDelta != null && $Object.hasOwnProperty.call(message, "eventGameDelta")) {
                    object.eventGameDelta = $root.wire.msg.EventGameDelta.toObject(message.eventGameDelta, options, _depth + 1);
                    if (options.oneofs)
                        object.event = "eventGameDelta";
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
            EventEnvelope.prototype.toJSON = function() {
                return EventEnvelope.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for EventEnvelope
             * @function getTypeUrl
             * @memberof wire.msg.EventEnvelope
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            EventEnvelope.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.EventEnvelope";
            };

            return EventEnvelope;
        })();

        msg.EventGameStart = (function() {

            /**
             * Properties of an EventGameStart.
             * @typedef {Object} wire.msg.EventGameStart.$Properties
             * @property {string|null} [playerId] EventGameStart playerId
             * @property {number|null} [tickInterval] EventGameStart tickInterval
             * @property {string|null} [resumeToken] EventGameStart resumeToken
             * @property {number|null} [resumeTimeout] EventGameStart resumeTimeout
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an EventGameStart.
             * @memberof wire.msg
             * @interface IEventGameStart
             * @augments wire.msg.EventGameStart.$Properties
             * @deprecated Use wire.msg.EventGameStart.$Properties instead.
             */

            /**
             * Shape of an EventGameStart.
             * @typedef {wire.msg.EventGameStart.$Properties} wire.msg.EventGameStart.$Shape
             */

            /**
             * Constructs a new EventGameStart.
             * @memberof wire.msg
             * @classdesc Represents an EventGameStart.
             * @constructor
             * @param {wire.msg.EventGameStart.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const EventGameStart = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

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
             * EventGameStart resumeToken.
             * @member {string} resumeToken
             * @memberof wire.msg.EventGameStart
             * @instance
             */
            EventGameStart.prototype.resumeToken = "";

            /**
             * EventGameStart resumeTimeout.
             * @member {number} resumeTimeout
             * @memberof wire.msg.EventGameStart
             * @instance
             */
            EventGameStart.prototype.resumeTimeout = 0;

            /**
             * Creates a new EventGameStart instance using the specified properties.
             * @function create
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {wire.msg.EventGameStart.$Properties=} [properties] Properties to set
             * @returns {wire.msg.EventGameStart} EventGameStart instance
             * @type {{
             *   (properties: wire.msg.EventGameStart.$Shape): wire.msg.EventGameStart & wire.msg.EventGameStart.$Shape;
             *   (properties?: wire.msg.EventGameStart.$Properties): wire.msg.EventGameStart;
             * }}
             */
            EventGameStart.create = function(properties) {
                return new EventGameStart(properties);
            };

            /**
             * Encodes the specified EventGameStart message. Does not implicitly {@link wire.msg.EventGameStart.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {wire.msg.EventGameStart.$Properties} message EventGameStart message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameStart.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.playerId != null && $Object.hasOwnProperty.call(message, "playerId") && message.playerId !== "")
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.playerId);
                if (message.tickInterval != null && $Object.hasOwnProperty.call(message, "tickInterval") && message.tickInterval !== 0)
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.tickInterval);
                if (message.resumeToken != null && $Object.hasOwnProperty.call(message, "resumeToken") && message.resumeToken !== "")
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.resumeToken);
                if (message.resumeTimeout != null && $Object.hasOwnProperty.call(message, "resumeTimeout") && message.resumeTimeout !== 0)
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.resumeTimeout);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified EventGameStart message, length delimited. Does not implicitly {@link wire.msg.EventGameStart.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {wire.msg.EventGameStart.$Properties} message EventGameStart message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameStart.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an EventGameStart message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.EventGameStart & wire.msg.EventGameStart.$Shape} EventGameStart
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameStart.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.EventGameStart();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if ((value = reader.stringVerify()).length)
                                message.playerId = value;
                            else
                                delete message.playerId;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.uint32())
                                message.tickInterval = value;
                            else
                                delete message.tickInterval;
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            if ((value = reader.stringVerify()).length)
                                message.resumeToken = value;
                            else
                                delete message.resumeToken;
                            continue;
                        }
                    case 4: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.uint32())
                                message.resumeTimeout = value;
                            else
                                delete message.resumeTimeout;
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes an EventGameStart message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.EventGameStart & wire.msg.EventGameStart.$Shape} EventGameStart
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameStart.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies an EventGameStart message.
             * @function verify
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventGameStart.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.playerId != null && $Object.hasOwnProperty.call(message, "playerId"))
                    if (!$util.isString(message.playerId))
                        return "playerId: string expected";
                if (message.tickInterval != null && $Object.hasOwnProperty.call(message, "tickInterval"))
                    if (!$util.isInteger(message.tickInterval))
                        return "tickInterval: integer expected";
                if (message.resumeToken != null && $Object.hasOwnProperty.call(message, "resumeToken"))
                    if (!$util.isString(message.resumeToken))
                        return "resumeToken: string expected";
                if (message.resumeTimeout != null && $Object.hasOwnProperty.call(message, "resumeTimeout"))
                    if (!$util.isInteger(message.resumeTimeout))
                        return "resumeTimeout: integer expected";
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
            EventGameStart.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.EventGameStart)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.EventGameStart: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.EventGameStart();
                if (object.playerId != null)
                    if (typeof object.playerId !== "string" || object.playerId.length)
                        message.playerId = $String(object.playerId);
                if (object.tickInterval != null)
                    if ($Number(object.tickInterval) !== 0)
                        message.tickInterval = object.tickInterval >>> 0;
                if (object.resumeToken != null)
                    if (typeof object.resumeToken !== "string" || object.resumeToken.length)
                        message.resumeToken = $String(object.resumeToken);
                if (object.resumeTimeout != null)
                    if ($Number(object.resumeTimeout) !== 0)
                        message.resumeTimeout = object.resumeTimeout >>> 0;
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
            EventGameStart.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (options.defaults) {
                    object.playerId = "";
                    object.tickInterval = 0;
                    object.resumeToken = "";
                    object.resumeTimeout = 0;
                }
                if (message.playerId != null && $Object.hasOwnProperty.call(message, "playerId"))
                    object.playerId = message.playerId;
                if (message.tickInterval != null && $Object.hasOwnProperty.call(message, "tickInterval"))
                    object.tickInterval = message.tickInterval;
                if (message.resumeToken != null && $Object.hasOwnProperty.call(message, "resumeToken"))
                    object.resumeToken = message.resumeToken;
                if (message.resumeTimeout != null && $Object.hasOwnProperty.call(message, "resumeTimeout"))
                    object.resumeTimeout = message.resumeTimeout;
                return object;
            };

            /**
             * Converts this EventGameStart to JSON.
             * @function toJSON
             * @memberof wire.msg.EventGameStart
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EventGameStart.prototype.toJSON = function() {
                return EventGameStart.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for EventGameStart
             * @function getTypeUrl
             * @memberof wire.msg.EventGameStart
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            EventGameStart.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.EventGameStart";
            };

            return EventGameStart;
        })();

        msg.EventGameOver = (function() {

            /**
             * Properties of an EventGameOver.
             * @typedef {Object} wire.msg.EventGameOver.$Properties
             * @property {string|null} [winnerId] EventGameOver winnerId
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an EventGameOver.
             * @memberof wire.msg
             * @interface IEventGameOver
             * @augments wire.msg.EventGameOver.$Properties
             * @deprecated Use wire.msg.EventGameOver.$Properties instead.
             */

            /**
             * Shape of an EventGameOver.
             * @typedef {wire.msg.EventGameOver.$Properties} wire.msg.EventGameOver.$Shape
             */

            /**
             * Constructs a new EventGameOver.
             * @memberof wire.msg
             * @classdesc Represents an EventGameOver.
             * @constructor
             * @param {wire.msg.EventGameOver.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const EventGameOver = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

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
             * @param {wire.msg.EventGameOver.$Properties=} [properties] Properties to set
             * @returns {wire.msg.EventGameOver} EventGameOver instance
             * @type {{
             *   (properties: wire.msg.EventGameOver.$Shape): wire.msg.EventGameOver & wire.msg.EventGameOver.$Shape;
             *   (properties?: wire.msg.EventGameOver.$Properties): wire.msg.EventGameOver;
             * }}
             */
            EventGameOver.create = function(properties) {
                return new EventGameOver(properties);
            };

            /**
             * Encodes the specified EventGameOver message. Does not implicitly {@link wire.msg.EventGameOver.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.EventGameOver
             * @static
             * @param {wire.msg.EventGameOver.$Properties} message EventGameOver message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameOver.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.winnerId != null && $Object.hasOwnProperty.call(message, "winnerId") && message.winnerId !== "")
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.winnerId);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified EventGameOver message, length delimited. Does not implicitly {@link wire.msg.EventGameOver.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.EventGameOver
             * @static
             * @param {wire.msg.EventGameOver.$Properties} message EventGameOver message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameOver.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an EventGameOver message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.EventGameOver
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.EventGameOver & wire.msg.EventGameOver.$Shape} EventGameOver
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameOver.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.EventGameOver();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if ((value = reader.stringVerify()).length)
                                message.winnerId = value;
                            else
                                delete message.winnerId;
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes an EventGameOver message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.EventGameOver
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.EventGameOver & wire.msg.EventGameOver.$Shape} EventGameOver
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameOver.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies an EventGameOver message.
             * @function verify
             * @memberof wire.msg.EventGameOver
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventGameOver.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.winnerId != null && $Object.hasOwnProperty.call(message, "winnerId"))
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
            EventGameOver.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.EventGameOver)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.EventGameOver: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.EventGameOver();
                if (object.winnerId != null)
                    if (typeof object.winnerId !== "string" || object.winnerId.length)
                        message.winnerId = $String(object.winnerId);
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
            EventGameOver.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (options.defaults)
                    object.winnerId = "";
                if (message.winnerId != null && $Object.hasOwnProperty.call(message, "winnerId"))
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
            EventGameOver.prototype.toJSON = function() {
                return EventGameOver.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for EventGameOver
             * @function getTypeUrl
             * @memberof wire.msg.EventGameOver
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            EventGameOver.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.EventGameOver";
            };

            return EventGameOver;
        })();

        msg.EventGameTick = (function() {

            /**
             * Properties of an EventGameTick.
             * @typedef {Object} wire.msg.EventGameTick.$Properties
             * @property {wire.msg.Game.$Properties|null} [game] EventGameTick game
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an EventGameTick.
             * @memberof wire.msg
             * @interface IEventGameTick
             * @augments wire.msg.EventGameTick.$Properties
             * @deprecated Use wire.msg.EventGameTick.$Properties instead.
             */

            /**
             * Shape of an EventGameTick.
             * @typedef {wire.msg.EventGameTick.$Properties} wire.msg.EventGameTick.$Shape
             */

            /**
             * Constructs a new EventGameTick.
             * @memberof wire.msg
             * @classdesc Represents an EventGameTick.
             * @constructor
             * @param {wire.msg.EventGameTick.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const EventGameTick = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * EventGameTick game.
             * @member {wire.msg.Game.$Properties|null|undefined} game
             * @memberof wire.msg.EventGameTick
             * @instance
             */
            EventGameTick.prototype.game = null;

            /**
             * Creates a new EventGameTick instance using the specified properties.
             * @function create
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {wire.msg.EventGameTick.$Properties=} [properties] Properties to set
             * @returns {wire.msg.EventGameTick} EventGameTick instance
             * @type {{
             *   (properties: wire.msg.EventGameTick.$Shape): wire.msg.EventGameTick & wire.msg.EventGameTick.$Shape;
             *   (properties?: wire.msg.EventGameTick.$Properties): wire.msg.EventGameTick;
             * }}
             */
            EventGameTick.create = function(properties) {
                return new EventGameTick(properties);
            };

            /**
             * Encodes the specified EventGameTick message. Does not implicitly {@link wire.msg.EventGameTick.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {wire.msg.EventGameTick.$Properties} message EventGameTick message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameTick.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.game != null && $Object.hasOwnProperty.call(message, "game"))
                    $root.wire.msg.Game.encode(message.game, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified EventGameTick message, length delimited. Does not implicitly {@link wire.msg.EventGameTick.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {wire.msg.EventGameTick.$Properties} message EventGameTick message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameTick.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an EventGameTick message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.EventGameTick & wire.msg.EventGameTick.$Shape} EventGameTick
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameTick.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.EventGameTick();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.game = $root.wire.msg.Game.decode(reader, reader.size(), $undefined, _depth + 1, message.game);
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes an EventGameTick message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.EventGameTick & wire.msg.EventGameTick.$Shape} EventGameTick
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameTick.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies an EventGameTick message.
             * @function verify
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventGameTick.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.game != null && $Object.hasOwnProperty.call(message, "game")) {
                    let error = $root.wire.msg.Game.verify(message.game, _depth + 1);
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
            EventGameTick.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.EventGameTick)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.EventGameTick: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.EventGameTick();
                if (object.game != null) {
                    if (!$util.isObject(object.game))
                        throw $TypeError(".wire.msg.EventGameTick.game: object expected");
                    message.game = $root.wire.msg.Game.fromObject(object.game, _depth + 1);
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
            EventGameTick.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (options.defaults)
                    object.game = null;
                if (message.game != null && $Object.hasOwnProperty.call(message, "game"))
                    object.game = $root.wire.msg.Game.toObject(message.game, options, _depth + 1);
                return object;
            };

            /**
             * Converts this EventGameTick to JSON.
             * @function toJSON
             * @memberof wire.msg.EventGameTick
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EventGameTick.prototype.toJSON = function() {
                return EventGameTick.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for EventGameTick
             * @function getTypeUrl
             * @memberof wire.msg.EventGameTick
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            EventGameTick.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.EventGameTick";
            };

            return EventGameTick;
        })();

        msg.EventGameSnapshot = (function() {

            /**
             * Properties of an EventGameSnapshot.
             * @typedef {Object} wire.msg.EventGameSnapshot.$Properties
             * @property {number|null} [seq] EventGameSnapshot seq
             * @property {number|null} [gameTime] EventGameSnapshot gameTime
             * @property {wire.msg.Game.$Properties|null} [game] EventGameSnapshot game
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an EventGameSnapshot.
             * @memberof wire.msg
             * @interface IEventGameSnapshot
             * @augments wire.msg.EventGameSnapshot.$Properties
             * @deprecated Use wire.msg.EventGameSnapshot.$Properties instead.
             */

            /**
             * Shape of an EventGameSnapshot.
             * @typedef {wire.msg.EventGameSnapshot.$Properties} wire.msg.EventGameSnapshot.$Shape
             */

            /**
             * Constructs a new EventGameSnapshot.
             * @memberof wire.msg
             * @classdesc Represents an EventGameSnapshot.
             * @constructor
             * @param {wire.msg.EventGameSnapshot.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const EventGameSnapshot = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * EventGameSnapshot seq.
             * @member {number} seq
             * @memberof wire.msg.EventGameSnapshot
             * @instance
             */
            EventGameSnapshot.prototype.seq = 0;

            /**
             * EventGameSnapshot gameTime.
             * @member {number} gameTime
             * @memberof wire.msg.EventGameSnapshot
             * @instance
             */
            EventGameSnapshot.prototype.gameTime = 0;

            /**
             * EventGameSnapshot game.
             * @member {wire.msg.Game.$Properties|null|undefined} game
             * @memberof wire.msg.EventGameSnapshot
             * @instance
             */
            EventGameSnapshot.prototype.game = null;

            /**
             * Creates a new EventGameSnapshot instance using the specified properties.
             * @function create
             * @memberof wire.msg.EventGameSnapshot
             * @static
             * @param {wire.msg.EventGameSnapshot.$Properties=} [properties] Properties to set
             * @returns {wire.msg.EventGameSnapshot} EventGameSnapshot instance
             * @type {{
             *   (properties: wire.msg.EventGameSnapshot.$Shape): wire.msg.EventGameSnapshot & wire.msg.EventGameSnapshot.$Shape;
             *   (properties?: wire.msg.EventGameSnapshot.$Properties): wire.msg.EventGameSnapshot;
             * }}
             */
            EventGameSnapshot.create = function(properties) {
                return new EventGameSnapshot(properties);
            };

            /**
             * Encodes the specified EventGameSnapshot message. Does not implicitly {@link wire.msg.EventGameSnapshot.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.EventGameSnapshot
             * @static
             * @param {wire.msg.EventGameSnapshot.$Properties} message EventGameSnapshot message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameSnapshot.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.seq != null && $Object.hasOwnProperty.call(message, "seq") && message.seq !== 0)
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.seq);
                if (message.gameTime != null && $Object.hasOwnProperty.call(message, "gameTime") && message.gameTime !== 0)
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.gameTime);
                if (message.game != null && $Object.hasOwnProperty.call(message, "game"))
                    $root.wire.msg.Game.encode(message.game, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified EventGameSnapshot message, length delimited. Does not implicitly {@link wire.msg.EventGameSnapshot.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.EventGameSnapshot
             * @static
             * @param {wire.msg.EventGameSnapshot.$Properties} message EventGameSnapshot message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameSnapshot.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an EventGameSnapshot message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.EventGameSnapshot
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.EventGameSnapshot & wire.msg.EventGameSnapshot.$Shape} EventGameSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameSnapshot.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.EventGameSnapshot();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.uint32())
                                message.seq = value;
                            else
                                delete message.seq;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.uint32())
                                message.gameTime = value;
                            else
                                delete message.gameTime;
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.game = $root.wire.msg.Game.decode(reader, reader.size(), $undefined, _depth + 1, message.game);
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes an EventGameSnapshot message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.EventGameSnapshot
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.EventGameSnapshot & wire.msg.EventGameSnapshot.$Shape} EventGameSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameSnapshot.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies an EventGameSnapshot message.
             * @function verify
             * @memberof wire.msg.EventGameSnapshot
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventGameSnapshot.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.seq != null && $Object.hasOwnProperty.call(message, "seq"))
                    if (!$util.isInteger(message.seq))
                        return "seq: integer expected";
                if (message.gameTime != null && $Object.hasOwnProperty.call(message, "gameTime"))
                    if (!$util.isInteger(message.gameTime))
                        return "gameTime: integer expected";
                if (message.game != null && $Object.hasOwnProperty.call(message, "game")) {
                    let error = $root.wire.msg.Game.verify(message.game, _depth + 1);
                    if (error)
                        return "game." + error;
                }
                return null;
            };

            /**
             * Creates an EventGameSnapshot message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.EventGameSnapshot
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.EventGameSnapshot} EventGameSnapshot
             */
            EventGameSnapshot.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.EventGameSnapshot)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.EventGameSnapshot: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.EventGameSnapshot();
                if (object.seq != null)
                    if ($Number(object.seq) !== 0)
                        message.seq = object.seq >>> 0;
                if (object.gameTime != null)
                    if ($Number(object.gameTime) !== 0)
                        message.gameTime = object.gameTime >>> 0;
                if (object.game != null) {
                    if (!$util.isObject(object.game))
                        throw $TypeError(".wire.msg.EventGameSnapshot.game: object expected");
                    message.game = $root.wire.msg.Game.fromObject(object.game, _depth + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from an EventGameSnapshot message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.EventGameSnapshot
             * @static
             * @param {wire.msg.EventGameSnapshot} message EventGameSnapshot
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EventGameSnapshot.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (options.defaults) {
                    object.seq = 0;
                    object.gameTime = 0;
                    object.game = null;
                }
                if (message.seq != null && $Object.hasOwnProperty.call(message, "seq"))
                    object.seq = message.seq;
                if (message.gameTime != null && $Object.hasOwnProperty.call(message, "gameTime"))
                    object.gameTime = message.gameTime;
                if (message.game != null && $Object.hasOwnProperty.call(message, "game"))
                    object.game = $root.wire.msg.Game.toObject(message.game, options, _depth + 1);
                return object;
            };

            /**
             * Converts this EventGameSnapshot to JSON.
             * @function toJSON
             * @memberof wire.msg.EventGameSnapshot
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EventGameSnapshot.prototype.toJSON = function() {
                return EventGameSnapshot.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for EventGameSnapshot
             * @function getTypeUrl
             * @memberof wire.msg.EventGameSnapshot
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            EventGameSnapshot.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.EventGameSnapshot";
            };

            return EventGameSnapshot;
        })();

        msg.EventGameDelta = (function() {

            /**
             * Properties of an EventGameDelta.
             * @typedef {Object} wire.msg.EventGameDelta.$Properties
             * @property {number|null} [seq] EventGameDelta seq
             * @property {number|null} [gameTime] EventGameDelta gameTime
             * @property {Array.<wire.msg.Player.$Properties>|null} [players] EventGameDelta players
             * @property {Array.<wire.msg.IslandUpdate.$Properties>|null} [islands] EventGameDelta islands
             * @property {Array.<wire.msg.Airplane.$Properties>|null} [airplanesAdded] EventGameDelta airplanesAdded
             * @property {Array.<wire.msg.AirplaneUpdate.$Properties>|null} [airplanesUpdated] EventGameDelta airplanesUpdated
             * @property {Array.<string>|null} [airplanesRemoved] EventGameDelta airplanesRemoved
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an EventGameDelta.
             * @memberof wire.msg
             * @interface IEventGameDelta
             * @augments wire.msg.EventGameDelta.$Properties
             * @deprecated Use wire.msg.EventGameDelta.$Properties instead.
             */

            /**
             * Shape of an EventGameDelta.
             * @typedef {wire.msg.EventGameDelta.$Properties} wire.msg.EventGameDelta.$Shape
             */

            /**
             * Constructs a new EventGameDelta.
             * @memberof wire.msg
             * @classdesc Represents an EventGameDelta.
             * @constructor
             * @param {wire.msg.EventGameDelta.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const EventGameDelta = function (properties) {
                this.players = [];
                this.islands = [];
                this.airplanesAdded = [];
                this.airplanesUpdated = [];
                this.airplanesRemoved = [];
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * EventGameDelta seq.
             * @member {number} seq
             * @memberof wire.msg.EventGameDelta
             * @instance
             */
            EventGameDelta.prototype.seq = 0;

            /**
             * EventGameDelta gameTime.
             * @member {number} gameTime
             * @memberof wire.msg.EventGameDelta
             * @instance
             */
            EventGameDelta.prototype.gameTime = 0;

            /**
             * EventGameDelta players.
             * @member {Array.<wire.msg.Player.$Properties>} players
             * @memberof wire.msg.EventGameDelta
             * @instance
             */
            EventGameDelta.prototype.players = $util.emptyArray;

            /**
             * EventGameDelta islands.
             * @member {Array.<wire.msg.IslandUpdate.$Properties>} islands
             * @memberof wire.msg.EventGameDelta
             * @instance
             */
            EventGameDelta.prototype.islands = $util.emptyArray;

            /**
             * EventGameDelta airplanesAdded.
             * @member {Array.<wire.msg.Airplane.$Properties>} airplanesAdded
             * @memberof wire.msg.EventGameDelta
             * @instance
             */
            EventGameDelta.prototype.airplanesAdded = $util.emptyArray;

            /**
             * EventGameDelta airplanesUpdated.
             * @member {Array.<wire.msg.AirplaneUpdate.$Properties>} airplanesUpdated
             * @memberof wire.msg.EventGameDelta
             * @instance
             */
            EventGameDelta.prototype.airplanesUpdated = $util.emptyArray;

            /**
             * EventGameDelta airplanesRemoved.
             * @member {Array.<string>} airplanesRemoved
             * @memberof wire.msg.EventGameDelta
             * @instance
             */
            EventGameDelta.prototype.airplanesRemoved = $util.emptyArray;

            /**
             * Creates a new EventGameDelta instance using the specified properties.
             * @function create
             * @memberof wire.msg.EventGameDelta
             * @static
             * @param {wire.msg.EventGameDelta.$Properties=} [properties] Properties to set
             * @returns {wire.msg.EventGameDelta} EventGameDelta instance
             * @type {{
             *   (properties: wire.msg.EventGameDelta.$Shape): wire.msg.EventGameDelta & wire.msg.EventGameDelta.$Shape;
             *   (properties?: wire.msg.EventGameDelta.$Properties): wire.msg.EventGameDelta;
             * }}
             */
            EventGameDelta.create = function(properties) {
                return new EventGameDelta(properties);
            };

            /**
             * Encodes the specified EventGameDelta message. Does not implicitly {@link wire.msg.EventGameDelta.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.EventGameDelta
             * @static
             * @param {wire.msg.EventGameDelta.$Properties} message EventGameDelta message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameDelta.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.seq != null && $Object.hasOwnProperty.call(message, "seq") && message.seq !== 0)
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.seq);
                if (message.gameTime != null && $Object.hasOwnProperty.call(message, "gameTime") && message.gameTime !== 0)
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.gameTime);
                if (message.players != null && message.players.length)
                    for (let i = 0; i < message.players.length; ++i)
                        $root.wire.msg.Player.encode(message.players[i], writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                if (message.islands != null && message.islands.length)
                    for (let i = 0; i < message.islands.length; ++i)
                        $root.wire.msg.IslandUpdate.encode(message.islands[i], writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                if (message.airplanesAdded != null && message.airplanesAdded.length)
                    for (let i = 0; i < message.airplanesAdded.length; ++i)
                        $root.wire.msg.Airplane.encode(message.airplanesAdded[i], writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                if (message.airplanesUpdated != null && message.airplanesUpdated.length)
                    for (let i = 0; i < message.airplanesUpdated.length; ++i)
                        $root.wire.msg.AirplaneUpdate.encode(message.airplanesUpdated[i], writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
                if (message.airplanesRemoved != null && message.airplanesRemoved.length)
                    for (let i = 0; i < message.airplanesRemoved.length; ++i)
                        writer.uint32(/* id 7, wireType 2 =*/58).string(message.airplanesRemoved[i]);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified EventGameDelta message, length delimited. Does not implicitly {@link wire.msg.EventGameDelta.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.EventGameDelta
             * @static
             * @param {wire.msg.EventGameDelta.$Properties} message EventGameDelta message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EventGameDelta.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an EventGameDelta message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.EventGameDelta
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.EventGameDelta & wire.msg.EventGameDelta.$Shape} EventGameDelta
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameDelta.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.EventGameDelta();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.uint32())
                                message.seq = value;
                            else
                                delete message.seq;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.uint32())
                                message.gameTime = value;
                            else
                                delete message.gameTime;
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            if (!(message.players && message.players.length))
                                message.players = [];
                            message.players.push($root.wire.msg.Player.decode(reader, reader.size(), $undefined, _depth + 1));
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            if (!(message.islands && message.islands.length))
                                message.islands = [];
                            message.islands.push($root.wire.msg.IslandUpdate.decode(reader, reader.size(), $undefined, _depth + 1));
                            continue;
                        }
                    case 5: {
                            if (wireType !== 2)
                                break;
                            if (!(message.airplanesAdded && message.airplanesAdded.length))
                                message.airplanesAdded = [];
                            message.airplanesAdded.push($root.wire.msg.Airplane.decode(reader, reader.size(), $undefined, _depth + 1));
                            continue;
                        }
                    case 6: {
                            if (wireType !== 2)
                                break;
                            if (!(message.airplanesUpdated && message.airplanesUpdated.length))
                                message.airplanesUpdated = [];
                            message.airplanesUpdated.push($root.wire.msg.AirplaneUpdate.decode(reader, reader.size(), $undefined, _depth + 1));
                            continue;
                        }
                    case 7: {
                            if (wireType !== 2)
                                break;
                            if (!(message.airplanesRemoved && message.airplanesRemoved.length))
                                message.airplanesRemoved = [];
                            message.airplanesRemoved.push(reader.stringVerify());
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes an EventGameDelta message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.EventGameDelta
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.EventGameDelta & wire.msg.EventGameDelta.$Shape} EventGameDelta
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EventGameDelta.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies an EventGameDelta message.
             * @function verify
             * @memberof wire.msg.EventGameDelta
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EventGameDelta.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.seq != null && $Object.hasOwnProperty.call(message, "seq"))
                    if (!$util.isInteger(message.seq))
                        return "seq: integer expected";
                if (message.gameTime != null && $Object.hasOwnProperty.call(message, "gameTime"))
                    if (!$util.isInteger(message.gameTime))
                        return "gameTime: integer expected";
                if (message.players != null && $Object.hasOwnProperty.call(message, "players")) {
                    if (!$Array.isArray(message.players))
                        return "players: array expected";
                    for (let i = 0; i < message.players.length; ++i) {
                        let error = $root.wire.msg.Player.verify(message.players[i], _depth + 1);
                        if (error)
                            return "players." + error;
                    }
                }
                if (message.islands != null && $Object.hasOwnProperty.call(message, "islands")) {
                    if (!$Array.isArray(message.islands))
                        return "islands: array expected";
                    for (let i = 0; i < message.islands.length; ++i) {
                        let error = $root.wire.msg.IslandUpdate.verify(message.islands[i], _depth + 1);
                        if (error)
                            return "islands." + error;
                    }
                }
                if (message.airplanesAdded != null && $Object.hasOwnProperty.call(message, "airplanesAdded")) {
                    if (!$Array.isArray(message.airplanesAdded))
                        return "airplanesAdded: array expected";
                    for (let i = 0; i < message.airplanesAdded.length; ++i) {
                        let error = $root.wire.msg.Airplane.verify(message.airplanesAdded[i], _depth + 1);
                        if (error)
                            return "airplanesAdded." + error;
                    }
                }
                if (message.airplanesUpdated != null && $Object.hasOwnProperty.call(message, "airplanesUpdated")) {
                    if (!$Array.isArray(message.airplanesUpdated))
                        return "airplanesUpdated: array expected";
                    for (let i = 0; i < message.airplanesUpdated.length; ++i) {
                        let error = $root.wire.msg.AirplaneUpdate.verify(message.airplanesUpdated[i], _depth + 1);
                        if (error)
                            return "airplanesUpdated." + error;
                    }
                }
                if (message.airplanesRemoved != null && $Object.hasOwnProperty.call(message, "airplanesRemoved")) {
                    if (!$Array.isArray(message.airplanesRemoved))
                        return "airplanesRemoved: array expected";
                    for (let i = 0; i < message.airplanesRemoved.length; ++i)
                        if (!$util.isString(message.airplanesRemoved[i]))
                            return "airplanesRemoved: string[] expected";
                }
                return null;
            };

            /**
             * Creates an EventGameDelta message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.EventGameDelta
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.EventGameDelta} EventGameDelta
             */
            EventGameDelta.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.EventGameDelta)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.EventGameDelta: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.EventGameDelta();
                if (object.seq != null)
                    if ($Number(object.seq) !== 0)
                        message.seq = object.seq >>> 0;
                if (object.gameTime != null)
                    if ($Number(object.gameTime) !== 0)
                        message.gameTime = object.gameTime >>> 0;
                if (object.players) {
                    if (!$Array.isArray(object.players))
                        throw $TypeError(".wire.msg.EventGameDelta.players: array expected");
                    message.players = $Array(object.players.length);
                    for (let i = 0; i < object.players.length; ++i) {
                        if (!$util.isObject(object.players[i]))
                            throw $TypeError(".wire.msg.EventGameDelta.players: object expected");
                        message.players[i] = $root.wire.msg.Player.fromObject(object.players[i], _depth + 1);
                    }
                }
                if (object.islands) {
                    if (!$Array.isArray(object.islands))
                        throw $TypeError(".wire.msg.EventGameDelta.islands: array expected");
                    message.islands = $Array(object.islands.length);
                    for (let i = 0; i < object.islands.length; ++i) {
                        if (!$util.isObject(object.islands[i]))
                            throw $TypeError(".wire.msg.EventGameDelta.islands: object expected");
                        message.islands[i] = $root.wire.msg.IslandUpdate.fromObject(object.islands[i], _depth + 1);
                    }
                }
                if (object.airplanesAdded) {
                    if (!$Array.isArray(object.airplanesAdded))
                        throw $TypeError(".wire.msg.EventGameDelta.airplanesAdded: array expected");
                    message.airplanesAdded = $Array(object.airplanesAdded.length);
                    for (let i = 0; i < object.airplanesAdded.length; ++i) {
                        if (!$util.isObject(object.airplanesAdded[i]))
                            throw $TypeError(".wire.msg.EventGameDelta.airplanesAdded: object expected");
                        message.airplanesAdded[i] = $root.wire.msg.Airplane.fromObject(object.airplanesAdded[i], _depth + 1);
                    }
                }
                if (object.airplanesUpdated) {
                    if (!$Array.isArray(object.airplanesUpdated))
                        throw $TypeError(".wire.msg.EventGameDelta.airplanesUpdated: array expected");
                    message.airplanesUpdated = $Array(object.airplanesUpdated.length);
                    for (let i = 0; i < object.airplanesUpdated.length; ++i) {
                        if (!$util.isObject(object.airplanesUpdated[i]))
                            throw $TypeError(".wire.msg.EventGameDelta.airplanesUpdated: object expected");
                        message.airplanesUpdated[i] = $root.wire.msg.AirplaneUpdate.fromObject(object.airplanesUpdated[i], _depth + 1);
                    }
                }
                if (object.airplanesRemoved) {
                    if (!$Array.isArray(object.airplanesRemoved))
                        throw $TypeError(".wire.msg.EventGameDelta.airplanesRemoved: array expected");
                    message.airplanesRemoved = $Array(object.airplanesRemoved.length);
                    for (let i = 0; i < object.airplanesRemoved.length; ++i)
                        message.airplanesRemoved[i] = $String(object.airplanesRemoved[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from an EventGameDelta message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.EventGameDelta
             * @static
             * @param {wire.msg.EventGameDelta} message EventGameDelta
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EventGameDelta.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (options.arrays || options.defaults) {
                    object.players = [];
                    object.islands = [];
                    object.airplanesAdded = [];
                    object.airplanesUpdated = [];
                    object.airplanesRemoved = [];
                }
                if (options.defaults) {
                    object.seq = 0;
                    object.gameTime = 0;
                }
                if (message.seq != null && $Object.hasOwnProperty.call(message, "seq"))
                    object.seq = message.seq;
                if (message.gameTime != null && $Object.hasOwnProperty.call(message, "gameTime"))
                    object.gameTime = message.gameTime;
                if (message.players && message.players.length) {
                    object.players = $Array(message.players.length);
                    for (let j = 0; j < message.players.length; ++j)
                        object.players[j] = $root.wire.msg.Player.toObject(message.players[j], options, _depth + 1);
                }
                if (message.islands && message.islands.length) {
                    object.islands = $Array(message.islands.length);
                    for (let j = 0; j < message.islands.length; ++j)
                        object.islands[j] = $root.wire.msg.IslandUpdate.toObject(message.islands[j], options, _depth + 1);
                }
                if (message.airplanesAdded && message.airplanesAdded.length) {
                    object.airplanesAdded = $Array(message.airplanesAdded.length);
                    for (let j = 0; j < message.airplanesAdded.length; ++j)
                        object.airplanesAdded[j] = $root.wire.msg.Airplane.toObject(message.airplanesAdded[j], options, _depth + 1);
                }
                if (message.airplanesUpdated && message.airplanesUpdated.length) {
                    object.airplanesUpdated = $Array(message.airplanesUpdated.length);
                    for (let j = 0; j < message.airplanesUpdated.length; ++j)
                        object.airplanesUpdated[j] = $root.wire.msg.AirplaneUpdate.toObject(message.airplanesUpdated[j], options, _depth + 1);
                }
                if (message.airplanesRemoved && message.airplanesRemoved.length) {
                    object.airplanesRemoved = $Array(message.airplanesRemoved.length);
                    for (let j = 0; j < message.airplanesRemoved.length; ++j)
                        object.airplanesRemoved[j] = message.airplanesRemoved[j];
                }
                return object;
            };

            /**
             * Converts this EventGameDelta to JSON.
             * @function toJSON
             * @memberof wire.msg.EventGameDelta
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EventGameDelta.prototype.toJSON = function() {
                return EventGameDelta.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for EventGameDelta
             * @function getTypeUrl
             * @memberof wire.msg.EventGameDelta
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            EventGameDelta.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.EventGameDelta";
            };

            return EventGameDelta;
        })();

        msg.IslandUpdate = (function() {

            /**
             * Properties of an IslandUpdate.
             * @typedef {Object} wire.msg.IslandUpdate.$Properties
             * @property {string|null} [id] IslandUpdate id
             * @property {wire.msg.Army.$Properties|null} [army] IslandUpdate army
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an IslandUpdate.
             * @memberof wire.msg
             * @interface IIslandUpdate
             * @augments wire.msg.IslandUpdate.$Properties
             * @deprecated Use wire.msg.IslandUpdate.$Properties instead.
             */

            /**
             * Shape of an IslandUpdate.
             * @typedef {wire.msg.IslandUpdate.$Properties} wire.msg.IslandUpdate.$Shape
             */

            /**
             * Constructs a new IslandUpdate.
             * @memberof wire.msg
             * @classdesc Represents an IslandUpdate.
             * @constructor
             * @param {wire.msg.IslandUpdate.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const IslandUpdate = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * IslandUpdate id.
             * @member {string} id
             * @memberof wire.msg.IslandUpdate
             * @instance
             */
            IslandUpdate.prototype.id = "";

            /**
             * IslandUpdate army.
             * @member {wire.msg.Army.$Properties|null|undefined} army
             * @memberof wire.msg.IslandUpdate
             * @instance
             */
            IslandUpdate.prototype.army = null;

            /**
             * Creates a new IslandUpdate instance using the specified properties.
             * @function create
             * @memberof wire.msg.IslandUpdate
             * @static
             * @param {wire.msg.IslandUpdate.$Properties=} [properties] Properties to set
             * @returns {wire.msg.IslandUpdate} IslandUpdate instance
             * @type {{
             *   (properties: wire.msg.IslandUpdate.$Shape): wire.msg.IslandUpdate & wire.msg.IslandUpdate.$Shape;
             *   (properties?: wire.msg.IslandUpdate.$Properties): wire.msg.IslandUpdate;
             * }}
             */
            IslandUpdate.create = function(properties) {
                return new IslandUpdate(properties);
            };

            /**
             * Encodes the specified IslandUpdate message. Does not implicitly {@link wire.msg.IslandUpdate.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.IslandUpdate
             * @static
             * @param {wire.msg.IslandUpdate.$Properties} message IslandUpdate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            IslandUpdate.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.id != null && $Object.hasOwnProperty.call(message, "id") && message.id !== "")
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.army != null && $Object.hasOwnProperty.call(message, "army"))
                    $root.wire.msg.Army.encode(message.army, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified IslandUpdate message, length delimited. Does not implicitly {@link wire.msg.IslandUpdate.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.IslandUpdate
             * @static
             * @param {wire.msg.IslandUpdate.$Properties} message IslandUpdate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            IslandUpdate.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an IslandUpdate message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.IslandUpdate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.IslandUpdate & wire.msg.IslandUpdate.$Shape} IslandUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            IslandUpdate.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.IslandUpdate();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if ((value = reader.stringVerify()).length)
                                message.id = value;
                            else
                                delete message.id;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.army = $root.wire.msg.Army.decode(reader, reader.size(), $undefined, _depth + 1, message.army);
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes an IslandUpdate message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.IslandUpdate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.IslandUpdate & wire.msg.IslandUpdate.$Shape} IslandUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            IslandUpdate.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies an IslandUpdate message.
             * @function verify
             * @memberof wire.msg.IslandUpdate
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            IslandUpdate.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.army != null && $Object.hasOwnProperty.call(message, "army")) {
                    let error = $root.wire.msg.Army.verify(message.army, _depth + 1);
                    if (error)
                        return "army." + error;
                }
                return null;
            };

            /**
             * Creates an IslandUpdate message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.IslandUpdate
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.IslandUpdate} IslandUpdate
             */
            IslandUpdate.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.IslandUpdate)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.IslandUpdate: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.IslandUpdate();
                if (object.id != null)
                    if (typeof object.id !== "string" || object.id.length)
                        message.id = $String(object.id);
                if (object.army != null) {
                    if (!$util.isObject(object.army))
                        throw $TypeError(".wire.msg.IslandUpdate.army: object expected");
                    message.army = $root.wire.msg.Army.fromObject(object.army, _depth + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from an IslandUpdate message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.IslandUpdate
             * @static
             * @param {wire.msg.IslandUpdate} message IslandUpdate
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            IslandUpdate.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (options.defaults) {
                    object.id = "";
                    object.army = null;
                }
                if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                    object.id = message.id;
                if (message.army != null && $Object.hasOwnProperty.call(message, "army"))
                    object.army = $root.wire.msg.Army.toObject(message.army, options, _depth + 1);
                return object;
            };

            /**
             * Converts this IslandUpdate to JSON.
             * @function toJSON
             * @memberof wire.msg.IslandUpdate
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            IslandUpdate.prototype.toJSON = function() {
                return IslandUpdate.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for IslandUpdate
             * @function getTypeUrl
             * @memberof wire.msg.IslandUpdate
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            IslandUpdate.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.IslandUpdate";
            };

            return IslandUpdate;
        })();

        msg.AirplaneUpdate = (function() {

            /**
             * Properties of an AirplaneUpdate.
             * @typedef {Object} wire.msg.AirplaneUpdate.$Properties
             * @property {string|null} [id] AirplaneUpdate id
             * @property {wire.msg.Army.$Properties|null} [army] AirplaneUpdate army
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an AirplaneUpdate.
             * @memberof wire.msg
             * @interface IAirplaneUpdate
             * @augments wire.msg.AirplaneUpdate.$Properties
             * @deprecated Use wire.msg.AirplaneUpdate.$Properties instead.
             */

            /**
             * Shape of an AirplaneUpdate.
             * @typedef {wire.msg.AirplaneUpdate.$Properties} wire.msg.AirplaneUpdate.$Shape
             */

            /**
             * Constructs a new AirplaneUpdate.
             * @memberof wire.msg
             * @classdesc Represents an AirplaneUpdate.
             * @constructor
             * @param {wire.msg.AirplaneUpdate.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const AirplaneUpdate = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * AirplaneUpdate id.
             * @member {string} id
             * @memberof wire.msg.AirplaneUpdate
             * @instance
             */
            AirplaneUpdate.prototype.id = "";

            /**
             * AirplaneUpdate army.
             * @member {wire.msg.Army.$Properties|null|undefined} army
             * @memberof wire.msg.AirplaneUpdate
             * @instance
             */
            AirplaneUpdate.prototype.army = null;

            /**
             * Creates a new AirplaneUpdate instance using the specified properties.
             * @function create
             * @memberof wire.msg.AirplaneUpdate
             * @static
             * @param {wire.msg.AirplaneUpdate.$Properties=} [properties] Properties to set
             * @returns {wire.msg.AirplaneUpdate} AirplaneUpdate instance
             * @type {{
             *   (properties: wire.msg.AirplaneUpdate.$Shape): wire.msg.AirplaneUpdate & wire.msg.AirplaneUpdate.$Shape;
             *   (properties?: wire.msg.AirplaneUpdate.$Properties): wire.msg.AirplaneUpdate;
             * }}
             */
            AirplaneUpdate.create = function(properties) {
                return new AirplaneUpdate(properties);
            };

            /**
             * Encodes the specified AirplaneUpdate message. Does not implicitly {@link wire.msg.AirplaneUpdate.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.AirplaneUpdate
             * @static
             * @param {wire.msg.AirplaneUpdate.$Properties} message AirplaneUpdate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AirplaneUpdate.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.id != null && $Object.hasOwnProperty.call(message, "id") && message.id !== "")
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.army != null && $Object.hasOwnProperty.call(message, "army"))
                    $root.wire.msg.Army.encode(message.army, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified AirplaneUpdate message, length delimited. Does not implicitly {@link wire.msg.AirplaneUpdate.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.AirplaneUpdate
             * @static
             * @param {wire.msg.AirplaneUpdate.$Properties} message AirplaneUpdate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AirplaneUpdate.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an AirplaneUpdate message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.AirplaneUpdate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.AirplaneUpdate & wire.msg.AirplaneUpdate.$Shape} AirplaneUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AirplaneUpdate.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.AirplaneUpdate();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if ((value = reader.stringVerify()).length)
                                message.id = value;
                            else
                                delete message.id;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.army = $root.wire.msg.Army.decode(reader, reader.size(), $undefined, _depth + 1, message.army);
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes an AirplaneUpdate message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.AirplaneUpdate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.AirplaneUpdate & wire.msg.AirplaneUpdate.$Shape} AirplaneUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AirplaneUpdate.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies an AirplaneUpdate message.
             * @function verify
             * @memberof wire.msg.AirplaneUpdate
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AirplaneUpdate.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.army != null && $Object.hasOwnProperty.call(message, "army")) {
                    let error = $root.wire.msg.Army.verify(message.army, _depth + 1);
                    if (error)
                        return "army." + error;
                }
                return null;
            };

            /**
             * Creates an AirplaneUpdate message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof wire.msg.AirplaneUpdate
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.msg.AirplaneUpdate} AirplaneUpdate
             */
            AirplaneUpdate.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.AirplaneUpdate)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.AirplaneUpdate: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.AirplaneUpdate();
                if (object.id != null)
                    if (typeof object.id !== "string" || object.id.length)
                        message.id = $String(object.id);
                if (object.army != null) {
                    if (!$util.isObject(object.army))
                        throw $TypeError(".wire.msg.AirplaneUpdate.army: object expected");
                    message.army = $root.wire.msg.Army.fromObject(object.army, _depth + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from an AirplaneUpdate message. Also converts values to other types if specified.
             * @function toObject
             * @memberof wire.msg.AirplaneUpdate
             * @static
             * @param {wire.msg.AirplaneUpdate} message AirplaneUpdate
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AirplaneUpdate.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (options.defaults) {
                    object.id = "";
                    object.army = null;
                }
                if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                    object.id = message.id;
                if (message.army != null && $Object.hasOwnProperty.call(message, "army"))
                    object.army = $root.wire.msg.Army.toObject(message.army, options, _depth + 1);
                return object;
            };

            /**
             * Converts this AirplaneUpdate to JSON.
             * @function toJSON
             * @memberof wire.msg.AirplaneUpdate
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AirplaneUpdate.prototype.toJSON = function() {
                return AirplaneUpdate.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for AirplaneUpdate
             * @function getTypeUrl
             * @memberof wire.msg.AirplaneUpdate
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            AirplaneUpdate.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.AirplaneUpdate";
            };

            return AirplaneUpdate;
        })();

        msg.ActionEnvelope = (function() {

            /**
             * Properties of an ActionEnvelope.
             * @typedef {Object} wire.msg.ActionEnvelope.$Properties
             * @property {wire.msg.ActionGameLeave.$Properties|null} [actionGameLeave] ActionEnvelope actionGameLeave
             * @property {wire.msg.ActionGameLaunch.$Properties|null} [actionGameLaunch] ActionEnvelope actionGameLaunch
             * @property {"actionGameLeave"|"actionGameLaunch"} [action] ActionEnvelope action
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an ActionEnvelope.
             * @memberof wire.msg
             * @interface IActionEnvelope
             * @augments wire.msg.ActionEnvelope.$Properties
             * @deprecated Use wire.msg.ActionEnvelope.$Properties instead.
             */

            /**
             * Narrowed shape of an ActionEnvelope.
             * @typedef {{
             *   actionGameLeave?: wire.msg.ActionGameLeave.$Shape|null;
             *   actionGameLaunch?: wire.msg.ActionGameLaunch.$Shape|null;
             *   $unknowns?: Array.<Uint8Array>;
             * } & (
             *   ({ action?: undefined; actionGameLeave?: null; actionGameLaunch?: null }|{ action?: "actionGameLeave"; actionGameLeave: wire.msg.ActionGameLeave.$Shape; actionGameLaunch?: null }|{ action?: "actionGameLaunch"; actionGameLeave?: null; actionGameLaunch: wire.msg.ActionGameLaunch.$Shape })
             * )} wire.msg.ActionEnvelope.$Shape
             */

            /**
             * Constructs a new ActionEnvelope.
             * @memberof wire.msg
             * @classdesc Represents an ActionEnvelope.
             * @constructor
             * @param {wire.msg.ActionEnvelope.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const ActionEnvelope = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * ActionEnvelope actionGameLeave.
             * @member {wire.msg.ActionGameLeave.$Properties|null|undefined} actionGameLeave
             * @memberof wire.msg.ActionEnvelope
             * @instance
             */
            ActionEnvelope.prototype.actionGameLeave = null;

            /**
             * ActionEnvelope actionGameLaunch.
             * @member {wire.msg.ActionGameLaunch.$Properties|null|undefined} actionGameLaunch
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
            $Object.defineProperty(ActionEnvelope.prototype, "action", {
                get: $util.oneOfGetter($oneOfFields = ["actionGameLeave", "actionGameLaunch"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ActionEnvelope instance using the specified properties.
             * @function create
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {wire.msg.ActionEnvelope.$Properties=} [properties] Properties to set
             * @returns {wire.msg.ActionEnvelope} ActionEnvelope instance
             * @type {{
             *   (properties: wire.msg.ActionEnvelope.$Shape): wire.msg.ActionEnvelope & wire.msg.ActionEnvelope.$Shape;
             *   (properties?: wire.msg.ActionEnvelope.$Properties): wire.msg.ActionEnvelope;
             * }}
             */
            ActionEnvelope.create = function(properties) {
                return new ActionEnvelope(properties);
            };

            /**
             * Encodes the specified ActionEnvelope message. Does not implicitly {@link wire.msg.ActionEnvelope.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {wire.msg.ActionEnvelope.$Properties} message ActionEnvelope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ActionEnvelope.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.actionGameLeave != null && $Object.hasOwnProperty.call(message, "actionGameLeave"))
                    $root.wire.msg.ActionGameLeave.encode(message.actionGameLeave, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                if (message.actionGameLaunch != null && $Object.hasOwnProperty.call(message, "actionGameLaunch"))
                    $root.wire.msg.ActionGameLaunch.encode(message.actionGameLaunch, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified ActionEnvelope message, length delimited. Does not implicitly {@link wire.msg.ActionEnvelope.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {wire.msg.ActionEnvelope.$Properties} message ActionEnvelope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ActionEnvelope.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an ActionEnvelope message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.ActionEnvelope & wire.msg.ActionEnvelope.$Shape} ActionEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ActionEnvelope.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.ActionEnvelope();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.actionGameLeave = $root.wire.msg.ActionGameLeave.decode(reader, reader.size(), $undefined, _depth + 1, message.actionGameLeave);
                            message.action = "actionGameLeave";
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.actionGameLaunch = $root.wire.msg.ActionGameLaunch.decode(reader, reader.size(), $undefined, _depth + 1, message.actionGameLaunch);
                            message.action = "actionGameLaunch";
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes an ActionEnvelope message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.ActionEnvelope & wire.msg.ActionEnvelope.$Shape} ActionEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ActionEnvelope.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies an ActionEnvelope message.
             * @function verify
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ActionEnvelope.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                let properties = {};
                if (message.actionGameLeave != null && $Object.hasOwnProperty.call(message, "actionGameLeave")) {
                    properties.action = 1;
                    {
                        let error = $root.wire.msg.ActionGameLeave.verify(message.actionGameLeave, _depth + 1);
                        if (error)
                            return "actionGameLeave." + error;
                    }
                }
                if (message.actionGameLaunch != null && $Object.hasOwnProperty.call(message, "actionGameLaunch")) {
                    if (properties.action === 1)
                        return "action: multiple values";
                    properties.action = 1;
                    {
                        let error = $root.wire.msg.ActionGameLaunch.verify(message.actionGameLaunch, _depth + 1);
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
            ActionEnvelope.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.ActionEnvelope)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.ActionEnvelope: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.ActionEnvelope();
                if (object.actionGameLeave != null) {
                    if (!$util.isObject(object.actionGameLeave))
                        throw $TypeError(".wire.msg.ActionEnvelope.actionGameLeave: object expected");
                    message.actionGameLeave = $root.wire.msg.ActionGameLeave.fromObject(object.actionGameLeave, _depth + 1);
                }
                if (object.actionGameLaunch != null) {
                    if (!$util.isObject(object.actionGameLaunch))
                        throw $TypeError(".wire.msg.ActionEnvelope.actionGameLaunch: object expected");
                    message.actionGameLaunch = $root.wire.msg.ActionGameLaunch.fromObject(object.actionGameLaunch, _depth + 1);
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
            ActionEnvelope.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (message.actionGameLeave != null && $Object.hasOwnProperty.call(message, "actionGameLeave")) {
                    object.actionGameLeave = $root.wire.msg.ActionGameLeave.toObject(message.actionGameLeave, options, _depth + 1);
                    if (options.oneofs)
                        object.action = "actionGameLeave";
                }
                if (message.actionGameLaunch != null && $Object.hasOwnProperty.call(message, "actionGameLaunch")) {
                    object.actionGameLaunch = $root.wire.msg.ActionGameLaunch.toObject(message.actionGameLaunch, options, _depth + 1);
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
            ActionEnvelope.prototype.toJSON = function() {
                return ActionEnvelope.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for ActionEnvelope
             * @function getTypeUrl
             * @memberof wire.msg.ActionEnvelope
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            ActionEnvelope.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.ActionEnvelope";
            };

            return ActionEnvelope;
        })();

        msg.ActionGameLeave = (function() {

            /**
             * Properties of an ActionGameLeave.
             * @typedef {Object} wire.msg.ActionGameLeave.$Properties
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an ActionGameLeave.
             * @memberof wire.msg
             * @interface IActionGameLeave
             * @augments wire.msg.ActionGameLeave.$Properties
             * @deprecated Use wire.msg.ActionGameLeave.$Properties instead.
             */

            /**
             * Shape of an ActionGameLeave.
             * @typedef {wire.msg.ActionGameLeave.$Properties} wire.msg.ActionGameLeave.$Shape
             */

            /**
             * Constructs a new ActionGameLeave.
             * @memberof wire.msg
             * @classdesc Represents an ActionGameLeave.
             * @constructor
             * @param {wire.msg.ActionGameLeave.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const ActionGameLeave = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Creates a new ActionGameLeave instance using the specified properties.
             * @function create
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {wire.msg.ActionGameLeave.$Properties=} [properties] Properties to set
             * @returns {wire.msg.ActionGameLeave} ActionGameLeave instance
             * @type {{
             *   (properties: wire.msg.ActionGameLeave.$Shape): wire.msg.ActionGameLeave & wire.msg.ActionGameLeave.$Shape;
             *   (properties?: wire.msg.ActionGameLeave.$Properties): wire.msg.ActionGameLeave;
             * }}
             */
            ActionGameLeave.create = function(properties) {
                return new ActionGameLeave(properties);
            };

            /**
             * Encodes the specified ActionGameLeave message. Does not implicitly {@link wire.msg.ActionGameLeave.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {wire.msg.ActionGameLeave.$Properties} message ActionGameLeave message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ActionGameLeave.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified ActionGameLeave message, length delimited. Does not implicitly {@link wire.msg.ActionGameLeave.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {wire.msg.ActionGameLeave.$Properties} message ActionGameLeave message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ActionGameLeave.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an ActionGameLeave message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.ActionGameLeave & wire.msg.ActionGameLeave.$Shape} ActionGameLeave
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ActionGameLeave.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.ActionGameLeave();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    reader.skipType(tag & 7, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes an ActionGameLeave message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.ActionGameLeave & wire.msg.ActionGameLeave.$Shape} ActionGameLeave
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ActionGameLeave.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies an ActionGameLeave message.
             * @function verify
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ActionGameLeave.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
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
            ActionGameLeave.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.ActionGameLeave)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.ActionGameLeave: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
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
            ActionGameLeave.toObject = function () {
                return {};
            };

            /**
             * Converts this ActionGameLeave to JSON.
             * @function toJSON
             * @memberof wire.msg.ActionGameLeave
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ActionGameLeave.prototype.toJSON = function() {
                return ActionGameLeave.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for ActionGameLeave
             * @function getTypeUrl
             * @memberof wire.msg.ActionGameLeave
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            ActionGameLeave.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.ActionGameLeave";
            };

            return ActionGameLeave;
        })();

        msg.ActionGameLaunch = (function() {

            /**
             * Properties of an ActionGameLaunch.
             * @typedef {Object} wire.msg.ActionGameLaunch.$Properties
             * @property {string|null} [fromId] ActionGameLaunch fromId
             * @property {string|null} [toId] ActionGameLaunch toId
             * @property {number|null} [seq] ActionGameLaunch seq
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an ActionGameLaunch.
             * @memberof wire.msg
             * @interface IActionGameLaunch
             * @augments wire.msg.ActionGameLaunch.$Properties
             * @deprecated Use wire.msg.ActionGameLaunch.$Properties instead.
             */

            /**
             * Shape of an ActionGameLaunch.
             * @typedef {wire.msg.ActionGameLaunch.$Properties} wire.msg.ActionGameLaunch.$Shape
             */

            /**
             * Constructs a new ActionGameLaunch.
             * @memberof wire.msg
             * @classdesc Represents an ActionGameLaunch.
             * @constructor
             * @param {wire.msg.ActionGameLaunch.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const ActionGameLaunch = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

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
             * ActionGameLaunch seq.
             * @member {number} seq
             * @memberof wire.msg.ActionGameLaunch
             * @instance
             */
            ActionGameLaunch.prototype.seq = 0;

            /**
             * Creates a new ActionGameLaunch instance using the specified properties.
             * @function create
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {wire.msg.ActionGameLaunch.$Properties=} [properties] Properties to set
             * @returns {wire.msg.ActionGameLaunch} ActionGameLaunch instance
             * @type {{
             *   (properties: wire.msg.ActionGameLaunch.$Shape): wire.msg.ActionGameLaunch & wire.msg.ActionGameLaunch.$Shape;
             *   (properties?: wire.msg.ActionGameLaunch.$Properties): wire.msg.ActionGameLaunch;
             * }}
             */
            ActionGameLaunch.create = function(properties) {
                return new ActionGameLaunch(properties);
            };

            /**
             * Encodes the specified ActionGameLaunch message. Does not implicitly {@link wire.msg.ActionGameLaunch.verify|verify} messages.
             * @function encode
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {wire.msg.ActionGameLaunch.$Properties} message ActionGameLaunch message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ActionGameLaunch.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.fromId != null && $Object.hasOwnProperty.call(message, "fromId") && message.fromId !== "")
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.fromId);
                if (message.toId != null && $Object.hasOwnProperty.call(message, "toId") && message.toId !== "")
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.toId);
                if (message.seq != null && $Object.hasOwnProperty.call(message, "seq") && message.seq !== 0)
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.seq);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified ActionGameLaunch message, length delimited. Does not implicitly {@link wire.msg.ActionGameLaunch.verify|verify} messages.
             * @function encodeDelimited
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {wire.msg.ActionGameLaunch.$Properties} message ActionGameLaunch message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ActionGameLaunch.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an ActionGameLaunch message from the specified reader or buffer.
             * @function decode
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {wire.msg.ActionGameLaunch & wire.msg.ActionGameLaunch.$Shape} ActionGameLaunch
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ActionGameLaunch.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.wire.msg.ActionGameLaunch();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if ((value = reader.stringVerify()).length)
                                message.fromId = value;
                            else
                                delete message.fromId;
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            if ((value = reader.stringVerify()).length)
                                message.toId = value;
                            else
                                delete message.toId;
                            continue;
                        }
                    case 3: {
                            if (wireType !== 0)
                                break;
                            if (value = reader.uint32())
                                message.seq = value;
                            else
                                delete message.seq;
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes an ActionGameLaunch message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {wire.msg.ActionGameLaunch & wire.msg.ActionGameLaunch.$Shape} ActionGameLaunch
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ActionGameLaunch.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.size());
            };

            /**
             * Verifies an ActionGameLaunch message.
             * @function verify
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ActionGameLaunch.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.fromId != null && $Object.hasOwnProperty.call(message, "fromId"))
                    if (!$util.isString(message.fromId))
                        return "fromId: string expected";
                if (message.toId != null && $Object.hasOwnProperty.call(message, "toId"))
                    if (!$util.isString(message.toId))
                        return "toId: string expected";
                if (message.seq != null && $Object.hasOwnProperty.call(message, "seq"))
                    if (!$util.isInteger(message.seq))
                        return "seq: integer expected";
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
            ActionGameLaunch.fromObject = function (object, _depth) {
                if (object instanceof $root.wire.msg.ActionGameLaunch)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".wire.msg.ActionGameLaunch: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let message = new $root.wire.msg.ActionGameLaunch();
                if (object.fromId != null)
                    if (typeof object.fromId !== "string" || object.fromId.length)
                        message.fromId = $String(object.fromId);
                if (object.toId != null)
                    if (typeof object.toId !== "string" || object.toId.length)
                        message.toId = $String(object.toId);
                if (object.seq != null)
                    if ($Number(object.seq) !== 0)
                        message.seq = object.seq >>> 0;
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
            ActionGameLaunch.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                let object = {};
                if (options.defaults) {
                    object.fromId = "";
                    object.toId = "";
                    object.seq = 0;
                }
                if (message.fromId != null && $Object.hasOwnProperty.call(message, "fromId"))
                    object.fromId = message.fromId;
                if (message.toId != null && $Object.hasOwnProperty.call(message, "toId"))
                    object.toId = message.toId;
                if (message.seq != null && $Object.hasOwnProperty.call(message, "seq"))
                    object.seq = message.seq;
                return object;
            };

            /**
             * Converts this ActionGameLaunch to JSON.
             * @function toJSON
             * @memberof wire.msg.ActionGameLaunch
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ActionGameLaunch.prototype.toJSON = function() {
                return ActionGameLaunch.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for ActionGameLaunch
             * @function getTypeUrl
             * @memberof wire.msg.ActionGameLaunch
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            ActionGameLaunch.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/wire.msg.ActionGameLaunch";
            };

            return ActionGameLaunch;
        })();

        return msg;
    })();

    return wire;
})();

export {
  $root as default
};
