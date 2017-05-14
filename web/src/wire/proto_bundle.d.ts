import * as $protobuf from "protobufjs";

/**
 * Namespace archipelago.
 * @exports archipelago
 * @namespace
 */
export namespace archipelago {

    /**
     * Namespace proto.
     * @exports archipelago.proto
     * @namespace
     */
    namespace proto {

        /**
         * Namespace wire.
         * @exports archipelago.proto.wire
         * @namespace
         */
        namespace wire {

            type ActionEnvelope$Properties = {
                actionGameLeave?: archipelago.proto.wire.ActionGameLeave$Properties;
                actionGameLaunch?: archipelago.proto.wire.ActionGameLaunch$Properties;
            };

            /**
             * Constructs a new ActionEnvelope.
             * @exports archipelago.proto.wire.ActionEnvelope
             * @constructor
             * @param {archipelago.proto.wire.ActionEnvelope$Properties=} [properties] Properties to set
             */
            class ActionEnvelope {

                /**
                 * Constructs a new ActionEnvelope.
                 * @exports archipelago.proto.wire.ActionEnvelope
                 * @constructor
                 * @param {archipelago.proto.wire.ActionEnvelope$Properties=} [properties] Properties to set
                 */
                constructor(properties?: archipelago.proto.wire.ActionEnvelope$Properties);

                /**
                 * ActionEnvelope actionGameLeave.
                 * @type {(archipelago.proto.wire.ActionGameLeave$Properties|null)}
                 */
                public actionGameLeave: (archipelago.proto.wire.ActionGameLeave$Properties|null);

                /**
                 * ActionEnvelope actionGameLaunch.
                 * @type {(archipelago.proto.wire.ActionGameLaunch$Properties|null)}
                 */
                public actionGameLaunch: (archipelago.proto.wire.ActionGameLaunch$Properties|null);

                /**
                 * ActionEnvelope action.
                 * @name archipelago.proto.wire.ActionEnvelope#action
                 * @type {string|undefined}
                 */
                public action?: string;

                /**
                 * Creates a new ActionEnvelope instance using the specified properties.
                 * @param {archipelago.proto.wire.ActionEnvelope$Properties=} [properties] Properties to set
                 * @returns {archipelago.proto.wire.ActionEnvelope} ActionEnvelope instance
                 */
                public static create(properties?: archipelago.proto.wire.ActionEnvelope$Properties): archipelago.proto.wire.ActionEnvelope;

                /**
                 * Encodes the specified ActionEnvelope message. Does not implicitly {@link archipelago.proto.wire.ActionEnvelope.verify|verify} messages.
                 * @param {archipelago.proto.wire.ActionEnvelope$Properties} message ActionEnvelope message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                public static encode(message: archipelago.proto.wire.ActionEnvelope$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ActionEnvelope message, length delimited. Does not implicitly {@link archipelago.proto.wire.ActionEnvelope.verify|verify} messages.
                 * @param {archipelago.proto.wire.ActionEnvelope$Properties} message ActionEnvelope message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                public static encodeDelimited(message: archipelago.proto.wire.ActionEnvelope$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ActionEnvelope message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {archipelago.proto.wire.ActionEnvelope} ActionEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): archipelago.proto.wire.ActionEnvelope;

                /**
                 * Decodes an ActionEnvelope message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {archipelago.proto.wire.ActionEnvelope} ActionEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): archipelago.proto.wire.ActionEnvelope;

                /**
                 * Verifies an ActionEnvelope message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): string;

                /**
                 * Creates an ActionEnvelope message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.ActionEnvelope} ActionEnvelope
                 */
                public static fromObject(object: { [k: string]: any }): archipelago.proto.wire.ActionEnvelope;

                /**
                 * Creates an ActionEnvelope message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link archipelago.proto.wire.ActionEnvelope.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.ActionEnvelope} ActionEnvelope
                 */
                public static from(object: { [k: string]: any }): archipelago.proto.wire.ActionEnvelope;

                /**
                 * Creates a plain object from an ActionEnvelope message. Also converts values to other types if specified.
                 * @param {archipelago.proto.wire.ActionEnvelope} message ActionEnvelope
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                public static toObject(message: archipelago.proto.wire.ActionEnvelope, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this ActionEnvelope message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this ActionEnvelope to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            type ActionGameLeave$Properties = {};

            /**
             * Constructs a new ActionGameLeave.
             * @exports archipelago.proto.wire.ActionGameLeave
             * @constructor
             * @param {archipelago.proto.wire.ActionGameLeave$Properties=} [properties] Properties to set
             */
            class ActionGameLeave {

                /**
                 * Constructs a new ActionGameLeave.
                 * @exports archipelago.proto.wire.ActionGameLeave
                 * @constructor
                 * @param {archipelago.proto.wire.ActionGameLeave$Properties=} [properties] Properties to set
                 */
                constructor(properties?: archipelago.proto.wire.ActionGameLeave$Properties);

                /**
                 * Creates a new ActionGameLeave instance using the specified properties.
                 * @param {archipelago.proto.wire.ActionGameLeave$Properties=} [properties] Properties to set
                 * @returns {archipelago.proto.wire.ActionGameLeave} ActionGameLeave instance
                 */
                public static create(properties?: archipelago.proto.wire.ActionGameLeave$Properties): archipelago.proto.wire.ActionGameLeave;

                /**
                 * Encodes the specified ActionGameLeave message. Does not implicitly {@link archipelago.proto.wire.ActionGameLeave.verify|verify} messages.
                 * @param {archipelago.proto.wire.ActionGameLeave$Properties} message ActionGameLeave message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                public static encode(message: archipelago.proto.wire.ActionGameLeave$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ActionGameLeave message, length delimited. Does not implicitly {@link archipelago.proto.wire.ActionGameLeave.verify|verify} messages.
                 * @param {archipelago.proto.wire.ActionGameLeave$Properties} message ActionGameLeave message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                public static encodeDelimited(message: archipelago.proto.wire.ActionGameLeave$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ActionGameLeave message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {archipelago.proto.wire.ActionGameLeave} ActionGameLeave
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): archipelago.proto.wire.ActionGameLeave;

                /**
                 * Decodes an ActionGameLeave message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {archipelago.proto.wire.ActionGameLeave} ActionGameLeave
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): archipelago.proto.wire.ActionGameLeave;

                /**
                 * Verifies an ActionGameLeave message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): string;

                /**
                 * Creates an ActionGameLeave message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.ActionGameLeave} ActionGameLeave
                 */
                public static fromObject(object: { [k: string]: any }): archipelago.proto.wire.ActionGameLeave;

                /**
                 * Creates an ActionGameLeave message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link archipelago.proto.wire.ActionGameLeave.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.ActionGameLeave} ActionGameLeave
                 */
                public static from(object: { [k: string]: any }): archipelago.proto.wire.ActionGameLeave;

                /**
                 * Creates a plain object from an ActionGameLeave message. Also converts values to other types if specified.
                 * @param {archipelago.proto.wire.ActionGameLeave} message ActionGameLeave
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                public static toObject(message: archipelago.proto.wire.ActionGameLeave, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this ActionGameLeave message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this ActionGameLeave to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            type ActionGameLaunch$Properties = {
                islandIdFrom?: string;
                islandIdTo?: string;
            };

            /**
             * Constructs a new ActionGameLaunch.
             * @exports archipelago.proto.wire.ActionGameLaunch
             * @constructor
             * @param {archipelago.proto.wire.ActionGameLaunch$Properties=} [properties] Properties to set
             */
            class ActionGameLaunch {

                /**
                 * Constructs a new ActionGameLaunch.
                 * @exports archipelago.proto.wire.ActionGameLaunch
                 * @constructor
                 * @param {archipelago.proto.wire.ActionGameLaunch$Properties=} [properties] Properties to set
                 */
                constructor(properties?: archipelago.proto.wire.ActionGameLaunch$Properties);

                /**
                 * ActionGameLaunch islandIdFrom.
                 * @type {string}
                 */
                public islandIdFrom: string;

                /**
                 * ActionGameLaunch islandIdTo.
                 * @type {string}
                 */
                public islandIdTo: string;

                /**
                 * Creates a new ActionGameLaunch instance using the specified properties.
                 * @param {archipelago.proto.wire.ActionGameLaunch$Properties=} [properties] Properties to set
                 * @returns {archipelago.proto.wire.ActionGameLaunch} ActionGameLaunch instance
                 */
                public static create(properties?: archipelago.proto.wire.ActionGameLaunch$Properties): archipelago.proto.wire.ActionGameLaunch;

                /**
                 * Encodes the specified ActionGameLaunch message. Does not implicitly {@link archipelago.proto.wire.ActionGameLaunch.verify|verify} messages.
                 * @param {archipelago.proto.wire.ActionGameLaunch$Properties} message ActionGameLaunch message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                public static encode(message: archipelago.proto.wire.ActionGameLaunch$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ActionGameLaunch message, length delimited. Does not implicitly {@link archipelago.proto.wire.ActionGameLaunch.verify|verify} messages.
                 * @param {archipelago.proto.wire.ActionGameLaunch$Properties} message ActionGameLaunch message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                public static encodeDelimited(message: archipelago.proto.wire.ActionGameLaunch$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ActionGameLaunch message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {archipelago.proto.wire.ActionGameLaunch} ActionGameLaunch
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): archipelago.proto.wire.ActionGameLaunch;

                /**
                 * Decodes an ActionGameLaunch message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {archipelago.proto.wire.ActionGameLaunch} ActionGameLaunch
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): archipelago.proto.wire.ActionGameLaunch;

                /**
                 * Verifies an ActionGameLaunch message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): string;

                /**
                 * Creates an ActionGameLaunch message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.ActionGameLaunch} ActionGameLaunch
                 */
                public static fromObject(object: { [k: string]: any }): archipelago.proto.wire.ActionGameLaunch;

                /**
                 * Creates an ActionGameLaunch message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link archipelago.proto.wire.ActionGameLaunch.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.ActionGameLaunch} ActionGameLaunch
                 */
                public static from(object: { [k: string]: any }): archipelago.proto.wire.ActionGameLaunch;

                /**
                 * Creates a plain object from an ActionGameLaunch message. Also converts values to other types if specified.
                 * @param {archipelago.proto.wire.ActionGameLaunch} message ActionGameLaunch
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                public static toObject(message: archipelago.proto.wire.ActionGameLaunch, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this ActionGameLaunch message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this ActionGameLaunch to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            type EventEnvelope$Properties = {
                eventGameStart?: archipelago.proto.wire.EventGameStart$Properties;
                eventGameOver?: archipelago.proto.wire.EventGameOver$Properties;
                eventGameTick?: archipelago.proto.wire.EventGameTick$Properties;
            };

            /**
             * Constructs a new EventEnvelope.
             * @exports archipelago.proto.wire.EventEnvelope
             * @constructor
             * @param {archipelago.proto.wire.EventEnvelope$Properties=} [properties] Properties to set
             */
            class EventEnvelope {

                /**
                 * Constructs a new EventEnvelope.
                 * @exports archipelago.proto.wire.EventEnvelope
                 * @constructor
                 * @param {archipelago.proto.wire.EventEnvelope$Properties=} [properties] Properties to set
                 */
                constructor(properties?: archipelago.proto.wire.EventEnvelope$Properties);

                /**
                 * EventEnvelope eventGameStart.
                 * @type {(archipelago.proto.wire.EventGameStart$Properties|null)}
                 */
                public eventGameStart: (archipelago.proto.wire.EventGameStart$Properties|null);

                /**
                 * EventEnvelope eventGameOver.
                 * @type {(archipelago.proto.wire.EventGameOver$Properties|null)}
                 */
                public eventGameOver: (archipelago.proto.wire.EventGameOver$Properties|null);

                /**
                 * EventEnvelope eventGameTick.
                 * @type {(archipelago.proto.wire.EventGameTick$Properties|null)}
                 */
                public eventGameTick: (archipelago.proto.wire.EventGameTick$Properties|null);

                /**
                 * EventEnvelope event.
                 * @name archipelago.proto.wire.EventEnvelope#event
                 * @type {string|undefined}
                 */
                public event?: string;

                /**
                 * Creates a new EventEnvelope instance using the specified properties.
                 * @param {archipelago.proto.wire.EventEnvelope$Properties=} [properties] Properties to set
                 * @returns {archipelago.proto.wire.EventEnvelope} EventEnvelope instance
                 */
                public static create(properties?: archipelago.proto.wire.EventEnvelope$Properties): archipelago.proto.wire.EventEnvelope;

                /**
                 * Encodes the specified EventEnvelope message. Does not implicitly {@link archipelago.proto.wire.EventEnvelope.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventEnvelope$Properties} message EventEnvelope message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                public static encode(message: archipelago.proto.wire.EventEnvelope$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EventEnvelope message, length delimited. Does not implicitly {@link archipelago.proto.wire.EventEnvelope.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventEnvelope$Properties} message EventEnvelope message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                public static encodeDelimited(message: archipelago.proto.wire.EventEnvelope$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EventEnvelope message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {archipelago.proto.wire.EventEnvelope} EventEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): archipelago.proto.wire.EventEnvelope;

                /**
                 * Decodes an EventEnvelope message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {archipelago.proto.wire.EventEnvelope} EventEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): archipelago.proto.wire.EventEnvelope;

                /**
                 * Verifies an EventEnvelope message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): string;

                /**
                 * Creates an EventEnvelope message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventEnvelope} EventEnvelope
                 */
                public static fromObject(object: { [k: string]: any }): archipelago.proto.wire.EventEnvelope;

                /**
                 * Creates an EventEnvelope message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link archipelago.proto.wire.EventEnvelope.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventEnvelope} EventEnvelope
                 */
                public static from(object: { [k: string]: any }): archipelago.proto.wire.EventEnvelope;

                /**
                 * Creates a plain object from an EventEnvelope message. Also converts values to other types if specified.
                 * @param {archipelago.proto.wire.EventEnvelope} message EventEnvelope
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                public static toObject(message: archipelago.proto.wire.EventEnvelope, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this EventEnvelope message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this EventEnvelope to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            type EventGameStart$Properties = {
                playerId?: string;
            };

            /**
             * Constructs a new EventGameStart.
             * @exports archipelago.proto.wire.EventGameStart
             * @constructor
             * @param {archipelago.proto.wire.EventGameStart$Properties=} [properties] Properties to set
             */
            class EventGameStart {

                /**
                 * Constructs a new EventGameStart.
                 * @exports archipelago.proto.wire.EventGameStart
                 * @constructor
                 * @param {archipelago.proto.wire.EventGameStart$Properties=} [properties] Properties to set
                 */
                constructor(properties?: archipelago.proto.wire.EventGameStart$Properties);

                /**
                 * EventGameStart playerId.
                 * @type {string}
                 */
                public playerId: string;

                /**
                 * Creates a new EventGameStart instance using the specified properties.
                 * @param {archipelago.proto.wire.EventGameStart$Properties=} [properties] Properties to set
                 * @returns {archipelago.proto.wire.EventGameStart} EventGameStart instance
                 */
                public static create(properties?: archipelago.proto.wire.EventGameStart$Properties): archipelago.proto.wire.EventGameStart;

                /**
                 * Encodes the specified EventGameStart message. Does not implicitly {@link archipelago.proto.wire.EventGameStart.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventGameStart$Properties} message EventGameStart message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                public static encode(message: archipelago.proto.wire.EventGameStart$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EventGameStart message, length delimited. Does not implicitly {@link archipelago.proto.wire.EventGameStart.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventGameStart$Properties} message EventGameStart message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                public static encodeDelimited(message: archipelago.proto.wire.EventGameStart$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EventGameStart message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {archipelago.proto.wire.EventGameStart} EventGameStart
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): archipelago.proto.wire.EventGameStart;

                /**
                 * Decodes an EventGameStart message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {archipelago.proto.wire.EventGameStart} EventGameStart
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): archipelago.proto.wire.EventGameStart;

                /**
                 * Verifies an EventGameStart message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): string;

                /**
                 * Creates an EventGameStart message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventGameStart} EventGameStart
                 */
                public static fromObject(object: { [k: string]: any }): archipelago.proto.wire.EventGameStart;

                /**
                 * Creates an EventGameStart message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link archipelago.proto.wire.EventGameStart.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventGameStart} EventGameStart
                 */
                public static from(object: { [k: string]: any }): archipelago.proto.wire.EventGameStart;

                /**
                 * Creates a plain object from an EventGameStart message. Also converts values to other types if specified.
                 * @param {archipelago.proto.wire.EventGameStart} message EventGameStart
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                public static toObject(message: archipelago.proto.wire.EventGameStart, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this EventGameStart message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this EventGameStart to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            type EventGameOver$Properties = {
                playerIdWinner?: string;
            };

            /**
             * Constructs a new EventGameOver.
             * @exports archipelago.proto.wire.EventGameOver
             * @constructor
             * @param {archipelago.proto.wire.EventGameOver$Properties=} [properties] Properties to set
             */
            class EventGameOver {

                /**
                 * Constructs a new EventGameOver.
                 * @exports archipelago.proto.wire.EventGameOver
                 * @constructor
                 * @param {archipelago.proto.wire.EventGameOver$Properties=} [properties] Properties to set
                 */
                constructor(properties?: archipelago.proto.wire.EventGameOver$Properties);

                /**
                 * EventGameOver playerIdWinner.
                 * @type {string}
                 */
                public playerIdWinner: string;

                /**
                 * Creates a new EventGameOver instance using the specified properties.
                 * @param {archipelago.proto.wire.EventGameOver$Properties=} [properties] Properties to set
                 * @returns {archipelago.proto.wire.EventGameOver} EventGameOver instance
                 */
                public static create(properties?: archipelago.proto.wire.EventGameOver$Properties): archipelago.proto.wire.EventGameOver;

                /**
                 * Encodes the specified EventGameOver message. Does not implicitly {@link archipelago.proto.wire.EventGameOver.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventGameOver$Properties} message EventGameOver message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                public static encode(message: archipelago.proto.wire.EventGameOver$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EventGameOver message, length delimited. Does not implicitly {@link archipelago.proto.wire.EventGameOver.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventGameOver$Properties} message EventGameOver message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                public static encodeDelimited(message: archipelago.proto.wire.EventGameOver$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EventGameOver message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {archipelago.proto.wire.EventGameOver} EventGameOver
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): archipelago.proto.wire.EventGameOver;

                /**
                 * Decodes an EventGameOver message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {archipelago.proto.wire.EventGameOver} EventGameOver
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): archipelago.proto.wire.EventGameOver;

                /**
                 * Verifies an EventGameOver message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): string;

                /**
                 * Creates an EventGameOver message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventGameOver} EventGameOver
                 */
                public static fromObject(object: { [k: string]: any }): archipelago.proto.wire.EventGameOver;

                /**
                 * Creates an EventGameOver message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link archipelago.proto.wire.EventGameOver.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventGameOver} EventGameOver
                 */
                public static from(object: { [k: string]: any }): archipelago.proto.wire.EventGameOver;

                /**
                 * Creates a plain object from an EventGameOver message. Also converts values to other types if specified.
                 * @param {archipelago.proto.wire.EventGameOver} message EventGameOver
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                public static toObject(message: archipelago.proto.wire.EventGameOver, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this EventGameOver message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this EventGameOver to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            type EventGameTick$Properties = {
                game?: archipelago.proto.wire.game.Game$Properties;
            };

            /**
             * Constructs a new EventGameTick.
             * @exports archipelago.proto.wire.EventGameTick
             * @constructor
             * @param {archipelago.proto.wire.EventGameTick$Properties=} [properties] Properties to set
             */
            class EventGameTick {

                /**
                 * Constructs a new EventGameTick.
                 * @exports archipelago.proto.wire.EventGameTick
                 * @constructor
                 * @param {archipelago.proto.wire.EventGameTick$Properties=} [properties] Properties to set
                 */
                constructor(properties?: archipelago.proto.wire.EventGameTick$Properties);

                /**
                 * EventGameTick game.
                 * @type {(archipelago.proto.wire.game.Game$Properties|null)}
                 */
                public game: (archipelago.proto.wire.game.Game$Properties|null);

                /**
                 * Creates a new EventGameTick instance using the specified properties.
                 * @param {archipelago.proto.wire.EventGameTick$Properties=} [properties] Properties to set
                 * @returns {archipelago.proto.wire.EventGameTick} EventGameTick instance
                 */
                public static create(properties?: archipelago.proto.wire.EventGameTick$Properties): archipelago.proto.wire.EventGameTick;

                /**
                 * Encodes the specified EventGameTick message. Does not implicitly {@link archipelago.proto.wire.EventGameTick.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventGameTick$Properties} message EventGameTick message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                public static encode(message: archipelago.proto.wire.EventGameTick$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EventGameTick message, length delimited. Does not implicitly {@link archipelago.proto.wire.EventGameTick.verify|verify} messages.
                 * @param {archipelago.proto.wire.EventGameTick$Properties} message EventGameTick message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                public static encodeDelimited(message: archipelago.proto.wire.EventGameTick$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EventGameTick message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {archipelago.proto.wire.EventGameTick} EventGameTick
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): archipelago.proto.wire.EventGameTick;

                /**
                 * Decodes an EventGameTick message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {archipelago.proto.wire.EventGameTick} EventGameTick
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): archipelago.proto.wire.EventGameTick;

                /**
                 * Verifies an EventGameTick message.
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): string;

                /**
                 * Creates an EventGameTick message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventGameTick} EventGameTick
                 */
                public static fromObject(object: { [k: string]: any }): archipelago.proto.wire.EventGameTick;

                /**
                 * Creates an EventGameTick message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link archipelago.proto.wire.EventGameTick.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {archipelago.proto.wire.EventGameTick} EventGameTick
                 */
                public static from(object: { [k: string]: any }): archipelago.proto.wire.EventGameTick;

                /**
                 * Creates a plain object from an EventGameTick message. Also converts values to other types if specified.
                 * @param {archipelago.proto.wire.EventGameTick} message EventGameTick
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                public static toObject(message: archipelago.proto.wire.EventGameTick, options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Creates a plain object from this EventGameTick message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                /**
                 * Converts this EventGameTick to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /**
             * Namespace game.
             * @exports archipelago.proto.wire.game
             * @namespace
             */
            namespace game {

                type Coordinate$Properties = {
                    x?: number;
                    y?: number;
                };

                /**
                 * Constructs a new Coordinate.
                 * @exports archipelago.proto.wire.game.Coordinate
                 * @constructor
                 * @param {archipelago.proto.wire.game.Coordinate$Properties=} [properties] Properties to set
                 */
                class Coordinate {

                    /**
                     * Constructs a new Coordinate.
                     * @exports archipelago.proto.wire.game.Coordinate
                     * @constructor
                     * @param {archipelago.proto.wire.game.Coordinate$Properties=} [properties] Properties to set
                     */
                    constructor(properties?: archipelago.proto.wire.game.Coordinate$Properties);

                    /**
                     * Coordinate x.
                     * @type {number}
                     */
                    public x: number;

                    /**
                     * Coordinate y.
                     * @type {number}
                     */
                    public y: number;

                    /**
                     * Creates a new Coordinate instance using the specified properties.
                     * @param {archipelago.proto.wire.game.Coordinate$Properties=} [properties] Properties to set
                     * @returns {archipelago.proto.wire.game.Coordinate} Coordinate instance
                     */
                    public static create(properties?: archipelago.proto.wire.game.Coordinate$Properties): archipelago.proto.wire.game.Coordinate;

                    /**
                     * Encodes the specified Coordinate message. Does not implicitly {@link archipelago.proto.wire.game.Coordinate.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Coordinate$Properties} message Coordinate message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    public static encode(message: archipelago.proto.wire.game.Coordinate$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Coordinate message, length delimited. Does not implicitly {@link archipelago.proto.wire.game.Coordinate.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Coordinate$Properties} message Coordinate message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    public static encodeDelimited(message: archipelago.proto.wire.game.Coordinate$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Coordinate message from the specified reader or buffer.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {archipelago.proto.wire.game.Coordinate} Coordinate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): archipelago.proto.wire.game.Coordinate;

                    /**
                     * Decodes a Coordinate message from the specified reader or buffer, length delimited.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {archipelago.proto.wire.game.Coordinate} Coordinate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): archipelago.proto.wire.game.Coordinate;

                    /**
                     * Verifies a Coordinate message.
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {?string} `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): string;

                    /**
                     * Creates a Coordinate message from a plain object. Also converts values to their respective internal types.
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Coordinate} Coordinate
                     */
                    public static fromObject(object: { [k: string]: any }): archipelago.proto.wire.game.Coordinate;

                    /**
                     * Creates a Coordinate message from a plain object. Also converts values to their respective internal types.
                     * This is an alias of {@link archipelago.proto.wire.game.Coordinate.fromObject}.
                     * @function
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Coordinate} Coordinate
                     */
                    public static from(object: { [k: string]: any }): archipelago.proto.wire.game.Coordinate;

                    /**
                     * Creates a plain object from a Coordinate message. Also converts values to other types if specified.
                     * @param {archipelago.proto.wire.game.Coordinate} message Coordinate
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    public static toObject(message: archipelago.proto.wire.game.Coordinate, options?: $protobuf.ConversionOptions): { [k: string]: any };

                    /**
                     * Creates a plain object from this Coordinate message. Also converts values to other types if specified.
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Coordinate to JSON.
                     * @returns {Object.<string,*>} JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                type FloatCoordinate$Properties = {
                    x?: number;
                    y?: number;
                };

                /**
                 * Constructs a new FloatCoordinate.
                 * @exports archipelago.proto.wire.game.FloatCoordinate
                 * @constructor
                 * @param {archipelago.proto.wire.game.FloatCoordinate$Properties=} [properties] Properties to set
                 */
                class FloatCoordinate {

                    /**
                     * Constructs a new FloatCoordinate.
                     * @exports archipelago.proto.wire.game.FloatCoordinate
                     * @constructor
                     * @param {archipelago.proto.wire.game.FloatCoordinate$Properties=} [properties] Properties to set
                     */
                    constructor(properties?: archipelago.proto.wire.game.FloatCoordinate$Properties);

                    /**
                     * FloatCoordinate x.
                     * @type {number}
                     */
                    public x: number;

                    /**
                     * FloatCoordinate y.
                     * @type {number}
                     */
                    public y: number;

                    /**
                     * Creates a new FloatCoordinate instance using the specified properties.
                     * @param {archipelago.proto.wire.game.FloatCoordinate$Properties=} [properties] Properties to set
                     * @returns {archipelago.proto.wire.game.FloatCoordinate} FloatCoordinate instance
                     */
                    public static create(properties?: archipelago.proto.wire.game.FloatCoordinate$Properties): archipelago.proto.wire.game.FloatCoordinate;

                    /**
                     * Encodes the specified FloatCoordinate message. Does not implicitly {@link archipelago.proto.wire.game.FloatCoordinate.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.FloatCoordinate$Properties} message FloatCoordinate message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    public static encode(message: archipelago.proto.wire.game.FloatCoordinate$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified FloatCoordinate message, length delimited. Does not implicitly {@link archipelago.proto.wire.game.FloatCoordinate.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.FloatCoordinate$Properties} message FloatCoordinate message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    public static encodeDelimited(message: archipelago.proto.wire.game.FloatCoordinate$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a FloatCoordinate message from the specified reader or buffer.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {archipelago.proto.wire.game.FloatCoordinate} FloatCoordinate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): archipelago.proto.wire.game.FloatCoordinate;

                    /**
                     * Decodes a FloatCoordinate message from the specified reader or buffer, length delimited.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {archipelago.proto.wire.game.FloatCoordinate} FloatCoordinate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): archipelago.proto.wire.game.FloatCoordinate;

                    /**
                     * Verifies a FloatCoordinate message.
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {?string} `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): string;

                    /**
                     * Creates a FloatCoordinate message from a plain object. Also converts values to their respective internal types.
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.FloatCoordinate} FloatCoordinate
                     */
                    public static fromObject(object: { [k: string]: any }): archipelago.proto.wire.game.FloatCoordinate;

                    /**
                     * Creates a FloatCoordinate message from a plain object. Also converts values to their respective internal types.
                     * This is an alias of {@link archipelago.proto.wire.game.FloatCoordinate.fromObject}.
                     * @function
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.FloatCoordinate} FloatCoordinate
                     */
                    public static from(object: { [k: string]: any }): archipelago.proto.wire.game.FloatCoordinate;

                    /**
                     * Creates a plain object from a FloatCoordinate message. Also converts values to other types if specified.
                     * @param {archipelago.proto.wire.game.FloatCoordinate} message FloatCoordinate
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    public static toObject(message: archipelago.proto.wire.game.FloatCoordinate, options?: $protobuf.ConversionOptions): { [k: string]: any };

                    /**
                     * Creates a plain object from this FloatCoordinate message. Also converts values to other types if specified.
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                    /**
                     * Converts this FloatCoordinate to JSON.
                     * @returns {Object.<string,*>} JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                type Player$Properties = {
                    id?: string;
                };

                /**
                 * Constructs a new Player.
                 * @exports archipelago.proto.wire.game.Player
                 * @constructor
                 * @param {archipelago.proto.wire.game.Player$Properties=} [properties] Properties to set
                 */
                class Player {

                    /**
                     * Constructs a new Player.
                     * @exports archipelago.proto.wire.game.Player
                     * @constructor
                     * @param {archipelago.proto.wire.game.Player$Properties=} [properties] Properties to set
                     */
                    constructor(properties?: archipelago.proto.wire.game.Player$Properties);

                    /**
                     * Player id.
                     * @type {string}
                     */
                    public id: string;

                    /**
                     * Creates a new Player instance using the specified properties.
                     * @param {archipelago.proto.wire.game.Player$Properties=} [properties] Properties to set
                     * @returns {archipelago.proto.wire.game.Player} Player instance
                     */
                    public static create(properties?: archipelago.proto.wire.game.Player$Properties): archipelago.proto.wire.game.Player;

                    /**
                     * Encodes the specified Player message. Does not implicitly {@link archipelago.proto.wire.game.Player.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Player$Properties} message Player message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    public static encode(message: archipelago.proto.wire.game.Player$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Player message, length delimited. Does not implicitly {@link archipelago.proto.wire.game.Player.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Player$Properties} message Player message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    public static encodeDelimited(message: archipelago.proto.wire.game.Player$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Player message from the specified reader or buffer.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {archipelago.proto.wire.game.Player} Player
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): archipelago.proto.wire.game.Player;

                    /**
                     * Decodes a Player message from the specified reader or buffer, length delimited.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {archipelago.proto.wire.game.Player} Player
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): archipelago.proto.wire.game.Player;

                    /**
                     * Verifies a Player message.
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {?string} `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): string;

                    /**
                     * Creates a Player message from a plain object. Also converts values to their respective internal types.
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Player} Player
                     */
                    public static fromObject(object: { [k: string]: any }): archipelago.proto.wire.game.Player;

                    /**
                     * Creates a Player message from a plain object. Also converts values to their respective internal types.
                     * This is an alias of {@link archipelago.proto.wire.game.Player.fromObject}.
                     * @function
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Player} Player
                     */
                    public static from(object: { [k: string]: any }): archipelago.proto.wire.game.Player;

                    /**
                     * Creates a plain object from a Player message. Also converts values to other types if specified.
                     * @param {archipelago.proto.wire.game.Player} message Player
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    public static toObject(message: archipelago.proto.wire.game.Player, options?: $protobuf.ConversionOptions): { [k: string]: any };

                    /**
                     * Creates a plain object from this Player message. Also converts values to other types if specified.
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Player to JSON.
                     * @returns {Object.<string,*>} JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                type Army$Properties = {
                    owner?: archipelago.proto.wire.game.Player$Properties;
                    strength?: number;
                };

                /**
                 * Constructs a new Army.
                 * @exports archipelago.proto.wire.game.Army
                 * @constructor
                 * @param {archipelago.proto.wire.game.Army$Properties=} [properties] Properties to set
                 */
                class Army {

                    /**
                     * Constructs a new Army.
                     * @exports archipelago.proto.wire.game.Army
                     * @constructor
                     * @param {archipelago.proto.wire.game.Army$Properties=} [properties] Properties to set
                     */
                    constructor(properties?: archipelago.proto.wire.game.Army$Properties);

                    /**
                     * Army owner.
                     * @type {(archipelago.proto.wire.game.Player$Properties|null)}
                     */
                    public owner: (archipelago.proto.wire.game.Player$Properties|null);

                    /**
                     * Army strength.
                     * @type {number}
                     */
                    public strength: number;

                    /**
                     * Creates a new Army instance using the specified properties.
                     * @param {archipelago.proto.wire.game.Army$Properties=} [properties] Properties to set
                     * @returns {archipelago.proto.wire.game.Army} Army instance
                     */
                    public static create(properties?: archipelago.proto.wire.game.Army$Properties): archipelago.proto.wire.game.Army;

                    /**
                     * Encodes the specified Army message. Does not implicitly {@link archipelago.proto.wire.game.Army.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Army$Properties} message Army message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    public static encode(message: archipelago.proto.wire.game.Army$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Army message, length delimited. Does not implicitly {@link archipelago.proto.wire.game.Army.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Army$Properties} message Army message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    public static encodeDelimited(message: archipelago.proto.wire.game.Army$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an Army message from the specified reader or buffer.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {archipelago.proto.wire.game.Army} Army
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): archipelago.proto.wire.game.Army;

                    /**
                     * Decodes an Army message from the specified reader or buffer, length delimited.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {archipelago.proto.wire.game.Army} Army
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): archipelago.proto.wire.game.Army;

                    /**
                     * Verifies an Army message.
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {?string} `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): string;

                    /**
                     * Creates an Army message from a plain object. Also converts values to their respective internal types.
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Army} Army
                     */
                    public static fromObject(object: { [k: string]: any }): archipelago.proto.wire.game.Army;

                    /**
                     * Creates an Army message from a plain object. Also converts values to their respective internal types.
                     * This is an alias of {@link archipelago.proto.wire.game.Army.fromObject}.
                     * @function
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Army} Army
                     */
                    public static from(object: { [k: string]: any }): archipelago.proto.wire.game.Army;

                    /**
                     * Creates a plain object from an Army message. Also converts values to other types if specified.
                     * @param {archipelago.proto.wire.game.Army} message Army
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    public static toObject(message: archipelago.proto.wire.game.Army, options?: $protobuf.ConversionOptions): { [k: string]: any };

                    /**
                     * Creates a plain object from this Army message. Also converts values to other types if specified.
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Army to JSON.
                     * @returns {Object.<string,*>} JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                type Airplane$Properties = {
                    id?: string;
                    army?: archipelago.proto.wire.game.Army$Properties;
                    position?: archipelago.proto.wire.game.FloatCoordinate$Properties;
                    direction?: number;
                    speed?: number;
                };

                /**
                 * Constructs a new Airplane.
                 * @exports archipelago.proto.wire.game.Airplane
                 * @constructor
                 * @param {archipelago.proto.wire.game.Airplane$Properties=} [properties] Properties to set
                 */
                class Airplane {

                    /**
                     * Constructs a new Airplane.
                     * @exports archipelago.proto.wire.game.Airplane
                     * @constructor
                     * @param {archipelago.proto.wire.game.Airplane$Properties=} [properties] Properties to set
                     */
                    constructor(properties?: archipelago.proto.wire.game.Airplane$Properties);

                    /**
                     * Airplane id.
                     * @type {string}
                     */
                    public id: string;

                    /**
                     * Airplane army.
                     * @type {(archipelago.proto.wire.game.Army$Properties|null)}
                     */
                    public army: (archipelago.proto.wire.game.Army$Properties|null);

                    /**
                     * Airplane position.
                     * @type {(archipelago.proto.wire.game.FloatCoordinate$Properties|null)}
                     */
                    public position: (archipelago.proto.wire.game.FloatCoordinate$Properties|null);

                    /**
                     * Airplane direction.
                     * @type {number}
                     */
                    public direction: number;

                    /**
                     * Airplane speed.
                     * @type {number}
                     */
                    public speed: number;

                    /**
                     * Creates a new Airplane instance using the specified properties.
                     * @param {archipelago.proto.wire.game.Airplane$Properties=} [properties] Properties to set
                     * @returns {archipelago.proto.wire.game.Airplane} Airplane instance
                     */
                    public static create(properties?: archipelago.proto.wire.game.Airplane$Properties): archipelago.proto.wire.game.Airplane;

                    /**
                     * Encodes the specified Airplane message. Does not implicitly {@link archipelago.proto.wire.game.Airplane.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Airplane$Properties} message Airplane message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    public static encode(message: archipelago.proto.wire.game.Airplane$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Airplane message, length delimited. Does not implicitly {@link archipelago.proto.wire.game.Airplane.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Airplane$Properties} message Airplane message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    public static encodeDelimited(message: archipelago.proto.wire.game.Airplane$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an Airplane message from the specified reader or buffer.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {archipelago.proto.wire.game.Airplane} Airplane
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): archipelago.proto.wire.game.Airplane;

                    /**
                     * Decodes an Airplane message from the specified reader or buffer, length delimited.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {archipelago.proto.wire.game.Airplane} Airplane
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): archipelago.proto.wire.game.Airplane;

                    /**
                     * Verifies an Airplane message.
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {?string} `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): string;

                    /**
                     * Creates an Airplane message from a plain object. Also converts values to their respective internal types.
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Airplane} Airplane
                     */
                    public static fromObject(object: { [k: string]: any }): archipelago.proto.wire.game.Airplane;

                    /**
                     * Creates an Airplane message from a plain object. Also converts values to their respective internal types.
                     * This is an alias of {@link archipelago.proto.wire.game.Airplane.fromObject}.
                     * @function
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Airplane} Airplane
                     */
                    public static from(object: { [k: string]: any }): archipelago.proto.wire.game.Airplane;

                    /**
                     * Creates a plain object from an Airplane message. Also converts values to other types if specified.
                     * @param {archipelago.proto.wire.game.Airplane} message Airplane
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    public static toObject(message: archipelago.proto.wire.game.Airplane, options?: $protobuf.ConversionOptions): { [k: string]: any };

                    /**
                     * Creates a plain object from this Airplane message. Also converts values to other types if specified.
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Airplane to JSON.
                     * @returns {Object.<string,*>} JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                type Island$Properties = {
                    id?: string;
                    army?: archipelago.proto.wire.game.Army$Properties;
                    position?: archipelago.proto.wire.game.Coordinate$Properties;
                    size?: number;
                };

                /**
                 * Constructs a new Island.
                 * @exports archipelago.proto.wire.game.Island
                 * @constructor
                 * @param {archipelago.proto.wire.game.Island$Properties=} [properties] Properties to set
                 */
                class Island {

                    /**
                     * Constructs a new Island.
                     * @exports archipelago.proto.wire.game.Island
                     * @constructor
                     * @param {archipelago.proto.wire.game.Island$Properties=} [properties] Properties to set
                     */
                    constructor(properties?: archipelago.proto.wire.game.Island$Properties);

                    /**
                     * Island id.
                     * @type {string}
                     */
                    public id: string;

                    /**
                     * Island army.
                     * @type {(archipelago.proto.wire.game.Army$Properties|null)}
                     */
                    public army: (archipelago.proto.wire.game.Army$Properties|null);

                    /**
                     * Island position.
                     * @type {(archipelago.proto.wire.game.Coordinate$Properties|null)}
                     */
                    public position: (archipelago.proto.wire.game.Coordinate$Properties|null);

                    /**
                     * Island size.
                     * @type {number}
                     */
                    public size: number;

                    /**
                     * Creates a new Island instance using the specified properties.
                     * @param {archipelago.proto.wire.game.Island$Properties=} [properties] Properties to set
                     * @returns {archipelago.proto.wire.game.Island} Island instance
                     */
                    public static create(properties?: archipelago.proto.wire.game.Island$Properties): archipelago.proto.wire.game.Island;

                    /**
                     * Encodes the specified Island message. Does not implicitly {@link archipelago.proto.wire.game.Island.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Island$Properties} message Island message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    public static encode(message: archipelago.proto.wire.game.Island$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Island message, length delimited. Does not implicitly {@link archipelago.proto.wire.game.Island.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Island$Properties} message Island message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    public static encodeDelimited(message: archipelago.proto.wire.game.Island$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an Island message from the specified reader or buffer.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {archipelago.proto.wire.game.Island} Island
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): archipelago.proto.wire.game.Island;

                    /**
                     * Decodes an Island message from the specified reader or buffer, length delimited.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {archipelago.proto.wire.game.Island} Island
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): archipelago.proto.wire.game.Island;

                    /**
                     * Verifies an Island message.
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {?string} `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): string;

                    /**
                     * Creates an Island message from a plain object. Also converts values to their respective internal types.
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Island} Island
                     */
                    public static fromObject(object: { [k: string]: any }): archipelago.proto.wire.game.Island;

                    /**
                     * Creates an Island message from a plain object. Also converts values to their respective internal types.
                     * This is an alias of {@link archipelago.proto.wire.game.Island.fromObject}.
                     * @function
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Island} Island
                     */
                    public static from(object: { [k: string]: any }): archipelago.proto.wire.game.Island;

                    /**
                     * Creates a plain object from an Island message. Also converts values to other types if specified.
                     * @param {archipelago.proto.wire.game.Island} message Island
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    public static toObject(message: archipelago.proto.wire.game.Island, options?: $protobuf.ConversionOptions): { [k: string]: any };

                    /**
                     * Creates a plain object from this Island message. Also converts values to other types if specified.
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Island to JSON.
                     * @returns {Object.<string,*>} JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                type Game$Properties = {
                    id?: string;
                    size?: archipelago.proto.wire.game.Coordinate$Properties;
                    player1?: archipelago.proto.wire.game.Player$Properties;
                    player2?: archipelago.proto.wire.game.Player$Properties;
                    playerNeutral?: archipelago.proto.wire.game.Player$Properties;
                    islands?: archipelago.proto.wire.game.Island$Properties[];
                    airplanes?: archipelago.proto.wire.game.Airplane$Properties[];
                };

                /**
                 * Constructs a new Game.
                 * @exports archipelago.proto.wire.game.Game
                 * @constructor
                 * @param {archipelago.proto.wire.game.Game$Properties=} [properties] Properties to set
                 */
                class Game {

                    /**
                     * Constructs a new Game.
                     * @exports archipelago.proto.wire.game.Game
                     * @constructor
                     * @param {archipelago.proto.wire.game.Game$Properties=} [properties] Properties to set
                     */
                    constructor(properties?: archipelago.proto.wire.game.Game$Properties);

                    /**
                     * Game id.
                     * @type {string}
                     */
                    public id: string;

                    /**
                     * Game size.
                     * @type {(archipelago.proto.wire.game.Coordinate$Properties|null)}
                     */
                    public size: (archipelago.proto.wire.game.Coordinate$Properties|null);

                    /**
                     * Game player1.
                     * @type {(archipelago.proto.wire.game.Player$Properties|null)}
                     */
                    public player1: (archipelago.proto.wire.game.Player$Properties|null);

                    /**
                     * Game player2.
                     * @type {(archipelago.proto.wire.game.Player$Properties|null)}
                     */
                    public player2: (archipelago.proto.wire.game.Player$Properties|null);

                    /**
                     * Game playerNeutral.
                     * @type {(archipelago.proto.wire.game.Player$Properties|null)}
                     */
                    public playerNeutral: (archipelago.proto.wire.game.Player$Properties|null);

                    /**
                     * Game islands.
                     * @type {Array.<archipelago.proto.wire.game.Island$Properties>}
                     */
                    public islands: archipelago.proto.wire.game.Island$Properties[];

                    /**
                     * Game airplanes.
                     * @type {Array.<archipelago.proto.wire.game.Airplane$Properties>}
                     */
                    public airplanes: archipelago.proto.wire.game.Airplane$Properties[];

                    /**
                     * Creates a new Game instance using the specified properties.
                     * @param {archipelago.proto.wire.game.Game$Properties=} [properties] Properties to set
                     * @returns {archipelago.proto.wire.game.Game} Game instance
                     */
                    public static create(properties?: archipelago.proto.wire.game.Game$Properties): archipelago.proto.wire.game.Game;

                    /**
                     * Encodes the specified Game message. Does not implicitly {@link archipelago.proto.wire.game.Game.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Game$Properties} message Game message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    public static encode(message: archipelago.proto.wire.game.Game$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Game message, length delimited. Does not implicitly {@link archipelago.proto.wire.game.Game.verify|verify} messages.
                     * @param {archipelago.proto.wire.game.Game$Properties} message Game message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    public static encodeDelimited(message: archipelago.proto.wire.game.Game$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Game message from the specified reader or buffer.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {archipelago.proto.wire.game.Game} Game
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): archipelago.proto.wire.game.Game;

                    /**
                     * Decodes a Game message from the specified reader or buffer, length delimited.
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {archipelago.proto.wire.game.Game} Game
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): archipelago.proto.wire.game.Game;

                    /**
                     * Verifies a Game message.
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {?string} `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): string;

                    /**
                     * Creates a Game message from a plain object. Also converts values to their respective internal types.
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Game} Game
                     */
                    public static fromObject(object: { [k: string]: any }): archipelago.proto.wire.game.Game;

                    /**
                     * Creates a Game message from a plain object. Also converts values to their respective internal types.
                     * This is an alias of {@link archipelago.proto.wire.game.Game.fromObject}.
                     * @function
                     * @param {Object.<string,*>} object Plain object
                     * @returns {archipelago.proto.wire.game.Game} Game
                     */
                    public static from(object: { [k: string]: any }): archipelago.proto.wire.game.Game;

                    /**
                     * Creates a plain object from a Game message. Also converts values to other types if specified.
                     * @param {archipelago.proto.wire.game.Game} message Game
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    public static toObject(message: archipelago.proto.wire.game.Game, options?: $protobuf.ConversionOptions): { [k: string]: any };

                    /**
                     * Creates a plain object from this Game message. Also converts values to other types if specified.
                     * @param {$protobuf.ConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    public toObject(options?: $protobuf.ConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Game to JSON.
                     * @returns {Object.<string,*>} JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }
        }
    }
}
