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

            type ActionEnvelope$Properties = {};

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

            type EventEnvelope$Properties = {
                eventGameStart?: archipelago.proto.wire.EventGameStart$Properties;
                eventGameOver?: archipelago.proto.wire.EventGameOver$Properties;
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
                player?: archipelago.proto.wire.game.Player$Properties;
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
                 * EventGameStart player.
                 * @type {(archipelago.proto.wire.game.Player$Properties|null)}
                 */
                public player: (archipelago.proto.wire.game.Player$Properties|null);

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
                winner?: archipelago.proto.wire.game.Player$Properties;
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
                 * EventGameOver winner.
                 * @type {(archipelago.proto.wire.game.Player$Properties|null)}
                 */
                public winner: (archipelago.proto.wire.game.Player$Properties|null);

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

            type EventGameTick$Properties = {};

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

                type Player$Properties = {
                    playerId?: string;
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
                     * Player playerId.
                     * @type {string}
                     */
                    public playerId: string;

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
            }
        }
    }
}
