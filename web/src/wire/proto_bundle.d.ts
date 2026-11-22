import * as $protobuf from "protobufjs";
import Long = require("long");

/** Namespace wire. */
export namespace wire {

    /** Namespace msg. */
    namespace msg {

        /**
         * Properties of a Coordinate.
         * @deprecated Use wire.msg.Coordinate.$Properties instead.
         */
        interface ICoordinate extends wire.msg.Coordinate.$Properties {
        }

        /** Represents a Coordinate. */
        class Coordinate {

            /**
             * Constructs a new Coordinate.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.Coordinate.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Coordinate x. */
            x: number;

            /** Coordinate y. */
            y: number;

            /**
             * Creates a new Coordinate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Coordinate instance
             */
            static create(properties: wire.msg.Coordinate.$Shape): wire.msg.Coordinate & wire.msg.Coordinate.$Shape;
            static create(properties?: wire.msg.Coordinate.$Properties): wire.msg.Coordinate;

            /**
             * Encodes the specified Coordinate message. Does not implicitly {@link wire.msg.Coordinate.verify|verify} messages.
             * @param message Coordinate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.Coordinate.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Coordinate message, length delimited. Does not implicitly {@link wire.msg.Coordinate.verify|verify} messages.
             * @param message Coordinate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.Coordinate.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Coordinate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.Coordinate & wire.msg.Coordinate.$Shape} Coordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.Coordinate & wire.msg.Coordinate.$Shape;

            /**
             * Decodes a Coordinate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.Coordinate & wire.msg.Coordinate.$Shape} Coordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.Coordinate & wire.msg.Coordinate.$Shape;

            /**
             * Verifies a Coordinate message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Coordinate message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Coordinate
             */
            static fromObject(object: { [k: string]: any }): wire.msg.Coordinate;

            /**
             * Creates a plain object from a Coordinate message. Also converts values to other types if specified.
             * @param message Coordinate
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.Coordinate, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Coordinate to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Coordinate
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Coordinate {

            /** Properties of a Coordinate. */
            interface $Properties {

                /** Coordinate x */
                x?: (number|null);

                /** Coordinate y */
                y?: (number|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a Coordinate. */
            type $Shape = wire.msg.Coordinate.$Properties;
        }

        /**
         * Properties of a FloatCoordinate.
         * @deprecated Use wire.msg.FloatCoordinate.$Properties instead.
         */
        interface IFloatCoordinate extends wire.msg.FloatCoordinate.$Properties {
        }

        /** Represents a FloatCoordinate. */
        class FloatCoordinate {

            /**
             * Constructs a new FloatCoordinate.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.FloatCoordinate.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** FloatCoordinate x. */
            x: number;

            /** FloatCoordinate y. */
            y: number;

            /**
             * Creates a new FloatCoordinate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FloatCoordinate instance
             */
            static create(properties: wire.msg.FloatCoordinate.$Shape): wire.msg.FloatCoordinate & wire.msg.FloatCoordinate.$Shape;
            static create(properties?: wire.msg.FloatCoordinate.$Properties): wire.msg.FloatCoordinate;

            /**
             * Encodes the specified FloatCoordinate message. Does not implicitly {@link wire.msg.FloatCoordinate.verify|verify} messages.
             * @param message FloatCoordinate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.FloatCoordinate.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FloatCoordinate message, length delimited. Does not implicitly {@link wire.msg.FloatCoordinate.verify|verify} messages.
             * @param message FloatCoordinate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.FloatCoordinate.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FloatCoordinate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.FloatCoordinate & wire.msg.FloatCoordinate.$Shape} FloatCoordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.FloatCoordinate & wire.msg.FloatCoordinate.$Shape;

            /**
             * Decodes a FloatCoordinate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.FloatCoordinate & wire.msg.FloatCoordinate.$Shape} FloatCoordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.FloatCoordinate & wire.msg.FloatCoordinate.$Shape;

            /**
             * Verifies a FloatCoordinate message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FloatCoordinate message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FloatCoordinate
             */
            static fromObject(object: { [k: string]: any }): wire.msg.FloatCoordinate;

            /**
             * Creates a plain object from a FloatCoordinate message. Also converts values to other types if specified.
             * @param message FloatCoordinate
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.FloatCoordinate, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FloatCoordinate to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for FloatCoordinate
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace FloatCoordinate {

            /** Properties of a FloatCoordinate. */
            interface $Properties {

                /** FloatCoordinate x */
                x?: (number|null);

                /** FloatCoordinate y */
                y?: (number|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a FloatCoordinate. */
            type $Shape = wire.msg.FloatCoordinate.$Properties;
        }

        /** PlayerState enum. */
        enum PlayerState {

            /** ALIVE value */
            ALIVE = 0,

            /** PENDING_REVIVAL value */
            PENDING_REVIVAL = 1,

            /** DEAD value */
            DEAD = 2,

            /** LEFT_GAME value */
            LEFT_GAME = 3
        }

        /**
         * Properties of a Player.
         * @deprecated Use wire.msg.Player.$Properties instead.
         */
        interface IPlayer extends wire.msg.Player.$Properties {
        }

        /** Represents a Player. */
        class Player {

            /**
             * Constructs a new Player.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.Player.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Player id. */
            id: string;

            /** Player state. */
            state: wire.msg.PlayerState;

            /** Player lastLaunchSeq. */
            lastLaunchSeq: number;

            /**
             * Creates a new Player instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Player instance
             */
            static create(properties: wire.msg.Player.$Shape): wire.msg.Player & wire.msg.Player.$Shape;
            static create(properties?: wire.msg.Player.$Properties): wire.msg.Player;

            /**
             * Encodes the specified Player message. Does not implicitly {@link wire.msg.Player.verify|verify} messages.
             * @param message Player message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.Player.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Player message, length delimited. Does not implicitly {@link wire.msg.Player.verify|verify} messages.
             * @param message Player message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.Player.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Player message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.Player & wire.msg.Player.$Shape} Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.Player & wire.msg.Player.$Shape;

            /**
             * Decodes a Player message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.Player & wire.msg.Player.$Shape} Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.Player & wire.msg.Player.$Shape;

            /**
             * Verifies a Player message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Player message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Player
             */
            static fromObject(object: { [k: string]: any }): wire.msg.Player;

            /**
             * Creates a plain object from a Player message. Also converts values to other types if specified.
             * @param message Player
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.Player, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Player to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Player
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Player {

            /** Properties of a Player. */
            interface $Properties {

                /** Player id */
                id?: (string|null);

                /** Player state */
                state?: (wire.msg.PlayerState|null);

                /** Player lastLaunchSeq */
                lastLaunchSeq?: (number|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a Player. */
            type $Shape = wire.msg.Player.$Properties;
        }

        /**
         * Properties of an Army.
         * @deprecated Use wire.msg.Army.$Properties instead.
         */
        interface IArmy extends wire.msg.Army.$Properties {
        }

        /** Represents an Army. */
        class Army {

            /**
             * Constructs a new Army.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.Army.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Army ownerId. */
            ownerId: string;

            /** Army strength. */
            strength: number;

            /**
             * Creates a new Army instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Army instance
             */
            static create(properties: wire.msg.Army.$Shape): wire.msg.Army & wire.msg.Army.$Shape;
            static create(properties?: wire.msg.Army.$Properties): wire.msg.Army;

            /**
             * Encodes the specified Army message. Does not implicitly {@link wire.msg.Army.verify|verify} messages.
             * @param message Army message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.Army.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Army message, length delimited. Does not implicitly {@link wire.msg.Army.verify|verify} messages.
             * @param message Army message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.Army.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Army message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.Army & wire.msg.Army.$Shape} Army
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.Army & wire.msg.Army.$Shape;

            /**
             * Decodes an Army message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.Army & wire.msg.Army.$Shape} Army
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.Army & wire.msg.Army.$Shape;

            /**
             * Verifies an Army message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Army message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Army
             */
            static fromObject(object: { [k: string]: any }): wire.msg.Army;

            /**
             * Creates a plain object from an Army message. Also converts values to other types if specified.
             * @param message Army
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.Army, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Army to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Army
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Army {

            /** Properties of an Army. */
            interface $Properties {

                /** Army ownerId */
                ownerId?: (string|null);

                /** Army strength */
                strength?: (number|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an Army. */
            type $Shape = wire.msg.Army.$Properties;
        }

        /**
         * Properties of an Airplane.
         * @deprecated Use wire.msg.Airplane.$Properties instead.
         */
        interface IAirplane extends wire.msg.Airplane.$Properties {
        }

        /** Represents an Airplane. */
        class Airplane {

            /**
             * Constructs a new Airplane.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.Airplane.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Airplane id. */
            id: string;

            /** Airplane army. */
            army?: (wire.msg.Army.$Properties|null);

            /** Airplane position. */
            position?: (wire.msg.FloatCoordinate.$Properties|null);

            /** Airplane direction. */
            direction: number;

            /** Airplane speed. */
            speed: number;

            /** Airplane destinationId. */
            destinationId: string;

            /** Airplane launchSeq. */
            launchSeq: number;

            /**
             * Creates a new Airplane instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Airplane instance
             */
            static create(properties: wire.msg.Airplane.$Shape): wire.msg.Airplane & wire.msg.Airplane.$Shape;
            static create(properties?: wire.msg.Airplane.$Properties): wire.msg.Airplane;

            /**
             * Encodes the specified Airplane message. Does not implicitly {@link wire.msg.Airplane.verify|verify} messages.
             * @param message Airplane message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.Airplane.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Airplane message, length delimited. Does not implicitly {@link wire.msg.Airplane.verify|verify} messages.
             * @param message Airplane message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.Airplane.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Airplane message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.Airplane & wire.msg.Airplane.$Shape} Airplane
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.Airplane & wire.msg.Airplane.$Shape;

            /**
             * Decodes an Airplane message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.Airplane & wire.msg.Airplane.$Shape} Airplane
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.Airplane & wire.msg.Airplane.$Shape;

            /**
             * Verifies an Airplane message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Airplane message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Airplane
             */
            static fromObject(object: { [k: string]: any }): wire.msg.Airplane;

            /**
             * Creates a plain object from an Airplane message. Also converts values to other types if specified.
             * @param message Airplane
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.Airplane, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Airplane to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Airplane
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Airplane {

            /** Properties of an Airplane. */
            interface $Properties {

                /** Airplane id */
                id?: (string|null);

                /** Airplane army */
                army?: (wire.msg.Army.$Properties|null);

                /** Airplane position */
                position?: (wire.msg.FloatCoordinate.$Properties|null);

                /** Airplane direction */
                direction?: (number|null);

                /** Airplane speed */
                speed?: (number|null);

                /** Airplane destinationId */
                destinationId?: (string|null);

                /** Airplane launchSeq */
                launchSeq?: (number|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an Airplane. */
            type $Shape = wire.msg.Airplane.$Properties;
        }

        /**
         * Properties of an Island.
         * @deprecated Use wire.msg.Island.$Properties instead.
         */
        interface IIsland extends wire.msg.Island.$Properties {
        }

        /** Represents an Island. */
        class Island {

            /**
             * Constructs a new Island.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.Island.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Island id. */
            id: string;

            /** Island army. */
            army?: (wire.msg.Army.$Properties|null);

            /** Island position. */
            position?: (wire.msg.Coordinate.$Properties|null);

            /** Island size. */
            size: number;

            /** Island garrison. */
            garrison: number;

            /**
             * Creates a new Island instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Island instance
             */
            static create(properties: wire.msg.Island.$Shape): wire.msg.Island & wire.msg.Island.$Shape;
            static create(properties?: wire.msg.Island.$Properties): wire.msg.Island;

            /**
             * Encodes the specified Island message. Does not implicitly {@link wire.msg.Island.verify|verify} messages.
             * @param message Island message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.Island.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Island message, length delimited. Does not implicitly {@link wire.msg.Island.verify|verify} messages.
             * @param message Island message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.Island.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Island message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.Island & wire.msg.Island.$Shape} Island
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.Island & wire.msg.Island.$Shape;

            /**
             * Decodes an Island message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.Island & wire.msg.Island.$Shape} Island
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.Island & wire.msg.Island.$Shape;

            /**
             * Verifies an Island message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Island message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Island
             */
            static fromObject(object: { [k: string]: any }): wire.msg.Island;

            /**
             * Creates a plain object from an Island message. Also converts values to other types if specified.
             * @param message Island
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.Island, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Island to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Island
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Island {

            /** Properties of an Island. */
            interface $Properties {

                /** Island id */
                id?: (string|null);

                /** Island army */
                army?: (wire.msg.Army.$Properties|null);

                /** Island position */
                position?: (wire.msg.Coordinate.$Properties|null);

                /** Island size */
                size?: (number|null);

                /** Island garrison */
                garrison?: (number|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an Island. */
            type $Shape = wire.msg.Island.$Properties;
        }

        /**
         * Properties of a Game.
         * @deprecated Use wire.msg.Game.$Properties instead.
         */
        interface IGame extends wire.msg.Game.$Properties {
        }

        /** Represents a Game. */
        class Game {

            /**
             * Constructs a new Game.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.Game.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Game id. */
            id: string;

            /** Game size. */
            size?: (wire.msg.Coordinate.$Properties|null);

            /** Game playerNeutral. */
            playerNeutral?: (wire.msg.Player.$Properties|null);

            /** Game players. */
            players: wire.msg.Player.$Properties[];

            /** Game islands. */
            islands: wire.msg.Island.$Properties[];

            /** Game airplanes. */
            airplanes: wire.msg.Airplane.$Properties[];

            /**
             * Creates a new Game instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Game instance
             */
            static create(properties: wire.msg.Game.$Shape): wire.msg.Game & wire.msg.Game.$Shape;
            static create(properties?: wire.msg.Game.$Properties): wire.msg.Game;

            /**
             * Encodes the specified Game message. Does not implicitly {@link wire.msg.Game.verify|verify} messages.
             * @param message Game message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.Game.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Game message, length delimited. Does not implicitly {@link wire.msg.Game.verify|verify} messages.
             * @param message Game message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.Game.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Game message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.Game & wire.msg.Game.$Shape} Game
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.Game & wire.msg.Game.$Shape;

            /**
             * Decodes a Game message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.Game & wire.msg.Game.$Shape} Game
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.Game & wire.msg.Game.$Shape;

            /**
             * Verifies a Game message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Game message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Game
             */
            static fromObject(object: { [k: string]: any }): wire.msg.Game;

            /**
             * Creates a plain object from a Game message. Also converts values to other types if specified.
             * @param message Game
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.Game, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Game to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Game
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Game {

            /** Properties of a Game. */
            interface $Properties {

                /** Game id */
                id?: (string|null);

                /** Game size */
                size?: (wire.msg.Coordinate.$Properties|null);

                /** Game playerNeutral */
                playerNeutral?: (wire.msg.Player.$Properties|null);

                /** Game players */
                players?: (wire.msg.Player.$Properties[]|null);

                /** Game islands */
                islands?: (wire.msg.Island.$Properties[]|null);

                /** Game airplanes */
                airplanes?: (wire.msg.Airplane.$Properties[]|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a Game. */
            type $Shape = wire.msg.Game.$Properties;
        }

        /**
         * Properties of an EventEnvelope.
         * @deprecated Use wire.msg.EventEnvelope.$Properties instead.
         */
        interface IEventEnvelope extends wire.msg.EventEnvelope.$Properties {
        }

        /** Represents an EventEnvelope. */
        class EventEnvelope {

            /**
             * Constructs a new EventEnvelope.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.EventEnvelope.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** EventEnvelope eventGameStart. */
            eventGameStart?: (wire.msg.EventGameStart.$Properties|null);

            /** EventEnvelope eventGameOver. */
            eventGameOver?: (wire.msg.EventGameOver.$Properties|null);

            /** EventEnvelope eventGameSnapshot. */
            eventGameSnapshot?: (wire.msg.EventGameSnapshot.$Properties|null);

            /** EventEnvelope eventGameDelta. */
            eventGameDelta?: (wire.msg.EventGameDelta.$Properties|null);

            /** EventEnvelope event. */
            event?: ("eventGameStart"|"eventGameOver"|"eventGameSnapshot"|"eventGameDelta");

            /**
             * Creates a new EventEnvelope instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EventEnvelope instance
             */
            static create(properties: wire.msg.EventEnvelope.$Shape): wire.msg.EventEnvelope & wire.msg.EventEnvelope.$Shape;
            static create(properties?: wire.msg.EventEnvelope.$Properties): wire.msg.EventEnvelope;

            /**
             * Encodes the specified EventEnvelope message. Does not implicitly {@link wire.msg.EventEnvelope.verify|verify} messages.
             * @param message EventEnvelope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.EventEnvelope.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EventEnvelope message, length delimited. Does not implicitly {@link wire.msg.EventEnvelope.verify|verify} messages.
             * @param message EventEnvelope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.EventEnvelope.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EventEnvelope message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.EventEnvelope & wire.msg.EventEnvelope.$Shape} EventEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.EventEnvelope & wire.msg.EventEnvelope.$Shape;

            /**
             * Decodes an EventEnvelope message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.EventEnvelope & wire.msg.EventEnvelope.$Shape} EventEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.EventEnvelope & wire.msg.EventEnvelope.$Shape;

            /**
             * Verifies an EventEnvelope message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EventEnvelope message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EventEnvelope
             */
            static fromObject(object: { [k: string]: any }): wire.msg.EventEnvelope;

            /**
             * Creates a plain object from an EventEnvelope message. Also converts values to other types if specified.
             * @param message EventEnvelope
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.EventEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EventEnvelope to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for EventEnvelope
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace EventEnvelope {

            /** Properties of an EventEnvelope. */
            interface $Properties {

                /** EventEnvelope eventGameStart */
                eventGameStart?: (wire.msg.EventGameStart.$Properties|null);

                /** EventEnvelope eventGameOver */
                eventGameOver?: (wire.msg.EventGameOver.$Properties|null);

                /** EventEnvelope eventGameSnapshot */
                eventGameSnapshot?: (wire.msg.EventGameSnapshot.$Properties|null);

                /** EventEnvelope eventGameDelta */
                eventGameDelta?: (wire.msg.EventGameDelta.$Properties|null);

                /** EventEnvelope event */
                event?: ("eventGameStart"|"eventGameOver"|"eventGameSnapshot"|"eventGameDelta");

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Narrowed shape of an EventEnvelope. */
            type $Shape = {
              eventGameStart?: wire.msg.EventGameStart.$Shape|null;
              eventGameOver?: wire.msg.EventGameOver.$Shape|null;
              eventGameSnapshot?: wire.msg.EventGameSnapshot.$Shape|null;
              eventGameDelta?: wire.msg.EventGameDelta.$Shape|null;
              $unknowns?: Uint8Array[];
            } & (
              ({ event?: undefined; eventGameStart?: null; eventGameOver?: null; eventGameSnapshot?: null; eventGameDelta?: null }|{ event?: "eventGameStart"; eventGameStart: wire.msg.EventGameStart.$Shape; eventGameOver?: null; eventGameSnapshot?: null; eventGameDelta?: null }|{ event?: "eventGameOver"; eventGameStart?: null; eventGameOver: wire.msg.EventGameOver.$Shape; eventGameSnapshot?: null; eventGameDelta?: null }|{ event?: "eventGameSnapshot"; eventGameStart?: null; eventGameOver?: null; eventGameSnapshot: wire.msg.EventGameSnapshot.$Shape; eventGameDelta?: null }|{ event?: "eventGameDelta"; eventGameStart?: null; eventGameOver?: null; eventGameSnapshot?: null; eventGameDelta: wire.msg.EventGameDelta.$Shape })
            );
        }

        /**
         * Properties of an EventGameStart.
         * @deprecated Use wire.msg.EventGameStart.$Properties instead.
         */
        interface IEventGameStart extends wire.msg.EventGameStart.$Properties {
        }

        /** Represents an EventGameStart. */
        class EventGameStart {

            /**
             * Constructs a new EventGameStart.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.EventGameStart.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** EventGameStart playerId. */
            playerId: string;

            /** EventGameStart tickInterval. */
            tickInterval: number;

            /** EventGameStart resumeToken. */
            resumeToken: string;

            /** EventGameStart resumeTimeout. */
            resumeTimeout: number;

            /**
             * Creates a new EventGameStart instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EventGameStart instance
             */
            static create(properties: wire.msg.EventGameStart.$Shape): wire.msg.EventGameStart & wire.msg.EventGameStart.$Shape;
            static create(properties?: wire.msg.EventGameStart.$Properties): wire.msg.EventGameStart;

            /**
             * Encodes the specified EventGameStart message. Does not implicitly {@link wire.msg.EventGameStart.verify|verify} messages.
             * @param message EventGameStart message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.EventGameStart.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EventGameStart message, length delimited. Does not implicitly {@link wire.msg.EventGameStart.verify|verify} messages.
             * @param message EventGameStart message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.EventGameStart.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EventGameStart message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.EventGameStart & wire.msg.EventGameStart.$Shape} EventGameStart
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.EventGameStart & wire.msg.EventGameStart.$Shape;

            /**
             * Decodes an EventGameStart message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.EventGameStart & wire.msg.EventGameStart.$Shape} EventGameStart
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.EventGameStart & wire.msg.EventGameStart.$Shape;

            /**
             * Verifies an EventGameStart message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EventGameStart message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EventGameStart
             */
            static fromObject(object: { [k: string]: any }): wire.msg.EventGameStart;

            /**
             * Creates a plain object from an EventGameStart message. Also converts values to other types if specified.
             * @param message EventGameStart
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.EventGameStart, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EventGameStart to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for EventGameStart
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace EventGameStart {

            /** Properties of an EventGameStart. */
            interface $Properties {

                /** EventGameStart playerId */
                playerId?: (string|null);

                /** EventGameStart tickInterval */
                tickInterval?: (number|null);

                /** EventGameStart resumeToken */
                resumeToken?: (string|null);

                /** EventGameStart resumeTimeout */
                resumeTimeout?: (number|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an EventGameStart. */
            type $Shape = wire.msg.EventGameStart.$Properties;
        }

        /**
         * Properties of an EventGameOver.
         * @deprecated Use wire.msg.EventGameOver.$Properties instead.
         */
        interface IEventGameOver extends wire.msg.EventGameOver.$Properties {
        }

        /** Represents an EventGameOver. */
        class EventGameOver {

            /**
             * Constructs a new EventGameOver.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.EventGameOver.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** EventGameOver winnerId. */
            winnerId: string;

            /**
             * Creates a new EventGameOver instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EventGameOver instance
             */
            static create(properties: wire.msg.EventGameOver.$Shape): wire.msg.EventGameOver & wire.msg.EventGameOver.$Shape;
            static create(properties?: wire.msg.EventGameOver.$Properties): wire.msg.EventGameOver;

            /**
             * Encodes the specified EventGameOver message. Does not implicitly {@link wire.msg.EventGameOver.verify|verify} messages.
             * @param message EventGameOver message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.EventGameOver.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EventGameOver message, length delimited. Does not implicitly {@link wire.msg.EventGameOver.verify|verify} messages.
             * @param message EventGameOver message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.EventGameOver.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EventGameOver message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.EventGameOver & wire.msg.EventGameOver.$Shape} EventGameOver
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.EventGameOver & wire.msg.EventGameOver.$Shape;

            /**
             * Decodes an EventGameOver message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.EventGameOver & wire.msg.EventGameOver.$Shape} EventGameOver
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.EventGameOver & wire.msg.EventGameOver.$Shape;

            /**
             * Verifies an EventGameOver message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EventGameOver message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EventGameOver
             */
            static fromObject(object: { [k: string]: any }): wire.msg.EventGameOver;

            /**
             * Creates a plain object from an EventGameOver message. Also converts values to other types if specified.
             * @param message EventGameOver
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.EventGameOver, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EventGameOver to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for EventGameOver
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace EventGameOver {

            /** Properties of an EventGameOver. */
            interface $Properties {

                /** EventGameOver winnerId */
                winnerId?: (string|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an EventGameOver. */
            type $Shape = wire.msg.EventGameOver.$Properties;
        }

        /**
         * Properties of an EventGameSnapshot.
         * @deprecated Use wire.msg.EventGameSnapshot.$Properties instead.
         */
        interface IEventGameSnapshot extends wire.msg.EventGameSnapshot.$Properties {
        }

        /** Represents an EventGameSnapshot. */
        class EventGameSnapshot {

            /**
             * Constructs a new EventGameSnapshot.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.EventGameSnapshot.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** EventGameSnapshot seq. */
            seq: number;

            /** EventGameSnapshot gameTime. */
            gameTime: number;

            /** EventGameSnapshot game. */
            game?: (wire.msg.Game.$Properties|null);

            /**
             * Creates a new EventGameSnapshot instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EventGameSnapshot instance
             */
            static create(properties: wire.msg.EventGameSnapshot.$Shape): wire.msg.EventGameSnapshot & wire.msg.EventGameSnapshot.$Shape;
            static create(properties?: wire.msg.EventGameSnapshot.$Properties): wire.msg.EventGameSnapshot;

            /**
             * Encodes the specified EventGameSnapshot message. Does not implicitly {@link wire.msg.EventGameSnapshot.verify|verify} messages.
             * @param message EventGameSnapshot message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.EventGameSnapshot.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EventGameSnapshot message, length delimited. Does not implicitly {@link wire.msg.EventGameSnapshot.verify|verify} messages.
             * @param message EventGameSnapshot message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.EventGameSnapshot.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EventGameSnapshot message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.EventGameSnapshot & wire.msg.EventGameSnapshot.$Shape} EventGameSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.EventGameSnapshot & wire.msg.EventGameSnapshot.$Shape;

            /**
             * Decodes an EventGameSnapshot message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.EventGameSnapshot & wire.msg.EventGameSnapshot.$Shape} EventGameSnapshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.EventGameSnapshot & wire.msg.EventGameSnapshot.$Shape;

            /**
             * Verifies an EventGameSnapshot message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EventGameSnapshot message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EventGameSnapshot
             */
            static fromObject(object: { [k: string]: any }): wire.msg.EventGameSnapshot;

            /**
             * Creates a plain object from an EventGameSnapshot message. Also converts values to other types if specified.
             * @param message EventGameSnapshot
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.EventGameSnapshot, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EventGameSnapshot to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for EventGameSnapshot
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace EventGameSnapshot {

            /** Properties of an EventGameSnapshot. */
            interface $Properties {

                /** EventGameSnapshot seq */
                seq?: (number|null);

                /** EventGameSnapshot gameTime */
                gameTime?: (number|null);

                /** EventGameSnapshot game */
                game?: (wire.msg.Game.$Properties|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an EventGameSnapshot. */
            type $Shape = wire.msg.EventGameSnapshot.$Properties;
        }

        /**
         * Properties of an EventGameDelta.
         * @deprecated Use wire.msg.EventGameDelta.$Properties instead.
         */
        interface IEventGameDelta extends wire.msg.EventGameDelta.$Properties {
        }

        /** Represents an EventGameDelta. */
        class EventGameDelta {

            /**
             * Constructs a new EventGameDelta.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.EventGameDelta.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** EventGameDelta seq. */
            seq: number;

            /** EventGameDelta gameTime. */
            gameTime: number;

            /** EventGameDelta players. */
            players: wire.msg.Player.$Properties[];

            /** EventGameDelta islands. */
            islands: wire.msg.IslandUpdate.$Properties[];

            /** EventGameDelta airplanesAdded. */
            airplanesAdded: wire.msg.Airplane.$Properties[];

            /** EventGameDelta airplanesUpdated. */
            airplanesUpdated: wire.msg.AirplaneUpdate.$Properties[];

            /** EventGameDelta airplanesRemoved. */
            airplanesRemoved: string[];

            /**
             * Creates a new EventGameDelta instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EventGameDelta instance
             */
            static create(properties: wire.msg.EventGameDelta.$Shape): wire.msg.EventGameDelta & wire.msg.EventGameDelta.$Shape;
            static create(properties?: wire.msg.EventGameDelta.$Properties): wire.msg.EventGameDelta;

            /**
             * Encodes the specified EventGameDelta message. Does not implicitly {@link wire.msg.EventGameDelta.verify|verify} messages.
             * @param message EventGameDelta message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.EventGameDelta.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EventGameDelta message, length delimited. Does not implicitly {@link wire.msg.EventGameDelta.verify|verify} messages.
             * @param message EventGameDelta message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.EventGameDelta.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EventGameDelta message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.EventGameDelta & wire.msg.EventGameDelta.$Shape} EventGameDelta
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.EventGameDelta & wire.msg.EventGameDelta.$Shape;

            /**
             * Decodes an EventGameDelta message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.EventGameDelta & wire.msg.EventGameDelta.$Shape} EventGameDelta
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.EventGameDelta & wire.msg.EventGameDelta.$Shape;

            /**
             * Verifies an EventGameDelta message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EventGameDelta message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EventGameDelta
             */
            static fromObject(object: { [k: string]: any }): wire.msg.EventGameDelta;

            /**
             * Creates a plain object from an EventGameDelta message. Also converts values to other types if specified.
             * @param message EventGameDelta
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.EventGameDelta, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EventGameDelta to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for EventGameDelta
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace EventGameDelta {

            /** Properties of an EventGameDelta. */
            interface $Properties {

                /** EventGameDelta seq */
                seq?: (number|null);

                /** EventGameDelta gameTime */
                gameTime?: (number|null);

                /** EventGameDelta players */
                players?: (wire.msg.Player.$Properties[]|null);

                /** EventGameDelta islands */
                islands?: (wire.msg.IslandUpdate.$Properties[]|null);

                /** EventGameDelta airplanesAdded */
                airplanesAdded?: (wire.msg.Airplane.$Properties[]|null);

                /** EventGameDelta airplanesUpdated */
                airplanesUpdated?: (wire.msg.AirplaneUpdate.$Properties[]|null);

                /** EventGameDelta airplanesRemoved */
                airplanesRemoved?: (string[]|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an EventGameDelta. */
            type $Shape = wire.msg.EventGameDelta.$Properties;
        }

        /**
         * Properties of an IslandUpdate.
         * @deprecated Use wire.msg.IslandUpdate.$Properties instead.
         */
        interface IIslandUpdate extends wire.msg.IslandUpdate.$Properties {
        }

        /** Represents an IslandUpdate. */
        class IslandUpdate {

            /**
             * Constructs a new IslandUpdate.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.IslandUpdate.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** IslandUpdate id. */
            id: string;

            /** IslandUpdate army. */
            army?: (wire.msg.Army.$Properties|null);

            /** IslandUpdate garrison. */
            garrison: number;

            /**
             * Creates a new IslandUpdate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns IslandUpdate instance
             */
            static create(properties: wire.msg.IslandUpdate.$Shape): wire.msg.IslandUpdate & wire.msg.IslandUpdate.$Shape;
            static create(properties?: wire.msg.IslandUpdate.$Properties): wire.msg.IslandUpdate;

            /**
             * Encodes the specified IslandUpdate message. Does not implicitly {@link wire.msg.IslandUpdate.verify|verify} messages.
             * @param message IslandUpdate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.IslandUpdate.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified IslandUpdate message, length delimited. Does not implicitly {@link wire.msg.IslandUpdate.verify|verify} messages.
             * @param message IslandUpdate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.IslandUpdate.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an IslandUpdate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.IslandUpdate & wire.msg.IslandUpdate.$Shape} IslandUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.IslandUpdate & wire.msg.IslandUpdate.$Shape;

            /**
             * Decodes an IslandUpdate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.IslandUpdate & wire.msg.IslandUpdate.$Shape} IslandUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.IslandUpdate & wire.msg.IslandUpdate.$Shape;

            /**
             * Verifies an IslandUpdate message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an IslandUpdate message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns IslandUpdate
             */
            static fromObject(object: { [k: string]: any }): wire.msg.IslandUpdate;

            /**
             * Creates a plain object from an IslandUpdate message. Also converts values to other types if specified.
             * @param message IslandUpdate
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.IslandUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this IslandUpdate to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for IslandUpdate
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace IslandUpdate {

            /** Properties of an IslandUpdate. */
            interface $Properties {

                /** IslandUpdate id */
                id?: (string|null);

                /** IslandUpdate army */
                army?: (wire.msg.Army.$Properties|null);

                /** IslandUpdate garrison */
                garrison?: (number|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an IslandUpdate. */
            type $Shape = wire.msg.IslandUpdate.$Properties;
        }

        /**
         * Properties of an AirplaneUpdate.
         * @deprecated Use wire.msg.AirplaneUpdate.$Properties instead.
         */
        interface IAirplaneUpdate extends wire.msg.AirplaneUpdate.$Properties {
        }

        /** Represents an AirplaneUpdate. */
        class AirplaneUpdate {

            /**
             * Constructs a new AirplaneUpdate.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.AirplaneUpdate.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** AirplaneUpdate id. */
            id: string;

            /** AirplaneUpdate army. */
            army?: (wire.msg.Army.$Properties|null);

            /**
             * Creates a new AirplaneUpdate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AirplaneUpdate instance
             */
            static create(properties: wire.msg.AirplaneUpdate.$Shape): wire.msg.AirplaneUpdate & wire.msg.AirplaneUpdate.$Shape;
            static create(properties?: wire.msg.AirplaneUpdate.$Properties): wire.msg.AirplaneUpdate;

            /**
             * Encodes the specified AirplaneUpdate message. Does not implicitly {@link wire.msg.AirplaneUpdate.verify|verify} messages.
             * @param message AirplaneUpdate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.AirplaneUpdate.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AirplaneUpdate message, length delimited. Does not implicitly {@link wire.msg.AirplaneUpdate.verify|verify} messages.
             * @param message AirplaneUpdate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.AirplaneUpdate.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AirplaneUpdate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.AirplaneUpdate & wire.msg.AirplaneUpdate.$Shape} AirplaneUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.AirplaneUpdate & wire.msg.AirplaneUpdate.$Shape;

            /**
             * Decodes an AirplaneUpdate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.AirplaneUpdate & wire.msg.AirplaneUpdate.$Shape} AirplaneUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.AirplaneUpdate & wire.msg.AirplaneUpdate.$Shape;

            /**
             * Verifies an AirplaneUpdate message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AirplaneUpdate message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AirplaneUpdate
             */
            static fromObject(object: { [k: string]: any }): wire.msg.AirplaneUpdate;

            /**
             * Creates a plain object from an AirplaneUpdate message. Also converts values to other types if specified.
             * @param message AirplaneUpdate
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.AirplaneUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AirplaneUpdate to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for AirplaneUpdate
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace AirplaneUpdate {

            /** Properties of an AirplaneUpdate. */
            interface $Properties {

                /** AirplaneUpdate id */
                id?: (string|null);

                /** AirplaneUpdate army */
                army?: (wire.msg.Army.$Properties|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an AirplaneUpdate. */
            type $Shape = wire.msg.AirplaneUpdate.$Properties;
        }

        /**
         * Properties of an ActionEnvelope.
         * @deprecated Use wire.msg.ActionEnvelope.$Properties instead.
         */
        interface IActionEnvelope extends wire.msg.ActionEnvelope.$Properties {
        }

        /** Represents an ActionEnvelope. */
        class ActionEnvelope {

            /**
             * Constructs a new ActionEnvelope.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.ActionEnvelope.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** ActionEnvelope actionGameLeave. */
            actionGameLeave?: (wire.msg.ActionGameLeave.$Properties|null);

            /** ActionEnvelope actionGameLaunch. */
            actionGameLaunch?: (wire.msg.ActionGameLaunch.$Properties|null);

            /** ActionEnvelope action. */
            action?: ("actionGameLeave"|"actionGameLaunch");

            /**
             * Creates a new ActionEnvelope instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ActionEnvelope instance
             */
            static create(properties: wire.msg.ActionEnvelope.$Shape): wire.msg.ActionEnvelope & wire.msg.ActionEnvelope.$Shape;
            static create(properties?: wire.msg.ActionEnvelope.$Properties): wire.msg.ActionEnvelope;

            /**
             * Encodes the specified ActionEnvelope message. Does not implicitly {@link wire.msg.ActionEnvelope.verify|verify} messages.
             * @param message ActionEnvelope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.ActionEnvelope.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ActionEnvelope message, length delimited. Does not implicitly {@link wire.msg.ActionEnvelope.verify|verify} messages.
             * @param message ActionEnvelope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.ActionEnvelope.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ActionEnvelope message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.ActionEnvelope & wire.msg.ActionEnvelope.$Shape} ActionEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.ActionEnvelope & wire.msg.ActionEnvelope.$Shape;

            /**
             * Decodes an ActionEnvelope message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.ActionEnvelope & wire.msg.ActionEnvelope.$Shape} ActionEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.ActionEnvelope & wire.msg.ActionEnvelope.$Shape;

            /**
             * Verifies an ActionEnvelope message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ActionEnvelope message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ActionEnvelope
             */
            static fromObject(object: { [k: string]: any }): wire.msg.ActionEnvelope;

            /**
             * Creates a plain object from an ActionEnvelope message. Also converts values to other types if specified.
             * @param message ActionEnvelope
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.ActionEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ActionEnvelope to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for ActionEnvelope
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace ActionEnvelope {

            /** Properties of an ActionEnvelope. */
            interface $Properties {

                /** ActionEnvelope actionGameLeave */
                actionGameLeave?: (wire.msg.ActionGameLeave.$Properties|null);

                /** ActionEnvelope actionGameLaunch */
                actionGameLaunch?: (wire.msg.ActionGameLaunch.$Properties|null);

                /** ActionEnvelope action */
                action?: ("actionGameLeave"|"actionGameLaunch");

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Narrowed shape of an ActionEnvelope. */
            type $Shape = {
              actionGameLeave?: wire.msg.ActionGameLeave.$Shape|null;
              actionGameLaunch?: wire.msg.ActionGameLaunch.$Shape|null;
              $unknowns?: Uint8Array[];
            } & (
              ({ action?: undefined; actionGameLeave?: null; actionGameLaunch?: null }|{ action?: "actionGameLeave"; actionGameLeave: wire.msg.ActionGameLeave.$Shape; actionGameLaunch?: null }|{ action?: "actionGameLaunch"; actionGameLeave?: null; actionGameLaunch: wire.msg.ActionGameLaunch.$Shape })
            );
        }

        /**
         * Properties of an ActionGameLeave.
         * @deprecated Use wire.msg.ActionGameLeave.$Properties instead.
         */
        interface IActionGameLeave extends wire.msg.ActionGameLeave.$Properties {
        }

        /** Represents an ActionGameLeave. */
        class ActionGameLeave {

            /**
             * Constructs a new ActionGameLeave.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.ActionGameLeave.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /**
             * Creates a new ActionGameLeave instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ActionGameLeave instance
             */
            static create(properties: wire.msg.ActionGameLeave.$Shape): wire.msg.ActionGameLeave & wire.msg.ActionGameLeave.$Shape;
            static create(properties?: wire.msg.ActionGameLeave.$Properties): wire.msg.ActionGameLeave;

            /**
             * Encodes the specified ActionGameLeave message. Does not implicitly {@link wire.msg.ActionGameLeave.verify|verify} messages.
             * @param message ActionGameLeave message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.ActionGameLeave.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ActionGameLeave message, length delimited. Does not implicitly {@link wire.msg.ActionGameLeave.verify|verify} messages.
             * @param message ActionGameLeave message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.ActionGameLeave.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ActionGameLeave message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.ActionGameLeave & wire.msg.ActionGameLeave.$Shape} ActionGameLeave
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.ActionGameLeave & wire.msg.ActionGameLeave.$Shape;

            /**
             * Decodes an ActionGameLeave message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.ActionGameLeave & wire.msg.ActionGameLeave.$Shape} ActionGameLeave
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.ActionGameLeave & wire.msg.ActionGameLeave.$Shape;

            /**
             * Verifies an ActionGameLeave message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ActionGameLeave message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ActionGameLeave
             */
            static fromObject(object: { [k: string]: any }): wire.msg.ActionGameLeave;

            /**
             * Creates a plain object from an ActionGameLeave message. Also converts values to other types if specified.
             * @param message ActionGameLeave
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.ActionGameLeave, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ActionGameLeave to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for ActionGameLeave
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace ActionGameLeave {

            /** Properties of an ActionGameLeave. */
            interface $Properties {

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an ActionGameLeave. */
            type $Shape = wire.msg.ActionGameLeave.$Properties;
        }

        /**
         * Properties of an ActionGameLaunch.
         * @deprecated Use wire.msg.ActionGameLaunch.$Properties instead.
         */
        interface IActionGameLaunch extends wire.msg.ActionGameLaunch.$Properties {
        }

        /** Represents an ActionGameLaunch. */
        class ActionGameLaunch {

            /**
             * Constructs a new ActionGameLaunch.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.ActionGameLaunch.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** ActionGameLaunch fromId. */
            fromId: string;

            /** ActionGameLaunch toId. */
            toId: string;

            /** ActionGameLaunch seq. */
            seq: number;

            /**
             * Creates a new ActionGameLaunch instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ActionGameLaunch instance
             */
            static create(properties: wire.msg.ActionGameLaunch.$Shape): wire.msg.ActionGameLaunch & wire.msg.ActionGameLaunch.$Shape;
            static create(properties?: wire.msg.ActionGameLaunch.$Properties): wire.msg.ActionGameLaunch;

            /**
             * Encodes the specified ActionGameLaunch message. Does not implicitly {@link wire.msg.ActionGameLaunch.verify|verify} messages.
             * @param message ActionGameLaunch message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: wire.msg.ActionGameLaunch.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ActionGameLaunch message, length delimited. Does not implicitly {@link wire.msg.ActionGameLaunch.verify|verify} messages.
             * @param message ActionGameLaunch message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: wire.msg.ActionGameLaunch.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ActionGameLaunch message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {wire.msg.ActionGameLaunch & wire.msg.ActionGameLaunch.$Shape} ActionGameLaunch
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.ActionGameLaunch & wire.msg.ActionGameLaunch.$Shape;

            /**
             * Decodes an ActionGameLaunch message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {wire.msg.ActionGameLaunch & wire.msg.ActionGameLaunch.$Shape} ActionGameLaunch
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.ActionGameLaunch & wire.msg.ActionGameLaunch.$Shape;

            /**
             * Verifies an ActionGameLaunch message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ActionGameLaunch message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ActionGameLaunch
             */
            static fromObject(object: { [k: string]: any }): wire.msg.ActionGameLaunch;

            /**
             * Creates a plain object from an ActionGameLaunch message. Also converts values to other types if specified.
             * @param message ActionGameLaunch
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: wire.msg.ActionGameLaunch, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ActionGameLaunch to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for ActionGameLaunch
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace ActionGameLaunch {

            /** Properties of an ActionGameLaunch. */
            interface $Properties {

                /** ActionGameLaunch fromId */
                fromId?: (string|null);

                /** ActionGameLaunch toId */
                toId?: (string|null);

                /** ActionGameLaunch seq */
                seq?: (number|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an ActionGameLaunch. */
            type $Shape = wire.msg.ActionGameLaunch.$Properties;
        }
    }
}
