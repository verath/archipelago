/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
import * as $protobuf from "protobufjs";

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

    wire.ActionEnvelope = (function() {

        /**
         * Properties of an ActionEnvelope.
         * @typedef wire.ActionEnvelope$Properties
         * @type {Object}
         * @property {wire.ActionGameLeave$Properties} [actionGameLeave] ActionEnvelope actionGameLeave.
         * @property {wire.ActionGameLaunch$Properties} [actionGameLaunch] ActionEnvelope actionGameLaunch.
         */

        /**
         * Constructs a new ActionEnvelope.
         * @exports wire.ActionEnvelope
         * @constructor
         * @param {wire.ActionEnvelope$Properties=} [properties] Properties to set
         */
        function ActionEnvelope(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ActionEnvelope actionGameLeave.
         * @type {(wire.ActionGameLeave$Properties|null)}
         */
        ActionEnvelope.prototype.actionGameLeave = null;

        /**
         * ActionEnvelope actionGameLaunch.
         * @type {(wire.ActionGameLaunch$Properties|null)}
         */
        ActionEnvelope.prototype.actionGameLaunch = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * ActionEnvelope action.
         * @name wire.ActionEnvelope#action
         * @type {string|undefined}
         */
        Object.defineProperty(ActionEnvelope.prototype, "action", {
            get: $util.oneOfGetter($oneOfFields = ["actionGameLeave", "actionGameLaunch"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ActionEnvelope instance using the specified properties.
         * @param {wire.ActionEnvelope$Properties=} [properties] Properties to set
         * @returns {wire.ActionEnvelope} ActionEnvelope instance
         */
        ActionEnvelope.create = function create(properties) {
            return new ActionEnvelope(properties);
        };

        /**
         * Encodes the specified ActionEnvelope message. Does not implicitly {@link wire.ActionEnvelope.verify|verify} messages.
         * @param {wire.ActionEnvelope$Properties} message ActionEnvelope message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ActionEnvelope.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.actionGameLeave != null && message.hasOwnProperty("actionGameLeave"))
                $root.wire.ActionGameLeave.encode(message.actionGameLeave, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.actionGameLaunch != null && message.hasOwnProperty("actionGameLaunch"))
                $root.wire.ActionGameLaunch.encode(message.actionGameLaunch, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ActionEnvelope message, length delimited. Does not implicitly {@link wire.ActionEnvelope.verify|verify} messages.
         * @param {wire.ActionEnvelope$Properties} message ActionEnvelope message or plain object to encode
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
         * @returns {wire.ActionEnvelope} ActionEnvelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ActionEnvelope.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.ActionEnvelope();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.actionGameLeave = $root.wire.ActionGameLeave.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.actionGameLaunch = $root.wire.ActionGameLaunch.decode(reader, reader.uint32());
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
         * @returns {wire.ActionEnvelope} ActionEnvelope
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
                let error = $root.wire.ActionGameLeave.verify(message.actionGameLeave);
                if (error)
                    return "actionGameLeave." + error;
            }
            if (message.actionGameLaunch != null && message.hasOwnProperty("actionGameLaunch")) {
                if (properties.action === 1)
                    return "action: multiple values";
                properties.action = 1;
                let error = $root.wire.ActionGameLaunch.verify(message.actionGameLaunch);
                if (error)
                    return "actionGameLaunch." + error;
            }
            return null;
        };

        /**
         * Creates an ActionEnvelope message from a plain object. Also converts values to their respective internal types.
         * @param {Object.<string,*>} object Plain object
         * @returns {wire.ActionEnvelope} ActionEnvelope
         */
        ActionEnvelope.fromObject = function fromObject(object) {
            if (object instanceof $root.wire.ActionEnvelope)
                return object;
            let message = new $root.wire.ActionEnvelope();
            if (object.actionGameLeave != null) {
                if (typeof object.actionGameLeave !== "object")
                    throw TypeError(".wire.ActionEnvelope.actionGameLeave: object expected");
                message.actionGameLeave = $root.wire.ActionGameLeave.fromObject(object.actionGameLeave);
            }
            if (object.actionGameLaunch != null) {
                if (typeof object.actionGameLaunch !== "object")
                    throw TypeError(".wire.ActionEnvelope.actionGameLaunch: object expected");
                message.actionGameLaunch = $root.wire.ActionGameLaunch.fromObject(object.actionGameLaunch);
            }
            return message;
        };

        /**
         * Creates an ActionEnvelope message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link wire.ActionEnvelope.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {wire.ActionEnvelope} ActionEnvelope
         */
        ActionEnvelope.from = ActionEnvelope.fromObject;

        /**
         * Creates a plain object from an ActionEnvelope message. Also converts values to other types if specified.
         * @param {wire.ActionEnvelope} message ActionEnvelope
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ActionEnvelope.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.actionGameLeave != null && message.hasOwnProperty("actionGameLeave")) {
                object.actionGameLeave = $root.wire.ActionGameLeave.toObject(message.actionGameLeave, options);
                if (options.oneofs)
                    object.action = "actionGameLeave";
            }
            if (message.actionGameLaunch != null && message.hasOwnProperty("actionGameLaunch")) {
                object.actionGameLaunch = $root.wire.ActionGameLaunch.toObject(message.actionGameLaunch, options);
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
         * @typedef wire.ActionGameLeave$Properties
         * @type {Object}
         */

        /**
         * Constructs a new ActionGameLeave.
         * @exports wire.ActionGameLeave
         * @constructor
         * @param {wire.ActionGameLeave$Properties=} [properties] Properties to set
         */
        function ActionGameLeave(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new ActionGameLeave instance using the specified properties.
         * @param {wire.ActionGameLeave$Properties=} [properties] Properties to set
         * @returns {wire.ActionGameLeave} ActionGameLeave instance
         */
        ActionGameLeave.create = function create(properties) {
            return new ActionGameLeave(properties);
        };

        /**
         * Encodes the specified ActionGameLeave message. Does not implicitly {@link wire.ActionGameLeave.verify|verify} messages.
         * @param {wire.ActionGameLeave$Properties} message ActionGameLeave message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ActionGameLeave.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified ActionGameLeave message, length delimited. Does not implicitly {@link wire.ActionGameLeave.verify|verify} messages.
         * @param {wire.ActionGameLeave$Properties} message ActionGameLeave message or plain object to encode
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
         * @returns {wire.ActionGameLeave} ActionGameLeave
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ActionGameLeave.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.ActionGameLeave();
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
         * @returns {wire.ActionGameLeave} ActionGameLeave
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
         * @returns {wire.ActionGameLeave} ActionGameLeave
         */
        ActionGameLeave.fromObject = function fromObject(object) {
            if (object instanceof $root.wire.ActionGameLeave)
                return object;
            return new $root.wire.ActionGameLeave();
        };

        /**
         * Creates an ActionGameLeave message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link wire.ActionGameLeave.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {wire.ActionGameLeave} ActionGameLeave
         */
        ActionGameLeave.from = ActionGameLeave.fromObject;

        /**
         * Creates a plain object from an ActionGameLeave message. Also converts values to other types if specified.
         * @param {wire.ActionGameLeave} message ActionGameLeave
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
         * @typedef wire.ActionGameLaunch$Properties
         * @type {Object}
         * @property {string} [fromId] ActionGameLaunch fromId.
         * @property {string} [toId] ActionGameLaunch toId.
         */

        /**
         * Constructs a new ActionGameLaunch.
         * @exports wire.ActionGameLaunch
         * @constructor
         * @param {wire.ActionGameLaunch$Properties=} [properties] Properties to set
         */
        function ActionGameLaunch(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ActionGameLaunch fromId.
         * @type {string}
         */
        ActionGameLaunch.prototype.fromId = "";

        /**
         * ActionGameLaunch toId.
         * @type {string}
         */
        ActionGameLaunch.prototype.toId = "";

        /**
         * Creates a new ActionGameLaunch instance using the specified properties.
         * @param {wire.ActionGameLaunch$Properties=} [properties] Properties to set
         * @returns {wire.ActionGameLaunch} ActionGameLaunch instance
         */
        ActionGameLaunch.create = function create(properties) {
            return new ActionGameLaunch(properties);
        };

        /**
         * Encodes the specified ActionGameLaunch message. Does not implicitly {@link wire.ActionGameLaunch.verify|verify} messages.
         * @param {wire.ActionGameLaunch$Properties} message ActionGameLaunch message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ActionGameLaunch.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.fromId != null && message.hasOwnProperty("fromId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.fromId);
            if (message.toId != null && message.hasOwnProperty("toId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.toId);
            return writer;
        };

        /**
         * Encodes the specified ActionGameLaunch message, length delimited. Does not implicitly {@link wire.ActionGameLaunch.verify|verify} messages.
         * @param {wire.ActionGameLaunch$Properties} message ActionGameLaunch message or plain object to encode
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
         * @returns {wire.ActionGameLaunch} ActionGameLaunch
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ActionGameLaunch.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.ActionGameLaunch();
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
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wire.ActionGameLaunch} ActionGameLaunch
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
         * @param {Object.<string,*>} object Plain object
         * @returns {wire.ActionGameLaunch} ActionGameLaunch
         */
        ActionGameLaunch.fromObject = function fromObject(object) {
            if (object instanceof $root.wire.ActionGameLaunch)
                return object;
            let message = new $root.wire.ActionGameLaunch();
            if (object.fromId != null)
                message.fromId = String(object.fromId);
            if (object.toId != null)
                message.toId = String(object.toId);
            return message;
        };

        /**
         * Creates an ActionGameLaunch message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link wire.ActionGameLaunch.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {wire.ActionGameLaunch} ActionGameLaunch
         */
        ActionGameLaunch.from = ActionGameLaunch.fromObject;

        /**
         * Creates a plain object from an ActionGameLaunch message. Also converts values to other types if specified.
         * @param {wire.ActionGameLaunch} message ActionGameLaunch
         * @param {$protobuf.ConversionOptions} [options] Conversion options
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
         * @typedef wire.EventEnvelope$Properties
         * @type {Object}
         * @property {wire.EventGameStart$Properties} [eventGameStart] EventEnvelope eventGameStart.
         * @property {wire.EventGameOver$Properties} [eventGameOver] EventEnvelope eventGameOver.
         * @property {wire.EventGameTick$Properties} [eventGameTick] EventEnvelope eventGameTick.
         */

        /**
         * Constructs a new EventEnvelope.
         * @exports wire.EventEnvelope
         * @constructor
         * @param {wire.EventEnvelope$Properties=} [properties] Properties to set
         */
        function EventEnvelope(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EventEnvelope eventGameStart.
         * @type {(wire.EventGameStart$Properties|null)}
         */
        EventEnvelope.prototype.eventGameStart = null;

        /**
         * EventEnvelope eventGameOver.
         * @type {(wire.EventGameOver$Properties|null)}
         */
        EventEnvelope.prototype.eventGameOver = null;

        /**
         * EventEnvelope eventGameTick.
         * @type {(wire.EventGameTick$Properties|null)}
         */
        EventEnvelope.prototype.eventGameTick = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * EventEnvelope event.
         * @name wire.EventEnvelope#event
         * @type {string|undefined}
         */
        Object.defineProperty(EventEnvelope.prototype, "event", {
            get: $util.oneOfGetter($oneOfFields = ["eventGameStart", "eventGameOver", "eventGameTick"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new EventEnvelope instance using the specified properties.
         * @param {wire.EventEnvelope$Properties=} [properties] Properties to set
         * @returns {wire.EventEnvelope} EventEnvelope instance
         */
        EventEnvelope.create = function create(properties) {
            return new EventEnvelope(properties);
        };

        /**
         * Encodes the specified EventEnvelope message. Does not implicitly {@link wire.EventEnvelope.verify|verify} messages.
         * @param {wire.EventEnvelope$Properties} message EventEnvelope message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EventEnvelope.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.eventGameStart != null && message.hasOwnProperty("eventGameStart"))
                $root.wire.EventGameStart.encode(message.eventGameStart, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.eventGameOver != null && message.hasOwnProperty("eventGameOver"))
                $root.wire.EventGameOver.encode(message.eventGameOver, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.eventGameTick != null && message.hasOwnProperty("eventGameTick"))
                $root.wire.EventGameTick.encode(message.eventGameTick, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified EventEnvelope message, length delimited. Does not implicitly {@link wire.EventEnvelope.verify|verify} messages.
         * @param {wire.EventEnvelope$Properties} message EventEnvelope message or plain object to encode
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
         * @returns {wire.EventEnvelope} EventEnvelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EventEnvelope.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.EventEnvelope();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.eventGameStart = $root.wire.EventGameStart.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.eventGameOver = $root.wire.EventGameOver.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.eventGameTick = $root.wire.EventGameTick.decode(reader, reader.uint32());
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
         * @returns {wire.EventEnvelope} EventEnvelope
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
                let error = $root.wire.EventGameStart.verify(message.eventGameStart);
                if (error)
                    return "eventGameStart." + error;
            }
            if (message.eventGameOver != null && message.hasOwnProperty("eventGameOver")) {
                if (properties.event === 1)
                    return "event: multiple values";
                properties.event = 1;
                let error = $root.wire.EventGameOver.verify(message.eventGameOver);
                if (error)
                    return "eventGameOver." + error;
            }
            if (message.eventGameTick != null && message.hasOwnProperty("eventGameTick")) {
                if (properties.event === 1)
                    return "event: multiple values";
                properties.event = 1;
                let error = $root.wire.EventGameTick.verify(message.eventGameTick);
                if (error)
                    return "eventGameTick." + error;
            }
            return null;
        };

        /**
         * Creates an EventEnvelope message from a plain object. Also converts values to their respective internal types.
         * @param {Object.<string,*>} object Plain object
         * @returns {wire.EventEnvelope} EventEnvelope
         */
        EventEnvelope.fromObject = function fromObject(object) {
            if (object instanceof $root.wire.EventEnvelope)
                return object;
            let message = new $root.wire.EventEnvelope();
            if (object.eventGameStart != null) {
                if (typeof object.eventGameStart !== "object")
                    throw TypeError(".wire.EventEnvelope.eventGameStart: object expected");
                message.eventGameStart = $root.wire.EventGameStart.fromObject(object.eventGameStart);
            }
            if (object.eventGameOver != null) {
                if (typeof object.eventGameOver !== "object")
                    throw TypeError(".wire.EventEnvelope.eventGameOver: object expected");
                message.eventGameOver = $root.wire.EventGameOver.fromObject(object.eventGameOver);
            }
            if (object.eventGameTick != null) {
                if (typeof object.eventGameTick !== "object")
                    throw TypeError(".wire.EventEnvelope.eventGameTick: object expected");
                message.eventGameTick = $root.wire.EventGameTick.fromObject(object.eventGameTick);
            }
            return message;
        };

        /**
         * Creates an EventEnvelope message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link wire.EventEnvelope.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {wire.EventEnvelope} EventEnvelope
         */
        EventEnvelope.from = EventEnvelope.fromObject;

        /**
         * Creates a plain object from an EventEnvelope message. Also converts values to other types if specified.
         * @param {wire.EventEnvelope} message EventEnvelope
         * @param {$protobuf.ConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EventEnvelope.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.eventGameStart != null && message.hasOwnProperty("eventGameStart")) {
                object.eventGameStart = $root.wire.EventGameStart.toObject(message.eventGameStart, options);
                if (options.oneofs)
                    object.event = "eventGameStart";
            }
            if (message.eventGameOver != null && message.hasOwnProperty("eventGameOver")) {
                object.eventGameOver = $root.wire.EventGameOver.toObject(message.eventGameOver, options);
                if (options.oneofs)
                    object.event = "eventGameOver";
            }
            if (message.eventGameTick != null && message.hasOwnProperty("eventGameTick")) {
                object.eventGameTick = $root.wire.EventGameTick.toObject(message.eventGameTick, options);
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
         * @typedef wire.EventGameStart$Properties
         * @type {Object}
         * @property {string} [playerId] EventGameStart playerId.
         */

        /**
         * Constructs a new EventGameStart.
         * @exports wire.EventGameStart
         * @constructor
         * @param {wire.EventGameStart$Properties=} [properties] Properties to set
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
         * @param {wire.EventGameStart$Properties=} [properties] Properties to set
         * @returns {wire.EventGameStart} EventGameStart instance
         */
        EventGameStart.create = function create(properties) {
            return new EventGameStart(properties);
        };

        /**
         * Encodes the specified EventGameStart message. Does not implicitly {@link wire.EventGameStart.verify|verify} messages.
         * @param {wire.EventGameStart$Properties} message EventGameStart message or plain object to encode
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
         * Encodes the specified EventGameStart message, length delimited. Does not implicitly {@link wire.EventGameStart.verify|verify} messages.
         * @param {wire.EventGameStart$Properties} message EventGameStart message or plain object to encode
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
         * @returns {wire.EventGameStart} EventGameStart
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EventGameStart.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.EventGameStart();
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
         * @returns {wire.EventGameStart} EventGameStart
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
         * @returns {wire.EventGameStart} EventGameStart
         */
        EventGameStart.fromObject = function fromObject(object) {
            if (object instanceof $root.wire.EventGameStart)
                return object;
            let message = new $root.wire.EventGameStart();
            if (object.playerId != null)
                message.playerId = String(object.playerId);
            return message;
        };

        /**
         * Creates an EventGameStart message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link wire.EventGameStart.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {wire.EventGameStart} EventGameStart
         */
        EventGameStart.from = EventGameStart.fromObject;

        /**
         * Creates a plain object from an EventGameStart message. Also converts values to other types if specified.
         * @param {wire.EventGameStart} message EventGameStart
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
         * @typedef wire.EventGameOver$Properties
         * @type {Object}
         * @property {string} [winnerId] EventGameOver winnerId.
         */

        /**
         * Constructs a new EventGameOver.
         * @exports wire.EventGameOver
         * @constructor
         * @param {wire.EventGameOver$Properties=} [properties] Properties to set
         */
        function EventGameOver(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EventGameOver winnerId.
         * @type {string}
         */
        EventGameOver.prototype.winnerId = "";

        /**
         * Creates a new EventGameOver instance using the specified properties.
         * @param {wire.EventGameOver$Properties=} [properties] Properties to set
         * @returns {wire.EventGameOver} EventGameOver instance
         */
        EventGameOver.create = function create(properties) {
            return new EventGameOver(properties);
        };

        /**
         * Encodes the specified EventGameOver message. Does not implicitly {@link wire.EventGameOver.verify|verify} messages.
         * @param {wire.EventGameOver$Properties} message EventGameOver message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EventGameOver.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.winnerId != null && message.hasOwnProperty("winnerId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.winnerId);
            return writer;
        };

        /**
         * Encodes the specified EventGameOver message, length delimited. Does not implicitly {@link wire.EventGameOver.verify|verify} messages.
         * @param {wire.EventGameOver$Properties} message EventGameOver message or plain object to encode
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
         * @returns {wire.EventGameOver} EventGameOver
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EventGameOver.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.EventGameOver();
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
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {wire.EventGameOver} EventGameOver
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
            if (message.winnerId != null && message.hasOwnProperty("winnerId"))
                if (!$util.isString(message.winnerId))
                    return "winnerId: string expected";
            return null;
        };

        /**
         * Creates an EventGameOver message from a plain object. Also converts values to their respective internal types.
         * @param {Object.<string,*>} object Plain object
         * @returns {wire.EventGameOver} EventGameOver
         */
        EventGameOver.fromObject = function fromObject(object) {
            if (object instanceof $root.wire.EventGameOver)
                return object;
            let message = new $root.wire.EventGameOver();
            if (object.winnerId != null)
                message.winnerId = String(object.winnerId);
            return message;
        };

        /**
         * Creates an EventGameOver message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link wire.EventGameOver.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {wire.EventGameOver} EventGameOver
         */
        EventGameOver.from = EventGameOver.fromObject;

        /**
         * Creates a plain object from an EventGameOver message. Also converts values to other types if specified.
         * @param {wire.EventGameOver} message EventGameOver
         * @param {$protobuf.ConversionOptions} [options] Conversion options
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
         * @typedef wire.EventGameTick$Properties
         * @type {Object}
         * @property {wire.game.Game$Properties} [game] EventGameTick game.
         */

        /**
         * Constructs a new EventGameTick.
         * @exports wire.EventGameTick
         * @constructor
         * @param {wire.EventGameTick$Properties=} [properties] Properties to set
         */
        function EventGameTick(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EventGameTick game.
         * @type {(wire.game.Game$Properties|null)}
         */
        EventGameTick.prototype.game = null;

        /**
         * Creates a new EventGameTick instance using the specified properties.
         * @param {wire.EventGameTick$Properties=} [properties] Properties to set
         * @returns {wire.EventGameTick} EventGameTick instance
         */
        EventGameTick.create = function create(properties) {
            return new EventGameTick(properties);
        };

        /**
         * Encodes the specified EventGameTick message. Does not implicitly {@link wire.EventGameTick.verify|verify} messages.
         * @param {wire.EventGameTick$Properties} message EventGameTick message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EventGameTick.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.game != null && message.hasOwnProperty("game"))
                $root.wire.game.Game.encode(message.game, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified EventGameTick message, length delimited. Does not implicitly {@link wire.EventGameTick.verify|verify} messages.
         * @param {wire.EventGameTick$Properties} message EventGameTick message or plain object to encode
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
         * @returns {wire.EventGameTick} EventGameTick
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EventGameTick.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.EventGameTick();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.game = $root.wire.game.Game.decode(reader, reader.uint32());
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
         * @returns {wire.EventGameTick} EventGameTick
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
                let error = $root.wire.game.Game.verify(message.game);
                if (error)
                    return "game." + error;
            }
            return null;
        };

        /**
         * Creates an EventGameTick message from a plain object. Also converts values to their respective internal types.
         * @param {Object.<string,*>} object Plain object
         * @returns {wire.EventGameTick} EventGameTick
         */
        EventGameTick.fromObject = function fromObject(object) {
            if (object instanceof $root.wire.EventGameTick)
                return object;
            let message = new $root.wire.EventGameTick();
            if (object.game != null) {
                if (typeof object.game !== "object")
                    throw TypeError(".wire.EventGameTick.game: object expected");
                message.game = $root.wire.game.Game.fromObject(object.game);
            }
            return message;
        };

        /**
         * Creates an EventGameTick message from a plain object. Also converts values to their respective internal types.
         * This is an alias of {@link wire.EventGameTick.fromObject}.
         * @function
         * @param {Object.<string,*>} object Plain object
         * @returns {wire.EventGameTick} EventGameTick
         */
        EventGameTick.from = EventGameTick.fromObject;

        /**
         * Creates a plain object from an EventGameTick message. Also converts values to other types if specified.
         * @param {wire.EventGameTick} message EventGameTick
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
                object.game = $root.wire.game.Game.toObject(message.game, options);
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
         * @exports wire.game
         * @namespace
         */
        const game = {};

        game.Coordinate = (function() {

            /**
             * Properties of a Coordinate.
             * @typedef wire.game.Coordinate$Properties
             * @type {Object}
             * @property {number|Long} [x] Coordinate x.
             * @property {number|Long} [y] Coordinate y.
             */

            /**
             * Constructs a new Coordinate.
             * @exports wire.game.Coordinate
             * @constructor
             * @param {wire.game.Coordinate$Properties=} [properties] Properties to set
             */
            function Coordinate(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Coordinate x.
             * @type {number|Long}
             */
            Coordinate.prototype.x = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Coordinate y.
             * @type {number|Long}
             */
            Coordinate.prototype.y = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new Coordinate instance using the specified properties.
             * @param {wire.game.Coordinate$Properties=} [properties] Properties to set
             * @returns {wire.game.Coordinate} Coordinate instance
             */
            Coordinate.create = function create(properties) {
                return new Coordinate(properties);
            };

            /**
             * Encodes the specified Coordinate message. Does not implicitly {@link wire.game.Coordinate.verify|verify} messages.
             * @param {wire.game.Coordinate$Properties} message Coordinate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Coordinate.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.x != null && message.hasOwnProperty("x"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.x);
                if (message.y != null && message.hasOwnProperty("y"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int64(message.y);
                return writer;
            };

            /**
             * Encodes the specified Coordinate message, length delimited. Does not implicitly {@link wire.game.Coordinate.verify|verify} messages.
             * @param {wire.game.Coordinate$Properties} message Coordinate message or plain object to encode
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
             * @returns {wire.game.Coordinate} Coordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Coordinate.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.game.Coordinate();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.x = reader.int64();
                        break;
                    case 2:
                        message.y = reader.int64();
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
             * @returns {wire.game.Coordinate} Coordinate
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
                    if (!$util.isInteger(message.x) && !(message.x && $util.isInteger(message.x.low) && $util.isInteger(message.x.high)))
                        return "x: integer|Long expected";
                if (message.y != null && message.hasOwnProperty("y"))
                    if (!$util.isInteger(message.y) && !(message.y && $util.isInteger(message.y.low) && $util.isInteger(message.y.high)))
                        return "y: integer|Long expected";
                return null;
            };

            /**
             * Creates a Coordinate message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.game.Coordinate} Coordinate
             */
            Coordinate.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.game.Coordinate)
                    return object;
                let message = new $root.wire.game.Coordinate();
                if (object.x != null)
                    if ($util.Long)
                        (message.x = $util.Long.fromValue(object.x)).unsigned = false;
                    else if (typeof object.x === "string")
                        message.x = parseInt(object.x, 10);
                    else if (typeof object.x === "number")
                        message.x = object.x;
                    else if (typeof object.x === "object")
                        message.x = new $util.LongBits(object.x.low >>> 0, object.x.high >>> 0).toNumber();
                if (object.y != null)
                    if ($util.Long)
                        (message.y = $util.Long.fromValue(object.y)).unsigned = false;
                    else if (typeof object.y === "string")
                        message.y = parseInt(object.y, 10);
                    else if (typeof object.y === "number")
                        message.y = object.y;
                    else if (typeof object.y === "object")
                        message.y = new $util.LongBits(object.y.low >>> 0, object.y.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a Coordinate message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link wire.game.Coordinate.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.game.Coordinate} Coordinate
             */
            Coordinate.from = Coordinate.fromObject;

            /**
             * Creates a plain object from a Coordinate message. Also converts values to other types if specified.
             * @param {wire.game.Coordinate} message Coordinate
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Coordinate.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.x = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.x = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.y = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.y = options.longs === String ? "0" : 0;
                }
                if (message.x != null && message.hasOwnProperty("x"))
                    if (typeof message.x === "number")
                        object.x = options.longs === String ? String(message.x) : message.x;
                    else
                        object.x = options.longs === String ? $util.Long.prototype.toString.call(message.x) : options.longs === Number ? new $util.LongBits(message.x.low >>> 0, message.x.high >>> 0).toNumber() : message.x;
                if (message.y != null && message.hasOwnProperty("y"))
                    if (typeof message.y === "number")
                        object.y = options.longs === String ? String(message.y) : message.y;
                    else
                        object.y = options.longs === String ? $util.Long.prototype.toString.call(message.y) : options.longs === Number ? new $util.LongBits(message.y.low >>> 0, message.y.high >>> 0).toNumber() : message.y;
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
             * @typedef wire.game.FloatCoordinate$Properties
             * @type {Object}
             * @property {number} [x] FloatCoordinate x.
             * @property {number} [y] FloatCoordinate y.
             */

            /**
             * Constructs a new FloatCoordinate.
             * @exports wire.game.FloatCoordinate
             * @constructor
             * @param {wire.game.FloatCoordinate$Properties=} [properties] Properties to set
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
             * @param {wire.game.FloatCoordinate$Properties=} [properties] Properties to set
             * @returns {wire.game.FloatCoordinate} FloatCoordinate instance
             */
            FloatCoordinate.create = function create(properties) {
                return new FloatCoordinate(properties);
            };

            /**
             * Encodes the specified FloatCoordinate message. Does not implicitly {@link wire.game.FloatCoordinate.verify|verify} messages.
             * @param {wire.game.FloatCoordinate$Properties} message FloatCoordinate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FloatCoordinate.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.x != null && message.hasOwnProperty("x"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.x);
                if (message.y != null && message.hasOwnProperty("y"))
                    writer.uint32(/* id 2, wireType 1 =*/17).double(message.y);
                return writer;
            };

            /**
             * Encodes the specified FloatCoordinate message, length delimited. Does not implicitly {@link wire.game.FloatCoordinate.verify|verify} messages.
             * @param {wire.game.FloatCoordinate$Properties} message FloatCoordinate message or plain object to encode
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
             * @returns {wire.game.FloatCoordinate} FloatCoordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FloatCoordinate.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.game.FloatCoordinate();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.x = reader.double();
                        break;
                    case 2:
                        message.y = reader.double();
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
             * @returns {wire.game.FloatCoordinate} FloatCoordinate
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
             * @returns {wire.game.FloatCoordinate} FloatCoordinate
             */
            FloatCoordinate.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.game.FloatCoordinate)
                    return object;
                let message = new $root.wire.game.FloatCoordinate();
                if (object.x != null)
                    message.x = Number(object.x);
                if (object.y != null)
                    message.y = Number(object.y);
                return message;
            };

            /**
             * Creates a FloatCoordinate message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link wire.game.FloatCoordinate.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.game.FloatCoordinate} FloatCoordinate
             */
            FloatCoordinate.from = FloatCoordinate.fromObject;

            /**
             * Creates a plain object from a FloatCoordinate message. Also converts values to other types if specified.
             * @param {wire.game.FloatCoordinate} message FloatCoordinate
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
             * @typedef wire.game.Player$Properties
             * @type {Object}
             * @property {string} [id] Player id.
             */

            /**
             * Constructs a new Player.
             * @exports wire.game.Player
             * @constructor
             * @param {wire.game.Player$Properties=} [properties] Properties to set
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
             * @param {wire.game.Player$Properties=} [properties] Properties to set
             * @returns {wire.game.Player} Player instance
             */
            Player.create = function create(properties) {
                return new Player(properties);
            };

            /**
             * Encodes the specified Player message. Does not implicitly {@link wire.game.Player.verify|verify} messages.
             * @param {wire.game.Player$Properties} message Player message or plain object to encode
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
             * Encodes the specified Player message, length delimited. Does not implicitly {@link wire.game.Player.verify|verify} messages.
             * @param {wire.game.Player$Properties} message Player message or plain object to encode
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
             * @returns {wire.game.Player} Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Player.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.game.Player();
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
             * @returns {wire.game.Player} Player
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
             * @returns {wire.game.Player} Player
             */
            Player.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.game.Player)
                    return object;
                let message = new $root.wire.game.Player();
                if (object.id != null)
                    message.id = String(object.id);
                return message;
            };

            /**
             * Creates a Player message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link wire.game.Player.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.game.Player} Player
             */
            Player.from = Player.fromObject;

            /**
             * Creates a plain object from a Player message. Also converts values to other types if specified.
             * @param {wire.game.Player} message Player
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
             * @typedef wire.game.Army$Properties
             * @type {Object}
             * @property {string} [ownerId] Army ownerId.
             * @property {number|Long} [strength] Army strength.
             */

            /**
             * Constructs a new Army.
             * @exports wire.game.Army
             * @constructor
             * @param {wire.game.Army$Properties=} [properties] Properties to set
             */
            function Army(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Army ownerId.
             * @type {string}
             */
            Army.prototype.ownerId = "";

            /**
             * Army strength.
             * @type {number|Long}
             */
            Army.prototype.strength = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new Army instance using the specified properties.
             * @param {wire.game.Army$Properties=} [properties] Properties to set
             * @returns {wire.game.Army} Army instance
             */
            Army.create = function create(properties) {
                return new Army(properties);
            };

            /**
             * Encodes the specified Army message. Does not implicitly {@link wire.game.Army.verify|verify} messages.
             * @param {wire.game.Army$Properties} message Army message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Army.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.ownerId != null && message.hasOwnProperty("ownerId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.ownerId);
                if (message.strength != null && message.hasOwnProperty("strength"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int64(message.strength);
                return writer;
            };

            /**
             * Encodes the specified Army message, length delimited. Does not implicitly {@link wire.game.Army.verify|verify} messages.
             * @param {wire.game.Army$Properties} message Army message or plain object to encode
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
             * @returns {wire.game.Army} Army
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Army.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.game.Army();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.ownerId = reader.string();
                        break;
                    case 2:
                        message.strength = reader.int64();
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
             * @returns {wire.game.Army} Army
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
                if (message.ownerId != null && message.hasOwnProperty("ownerId"))
                    if (!$util.isString(message.ownerId))
                        return "ownerId: string expected";
                if (message.strength != null && message.hasOwnProperty("strength"))
                    if (!$util.isInteger(message.strength) && !(message.strength && $util.isInteger(message.strength.low) && $util.isInteger(message.strength.high)))
                        return "strength: integer|Long expected";
                return null;
            };

            /**
             * Creates an Army message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.game.Army} Army
             */
            Army.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.game.Army)
                    return object;
                let message = new $root.wire.game.Army();
                if (object.ownerId != null)
                    message.ownerId = String(object.ownerId);
                if (object.strength != null)
                    if ($util.Long)
                        (message.strength = $util.Long.fromValue(object.strength)).unsigned = false;
                    else if (typeof object.strength === "string")
                        message.strength = parseInt(object.strength, 10);
                    else if (typeof object.strength === "number")
                        message.strength = object.strength;
                    else if (typeof object.strength === "object")
                        message.strength = new $util.LongBits(object.strength.low >>> 0, object.strength.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates an Army message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link wire.game.Army.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.game.Army} Army
             */
            Army.from = Army.fromObject;

            /**
             * Creates a plain object from an Army message. Also converts values to other types if specified.
             * @param {wire.game.Army} message Army
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Army.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.ownerId = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.strength = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.strength = options.longs === String ? "0" : 0;
                }
                if (message.ownerId != null && message.hasOwnProperty("ownerId"))
                    object.ownerId = message.ownerId;
                if (message.strength != null && message.hasOwnProperty("strength"))
                    if (typeof message.strength === "number")
                        object.strength = options.longs === String ? String(message.strength) : message.strength;
                    else
                        object.strength = options.longs === String ? $util.Long.prototype.toString.call(message.strength) : options.longs === Number ? new $util.LongBits(message.strength.low >>> 0, message.strength.high >>> 0).toNumber() : message.strength;
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
             * @typedef wire.game.Airplane$Properties
             * @type {Object}
             * @property {string} [id] Airplane id.
             * @property {wire.game.Army$Properties} [army] Airplane army.
             * @property {wire.game.FloatCoordinate$Properties} [position] Airplane position.
             * @property {number} [direction] Airplane direction.
             * @property {number} [speed] Airplane speed.
             */

            /**
             * Constructs a new Airplane.
             * @exports wire.game.Airplane
             * @constructor
             * @param {wire.game.Airplane$Properties=} [properties] Properties to set
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
             * @type {(wire.game.Army$Properties|null)}
             */
            Airplane.prototype.army = null;

            /**
             * Airplane position.
             * @type {(wire.game.FloatCoordinate$Properties|null)}
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
             * @param {wire.game.Airplane$Properties=} [properties] Properties to set
             * @returns {wire.game.Airplane} Airplane instance
             */
            Airplane.create = function create(properties) {
                return new Airplane(properties);
            };

            /**
             * Encodes the specified Airplane message. Does not implicitly {@link wire.game.Airplane.verify|verify} messages.
             * @param {wire.game.Airplane$Properties} message Airplane message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Airplane.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.army != null && message.hasOwnProperty("army"))
                    $root.wire.game.Army.encode(message.army, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.position != null && message.hasOwnProperty("position"))
                    $root.wire.game.FloatCoordinate.encode(message.position, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.direction != null && message.hasOwnProperty("direction"))
                    writer.uint32(/* id 4, wireType 1 =*/33).double(message.direction);
                if (message.speed != null && message.hasOwnProperty("speed"))
                    writer.uint32(/* id 5, wireType 1 =*/41).double(message.speed);
                return writer;
            };

            /**
             * Encodes the specified Airplane message, length delimited. Does not implicitly {@link wire.game.Airplane.verify|verify} messages.
             * @param {wire.game.Airplane$Properties} message Airplane message or plain object to encode
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
             * @returns {wire.game.Airplane} Airplane
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Airplane.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.game.Airplane();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.army = $root.wire.game.Army.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.position = $root.wire.game.FloatCoordinate.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.direction = reader.double();
                        break;
                    case 5:
                        message.speed = reader.double();
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
             * @returns {wire.game.Airplane} Airplane
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
                    let error = $root.wire.game.Army.verify(message.army);
                    if (error)
                        return "army." + error;
                }
                if (message.position != null && message.hasOwnProperty("position")) {
                    let error = $root.wire.game.FloatCoordinate.verify(message.position);
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
             * @returns {wire.game.Airplane} Airplane
             */
            Airplane.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.game.Airplane)
                    return object;
                let message = new $root.wire.game.Airplane();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.army != null) {
                    if (typeof object.army !== "object")
                        throw TypeError(".wire.game.Airplane.army: object expected");
                    message.army = $root.wire.game.Army.fromObject(object.army);
                }
                if (object.position != null) {
                    if (typeof object.position !== "object")
                        throw TypeError(".wire.game.Airplane.position: object expected");
                    message.position = $root.wire.game.FloatCoordinate.fromObject(object.position);
                }
                if (object.direction != null)
                    message.direction = Number(object.direction);
                if (object.speed != null)
                    message.speed = Number(object.speed);
                return message;
            };

            /**
             * Creates an Airplane message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link wire.game.Airplane.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.game.Airplane} Airplane
             */
            Airplane.from = Airplane.fromObject;

            /**
             * Creates a plain object from an Airplane message. Also converts values to other types if specified.
             * @param {wire.game.Airplane} message Airplane
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
                    object.army = $root.wire.game.Army.toObject(message.army, options);
                if (message.position != null && message.hasOwnProperty("position"))
                    object.position = $root.wire.game.FloatCoordinate.toObject(message.position, options);
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
             * @typedef wire.game.Island$Properties
             * @type {Object}
             * @property {string} [id] Island id.
             * @property {wire.game.Army$Properties} [army] Island army.
             * @property {wire.game.Coordinate$Properties} [position] Island position.
             * @property {number} [size] Island size.
             */

            /**
             * Constructs a new Island.
             * @exports wire.game.Island
             * @constructor
             * @param {wire.game.Island$Properties=} [properties] Properties to set
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
             * @type {(wire.game.Army$Properties|null)}
             */
            Island.prototype.army = null;

            /**
             * Island position.
             * @type {(wire.game.Coordinate$Properties|null)}
             */
            Island.prototype.position = null;

            /**
             * Island size.
             * @type {number}
             */
            Island.prototype.size = 0;

            /**
             * Creates a new Island instance using the specified properties.
             * @param {wire.game.Island$Properties=} [properties] Properties to set
             * @returns {wire.game.Island} Island instance
             */
            Island.create = function create(properties) {
                return new Island(properties);
            };

            /**
             * Encodes the specified Island message. Does not implicitly {@link wire.game.Island.verify|verify} messages.
             * @param {wire.game.Island$Properties} message Island message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Island.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.army != null && message.hasOwnProperty("army"))
                    $root.wire.game.Army.encode(message.army, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.position != null && message.hasOwnProperty("position"))
                    $root.wire.game.Coordinate.encode(message.position, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.size != null && message.hasOwnProperty("size"))
                    writer.uint32(/* id 4, wireType 1 =*/33).double(message.size);
                return writer;
            };

            /**
             * Encodes the specified Island message, length delimited. Does not implicitly {@link wire.game.Island.verify|verify} messages.
             * @param {wire.game.Island$Properties} message Island message or plain object to encode
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
             * @returns {wire.game.Island} Island
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Island.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.game.Island();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.army = $root.wire.game.Army.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.position = $root.wire.game.Coordinate.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.size = reader.double();
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
             * @returns {wire.game.Island} Island
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
                    let error = $root.wire.game.Army.verify(message.army);
                    if (error)
                        return "army." + error;
                }
                if (message.position != null && message.hasOwnProperty("position")) {
                    let error = $root.wire.game.Coordinate.verify(message.position);
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
             * @returns {wire.game.Island} Island
             */
            Island.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.game.Island)
                    return object;
                let message = new $root.wire.game.Island();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.army != null) {
                    if (typeof object.army !== "object")
                        throw TypeError(".wire.game.Island.army: object expected");
                    message.army = $root.wire.game.Army.fromObject(object.army);
                }
                if (object.position != null) {
                    if (typeof object.position !== "object")
                        throw TypeError(".wire.game.Island.position: object expected");
                    message.position = $root.wire.game.Coordinate.fromObject(object.position);
                }
                if (object.size != null)
                    message.size = Number(object.size);
                return message;
            };

            /**
             * Creates an Island message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link wire.game.Island.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.game.Island} Island
             */
            Island.from = Island.fromObject;

            /**
             * Creates a plain object from an Island message. Also converts values to other types if specified.
             * @param {wire.game.Island} message Island
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
                    object.army = $root.wire.game.Army.toObject(message.army, options);
                if (message.position != null && message.hasOwnProperty("position"))
                    object.position = $root.wire.game.Coordinate.toObject(message.position, options);
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
             * @typedef wire.game.Game$Properties
             * @type {Object}
             * @property {string} [id] Game id.
             * @property {wire.game.Coordinate$Properties} [size] Game size.
             * @property {wire.game.Player$Properties} [player1] Game player1.
             * @property {wire.game.Player$Properties} [player2] Game player2.
             * @property {wire.game.Player$Properties} [playerNeutral] Game playerNeutral.
             * @property {Array.<wire.game.Island$Properties>} [islands] Game islands.
             * @property {Array.<wire.game.Airplane$Properties>} [airplanes] Game airplanes.
             */

            /**
             * Constructs a new Game.
             * @exports wire.game.Game
             * @constructor
             * @param {wire.game.Game$Properties=} [properties] Properties to set
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
             * @type {(wire.game.Coordinate$Properties|null)}
             */
            Game.prototype.size = null;

            /**
             * Game player1.
             * @type {(wire.game.Player$Properties|null)}
             */
            Game.prototype.player1 = null;

            /**
             * Game player2.
             * @type {(wire.game.Player$Properties|null)}
             */
            Game.prototype.player2 = null;

            /**
             * Game playerNeutral.
             * @type {(wire.game.Player$Properties|null)}
             */
            Game.prototype.playerNeutral = null;

            /**
             * Game islands.
             * @type {Array.<wire.game.Island$Properties>}
             */
            Game.prototype.islands = $util.emptyArray;

            /**
             * Game airplanes.
             * @type {Array.<wire.game.Airplane$Properties>}
             */
            Game.prototype.airplanes = $util.emptyArray;

            /**
             * Creates a new Game instance using the specified properties.
             * @param {wire.game.Game$Properties=} [properties] Properties to set
             * @returns {wire.game.Game} Game instance
             */
            Game.create = function create(properties) {
                return new Game(properties);
            };

            /**
             * Encodes the specified Game message. Does not implicitly {@link wire.game.Game.verify|verify} messages.
             * @param {wire.game.Game$Properties} message Game message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Game.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.size != null && message.hasOwnProperty("size"))
                    $root.wire.game.Coordinate.encode(message.size, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.player1 != null && message.hasOwnProperty("player1"))
                    $root.wire.game.Player.encode(message.player1, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.player2 != null && message.hasOwnProperty("player2"))
                    $root.wire.game.Player.encode(message.player2, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.playerNeutral != null && message.hasOwnProperty("playerNeutral"))
                    $root.wire.game.Player.encode(message.playerNeutral, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.islands != null && message.islands.length)
                    for (let i = 0; i < message.islands.length; ++i)
                        $root.wire.game.Island.encode(message.islands[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.airplanes != null && message.airplanes.length)
                    for (let i = 0; i < message.airplanes.length; ++i)
                        $root.wire.game.Airplane.encode(message.airplanes[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Game message, length delimited. Does not implicitly {@link wire.game.Game.verify|verify} messages.
             * @param {wire.game.Game$Properties} message Game message or plain object to encode
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
             * @returns {wire.game.Game} Game
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Game.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.wire.game.Game();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.size = $root.wire.game.Coordinate.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.player1 = $root.wire.game.Player.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.player2 = $root.wire.game.Player.decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.playerNeutral = $root.wire.game.Player.decode(reader, reader.uint32());
                        break;
                    case 6:
                        if (!(message.islands && message.islands.length))
                            message.islands = [];
                        message.islands.push($root.wire.game.Island.decode(reader, reader.uint32()));
                        break;
                    case 7:
                        if (!(message.airplanes && message.airplanes.length))
                            message.airplanes = [];
                        message.airplanes.push($root.wire.game.Airplane.decode(reader, reader.uint32()));
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
             * @returns {wire.game.Game} Game
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
                    let error = $root.wire.game.Coordinate.verify(message.size);
                    if (error)
                        return "size." + error;
                }
                if (message.player1 != null && message.hasOwnProperty("player1")) {
                    let error = $root.wire.game.Player.verify(message.player1);
                    if (error)
                        return "player1." + error;
                }
                if (message.player2 != null && message.hasOwnProperty("player2")) {
                    let error = $root.wire.game.Player.verify(message.player2);
                    if (error)
                        return "player2." + error;
                }
                if (message.playerNeutral != null && message.hasOwnProperty("playerNeutral")) {
                    let error = $root.wire.game.Player.verify(message.playerNeutral);
                    if (error)
                        return "playerNeutral." + error;
                }
                if (message.islands != null && message.hasOwnProperty("islands")) {
                    if (!Array.isArray(message.islands))
                        return "islands: array expected";
                    for (let i = 0; i < message.islands.length; ++i) {
                        let error = $root.wire.game.Island.verify(message.islands[i]);
                        if (error)
                            return "islands." + error;
                    }
                }
                if (message.airplanes != null && message.hasOwnProperty("airplanes")) {
                    if (!Array.isArray(message.airplanes))
                        return "airplanes: array expected";
                    for (let i = 0; i < message.airplanes.length; ++i) {
                        let error = $root.wire.game.Airplane.verify(message.airplanes[i]);
                        if (error)
                            return "airplanes." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Game message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.game.Game} Game
             */
            Game.fromObject = function fromObject(object) {
                if (object instanceof $root.wire.game.Game)
                    return object;
                let message = new $root.wire.game.Game();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.size != null) {
                    if (typeof object.size !== "object")
                        throw TypeError(".wire.game.Game.size: object expected");
                    message.size = $root.wire.game.Coordinate.fromObject(object.size);
                }
                if (object.player1 != null) {
                    if (typeof object.player1 !== "object")
                        throw TypeError(".wire.game.Game.player1: object expected");
                    message.player1 = $root.wire.game.Player.fromObject(object.player1);
                }
                if (object.player2 != null) {
                    if (typeof object.player2 !== "object")
                        throw TypeError(".wire.game.Game.player2: object expected");
                    message.player2 = $root.wire.game.Player.fromObject(object.player2);
                }
                if (object.playerNeutral != null) {
                    if (typeof object.playerNeutral !== "object")
                        throw TypeError(".wire.game.Game.playerNeutral: object expected");
                    message.playerNeutral = $root.wire.game.Player.fromObject(object.playerNeutral);
                }
                if (object.islands) {
                    if (!Array.isArray(object.islands))
                        throw TypeError(".wire.game.Game.islands: array expected");
                    message.islands = [];
                    for (let i = 0; i < object.islands.length; ++i) {
                        if (typeof object.islands[i] !== "object")
                            throw TypeError(".wire.game.Game.islands: object expected");
                        message.islands[i] = $root.wire.game.Island.fromObject(object.islands[i]);
                    }
                }
                if (object.airplanes) {
                    if (!Array.isArray(object.airplanes))
                        throw TypeError(".wire.game.Game.airplanes: array expected");
                    message.airplanes = [];
                    for (let i = 0; i < object.airplanes.length; ++i) {
                        if (typeof object.airplanes[i] !== "object")
                            throw TypeError(".wire.game.Game.airplanes: object expected");
                        message.airplanes[i] = $root.wire.game.Airplane.fromObject(object.airplanes[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a Game message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link wire.game.Game.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {wire.game.Game} Game
             */
            Game.from = Game.fromObject;

            /**
             * Creates a plain object from a Game message. Also converts values to other types if specified.
             * @param {wire.game.Game} message Game
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
                    object.size = $root.wire.game.Coordinate.toObject(message.size, options);
                if (message.player1 != null && message.hasOwnProperty("player1"))
                    object.player1 = $root.wire.game.Player.toObject(message.player1, options);
                if (message.player2 != null && message.hasOwnProperty("player2"))
                    object.player2 = $root.wire.game.Player.toObject(message.player2, options);
                if (message.playerNeutral != null && message.hasOwnProperty("playerNeutral"))
                    object.playerNeutral = $root.wire.game.Player.toObject(message.playerNeutral, options);
                if (message.islands && message.islands.length) {
                    object.islands = [];
                    for (let j = 0; j < message.islands.length; ++j)
                        object.islands[j] = $root.wire.game.Island.toObject(message.islands[j], options);
                }
                if (message.airplanes && message.airplanes.length) {
                    object.airplanes = [];
                    for (let j = 0; j < message.airplanes.length; ++j)
                        object.airplanes[j] = $root.wire.game.Airplane.toObject(message.airplanes[j], options);
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

export { $root as default };