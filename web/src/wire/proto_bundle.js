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
                 * @property {archipelago.proto.wire.ActionGameLeave$Properties} [actionGameLeave] ActionEnvelope actionGameLeave.
                 * @property {archipelago.proto.wire.ActionGameLaunch$Properties} [actionGameLaunch] ActionEnvelope actionGameLaunch.
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
                 * ActionEnvelope actionGameLeave.
                 * @type {(archipelago.proto.wire.ActionGameLeave$Properties|null)}
                 */
                ActionEnvelope.prototype.actionGameLeave = null;

                /**
                 * ActionEnvelope actionGameLaunch.
                 * @type {(archipelago.proto.wire.ActionGameLaunch$Properties|null)}
                 */
                ActionEnvelope.prototype.actionGameLaunch = null;

                // OneOf field names bound to virtual getters and setters
                let $oneOfFields;

                /**
                 * ActionEnvelope action.
                 * @name archipelago.proto.wire.ActionEnvelope#action
                 * @type {string|undefined}
                 */
                Object.defineProperty(ActionEnvelope.prototype, "action", {
                    get: $util.oneOfGetter($oneOfFields = ["actionGameLeave", "actionGameLaunch"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

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
                    if (message.actionGameLeave != null && message.hasOwnProperty("actionGameLeave"))
                        $root.archipelago.proto.wire.ActionGameLeave.encode(message.actionGameLeave, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.actionGameLaunch != null && message.hasOwnProperty("actionGameLaunch"))
                        $root.archipelago.proto.wire.ActionGameLaunch.encode(message.actionGameLaunch, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
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
                        case 1:
                            message.actionGameLeave = $root.archipelago.proto.wire.ActionGameLeave.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.actionGameLaunch = $root.archipelago.proto.wire.ActionGameLaunch.decode(reader, reader.uint32());
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
                    let properties = {};
                    if (message.actionGameLeave != null && message.hasOwnProperty("actionGameLeave")) {
                        properties.action = 1;
                        let error = $root.archipelago.proto.wire.ActionGameLeave.verify(message.actionGameLeave);
                        if (error)
                            return "actionGameLeave." + error;
                    }
                    if (message.actionGameLaunch != null && message.hasOwnProperty("actionGameLaunch")) {
                        if (properties.action === 1)
                            return "action: multiple values";
                        properties.action = 1;
                        let error = $root.archipelago.proto.wire.ActionGameLaunch.verify(message.actionGameLaunch);
                        if (error)
                            return "actionGameLaunch." + error;
                    }
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
                    let message = new $root.archipelago.proto.wire.ActionEnvelope();
                    if (object.actionGameLeave != null) {
                        if (typeof object.actionGameLeave !== "object")
                            throw TypeError(".archipelago.proto.wire.ActionEnvelope.actionGameLeave: object expected");
                        message.actionGameLeave = $root.archipelago.proto.wire.ActionGameLeave.fromObject(object.actionGameLeave);
                    }
                    if (object.actionGameLaunch != null) {
                        if (typeof object.actionGameLaunch !== "object")
                            throw TypeError(".archipelago.proto.wire.ActionEnvelope.actionGameLaunch: object expected");
                        message.actionGameLaunch = $root.archipelago.proto.wire.ActionGameLaunch.fromObject(object.actionGameLaunch);
                    }
                    return message;
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
                ActionEnvelope.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (message.actionGameLeave != null && message.hasOwnProperty("actionGameLeave")) {
                        object.actionGameLeave = $root.archipelago.proto.wire.ActionGameLeave.toObject(message.actionGameLeave, options);
                        if (options.oneofs)
                            object.action = "actionGameLeave";
                    }
                    if (message.actionGameLaunch != null && message.hasOwnProperty("actionGameLaunch")) {
                        object.actionGameLaunch = $root.archipelago.proto.wire.ActionGameLaunch.toObject(message.actionGameLaunch, options);
                        if (options.oneofs)
                            object.action = "actionGameLaunch";
                    }
                    return object;
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

            wire.ActionGameLeave = (function() {

                /**
                 * Properties of an ActionGameLeave.
                 * @typedef archipelago.proto.wire.ActionGameLeave$Properties
                 * @type {Object}
                 */

                /**
                 * Constructs a new ActionGameLeave.
                 * @exports archipelago.proto.wire.ActionGameLeave
                 * @constructor
                 * @param {archipelago.proto.wire.ActionGameLeave$Properties=} [properties] Properties to set
                 */
                function ActionGameLeave(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Creates a new ActionGameLeave instance using the specified properties.
                 * @param {archipelago.proto.wire.ActionGameLeave$Properties=} [properties] Properties to set
                 * @returns {archipelago.proto.wire.ActionGameLeave} ActionGameLeave instance
                 */
                ActionGameLeave.create = function create(properties) {
                    return new ActionGameLeave(properties);
                };

                /**
                 * Encodes the specified ActionGameLeave message. Does not implicitly {@link archipelago.proto.wire.ActionGameLeave.verify|verify} messages.
                 * @param {archipelago.proto.wire.ActionGameLeave$Properties} message ActionGameLeave message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ActionGameLeave.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    return writer;
                };

                /**
                 * Encodes the specified ActionGameLeave message, length delimited. Does not implicitly {@link archipelago.proto.wire.ActionGameLeave.verify|verify} messages.
                 * @param {archipelago.proto.wire.ActionGameLeave$Properties} message ActionGameLeave message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ActionGameLeave.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an ActionGameLeave message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {archipelago.proto.wire.ActionGameLeave} ActionGameLeave
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ActionGameLeave.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.archipelago.proto.wire.ActionGameLeave();
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
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {archipelago.proto.wire.ActionGameLeave} ActionGameLeave
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ActionGameLeave.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an ActionGameLeave message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ActionGameLeave.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    return null;
                };

                /**
                 * Creates an ActionGameLeave message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.ActionGameLeave} ActionGameLeave
                 */
                ActionGameLeave.fromObject = function fromObject(object) {
                    if (object instanceof $root.archipelago.proto.wire.ActionGameLeave)
                        return object;
                    return new $root.archipelago.proto.wire.ActionGameLeave();
                };

                /**
                 * Creates an ActionGameLeave message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link archipelago.proto.wire.ActionGameLeave.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.ActionGameLeave} ActionGameLeave
                 */
                ActionGameLeave.from = ActionGameLeave.fromObject;

                /**
                 * Creates a plain object from an ActionGameLeave message. Also converts values to other types if specified.
                 * @param {archipelago.proto.wire.ActionGameLeave} message ActionGameLeave
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ActionGameLeave.toObject = function toObject() {
                    return {};
                };

                /**
                 * Creates a plain object from this ActionGameLeave message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ActionGameLeave.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this ActionGameLeave to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ActionGameLeave.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ActionGameLeave;
            })();

            wire.ActionGameLaunch = (function() {

                /**
                 * Properties of an ActionGameLaunch.
                 * @typedef archipelago.proto.wire.ActionGameLaunch$Properties
                 * @type {Object}
                 * @property {string} [islandIdFrom] ActionGameLaunch islandIdFrom.
                 * @property {string} [islandIdTo] ActionGameLaunch islandIdTo.
                 */

                /**
                 * Constructs a new ActionGameLaunch.
                 * @exports archipelago.proto.wire.ActionGameLaunch
                 * @constructor
                 * @param {archipelago.proto.wire.ActionGameLaunch$Properties=} [properties] Properties to set
                 */
                function ActionGameLaunch(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ActionGameLaunch islandIdFrom.
                 * @type {string}
                 */
                ActionGameLaunch.prototype.islandIdFrom = "";

                /**
                 * ActionGameLaunch islandIdTo.
                 * @type {string}
                 */
                ActionGameLaunch.prototype.islandIdTo = "";

                /**
                 * Creates a new ActionGameLaunch instance using the specified properties.
                 * @param {archipelago.proto.wire.ActionGameLaunch$Properties=} [properties] Properties to set
                 * @returns {archipelago.proto.wire.ActionGameLaunch} ActionGameLaunch instance
                 */
                ActionGameLaunch.create = function create(properties) {
                    return new ActionGameLaunch(properties);
                };

                /**
                 * Encodes the specified ActionGameLaunch message. Does not implicitly {@link archipelago.proto.wire.ActionGameLaunch.verify|verify} messages.
                 * @param {archipelago.proto.wire.ActionGameLaunch$Properties} message ActionGameLaunch message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ActionGameLaunch.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.islandIdFrom != null && message.hasOwnProperty("islandIdFrom"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.islandIdFrom);
                    if (message.islandIdTo != null && message.hasOwnProperty("islandIdTo"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.islandIdTo);
                    return writer;
                };

                /**
                 * Encodes the specified ActionGameLaunch message, length delimited. Does not implicitly {@link archipelago.proto.wire.ActionGameLaunch.verify|verify} messages.
                 * @param {archipelago.proto.wire.ActionGameLaunch$Properties} message ActionGameLaunch message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ActionGameLaunch.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an ActionGameLaunch message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {archipelago.proto.wire.ActionGameLaunch} ActionGameLaunch
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ActionGameLaunch.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.archipelago.proto.wire.ActionGameLaunch();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.islandIdFrom = reader.string();
                            break;
                        case 2:
                            message.islandIdTo = reader.string();
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
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {archipelago.proto.wire.ActionGameLaunch} ActionGameLaunch
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ActionGameLaunch.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an ActionGameLaunch message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                ActionGameLaunch.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.islandIdFrom != null && message.hasOwnProperty("islandIdFrom"))
                        if (!$util.isString(message.islandIdFrom))
                            return "islandIdFrom: string expected";
                    if (message.islandIdTo != null && message.hasOwnProperty("islandIdTo"))
                        if (!$util.isString(message.islandIdTo))
                            return "islandIdTo: string expected";
                    return null;
                };

                /**
                 * Creates an ActionGameLaunch message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.ActionGameLaunch} ActionGameLaunch
                 */
                ActionGameLaunch.fromObject = function fromObject(object) {
                    if (object instanceof $root.archipelago.proto.wire.ActionGameLaunch)
                        return object;
                    let message = new $root.archipelago.proto.wire.ActionGameLaunch();
                    if (object.islandIdFrom != null)
                        message.islandIdFrom = String(object.islandIdFrom);
                    if (object.islandIdTo != null)
                        message.islandIdTo = String(object.islandIdTo);
                    return message;
                };

                /**
                 * Creates an ActionGameLaunch message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link archipelago.proto.wire.ActionGameLaunch.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.ActionGameLaunch} ActionGameLaunch
                 */
                ActionGameLaunch.from = ActionGameLaunch.fromObject;

                /**
                 * Creates a plain object from an ActionGameLaunch message. Also converts values to other types if specified.
                 * @param {archipelago.proto.wire.ActionGameLaunch} message ActionGameLaunch
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ActionGameLaunch.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        object.islandIdFrom = "";
                        object.islandIdTo = "";
                    }
                    if (message.islandIdFrom != null && message.hasOwnProperty("islandIdFrom"))
                        object.islandIdFrom = message.islandIdFrom;
                    if (message.islandIdTo != null && message.hasOwnProperty("islandIdTo"))
                        object.islandIdTo = message.islandIdTo;
                    return object;
                };

                /**
                 * Creates a plain object from this ActionGameLaunch message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ActionGameLaunch.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };

                /**
                 * Converts this ActionGameLaunch to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                ActionGameLaunch.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ActionGameLaunch;
            })();

            wire.EventEnvelope = (function() {

                /**
                 * Properties of an EventEnvelope.
                 * @typedef archipelago.proto.wire.EventEnvelope$Properties
                 * @type {Object}
                 * @property {archipelago.proto.wire.EventGameStart$Properties} [eventGameStart] EventEnvelope eventGameStart.
                 * @property {archipelago.proto.wire.EventGameOver$Properties} [eventGameOver] EventEnvelope eventGameOver.
                 * @property {archipelago.proto.wire.EventGameTick$Properties} [eventGameTick] EventEnvelope eventGameTick.
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

                /**
                 * EventEnvelope eventGameTick.
                 * @type {(archipelago.proto.wire.EventGameTick$Properties|null)}
                 */
                EventEnvelope.prototype.eventGameTick = null;

                // OneOf field names bound to virtual getters and setters
                let $oneOfFields;

                /**
                 * EventEnvelope event.
                 * @name archipelago.proto.wire.EventEnvelope#event
                 * @type {string|undefined}
                 */
                Object.defineProperty(EventEnvelope.prototype, "event", {
                    get: $util.oneOfGetter($oneOfFields = ["eventGameStart", "eventGameOver", "eventGameTick"]),
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
                    if (message.eventGameTick != null && message.hasOwnProperty("eventGameTick"))
                        $root.archipelago.proto.wire.EventGameTick.encode(message.eventGameTick, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
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
                        case 3:
                            message.eventGameTick = $root.archipelago.proto.wire.EventGameTick.decode(reader, reader.uint32());
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
                    if (message.eventGameTick != null && message.hasOwnProperty("eventGameTick")) {
                        if (properties.event === 1)
                            return "event: multiple values";
                        properties.event = 1;
                        let error = $root.archipelago.proto.wire.EventGameTick.verify(message.eventGameTick);
                        if (error)
                            return "eventGameTick." + error;
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
                    if (object.eventGameTick != null) {
                        if (typeof object.eventGameTick !== "object")
                            throw TypeError(".archipelago.proto.wire.EventEnvelope.eventGameTick: object expected");
                        message.eventGameTick = $root.archipelago.proto.wire.EventGameTick.fromObject(object.eventGameTick);
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
                    if (message.eventGameTick != null && message.hasOwnProperty("eventGameTick")) {
                        object.eventGameTick = $root.archipelago.proto.wire.EventGameTick.toObject(message.eventGameTick, options);
                        if (options.oneofs)
                            object.event = "eventGameTick";
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
                 * @property {string} [playerId] EventGameStart playerId.
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
                 * EventGameStart playerId.
                 * @type {string}
                 */
                EventGameStart.prototype.playerId = "";

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
                    if (message.playerId != null && message.hasOwnProperty("playerId"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.playerId);
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
                    if (message.playerId != null && message.hasOwnProperty("playerId"))
                        if (!$util.isString(message.playerId))
                            return "playerId: string expected";
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
                    if (object.playerId != null)
                        message.playerId = String(object.playerId);
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
                        object.playerId = "";
                    if (message.playerId != null && message.hasOwnProperty("playerId"))
                        object.playerId = message.playerId;
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
                 * @property {string} [playerIdWinner] EventGameOver playerIdWinner.
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
                 * EventGameOver playerIdWinner.
                 * @type {string}
                 */
                EventGameOver.prototype.playerIdWinner = "";

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
                    if (message.playerIdWinner != null && message.hasOwnProperty("playerIdWinner"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.playerIdWinner);
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
                            message.playerIdWinner = reader.string();
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
                    if (message.playerIdWinner != null && message.hasOwnProperty("playerIdWinner"))
                        if (!$util.isString(message.playerIdWinner))
                            return "playerIdWinner: string expected";
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
                    if (object.playerIdWinner != null)
                        message.playerIdWinner = String(object.playerIdWinner);
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
                        object.playerIdWinner = "";
                    if (message.playerIdWinner != null && message.hasOwnProperty("playerIdWinner"))
                        object.playerIdWinner = message.playerIdWinner;
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
                 * @property {archipelago.proto.wire.game.Game$Properties} [game] EventGameTick game.
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
                 * EventGameTick game.
                 * @type {(archipelago.proto.wire.game.Game$Properties|null)}
                 */
                EventGameTick.prototype.game = null;

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
                    if (message.game != null && message.hasOwnProperty("game"))
                        $root.archipelago.proto.wire.game.Game.encode(message.game, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
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
                        case 1:
                            message.game = $root.archipelago.proto.wire.game.Game.decode(reader, reader.uint32());
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
                    if (message.game != null && message.hasOwnProperty("game")) {
                        let error = $root.archipelago.proto.wire.game.Game.verify(message.game);
                        if (error)
                            return "game." + error;
                    }
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
                    let message = new $root.archipelago.proto.wire.EventGameTick();
                    if (object.game != null) {
                        if (typeof object.game !== "object")
                            throw TypeError(".archipelago.proto.wire.EventGameTick.game: object expected");
                        message.game = $root.archipelago.proto.wire.game.Game.fromObject(object.game);
                    }
                    return message;
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
                EventGameTick.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults)
                        object.game = null;
                    if (message.game != null && message.hasOwnProperty("game"))
                        object.game = $root.archipelago.proto.wire.game.Game.toObject(message.game, options);
                    return object;
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

                game.Coordinate = (function() {

                    /**
                     * Properties of a Coordinate.
                     * @typedef archipelago.proto.wire.game.Coordinate$Properties
                     * @type {Object}
                     * @property {number} [x] Coordinate x.
                     * @property {number} [y] Coordinate y.
                     */

                    /**
                     * Constructs a new Coordinate.
                     * @exports archipelago.proto.wire.game.Coordinate
                     * @constructor
                     * @param {archipelago.proto.wire.game.Coordinate$Properties=} [properties] Properties to set
                     */
                    function Coordinate(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Coordinate x.
                     * @type {number}
                     */
                    Coordinate.prototype.x = 0;

                    /**
                     * Coordinate y.
                     * @type {number}
                     */
                    Coordinate.prototype.y = 0;

                    /**
                     * Creates a new Coordinate instance using the specified properties.
                     * @param {archipelago.proto.wire.game.Coordinate$Properties=} [properties] Properties to set
                     * @returns {archipelago.proto.wire.game.Coordinate} Coordinate instance
                     */
                    Coordinate.create = function create(properties) {
                        return new Coordinate(properties);
                    };

                    /**
                     * Encodes the specified Coordinate message. Does not implicitly {@link archipelago.proto.wire.game.Coordinate.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Coordinate$Properties} message Coordinate message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Coordinate.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.x != null && message.hasOwnProperty("x"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.x);
                        if (message.y != null && message.hasOwnProperty("y"))
                            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.y);
                        return writer;
                    };

                    /**
                     * Encodes the specified Coordinate message, length delimited. Does not implicitly {@link archipelago.proto.wire.game.Coordinate.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Coordinate$Properties} message Coordinate message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Coordinate.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Coordinate message from the specified reader or buffer.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {archipelago.proto.wire.game.Coordinate} Coordinate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Coordinate.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.archipelago.proto.wire.game.Coordinate();
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
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {archipelago.proto.wire.game.Coordinate} Coordinate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Coordinate.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Coordinate message.
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {?string} `null` if valid, otherwise the reason why it is not
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
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Coordinate} Coordinate
                     */
                    Coordinate.fromObject = function fromObject(object) {
                        if (object instanceof $root.archipelago.proto.wire.game.Coordinate)
                            return object;
                        let message = new $root.archipelago.proto.wire.game.Coordinate();
                        if (object.x != null)
                            message.x = object.x | 0;
                        if (object.y != null)
                            message.y = object.y | 0;
                        return message;
                    };

                    /**
                     * Creates a Coordinate message from a plain object. Also converts values to their respective internal types.
                     * This is an alias of {@link archipelago.proto.wire.game.Coordinate.fromObject}.
                     * @function
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Coordinate} Coordinate
                     */
                    Coordinate.from = Coordinate.fromObject;

                    /**
                     * Creates a plain object from a Coordinate message. Also converts values to other types if specified.
                     * @param {archipelago.proto.wire.game.Coordinate} message Coordinate
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
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
                     * Creates a plain object from this Coordinate message. Also converts values to other types if specified.
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Coordinate.prototype.toObject = function toObject(options) {
                        return this.constructor.toObject(this, options);
                    };

                    /**
                     * Converts this Coordinate to JSON.
                     * @returns {Object.<string,*>} JSON object
                     */
                    Coordinate.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Coordinate;
                })();

                game.FloatCoordinate = (function() {

                    /**
                     * Properties of a FloatCoordinate.
                     * @typedef archipelago.proto.wire.game.FloatCoordinate$Properties
                     * @type {Object}
                     * @property {number} [x] FloatCoordinate x.
                     * @property {number} [y] FloatCoordinate y.
                     */

                    /**
                     * Constructs a new FloatCoordinate.
                     * @exports archipelago.proto.wire.game.FloatCoordinate
                     * @constructor
                     * @param {archipelago.proto.wire.game.FloatCoordinate$Properties=} [properties] Properties to set
                     */
                    function FloatCoordinate(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * FloatCoordinate x.
                     * @type {number}
                     */
                    FloatCoordinate.prototype.x = 0;

                    /**
                     * FloatCoordinate y.
                     * @type {number}
                     */
                    FloatCoordinate.prototype.y = 0;

                    /**
                     * Creates a new FloatCoordinate instance using the specified properties.
                     * @param {archipelago.proto.wire.game.FloatCoordinate$Properties=} [properties] Properties to set
                     * @returns {archipelago.proto.wire.game.FloatCoordinate} FloatCoordinate instance
                     */
                    FloatCoordinate.create = function create(properties) {
                        return new FloatCoordinate(properties);
                    };

                    /**
                     * Encodes the specified FloatCoordinate message. Does not implicitly {@link archipelago.proto.wire.game.FloatCoordinate.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.FloatCoordinate$Properties} message FloatCoordinate message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    FloatCoordinate.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.x != null && message.hasOwnProperty("x"))
                            writer.uint32(/* id 1, wireType 5 =*/13).float(message.x);
                        if (message.y != null && message.hasOwnProperty("y"))
                            writer.uint32(/* id 2, wireType 5 =*/21).float(message.y);
                        return writer;
                    };

                    /**
                     * Encodes the specified FloatCoordinate message, length delimited. Does not implicitly {@link archipelago.proto.wire.game.FloatCoordinate.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.FloatCoordinate$Properties} message FloatCoordinate message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    FloatCoordinate.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a FloatCoordinate message from the specified reader or buffer.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {archipelago.proto.wire.game.FloatCoordinate} FloatCoordinate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    FloatCoordinate.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.archipelago.proto.wire.game.FloatCoordinate();
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
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {archipelago.proto.wire.game.FloatCoordinate} FloatCoordinate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    FloatCoordinate.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a FloatCoordinate message.
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {?string} `null` if valid, otherwise the reason why it is not
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
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.FloatCoordinate} FloatCoordinate
                     */
                    FloatCoordinate.fromObject = function fromObject(object) {
                        if (object instanceof $root.archipelago.proto.wire.game.FloatCoordinate)
                            return object;
                        let message = new $root.archipelago.proto.wire.game.FloatCoordinate();
                        if (object.x != null)
                            message.x = Number(object.x);
                        if (object.y != null)
                            message.y = Number(object.y);
                        return message;
                    };

                    /**
                     * Creates a FloatCoordinate message from a plain object. Also converts values to their respective internal types.
                     * This is an alias of {@link archipelago.proto.wire.game.FloatCoordinate.fromObject}.
                     * @function
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.FloatCoordinate} FloatCoordinate
                     */
                    FloatCoordinate.from = FloatCoordinate.fromObject;

                    /**
                     * Creates a plain object from a FloatCoordinate message. Also converts values to other types if specified.
                     * @param {archipelago.proto.wire.game.FloatCoordinate} message FloatCoordinate
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
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
                            object.x = message.x;
                        if (message.y != null && message.hasOwnProperty("y"))
                            object.y = message.y;
                        return object;
                    };

                    /**
                     * Creates a plain object from this FloatCoordinate message. Also converts values to other types if specified.
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    FloatCoordinate.prototype.toObject = function toObject(options) {
                        return this.constructor.toObject(this, options);
                    };

                    /**
                     * Converts this FloatCoordinate to JSON.
                     * @returns {Object.<string,*>} JSON object
                     */
                    FloatCoordinate.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return FloatCoordinate;
                })();

                game.Player = (function() {

                    /**
                     * Properties of a Player.
                     * @typedef archipelago.proto.wire.game.Player$Properties
                     * @type {Object}
                     * @property {string} [id] Player id.
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
                     * Player id.
                     * @type {string}
                     */
                    Player.prototype.id = "";

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
                        if (message.id != null && message.hasOwnProperty("id"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
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
                                message.id = reader.string();
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
                        if (message.id != null && message.hasOwnProperty("id"))
                            if (!$util.isString(message.id))
                                return "id: string expected";
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
                        if (object.id != null)
                            message.id = String(object.id);
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
                            object.id = "";
                        if (message.id != null && message.hasOwnProperty("id"))
                            object.id = message.id;
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

                game.Army = (function() {

                    /**
                     * Properties of an Army.
                     * @typedef archipelago.proto.wire.game.Army$Properties
                     * @type {Object}
                     * @property {archipelago.proto.wire.game.Player$Properties} [owner] Army owner.
                     * @property {number} [strength] Army strength.
                     */

                    /**
                     * Constructs a new Army.
                     * @exports archipelago.proto.wire.game.Army
                     * @constructor
                     * @param {archipelago.proto.wire.game.Army$Properties=} [properties] Properties to set
                     */
                    function Army(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Army owner.
                     * @type {(archipelago.proto.wire.game.Player$Properties|null)}
                     */
                    Army.prototype.owner = null;

                    /**
                     * Army strength.
                     * @type {number}
                     */
                    Army.prototype.strength = 0;

                    /**
                     * Creates a new Army instance using the specified properties.
                     * @param {archipelago.proto.wire.game.Army$Properties=} [properties] Properties to set
                     * @returns {archipelago.proto.wire.game.Army} Army instance
                     */
                    Army.create = function create(properties) {
                        return new Army(properties);
                    };

                    /**
                     * Encodes the specified Army message. Does not implicitly {@link archipelago.proto.wire.game.Army.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Army$Properties} message Army message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Army.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.owner != null && message.hasOwnProperty("owner"))
                            $root.archipelago.proto.wire.game.Player.encode(message.owner, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        if (message.strength != null && message.hasOwnProperty("strength"))
                            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.strength);
                        return writer;
                    };

                    /**
                     * Encodes the specified Army message, length delimited. Does not implicitly {@link archipelago.proto.wire.game.Army.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Army$Properties} message Army message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Army.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes an Army message from the specified reader or buffer.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {archipelago.proto.wire.game.Army} Army
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Army.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.archipelago.proto.wire.game.Army();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.owner = $root.archipelago.proto.wire.game.Player.decode(reader, reader.uint32());
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
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {archipelago.proto.wire.game.Army} Army
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Army.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies an Army message.
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {?string} `null` if valid, otherwise the reason why it is not
                     */
                    Army.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.owner != null && message.hasOwnProperty("owner")) {
                            let error = $root.archipelago.proto.wire.game.Player.verify(message.owner);
                            if (error)
                                return "owner." + error;
                        }
                        if (message.strength != null && message.hasOwnProperty("strength"))
                            if (!$util.isInteger(message.strength))
                                return "strength: integer expected";
                        return null;
                    };

                    /**
                     * Creates an Army message from a plain object. Also converts values to their respective internal types.
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Army} Army
                     */
                    Army.fromObject = function fromObject(object) {
                        if (object instanceof $root.archipelago.proto.wire.game.Army)
                            return object;
                        let message = new $root.archipelago.proto.wire.game.Army();
                        if (object.owner != null) {
                            if (typeof object.owner !== "object")
                                throw TypeError(".archipelago.proto.wire.game.Army.owner: object expected");
                            message.owner = $root.archipelago.proto.wire.game.Player.fromObject(object.owner);
                        }
                        if (object.strength != null)
                            message.strength = object.strength | 0;
                        return message;
                    };

                    /**
                     * Creates an Army message from a plain object. Also converts values to their respective internal types.
                     * This is an alias of {@link archipelago.proto.wire.game.Army.fromObject}.
                     * @function
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Army} Army
                     */
                    Army.from = Army.fromObject;

                    /**
                     * Creates a plain object from an Army message. Also converts values to other types if specified.
                     * @param {archipelago.proto.wire.game.Army} message Army
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Army.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            object.owner = null;
                            object.strength = 0;
                        }
                        if (message.owner != null && message.hasOwnProperty("owner"))
                            object.owner = $root.archipelago.proto.wire.game.Player.toObject(message.owner, options);
                        if (message.strength != null && message.hasOwnProperty("strength"))
                            object.strength = message.strength;
                        return object;
                    };

                    /**
                     * Creates a plain object from this Army message. Also converts values to other types if specified.
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Army.prototype.toObject = function toObject(options) {
                        return this.constructor.toObject(this, options);
                    };

                    /**
                     * Converts this Army to JSON.
                     * @returns {Object.<string,*>} JSON object
                     */
                    Army.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Army;
                })();

                game.Airplane = (function() {

                    /**
                     * Properties of an Airplane.
                     * @typedef archipelago.proto.wire.game.Airplane$Properties
                     * @type {Object}
                     * @property {string} [id] Airplane id.
                     * @property {archipelago.proto.wire.game.Army$Properties} [army] Airplane army.
                     * @property {archipelago.proto.wire.game.FloatCoordinate$Properties} [position] Airplane position.
                     * @property {number} [direction] Airplane direction.
                     * @property {number} [speed] Airplane speed.
                     */

                    /**
                     * Constructs a new Airplane.
                     * @exports archipelago.proto.wire.game.Airplane
                     * @constructor
                     * @param {archipelago.proto.wire.game.Airplane$Properties=} [properties] Properties to set
                     */
                    function Airplane(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Airplane id.
                     * @type {string}
                     */
                    Airplane.prototype.id = "";

                    /**
                     * Airplane army.
                     * @type {(archipelago.proto.wire.game.Army$Properties|null)}
                     */
                    Airplane.prototype.army = null;

                    /**
                     * Airplane position.
                     * @type {(archipelago.proto.wire.game.FloatCoordinate$Properties|null)}
                     */
                    Airplane.prototype.position = null;

                    /**
                     * Airplane direction.
                     * @type {number}
                     */
                    Airplane.prototype.direction = 0;

                    /**
                     * Airplane speed.
                     * @type {number}
                     */
                    Airplane.prototype.speed = 0;

                    /**
                     * Creates a new Airplane instance using the specified properties.
                     * @param {archipelago.proto.wire.game.Airplane$Properties=} [properties] Properties to set
                     * @returns {archipelago.proto.wire.game.Airplane} Airplane instance
                     */
                    Airplane.create = function create(properties) {
                        return new Airplane(properties);
                    };

                    /**
                     * Encodes the specified Airplane message. Does not implicitly {@link archipelago.proto.wire.game.Airplane.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Airplane$Properties} message Airplane message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Airplane.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.id != null && message.hasOwnProperty("id"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                        if (message.army != null && message.hasOwnProperty("army"))
                            $root.archipelago.proto.wire.game.Army.encode(message.army, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        if (message.position != null && message.hasOwnProperty("position"))
                            $root.archipelago.proto.wire.game.FloatCoordinate.encode(message.position, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                        if (message.direction != null && message.hasOwnProperty("direction"))
                            writer.uint32(/* id 4, wireType 5 =*/37).float(message.direction);
                        if (message.speed != null && message.hasOwnProperty("speed"))
                            writer.uint32(/* id 5, wireType 5 =*/45).float(message.speed);
                        return writer;
                    };

                    /**
                     * Encodes the specified Airplane message, length delimited. Does not implicitly {@link archipelago.proto.wire.game.Airplane.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Airplane$Properties} message Airplane message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Airplane.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes an Airplane message from the specified reader or buffer.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {archipelago.proto.wire.game.Airplane} Airplane
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Airplane.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.archipelago.proto.wire.game.Airplane();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.id = reader.string();
                                break;
                            case 2:
                                message.army = $root.archipelago.proto.wire.game.Army.decode(reader, reader.uint32());
                                break;
                            case 3:
                                message.position = $root.archipelago.proto.wire.game.FloatCoordinate.decode(reader, reader.uint32());
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
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {archipelago.proto.wire.game.Airplane} Airplane
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Airplane.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies an Airplane message.
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {?string} `null` if valid, otherwise the reason why it is not
                     */
                    Airplane.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.id != null && message.hasOwnProperty("id"))
                            if (!$util.isString(message.id))
                                return "id: string expected";
                        if (message.army != null && message.hasOwnProperty("army")) {
                            let error = $root.archipelago.proto.wire.game.Army.verify(message.army);
                            if (error)
                                return "army." + error;
                        }
                        if (message.position != null && message.hasOwnProperty("position")) {
                            let error = $root.archipelago.proto.wire.game.FloatCoordinate.verify(message.position);
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
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Airplane} Airplane
                     */
                    Airplane.fromObject = function fromObject(object) {
                        if (object instanceof $root.archipelago.proto.wire.game.Airplane)
                            return object;
                        let message = new $root.archipelago.proto.wire.game.Airplane();
                        if (object.id != null)
                            message.id = String(object.id);
                        if (object.army != null) {
                            if (typeof object.army !== "object")
                                throw TypeError(".archipelago.proto.wire.game.Airplane.army: object expected");
                            message.army = $root.archipelago.proto.wire.game.Army.fromObject(object.army);
                        }
                        if (object.position != null) {
                            if (typeof object.position !== "object")
                                throw TypeError(".archipelago.proto.wire.game.Airplane.position: object expected");
                            message.position = $root.archipelago.proto.wire.game.FloatCoordinate.fromObject(object.position);
                        }
                        if (object.direction != null)
                            message.direction = Number(object.direction);
                        if (object.speed != null)
                            message.speed = Number(object.speed);
                        return message;
                    };

                    /**
                     * Creates an Airplane message from a plain object. Also converts values to their respective internal types.
                     * This is an alias of {@link archipelago.proto.wire.game.Airplane.fromObject}.
                     * @function
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Airplane} Airplane
                     */
                    Airplane.from = Airplane.fromObject;

                    /**
                     * Creates a plain object from an Airplane message. Also converts values to other types if specified.
                     * @param {archipelago.proto.wire.game.Airplane} message Airplane
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
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
                            object.army = $root.archipelago.proto.wire.game.Army.toObject(message.army, options);
                        if (message.position != null && message.hasOwnProperty("position"))
                            object.position = $root.archipelago.proto.wire.game.FloatCoordinate.toObject(message.position, options);
                        if (message.direction != null && message.hasOwnProperty("direction"))
                            object.direction = message.direction;
                        if (message.speed != null && message.hasOwnProperty("speed"))
                            object.speed = message.speed;
                        return object;
                    };

                    /**
                     * Creates a plain object from this Airplane message. Also converts values to other types if specified.
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Airplane.prototype.toObject = function toObject(options) {
                        return this.constructor.toObject(this, options);
                    };

                    /**
                     * Converts this Airplane to JSON.
                     * @returns {Object.<string,*>} JSON object
                     */
                    Airplane.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Airplane;
                })();

                game.Island = (function() {

                    /**
                     * Properties of an Island.
                     * @typedef archipelago.proto.wire.game.Island$Properties
                     * @type {Object}
                     * @property {string} [id] Island id.
                     * @property {archipelago.proto.wire.game.Army$Properties} [army] Island army.
                     * @property {archipelago.proto.wire.game.Coordinate$Properties} [position] Island position.
                     * @property {number} [size] Island size.
                     */

                    /**
                     * Constructs a new Island.
                     * @exports archipelago.proto.wire.game.Island
                     * @constructor
                     * @param {archipelago.proto.wire.game.Island$Properties=} [properties] Properties to set
                     */
                    function Island(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Island id.
                     * @type {string}
                     */
                    Island.prototype.id = "";

                    /**
                     * Island army.
                     * @type {(archipelago.proto.wire.game.Army$Properties|null)}
                     */
                    Island.prototype.army = null;

                    /**
                     * Island position.
                     * @type {(archipelago.proto.wire.game.Coordinate$Properties|null)}
                     */
                    Island.prototype.position = null;

                    /**
                     * Island size.
                     * @type {number}
                     */
                    Island.prototype.size = 0;

                    /**
                     * Creates a new Island instance using the specified properties.
                     * @param {archipelago.proto.wire.game.Island$Properties=} [properties] Properties to set
                     * @returns {archipelago.proto.wire.game.Island} Island instance
                     */
                    Island.create = function create(properties) {
                        return new Island(properties);
                    };

                    /**
                     * Encodes the specified Island message. Does not implicitly {@link archipelago.proto.wire.game.Island.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Island$Properties} message Island message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Island.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.id != null && message.hasOwnProperty("id"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                        if (message.army != null && message.hasOwnProperty("army"))
                            $root.archipelago.proto.wire.game.Army.encode(message.army, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        if (message.position != null && message.hasOwnProperty("position"))
                            $root.archipelago.proto.wire.game.Coordinate.encode(message.position, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                        if (message.size != null && message.hasOwnProperty("size"))
                            writer.uint32(/* id 4, wireType 5 =*/37).float(message.size);
                        return writer;
                    };

                    /**
                     * Encodes the specified Island message, length delimited. Does not implicitly {@link archipelago.proto.wire.game.Island.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Island$Properties} message Island message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Island.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes an Island message from the specified reader or buffer.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {archipelago.proto.wire.game.Island} Island
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Island.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.archipelago.proto.wire.game.Island();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.id = reader.string();
                                break;
                            case 2:
                                message.army = $root.archipelago.proto.wire.game.Army.decode(reader, reader.uint32());
                                break;
                            case 3:
                                message.position = $root.archipelago.proto.wire.game.Coordinate.decode(reader, reader.uint32());
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
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {archipelago.proto.wire.game.Island} Island
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Island.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies an Island message.
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {?string} `null` if valid, otherwise the reason why it is not
                     */
                    Island.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.id != null && message.hasOwnProperty("id"))
                            if (!$util.isString(message.id))
                                return "id: string expected";
                        if (message.army != null && message.hasOwnProperty("army")) {
                            let error = $root.archipelago.proto.wire.game.Army.verify(message.army);
                            if (error)
                                return "army." + error;
                        }
                        if (message.position != null && message.hasOwnProperty("position")) {
                            let error = $root.archipelago.proto.wire.game.Coordinate.verify(message.position);
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
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Island} Island
                     */
                    Island.fromObject = function fromObject(object) {
                        if (object instanceof $root.archipelago.proto.wire.game.Island)
                            return object;
                        let message = new $root.archipelago.proto.wire.game.Island();
                        if (object.id != null)
                            message.id = String(object.id);
                        if (object.army != null) {
                            if (typeof object.army !== "object")
                                throw TypeError(".archipelago.proto.wire.game.Island.army: object expected");
                            message.army = $root.archipelago.proto.wire.game.Army.fromObject(object.army);
                        }
                        if (object.position != null) {
                            if (typeof object.position !== "object")
                                throw TypeError(".archipelago.proto.wire.game.Island.position: object expected");
                            message.position = $root.archipelago.proto.wire.game.Coordinate.fromObject(object.position);
                        }
                        if (object.size != null)
                            message.size = Number(object.size);
                        return message;
                    };

                    /**
                     * Creates an Island message from a plain object. Also converts values to their respective internal types.
                     * This is an alias of {@link archipelago.proto.wire.game.Island.fromObject}.
                     * @function
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Island} Island
                     */
                    Island.from = Island.fromObject;

                    /**
                     * Creates a plain object from an Island message. Also converts values to other types if specified.
                     * @param {archipelago.proto.wire.game.Island} message Island
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
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
                            object.army = $root.archipelago.proto.wire.game.Army.toObject(message.army, options);
                        if (message.position != null && message.hasOwnProperty("position"))
                            object.position = $root.archipelago.proto.wire.game.Coordinate.toObject(message.position, options);
                        if (message.size != null && message.hasOwnProperty("size"))
                            object.size = message.size;
                        return object;
                    };

                    /**
                     * Creates a plain object from this Island message. Also converts values to other types if specified.
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Island.prototype.toObject = function toObject(options) {
                        return this.constructor.toObject(this, options);
                    };

                    /**
                     * Converts this Island to JSON.
                     * @returns {Object.<string,*>} JSON object
                     */
                    Island.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Island;
                })();

                game.Game = (function() {

                    /**
                     * Properties of a Game.
                     * @typedef archipelago.proto.wire.game.Game$Properties
                     * @type {Object}
                     * @property {string} [id] Game id.
                     * @property {archipelago.proto.wire.game.Coordinate$Properties} [size] Game size.
                     * @property {archipelago.proto.wire.game.Player$Properties} [player1] Game player1.
                     * @property {archipelago.proto.wire.game.Player$Properties} [player2] Game player2.
                     * @property {archipelago.proto.wire.game.Player$Properties} [playerNeutral] Game playerNeutral.
                     * @property {Array.<archipelago.proto.wire.game.Island$Properties>} [islands] Game islands.
                     * @property {Array.<archipelago.proto.wire.game.Airplane$Properties>} [airplanes] Game airplanes.
                     */

                    /**
                     * Constructs a new Game.
                     * @exports archipelago.proto.wire.game.Game
                     * @constructor
                     * @param {archipelago.proto.wire.game.Game$Properties=} [properties] Properties to set
                     */
                    function Game(properties) {
                        this.islands = [];
                        this.airplanes = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Game id.
                     * @type {string}
                     */
                    Game.prototype.id = "";

                    /**
                     * Game size.
                     * @type {(archipelago.proto.wire.game.Coordinate$Properties|null)}
                     */
                    Game.prototype.size = null;

                    /**
                     * Game player1.
                     * @type {(archipelago.proto.wire.game.Player$Properties|null)}
                     */
                    Game.prototype.player1 = null;

                    /**
                     * Game player2.
                     * @type {(archipelago.proto.wire.game.Player$Properties|null)}
                     */
                    Game.prototype.player2 = null;

                    /**
                     * Game playerNeutral.
                     * @type {(archipelago.proto.wire.game.Player$Properties|null)}
                     */
                    Game.prototype.playerNeutral = null;

                    /**
                     * Game islands.
                     * @type {Array.<archipelago.proto.wire.game.Island$Properties>}
                     */
                    Game.prototype.islands = $util.emptyArray;

                    /**
                     * Game airplanes.
                     * @type {Array.<archipelago.proto.wire.game.Airplane$Properties>}
                     */
                    Game.prototype.airplanes = $util.emptyArray;

                    /**
                     * Creates a new Game instance using the specified properties.
                     * @param {archipelago.proto.wire.game.Game$Properties=} [properties] Properties to set
                     * @returns {archipelago.proto.wire.game.Game} Game instance
                     */
                    Game.create = function create(properties) {
                        return new Game(properties);
                    };

                    /**
                     * Encodes the specified Game message. Does not implicitly {@link archipelago.proto.wire.game.Game.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Game$Properties} message Game message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Game.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.id != null && message.hasOwnProperty("id"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                        if (message.size != null && message.hasOwnProperty("size"))
                            $root.archipelago.proto.wire.game.Coordinate.encode(message.size, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        if (message.player1 != null && message.hasOwnProperty("player1"))
                            $root.archipelago.proto.wire.game.Player.encode(message.player1, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                        if (message.player2 != null && message.hasOwnProperty("player2"))
                            $root.archipelago.proto.wire.game.Player.encode(message.player2, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                        if (message.playerNeutral != null && message.hasOwnProperty("playerNeutral"))
                            $root.archipelago.proto.wire.game.Player.encode(message.playerNeutral, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                        if (message.islands != null && message.islands.length)
                            for (let i = 0; i < message.islands.length; ++i)
                                $root.archipelago.proto.wire.game.Island.encode(message.islands[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                        if (message.airplanes != null && message.airplanes.length)
                            for (let i = 0; i < message.airplanes.length; ++i)
                                $root.archipelago.proto.wire.game.Airplane.encode(message.airplanes[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified Game message, length delimited. Does not implicitly {@link archipelago.proto.wire.game.Game.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Game$Properties} message Game message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Game.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Game message from the specified reader or buffer.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {archipelago.proto.wire.game.Game} Game
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Game.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.archipelago.proto.wire.game.Game();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.id = reader.string();
                                break;
                            case 2:
                                message.size = $root.archipelago.proto.wire.game.Coordinate.decode(reader, reader.uint32());
                                break;
                            case 3:
                                message.player1 = $root.archipelago.proto.wire.game.Player.decode(reader, reader.uint32());
                                break;
                            case 4:
                                message.player2 = $root.archipelago.proto.wire.game.Player.decode(reader, reader.uint32());
                                break;
                            case 5:
                                message.playerNeutral = $root.archipelago.proto.wire.game.Player.decode(reader, reader.uint32());
                                break;
                            case 6:
                                if (!(message.islands && message.islands.length))
                                    message.islands = [];
                                message.islands.push($root.archipelago.proto.wire.game.Island.decode(reader, reader.uint32()));
                                break;
                            case 7:
                                if (!(message.airplanes && message.airplanes.length))
                                    message.airplanes = [];
                                message.airplanes.push($root.archipelago.proto.wire.game.Airplane.decode(reader, reader.uint32()));
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
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {archipelago.proto.wire.game.Game} Game
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Game.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Game message.
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {?string} `null` if valid, otherwise the reason why it is not
                     */
                    Game.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.id != null && message.hasOwnProperty("id"))
                            if (!$util.isString(message.id))
                                return "id: string expected";
                        if (message.size != null && message.hasOwnProperty("size")) {
                            let error = $root.archipelago.proto.wire.game.Coordinate.verify(message.size);
                            if (error)
                                return "size." + error;
                        }
                        if (message.player1 != null && message.hasOwnProperty("player1")) {
                            let error = $root.archipelago.proto.wire.game.Player.verify(message.player1);
                            if (error)
                                return "player1." + error;
                        }
                        if (message.player2 != null && message.hasOwnProperty("player2")) {
                            let error = $root.archipelago.proto.wire.game.Player.verify(message.player2);
                            if (error)
                                return "player2." + error;
                        }
                        if (message.playerNeutral != null && message.hasOwnProperty("playerNeutral")) {
                            let error = $root.archipelago.proto.wire.game.Player.verify(message.playerNeutral);
                            if (error)
                                return "playerNeutral." + error;
                        }
                        if (message.islands != null && message.hasOwnProperty("islands")) {
                            if (!Array.isArray(message.islands))
                                return "islands: array expected";
                            for (let i = 0; i < message.islands.length; ++i) {
                                let error = $root.archipelago.proto.wire.game.Island.verify(message.islands[i]);
                                if (error)
                                    return "islands." + error;
                            }
                        }
                        if (message.airplanes != null && message.hasOwnProperty("airplanes")) {
                            if (!Array.isArray(message.airplanes))
                                return "airplanes: array expected";
                            for (let i = 0; i < message.airplanes.length; ++i) {
                                let error = $root.archipelago.proto.wire.game.Airplane.verify(message.airplanes[i]);
                                if (error)
                                    return "airplanes." + error;
                            }
                        }
                        return null;
                    };

                    /**
                     * Creates a Game message from a plain object. Also converts values to their respective internal types.
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Game} Game
                     */
                    Game.fromObject = function fromObject(object) {
                        if (object instanceof $root.archipelago.proto.wire.game.Game)
                            return object;
                        let message = new $root.archipelago.proto.wire.game.Game();
                        if (object.id != null)
                            message.id = String(object.id);
                        if (object.size != null) {
                            if (typeof object.size !== "object")
                                throw TypeError(".archipelago.proto.wire.game.Game.size: object expected");
                            message.size = $root.archipelago.proto.wire.game.Coordinate.fromObject(object.size);
                        }
                        if (object.player1 != null) {
                            if (typeof object.player1 !== "object")
                                throw TypeError(".archipelago.proto.wire.game.Game.player1: object expected");
                            message.player1 = $root.archipelago.proto.wire.game.Player.fromObject(object.player1);
                        }
                        if (object.player2 != null) {
                            if (typeof object.player2 !== "object")
                                throw TypeError(".archipelago.proto.wire.game.Game.player2: object expected");
                            message.player2 = $root.archipelago.proto.wire.game.Player.fromObject(object.player2);
                        }
                        if (object.playerNeutral != null) {
                            if (typeof object.playerNeutral !== "object")
                                throw TypeError(".archipelago.proto.wire.game.Game.playerNeutral: object expected");
                            message.playerNeutral = $root.archipelago.proto.wire.game.Player.fromObject(object.playerNeutral);
                        }
                        if (object.islands) {
                            if (!Array.isArray(object.islands))
                                throw TypeError(".archipelago.proto.wire.game.Game.islands: array expected");
                            message.islands = [];
                            for (let i = 0; i < object.islands.length; ++i) {
                                if (typeof object.islands[i] !== "object")
                                    throw TypeError(".archipelago.proto.wire.game.Game.islands: object expected");
                                message.islands[i] = $root.archipelago.proto.wire.game.Island.fromObject(object.islands[i]);
                            }
                        }
                        if (object.airplanes) {
                            if (!Array.isArray(object.airplanes))
                                throw TypeError(".archipelago.proto.wire.game.Game.airplanes: array expected");
                            message.airplanes = [];
                            for (let i = 0; i < object.airplanes.length; ++i) {
                                if (typeof object.airplanes[i] !== "object")
                                    throw TypeError(".archipelago.proto.wire.game.Game.airplanes: object expected");
                                message.airplanes[i] = $root.archipelago.proto.wire.game.Airplane.fromObject(object.airplanes[i]);
                            }
                        }
                        return message;
                    };

                    /**
                     * Creates a Game message from a plain object. Also converts values to their respective internal types.
                     * This is an alias of {@link archipelago.proto.wire.game.Game.fromObject}.
                     * @function
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Game} Game
                     */
                    Game.from = Game.fromObject;

                    /**
                     * Creates a plain object from a Game message. Also converts values to other types if specified.
                     * @param {archipelago.proto.wire.game.Game} message Game
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Game.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.arrays || options.defaults) {
                            object.islands = [];
                            object.airplanes = [];
                        }
                        if (options.defaults) {
                            object.id = "";
                            object.size = null;
                            object.player1 = null;
                            object.player2 = null;
                            object.playerNeutral = null;
                        }
                        if (message.id != null && message.hasOwnProperty("id"))
                            object.id = message.id;
                        if (message.size != null && message.hasOwnProperty("size"))
                            object.size = $root.archipelago.proto.wire.game.Coordinate.toObject(message.size, options);
                        if (message.player1 != null && message.hasOwnProperty("player1"))
                            object.player1 = $root.archipelago.proto.wire.game.Player.toObject(message.player1, options);
                        if (message.player2 != null && message.hasOwnProperty("player2"))
                            object.player2 = $root.archipelago.proto.wire.game.Player.toObject(message.player2, options);
                        if (message.playerNeutral != null && message.hasOwnProperty("playerNeutral"))
                            object.playerNeutral = $root.archipelago.proto.wire.game.Player.toObject(message.playerNeutral, options);
                        if (message.islands && message.islands.length) {
                            object.islands = [];
                            for (let j = 0; j < message.islands.length; ++j)
                                object.islands[j] = $root.archipelago.proto.wire.game.Island.toObject(message.islands[j], options);
                        }
                        if (message.airplanes && message.airplanes.length) {
                            object.airplanes = [];
                            for (let j = 0; j < message.airplanes.length; ++j)
                                object.airplanes[j] = $root.archipelago.proto.wire.game.Airplane.toObject(message.airplanes[j], options);
                        }
                        return object;
                    };

                    /**
                     * Creates a plain object from this Game message. Also converts values to other types if specified.
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Game.prototype.toObject = function toObject(options) {
                        return this.constructor.toObject(this, options);
                    };

                    /**
                     * Converts this Game to JSON.
                     * @returns {Object.<string,*>} JSON object
                     */
                    Game.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Game;
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
