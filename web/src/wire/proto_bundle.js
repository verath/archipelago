/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
import * as $protobuf from "protobufjs";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const archipelago = $root.archipelago = (() => {

    /**
     * Namespace archipelago.
     * @exports archipelago
     * @namespace
     */
    const archipelago = {};

    archipelago.proto = (function() {

        /**
         * Namespace proto.
         * @exports archipelago.proto
         * @namespace
         */
        const proto = {};

        proto.wire = (function() {

            /**
             * Namespace wire.
             * @exports archipelago.proto.wire
             * @namespace
             */
            const wire = {};

            wire.ActionEnvelope = (function() {

                /**
                 * Properties of an ActionEnvelope.
                 * @typedef archipelago.proto.wire.ActionEnvelope$Properties
                 * @type {Object}
                 */

                /**
                 * Constructs a new ActionEnvelope.
                 * @exports archipelago.proto.wire.ActionEnvelope
                 * @constructor
                 * @param {archipelago.proto.wire.ActionEnvelope$Properties=} [properties] Properties to set
                 */
                function ActionEnvelope(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Creates a new ActionEnvelope instance using the specified properties.
                 * @param {archipelago.proto.wire.ActionEnvelope$Properties=} [properties] Properties to set
                 * @returns {archipelago.proto.wire.ActionEnvelope} ActionEnvelope instance
                 */
                ActionEnvelope.create = function create(properties) {
                    return new ActionEnvelope(properties);
                };

                /**
                 * Encodes the specified ActionEnvelope message. Does not implicitly {@link archipelago.proto.wire.ActionEnvelope.verify|verify} messages.
                 * @param {archipelago.proto.wire.ActionEnvelope$Properties} message ActionEnvelope message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ActionEnvelope.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    return writer;
                };

                /**
                 * Encodes the specified ActionEnvelope message, length delimited. Does not implicitly {@link archipelago.proto.wire.ActionEnvelope.verify|verify} messages.
                 * @param {archipelago.proto.wire.ActionEnvelope$Properties} message ActionEnvelope message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ActionEnvelope.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an ActionEnvelope message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {archipelago.proto.wire.ActionEnvelope} ActionEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ActionEnvelope.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.archipelago.proto.wire.ActionEnvelope();
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
                 * Decodes an ActionEnvelope message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {archipelago.proto.wire.ActionEnvelope} ActionEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ActionEnvelope.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an ActionEnvelope message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ActionEnvelope.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    return null;
                };

                /**
                 * Creates an ActionEnvelope message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.ActionEnvelope} ActionEnvelope
                 */
                ActionEnvelope.fromObject = function fromObject(object) {
                    if (object instanceof $root.archipelago.proto.wire.ActionEnvelope)
                        return object;
                    return new $root.archipelago.proto.wire.ActionEnvelope();
                };

                /**
                 * Creates an ActionEnvelope message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link archipelago.proto.wire.ActionEnvelope.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.ActionEnvelope} ActionEnvelope
                 */
                ActionEnvelope.from = ActionEnvelope.fromObject;

                /**
                 * Creates a plain object from an ActionEnvelope message. Also converts values to other types if specified.
                 * @param {archipelago.proto.wire.ActionEnvelope} message ActionEnvelope
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ActionEnvelope.toObject = function toObject() {
                    return {};
                };

                /**
                 * Creates a plain object from this ActionEnvelope message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ActionEnvelope.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this ActionEnvelope to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ActionEnvelope.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ActionEnvelope;
            })();

            wire.EventEnvelope = (function() {

                /**
                 * Properties of an EventEnvelope.
                 * @typedef archipelago.proto.wire.EventEnvelope$Properties
                 * @type {Object}
                 * @property {archipelago.proto.wire.EventGameStart$Properties} [eventGameStart] EventEnvelope eventGameStart.
                 * @property {archipelago.proto.wire.EventGameOver$Properties} [eventGameOver] EventEnvelope eventGameOver.
                 */

                /**
                 * Constructs a new EventEnvelope.
                 * @exports archipelago.proto.wire.EventEnvelope
                 * @constructor
                 * @param {archipelago.proto.wire.EventEnvelope$Properties=} [properties] Properties to set
                 */
                function EventEnvelope(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * EventEnvelope eventGameStart.
                 * @type {(archipelago.proto.wire.EventGameStart$Properties|null)}
                 */
                EventEnvelope.prototype.eventGameStart = null;

                /**
                 * EventEnvelope eventGameOver.
                 * @type {(archipelago.proto.wire.EventGameOver$Properties|null)}
                 */
                EventEnvelope.prototype.eventGameOver = null;

                // OneOf field names bound to virtual getters and setters
                let $oneOfFields;

                /**
                 * EventEnvelope event.
                 * @name archipelago.proto.wire.EventEnvelope#event
                 * @type {string|undefined}
                 */
                Object.defineProperty(EventEnvelope.prototype, "event", {
                    get: $util.oneOfGetter($oneOfFields = ["eventGameStart", "eventGameOver"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new EventEnvelope instance using the specified properties.
                 * @param {archipelago.proto.wire.EventEnvelope$Properties=} [properties] Properties to set
                 * @returns {archipelago.proto.wire.EventEnvelope} EventEnvelope instance
                 */
                EventEnvelope.create = function create(properties) {
                    return new EventEnvelope(properties);
                };

                /**
                 * Encodes the specified EventEnvelope message. Does not implicitly {@link archipelago.proto.wire.EventEnvelope.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventEnvelope$Properties} message EventEnvelope message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                EventEnvelope.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.eventGameStart != null && message.hasOwnProperty("eventGameStart"))
                        $root.archipelago.proto.wire.EventGameStart.encode(message.eventGameStart, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.eventGameOver != null && message.hasOwnProperty("eventGameOver"))
                        $root.archipelago.proto.wire.EventGameOver.encode(message.eventGameOver, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified EventEnvelope message, length delimited. Does not implicitly {@link archipelago.proto.wire.EventEnvelope.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventEnvelope$Properties} message EventEnvelope message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                EventEnvelope.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an EventEnvelope message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {archipelago.proto.wire.EventEnvelope} EventEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                EventEnvelope.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.archipelago.proto.wire.EventEnvelope();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.eventGameStart = $root.archipelago.proto.wire.EventGameStart.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.eventGameOver = $root.archipelago.proto.wire.EventGameOver.decode(reader, reader.uint32());
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
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {archipelago.proto.wire.EventEnvelope} EventEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                EventEnvelope.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an EventEnvelope message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                EventEnvelope.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    let properties = {};
                    if (message.eventGameStart != null && message.hasOwnProperty("eventGameStart")) {
                        properties.event = 1;
                        let error = $root.archipelago.proto.wire.EventGameStart.verify(message.eventGameStart);
                        if (error)
                            return "eventGameStart." + error;
                    }
                    if (message.eventGameOver != null && message.hasOwnProperty("eventGameOver")) {
                        if (properties.event === 1)
                            return "event: multiple values";
                        properties.event = 1;
                        let error = $root.archipelago.proto.wire.EventGameOver.verify(message.eventGameOver);
                        if (error)
                            return "eventGameOver." + error;
                    }
                    return null;
                };

                /**
                 * Creates an EventEnvelope message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventEnvelope} EventEnvelope
                 */
                EventEnvelope.fromObject = function fromObject(object) {
                    if (object instanceof $root.archipelago.proto.wire.EventEnvelope)
                        return object;
                    let message = new $root.archipelago.proto.wire.EventEnvelope();
                    if (object.eventGameStart != null) {
                        if (typeof object.eventGameStart !== "object")
                            throw TypeError(".archipelago.proto.wire.EventEnvelope.eventGameStart: object expected");
                        message.eventGameStart = $root.archipelago.proto.wire.EventGameStart.fromObject(object.eventGameStart);
                    }
                    if (object.eventGameOver != null) {
                        if (typeof object.eventGameOver !== "object")
                            throw TypeError(".archipelago.proto.wire.EventEnvelope.eventGameOver: object expected");
                        message.eventGameOver = $root.archipelago.proto.wire.EventGameOver.fromObject(object.eventGameOver);
                    }
                    return message;
                };

                /**
                 * Creates an EventEnvelope message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link archipelago.proto.wire.EventEnvelope.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventEnvelope} EventEnvelope
                 */
                EventEnvelope.from = EventEnvelope.fromObject;

                /**
                 * Creates a plain object from an EventEnvelope message. Also converts values to other types if specified.
                 * @param {archipelago.proto.wire.EventEnvelope} message EventEnvelope
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                EventEnvelope.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (message.eventGameStart != null && message.hasOwnProperty("eventGameStart")) {
                        object.eventGameStart = $root.archipelago.proto.wire.EventGameStart.toObject(message.eventGameStart, options);
                        if (options.oneofs)
                            object.event = "eventGameStart";
                    }
                    if (message.eventGameOver != null && message.hasOwnProperty("eventGameOver")) {
                        object.eventGameOver = $root.archipelago.proto.wire.EventGameOver.toObject(message.eventGameOver, options);
                        if (options.oneofs)
                            object.event = "eventGameOver";
                    }
                    return object;
                };

                /**
                 * Creates a plain object from this EventEnvelope message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                EventEnvelope.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this EventEnvelope to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                EventEnvelope.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return EventEnvelope;
            })();

            wire.EventGameStart = (function() {

                /**
                 * Properties of an EventGameStart.
                 * @typedef archipelago.proto.wire.EventGameStart$Properties
                 * @type {Object}
                 * @property {archipelago.proto.wire.game.Player$Properties} [player] EventGameStart player.
                 */

                /**
                 * Constructs a new EventGameStart.
                 * @exports archipelago.proto.wire.EventGameStart
                 * @constructor
                 * @param {archipelago.proto.wire.EventGameStart$Properties=} [properties] Properties to set
                 */
                function EventGameStart(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * EventGameStart player.
                 * @type {(archipelago.proto.wire.game.Player$Properties|null)}
                 */
                EventGameStart.prototype.player = null;

                /**
                 * Creates a new EventGameStart instance using the specified properties.
                 * @param {archipelago.proto.wire.EventGameStart$Properties=} [properties] Properties to set
                 * @returns {archipelago.proto.wire.EventGameStart} EventGameStart instance
                 */
                EventGameStart.create = function create(properties) {
                    return new EventGameStart(properties);
                };

                /**
                 * Encodes the specified EventGameStart message. Does not implicitly {@link archipelago.proto.wire.EventGameStart.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventGameStart$Properties} message EventGameStart message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                EventGameStart.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.player != null && message.hasOwnProperty("player"))
                        $root.archipelago.proto.wire.game.Player.encode(message.player, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified EventGameStart message, length delimited. Does not implicitly {@link archipelago.proto.wire.EventGameStart.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventGameStart$Properties} message EventGameStart message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                EventGameStart.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an EventGameStart message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {archipelago.proto.wire.EventGameStart} EventGameStart
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                EventGameStart.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.archipelago.proto.wire.EventGameStart();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.player = $root.archipelago.proto.wire.game.Player.decode(reader, reader.uint32());
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
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {archipelago.proto.wire.EventGameStart} EventGameStart
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                EventGameStart.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an EventGameStart message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                EventGameStart.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.player != null && message.hasOwnProperty("player")) {
                        let error = $root.archipelago.proto.wire.game.Player.verify(message.player);
                        if (error)
                            return "player." + error;
                    }
                    return null;
                };

                /**
                 * Creates an EventGameStart message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventGameStart} EventGameStart
                 */
                EventGameStart.fromObject = function fromObject(object) {
                    if (object instanceof $root.archipelago.proto.wire.EventGameStart)
                        return object;
                    let message = new $root.archipelago.proto.wire.EventGameStart();
                    if (object.player != null) {
                        if (typeof object.player !== "object")
                            throw TypeError(".archipelago.proto.wire.EventGameStart.player: object expected");
                        message.player = $root.archipelago.proto.wire.game.Player.fromObject(object.player);
                    }
                    return message;
                };

                /**
                 * Creates an EventGameStart message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link archipelago.proto.wire.EventGameStart.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventGameStart} EventGameStart
                 */
                EventGameStart.from = EventGameStart.fromObject;

                /**
                 * Creates a plain object from an EventGameStart message. Also converts values to other types if specified.
                 * @param {archipelago.proto.wire.EventGameStart} message EventGameStart
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                EventGameStart.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults)
                        object.player = null;
                    if (message.player != null && message.hasOwnProperty("player"))
                        object.player = $root.archipelago.proto.wire.game.Player.toObject(message.player, options);
                    return object;
                };

                /**
                 * Creates a plain object from this EventGameStart message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                EventGameStart.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this EventGameStart to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                EventGameStart.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return EventGameStart;
            })();

            wire.EventGameOver = (function() {

                /**
                 * Properties of an EventGameOver.
                 * @typedef archipelago.proto.wire.EventGameOver$Properties
                 * @type {Object}
                 * @property {archipelago.proto.wire.game.Player$Properties} [winner] EventGameOver winner.
                 */

                /**
                 * Constructs a new EventGameOver.
                 * @exports archipelago.proto.wire.EventGameOver
                 * @constructor
                 * @param {archipelago.proto.wire.EventGameOver$Properties=} [properties] Properties to set
                 */
                function EventGameOver(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * EventGameOver winner.
                 * @type {(archipelago.proto.wire.game.Player$Properties|null)}
                 */
                EventGameOver.prototype.winner = null;

                /**
                 * Creates a new EventGameOver instance using the specified properties.
                 * @param {archipelago.proto.wire.EventGameOver$Properties=} [properties] Properties to set
                 * @returns {archipelago.proto.wire.EventGameOver} EventGameOver instance
                 */
                EventGameOver.create = function create(properties) {
                    return new EventGameOver(properties);
                };

                /**
                 * Encodes the specified EventGameOver message. Does not implicitly {@link archipelago.proto.wire.EventGameOver.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventGameOver$Properties} message EventGameOver message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                EventGameOver.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.winner != null && message.hasOwnProperty("winner"))
                        $root.archipelago.proto.wire.game.Player.encode(message.winner, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified EventGameOver message, length delimited. Does not implicitly {@link archipelago.proto.wire.EventGameOver.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventGameOver$Properties} message EventGameOver message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                EventGameOver.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an EventGameOver message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {archipelago.proto.wire.EventGameOver} EventGameOver
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                EventGameOver.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.archipelago.proto.wire.EventGameOver();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.winner = $root.archipelago.proto.wire.game.Player.decode(reader, reader.uint32());
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
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {archipelago.proto.wire.EventGameOver} EventGameOver
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                EventGameOver.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an EventGameOver message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                EventGameOver.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.winner != null && message.hasOwnProperty("winner")) {
                        let error = $root.archipelago.proto.wire.game.Player.verify(message.winner);
                        if (error)
                            return "winner." + error;
                    }
                    return null;
                };

                /**
                 * Creates an EventGameOver message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventGameOver} EventGameOver
                 */
                EventGameOver.fromObject = function fromObject(object) {
                    if (object instanceof $root.archipelago.proto.wire.EventGameOver)
                        return object;
                    let message = new $root.archipelago.proto.wire.EventGameOver();
                    if (object.winner != null) {
                        if (typeof object.winner !== "object")
                            throw TypeError(".archipelago.proto.wire.EventGameOver.winner: object expected");
                        message.winner = $root.archipelago.proto.wire.game.Player.fromObject(object.winner);
                    }
                    return message;
                };

                /**
                 * Creates an EventGameOver message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link archipelago.proto.wire.EventGameOver.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventGameOver} EventGameOver
                 */
                EventGameOver.from = EventGameOver.fromObject;

                /**
                 * Creates a plain object from an EventGameOver message. Also converts values to other types if specified.
                 * @param {archipelago.proto.wire.EventGameOver} message EventGameOver
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                EventGameOver.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults)
                        object.winner = null;
                    if (message.winner != null && message.hasOwnProperty("winner"))
                        object.winner = $root.archipelago.proto.wire.game.Player.toObject(message.winner, options);
                    return object;
                };

                /**
                 * Creates a plain object from this EventGameOver message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                EventGameOver.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this EventGameOver to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                EventGameOver.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return EventGameOver;
            })();

            wire.EventGameTick = (function() {

                /**
                 * Properties of an EventGameTick.
                 * @typedef archipelago.proto.wire.EventGameTick$Properties
                 * @type {Object}
                 */

                /**
                 * Constructs a new EventGameTick.
                 * @exports archipelago.proto.wire.EventGameTick
                 * @constructor
                 * @param {archipelago.proto.wire.EventGameTick$Properties=} [properties] Properties to set
                 */
                function EventGameTick(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Creates a new EventGameTick instance using the specified properties.
                 * @param {archipelago.proto.wire.EventGameTick$Properties=} [properties] Properties to set
                 * @returns {archipelago.proto.wire.EventGameTick} EventGameTick instance
                 */
                EventGameTick.create = function create(properties) {
                    return new EventGameTick(properties);
                };

                /**
                 * Encodes the specified EventGameTick message. Does not implicitly {@link archipelago.proto.wire.EventGameTick.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventGameTick$Properties} message EventGameTick message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                EventGameTick.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    return writer;
                };

                /**
                 * Encodes the specified EventGameTick message, length delimited. Does not implicitly {@link archipelago.proto.wire.EventGameTick.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventGameTick$Properties} message EventGameTick message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                EventGameTick.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an EventGameTick message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {archipelago.proto.wire.EventGameTick} EventGameTick
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                EventGameTick.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.archipelago.proto.wire.EventGameTick();
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
                 * Decodes an EventGameTick message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {archipelago.proto.wire.EventGameTick} EventGameTick
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                EventGameTick.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an EventGameTick message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                EventGameTick.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    return null;
                };

                /**
                 * Creates an EventGameTick message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventGameTick} EventGameTick
                 */
                EventGameTick.fromObject = function fromObject(object) {
                    if (object instanceof $root.archipelago.proto.wire.EventGameTick)
                        return object;
                    return new $root.archipelago.proto.wire.EventGameTick();
                };

                /**
                 * Creates an EventGameTick message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link archipelago.proto.wire.EventGameTick.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventGameTick} EventGameTick
                 */
                EventGameTick.from = EventGameTick.fromObject;

                /**
                 * Creates a plain object from an EventGameTick message. Also converts values to other types if specified.
                 * @param {archipelago.proto.wire.EventGameTick} message EventGameTick
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                EventGameTick.toObject = function toObject() {
                    return {};
                };

                /**
                 * Creates a plain object from this EventGameTick message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                EventGameTick.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this EventGameTick to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                EventGameTick.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return EventGameTick;
            })();

            wire.game = (function() {

                /**
                 * Namespace game.
                 * @exports archipelago.proto.wire.game
                 * @namespace
                 */
                const game = {};

                game.Player = (function() {

                    /**
                     * Properties of a Player.
                     * @typedef archipelago.proto.wire.game.Player$Properties
                     * @type {Object}
                     * @property {string} [playerId] Player playerId.
                     */

                    /**
                     * Constructs a new Player.
                     * @exports archipelago.proto.wire.game.Player
                     * @constructor
                     * @param {archipelago.proto.wire.game.Player$Properties=} [properties] Properties to set
                     */
                    function Player(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Player playerId.
                     * @type {string}
                     */
                    Player.prototype.playerId = "";

                    /**
                     * Creates a new Player instance using the specified properties.
                     * @param {archipelago.proto.wire.game.Player$Properties=} [properties] Properties to set
                     * @returns {archipelago.proto.wire.game.Player} Player instance
                     */
                    Player.create = function create(properties) {
                        return new Player(properties);
                    };

                    /**
                     * Encodes the specified Player message. Does not implicitly {@link archipelago.proto.wire.game.Player.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Player$Properties} message Player message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Player.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.playerId != null && message.hasOwnProperty("playerId"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.playerId);
                        return writer;
                    };

                    /**
                     * Encodes the specified Player message, length delimited. Does not implicitly {@link archipelago.proto.wire.game.Player.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Player$Properties} message Player message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Player.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Player message from the specified reader or buffer.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {archipelago.proto.wire.game.Player} Player
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Player.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.archipelago.proto.wire.game.Player();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.playerId = reader.string();
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
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {archipelago.proto.wire.game.Player} Player
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Player.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Player message.
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {?string} `null` if valid, otherwise the reason why it is not
                     */
                    Player.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.playerId != null && message.hasOwnProperty("playerId"))
                            if (!$util.isString(message.playerId))
                                return "playerId: string expected";
                        return null;
                    };

                    /**
                     * Creates a Player message from a plain object. Also converts values to their respective internal types.
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Player} Player
                     */
                    Player.fromObject = function fromObject(object) {
                        if (object instanceof $root.archipelago.proto.wire.game.Player)
                            return object;
                        let message = new $root.archipelago.proto.wire.game.Player();
                        if (object.playerId != null)
                            message.playerId = String(object.playerId);
                        return message;
                    };

                    /**
                     * Creates a Player message from a plain object. Also converts values to their respective internal types.
                     * This is an alias of {@link archipelago.proto.wire.game.Player.fromObject}.
                     * @function
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Player} Player
                     */
                    Player.from = Player.fromObject;

                    /**
                     * Creates a plain object from a Player message. Also converts values to other types if specified.
                     * @param {archipelago.proto.wire.game.Player} message Player
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Player.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults)
                            object.playerId = "";
                        if (message.playerId != null && message.hasOwnProperty("playerId"))
                            object.playerId = message.playerId;
                        return object;
                    };

                    /**
                     * Creates a plain object from this Player message. Also converts values to other types if specified.
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Player.prototype.toObject = function toObject(options) {
                        return this.constructor.toObject(this, options);
                    };

                    /**
                     * Converts this Player to JSON.
                     * @returns {Object.<string,*>} JSON object
                     */
                    Player.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Player;
                })();

                return game;
            })();

            return wire;
        })();

        return proto;
    })();

    return archipelago;
})();

export { $root as default };
