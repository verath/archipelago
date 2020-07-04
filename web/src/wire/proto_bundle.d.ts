import * as $protobuf from "protobufjs";
/** Namespace wire. */
export namespace wire {

    /** Properties of an ActionEnvelope. */
    interface IActionEnvelope {

        /** ActionEnvelope actionGameLeave */
        actionGameLeave?: (wire.IActionGameLeave|null);

        /** ActionEnvelope actionGameLaunch */
        actionGameLaunch?: (wire.IActionGameLaunch|null);
    }

    /** Represents an ActionEnvelope. */
    class ActionEnvelope implements IActionEnvelope {

        /**
         * Constructs a new ActionEnvelope.
         * @param [properties] Properties to set
         */
        constructor(properties?: wire.IActionEnvelope);

        /** ActionEnvelope actionGameLeave. */
        public actionGameLeave?: (wire.IActionGameLeave|null);

        /** ActionEnvelope actionGameLaunch. */
        public actionGameLaunch?: (wire.IActionGameLaunch|null);

        /** ActionEnvelope action. */
        public action?: ("actionGameLeave"|"actionGameLaunch");

        /**
         * Creates a new ActionEnvelope instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ActionEnvelope instance
         */
        public static create(properties?: wire.IActionEnvelope): wire.ActionEnvelope;

        /**
         * Encodes the specified ActionEnvelope message. Does not implicitly {@link wire.ActionEnvelope.verify|verify} messages.
         * @param message ActionEnvelope message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wire.IActionEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ActionEnvelope message, length delimited. Does not implicitly {@link wire.ActionEnvelope.verify|verify} messages.
         * @param message ActionEnvelope message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wire.IActionEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ActionEnvelope message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ActionEnvelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.ActionEnvelope;

        /**
         * Decodes an ActionEnvelope message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ActionEnvelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.ActionEnvelope;

        /**
         * Verifies an ActionEnvelope message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ActionEnvelope message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ActionEnvelope
         */
        public static fromObject(object: { [k: string]: any }): wire.ActionEnvelope;

        /**
         * Creates a plain object from an ActionEnvelope message. Also converts values to other types if specified.
         * @param message ActionEnvelope
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wire.ActionEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ActionEnvelope to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an ActionGameLeave. */
    interface IActionGameLeave {
    }

    /** Represents an ActionGameLeave. */
    class ActionGameLeave implements IActionGameLeave {

        /**
         * Constructs a new ActionGameLeave.
         * @param [properties] Properties to set
         */
        constructor(properties?: wire.IActionGameLeave);

        /**
         * Creates a new ActionGameLeave instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ActionGameLeave instance
         */
        public static create(properties?: wire.IActionGameLeave): wire.ActionGameLeave;

        /**
         * Encodes the specified ActionGameLeave message. Does not implicitly {@link wire.ActionGameLeave.verify|verify} messages.
         * @param message ActionGameLeave message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wire.IActionGameLeave, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ActionGameLeave message, length delimited. Does not implicitly {@link wire.ActionGameLeave.verify|verify} messages.
         * @param message ActionGameLeave message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wire.IActionGameLeave, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ActionGameLeave message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ActionGameLeave
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.ActionGameLeave;

        /**
         * Decodes an ActionGameLeave message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ActionGameLeave
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.ActionGameLeave;

        /**
         * Verifies an ActionGameLeave message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ActionGameLeave message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ActionGameLeave
         */
        public static fromObject(object: { [k: string]: any }): wire.ActionGameLeave;

        /**
         * Creates a plain object from an ActionGameLeave message. Also converts values to other types if specified.
         * @param message ActionGameLeave
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wire.ActionGameLeave, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ActionGameLeave to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an ActionGameLaunch. */
    interface IActionGameLaunch {

        /** ActionGameLaunch fromId */
        fromId?: (string|null);

        /** ActionGameLaunch toId */
        toId?: (string|null);
    }

    /** Represents an ActionGameLaunch. */
    class ActionGameLaunch implements IActionGameLaunch {

        /**
         * Constructs a new ActionGameLaunch.
         * @param [properties] Properties to set
         */
        constructor(properties?: wire.IActionGameLaunch);

        /** ActionGameLaunch fromId. */
        public fromId: string;

        /** ActionGameLaunch toId. */
        public toId: string;

        /**
         * Creates a new ActionGameLaunch instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ActionGameLaunch instance
         */
        public static create(properties?: wire.IActionGameLaunch): wire.ActionGameLaunch;

        /**
         * Encodes the specified ActionGameLaunch message. Does not implicitly {@link wire.ActionGameLaunch.verify|verify} messages.
         * @param message ActionGameLaunch message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wire.IActionGameLaunch, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ActionGameLaunch message, length delimited. Does not implicitly {@link wire.ActionGameLaunch.verify|verify} messages.
         * @param message ActionGameLaunch message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wire.IActionGameLaunch, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ActionGameLaunch message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ActionGameLaunch
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.ActionGameLaunch;

        /**
         * Decodes an ActionGameLaunch message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ActionGameLaunch
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.ActionGameLaunch;

        /**
         * Verifies an ActionGameLaunch message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ActionGameLaunch message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ActionGameLaunch
         */
        public static fromObject(object: { [k: string]: any }): wire.ActionGameLaunch;

        /**
         * Creates a plain object from an ActionGameLaunch message. Also converts values to other types if specified.
         * @param message ActionGameLaunch
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wire.ActionGameLaunch, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ActionGameLaunch to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EventEnvelope. */
    interface IEventEnvelope {

        /** EventEnvelope eventGameStart */
        eventGameStart?: (wire.IEventGameStart|null);

        /** EventEnvelope eventGameOver */
        eventGameOver?: (wire.IEventGameOver|null);

        /** EventEnvelope eventGameTick */
        eventGameTick?: (wire.IEventGameTick|null);
    }

    /** Represents an EventEnvelope. */
    class EventEnvelope implements IEventEnvelope {

        /**
         * Constructs a new EventEnvelope.
         * @param [properties] Properties to set
         */
        constructor(properties?: wire.IEventEnvelope);

        /** EventEnvelope eventGameStart. */
        public eventGameStart?: (wire.IEventGameStart|null);

        /** EventEnvelope eventGameOver. */
        public eventGameOver?: (wire.IEventGameOver|null);

        /** EventEnvelope eventGameTick. */
        public eventGameTick?: (wire.IEventGameTick|null);

        /** EventEnvelope event. */
        public event?: ("eventGameStart"|"eventGameOver"|"eventGameTick");

        /**
         * Creates a new EventEnvelope instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EventEnvelope instance
         */
        public static create(properties?: wire.IEventEnvelope): wire.EventEnvelope;

        /**
         * Encodes the specified EventEnvelope message. Does not implicitly {@link wire.EventEnvelope.verify|verify} messages.
         * @param message EventEnvelope message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wire.IEventEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EventEnvelope message, length delimited. Does not implicitly {@link wire.EventEnvelope.verify|verify} messages.
         * @param message EventEnvelope message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wire.IEventEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EventEnvelope message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EventEnvelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.EventEnvelope;

        /**
         * Decodes an EventEnvelope message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EventEnvelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.EventEnvelope;

        /**
         * Verifies an EventEnvelope message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EventEnvelope message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EventEnvelope
         */
        public static fromObject(object: { [k: string]: any }): wire.EventEnvelope;

        /**
         * Creates a plain object from an EventEnvelope message. Also converts values to other types if specified.
         * @param message EventEnvelope
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wire.EventEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EventEnvelope to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EventGameStart. */
    interface IEventGameStart {

        /** EventGameStart playerId */
        playerId?: (string|null);

        /** EventGameStart tickInterval */
        tickInterval?: (number|null);
    }

    /** Represents an EventGameStart. */
    class EventGameStart implements IEventGameStart {

        /**
         * Constructs a new EventGameStart.
         * @param [properties] Properties to set
         */
        constructor(properties?: wire.IEventGameStart);

        /** EventGameStart playerId. */
        public playerId: string;

        /** EventGameStart tickInterval. */
        public tickInterval: number;

        /**
         * Creates a new EventGameStart instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EventGameStart instance
         */
        public static create(properties?: wire.IEventGameStart): wire.EventGameStart;

        /**
         * Encodes the specified EventGameStart message. Does not implicitly {@link wire.EventGameStart.verify|verify} messages.
         * @param message EventGameStart message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wire.IEventGameStart, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EventGameStart message, length delimited. Does not implicitly {@link wire.EventGameStart.verify|verify} messages.
         * @param message EventGameStart message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wire.IEventGameStart, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EventGameStart message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EventGameStart
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.EventGameStart;

        /**
         * Decodes an EventGameStart message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EventGameStart
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.EventGameStart;

        /**
         * Verifies an EventGameStart message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EventGameStart message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EventGameStart
         */
        public static fromObject(object: { [k: string]: any }): wire.EventGameStart;

        /**
         * Creates a plain object from an EventGameStart message. Also converts values to other types if specified.
         * @param message EventGameStart
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wire.EventGameStart, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EventGameStart to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EventGameOver. */
    interface IEventGameOver {

        /** EventGameOver winnerId */
        winnerId?: (string|null);
    }

    /** Represents an EventGameOver. */
    class EventGameOver implements IEventGameOver {

        /**
         * Constructs a new EventGameOver.
         * @param [properties] Properties to set
         */
        constructor(properties?: wire.IEventGameOver);

        /** EventGameOver winnerId. */
        public winnerId: string;

        /**
         * Creates a new EventGameOver instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EventGameOver instance
         */
        public static create(properties?: wire.IEventGameOver): wire.EventGameOver;

        /**
         * Encodes the specified EventGameOver message. Does not implicitly {@link wire.EventGameOver.verify|verify} messages.
         * @param message EventGameOver message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wire.IEventGameOver, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EventGameOver message, length delimited. Does not implicitly {@link wire.EventGameOver.verify|verify} messages.
         * @param message EventGameOver message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wire.IEventGameOver, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EventGameOver message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EventGameOver
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.EventGameOver;

        /**
         * Decodes an EventGameOver message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EventGameOver
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.EventGameOver;

        /**
         * Verifies an EventGameOver message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EventGameOver message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EventGameOver
         */
        public static fromObject(object: { [k: string]: any }): wire.EventGameOver;

        /**
         * Creates a plain object from an EventGameOver message. Also converts values to other types if specified.
         * @param message EventGameOver
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wire.EventGameOver, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EventGameOver to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EventGameTick. */
    interface IEventGameTick {

        /** EventGameTick game */
        game?: (wire.game.IGame|null);
    }

    /** Represents an EventGameTick. */
    class EventGameTick implements IEventGameTick {

        /**
         * Constructs a new EventGameTick.
         * @param [properties] Properties to set
         */
        constructor(properties?: wire.IEventGameTick);

        /** EventGameTick game. */
        public game?: (wire.game.IGame|null);

        /**
         * Creates a new EventGameTick instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EventGameTick instance
         */
        public static create(properties?: wire.IEventGameTick): wire.EventGameTick;

        /**
         * Encodes the specified EventGameTick message. Does not implicitly {@link wire.EventGameTick.verify|verify} messages.
         * @param message EventGameTick message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wire.IEventGameTick, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EventGameTick message, length delimited. Does not implicitly {@link wire.EventGameTick.verify|verify} messages.
         * @param message EventGameTick message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wire.IEventGameTick, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EventGameTick message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EventGameTick
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.EventGameTick;

        /**
         * Decodes an EventGameTick message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EventGameTick
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.EventGameTick;

        /**
         * Verifies an EventGameTick message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EventGameTick message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EventGameTick
         */
        public static fromObject(object: { [k: string]: any }): wire.EventGameTick;

        /**
         * Creates a plain object from an EventGameTick message. Also converts values to other types if specified.
         * @param message EventGameTick
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wire.EventGameTick, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EventGameTick to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Namespace game. */
    namespace game {

        /** Properties of a Coordinate. */
        interface ICoordinate {

            /** Coordinate x */
            x?: (number|null);

            /** Coordinate y */
            y?: (number|null);
        }

        /** Represents a Coordinate. */
        class Coordinate implements ICoordinate {

            /**
             * Constructs a new Coordinate.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.game.ICoordinate);

            /** Coordinate x. */
            public x: number;

            /** Coordinate y. */
            public y: number;

            /**
             * Creates a new Coordinate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Coordinate instance
             */
            public static create(properties?: wire.game.ICoordinate): wire.game.Coordinate;

            /**
             * Encodes the specified Coordinate message. Does not implicitly {@link wire.game.Coordinate.verify|verify} messages.
             * @param message Coordinate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.game.ICoordinate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Coordinate message, length delimited. Does not implicitly {@link wire.game.Coordinate.verify|verify} messages.
             * @param message Coordinate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.game.ICoordinate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Coordinate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Coordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.game.Coordinate;

            /**
             * Decodes a Coordinate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Coordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.game.Coordinate;

            /**
             * Verifies a Coordinate message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Coordinate message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Coordinate
             */
            public static fromObject(object: { [k: string]: any }): wire.game.Coordinate;

            /**
             * Creates a plain object from a Coordinate message. Also converts values to other types if specified.
             * @param message Coordinate
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.game.Coordinate, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Coordinate to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FloatCoordinate. */
        interface IFloatCoordinate {

            /** FloatCoordinate x */
            x?: (number|null);

            /** FloatCoordinate y */
            y?: (number|null);
        }

        /** Represents a FloatCoordinate. */
        class FloatCoordinate implements IFloatCoordinate {

            /**
             * Constructs a new FloatCoordinate.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.game.IFloatCoordinate);

            /** FloatCoordinate x. */
            public x: number;

            /** FloatCoordinate y. */
            public y: number;

            /**
             * Creates a new FloatCoordinate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FloatCoordinate instance
             */
            public static create(properties?: wire.game.IFloatCoordinate): wire.game.FloatCoordinate;

            /**
             * Encodes the specified FloatCoordinate message. Does not implicitly {@link wire.game.FloatCoordinate.verify|verify} messages.
             * @param message FloatCoordinate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.game.IFloatCoordinate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FloatCoordinate message, length delimited. Does not implicitly {@link wire.game.FloatCoordinate.verify|verify} messages.
             * @param message FloatCoordinate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.game.IFloatCoordinate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FloatCoordinate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FloatCoordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.game.FloatCoordinate;

            /**
             * Decodes a FloatCoordinate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FloatCoordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.game.FloatCoordinate;

            /**
             * Verifies a FloatCoordinate message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FloatCoordinate message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FloatCoordinate
             */
            public static fromObject(object: { [k: string]: any }): wire.game.FloatCoordinate;

            /**
             * Creates a plain object from a FloatCoordinate message. Also converts values to other types if specified.
             * @param message FloatCoordinate
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.game.FloatCoordinate, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FloatCoordinate to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** PlayerState enum. */
        enum PlayerState {
            ALIVE = 0,
            PENDING_REVIVAL = 1,
            DEAD = 2,
            LEFT_GAME = 3
        }

        /** Properties of a Player. */
        interface IPlayer {

            /** Player id */
            id?: (string|null);

            /** Player state */
            state?: (wire.game.PlayerState|null);
        }

        /** Represents a Player. */
        class Player implements IPlayer {

            /**
             * Constructs a new Player.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.game.IPlayer);

            /** Player id. */
            public id: string;

            /** Player state. */
            public state: wire.game.PlayerState;

            /**
             * Creates a new Player instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Player instance
             */
            public static create(properties?: wire.game.IPlayer): wire.game.Player;

            /**
             * Encodes the specified Player message. Does not implicitly {@link wire.game.Player.verify|verify} messages.
             * @param message Player message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.game.IPlayer, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Player message, length delimited. Does not implicitly {@link wire.game.Player.verify|verify} messages.
             * @param message Player message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.game.IPlayer, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Player message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.game.Player;

            /**
             * Decodes a Player message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.game.Player;

            /**
             * Verifies a Player message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Player message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Player
             */
            public static fromObject(object: { [k: string]: any }): wire.game.Player;

            /**
             * Creates a plain object from a Player message. Also converts values to other types if specified.
             * @param message Player
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.game.Player, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Player to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Army. */
        interface IArmy {

            /** Army ownerId */
            ownerId?: (string|null);

            /** Army strength */
            strength?: (number|null);
        }

        /** Represents an Army. */
        class Army implements IArmy {

            /**
             * Constructs a new Army.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.game.IArmy);

            /** Army ownerId. */
            public ownerId: string;

            /** Army strength. */
            public strength: number;

            /**
             * Creates a new Army instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Army instance
             */
            public static create(properties?: wire.game.IArmy): wire.game.Army;

            /**
             * Encodes the specified Army message. Does not implicitly {@link wire.game.Army.verify|verify} messages.
             * @param message Army message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.game.IArmy, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Army message, length delimited. Does not implicitly {@link wire.game.Army.verify|verify} messages.
             * @param message Army message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.game.IArmy, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Army message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Army
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.game.Army;

            /**
             * Decodes an Army message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Army
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.game.Army;

            /**
             * Verifies an Army message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Army message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Army
             */
            public static fromObject(object: { [k: string]: any }): wire.game.Army;

            /**
             * Creates a plain object from an Army message. Also converts values to other types if specified.
             * @param message Army
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.game.Army, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Army to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Airplane. */
        interface IAirplane {

            /** Airplane id */
            id?: (string|null);

            /** Airplane army */
            army?: (wire.game.IArmy|null);

            /** Airplane position */
            position?: (wire.game.IFloatCoordinate|null);

            /** Airplane direction */
            direction?: (number|null);

            /** Airplane speed */
            speed?: (number|null);
        }

        /** Represents an Airplane. */
        class Airplane implements IAirplane {

            /**
             * Constructs a new Airplane.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.game.IAirplane);

            /** Airplane id. */
            public id: string;

            /** Airplane army. */
            public army?: (wire.game.IArmy|null);

            /** Airplane position. */
            public position?: (wire.game.IFloatCoordinate|null);

            /** Airplane direction. */
            public direction: number;

            /** Airplane speed. */
            public speed: number;

            /**
             * Creates a new Airplane instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Airplane instance
             */
            public static create(properties?: wire.game.IAirplane): wire.game.Airplane;

            /**
             * Encodes the specified Airplane message. Does not implicitly {@link wire.game.Airplane.verify|verify} messages.
             * @param message Airplane message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.game.IAirplane, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Airplane message, length delimited. Does not implicitly {@link wire.game.Airplane.verify|verify} messages.
             * @param message Airplane message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.game.IAirplane, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Airplane message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Airplane
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.game.Airplane;

            /**
             * Decodes an Airplane message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Airplane
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.game.Airplane;

            /**
             * Verifies an Airplane message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Airplane message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Airplane
             */
            public static fromObject(object: { [k: string]: any }): wire.game.Airplane;

            /**
             * Creates a plain object from an Airplane message. Also converts values to other types if specified.
             * @param message Airplane
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.game.Airplane, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Airplane to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Island. */
        interface IIsland {

            /** Island id */
            id?: (string|null);

            /** Island army */
            army?: (wire.game.IArmy|null);

            /** Island position */
            position?: (wire.game.ICoordinate|null);

            /** Island size */
            size?: (number|null);
        }

        /** Represents an Island. */
        class Island implements IIsland {

            /**
             * Constructs a new Island.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.game.IIsland);

            /** Island id. */
            public id: string;

            /** Island army. */
            public army?: (wire.game.IArmy|null);

            /** Island position. */
            public position?: (wire.game.ICoordinate|null);

            /** Island size. */
            public size: number;

            /**
             * Creates a new Island instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Island instance
             */
            public static create(properties?: wire.game.IIsland): wire.game.Island;

            /**
             * Encodes the specified Island message. Does not implicitly {@link wire.game.Island.verify|verify} messages.
             * @param message Island message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.game.IIsland, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Island message, length delimited. Does not implicitly {@link wire.game.Island.verify|verify} messages.
             * @param message Island message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.game.IIsland, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Island message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Island
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.game.Island;

            /**
             * Decodes an Island message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Island
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.game.Island;

            /**
             * Verifies an Island message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Island message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Island
             */
            public static fromObject(object: { [k: string]: any }): wire.game.Island;

            /**
             * Creates a plain object from an Island message. Also converts values to other types if specified.
             * @param message Island
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.game.Island, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Island to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Game. */
        interface IGame {

            /** Game id */
            id?: (string|null);

            /** Game size */
            size?: (wire.game.ICoordinate|null);

            /** Game playerNeutral */
            playerNeutral?: (wire.game.IPlayer|null);

            /** Game players */
            players?: (wire.game.IPlayer[]|null);

            /** Game islands */
            islands?: (wire.game.IIsland[]|null);

            /** Game airplanes */
            airplanes?: (wire.game.IAirplane[]|null);
        }

        /** Represents a Game. */
        class Game implements IGame {

            /**
             * Constructs a new Game.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.game.IGame);

            /** Game id. */
            public id: string;

            /** Game size. */
            public size?: (wire.game.ICoordinate|null);

            /** Game playerNeutral. */
            public playerNeutral?: (wire.game.IPlayer|null);

            /** Game players. */
            public players: wire.game.IPlayer[];

            /** Game islands. */
            public islands: wire.game.IIsland[];

            /** Game airplanes. */
            public airplanes: wire.game.IAirplane[];

            /**
             * Creates a new Game instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Game instance
             */
            public static create(properties?: wire.game.IGame): wire.game.Game;

            /**
             * Encodes the specified Game message. Does not implicitly {@link wire.game.Game.verify|verify} messages.
             * @param message Game message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.game.IGame, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Game message, length delimited. Does not implicitly {@link wire.game.Game.verify|verify} messages.
             * @param message Game message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.game.IGame, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Game message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Game
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.game.Game;

            /**
             * Decodes a Game message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Game
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.game.Game;

            /**
             * Verifies a Game message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Game message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Game
             */
            public static fromObject(object: { [k: string]: any }): wire.game.Game;

            /**
             * Creates a plain object from a Game message. Also converts values to other types if specified.
             * @param message Game
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.game.Game, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Game to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
