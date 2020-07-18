import * as $protobuf from "protobufjs";
/** Namespace wire. */
export namespace wire {

    /** Namespace msg. */
    namespace msg {

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
            constructor(properties?: wire.msg.ICoordinate);

            /** Coordinate x. */
            public x: number;

            /** Coordinate y. */
            public y: number;

            /**
             * Creates a new Coordinate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Coordinate instance
             */
            public static create(properties?: wire.msg.ICoordinate): wire.msg.Coordinate;

            /**
             * Encodes the specified Coordinate message. Does not implicitly {@link wire.msg.Coordinate.verify|verify} messages.
             * @param message Coordinate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.msg.ICoordinate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Coordinate message, length delimited. Does not implicitly {@link wire.msg.Coordinate.verify|verify} messages.
             * @param message Coordinate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.msg.ICoordinate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Coordinate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Coordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.Coordinate;

            /**
             * Decodes a Coordinate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Coordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.Coordinate;

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
            public static fromObject(object: { [k: string]: any }): wire.msg.Coordinate;

            /**
             * Creates a plain object from a Coordinate message. Also converts values to other types if specified.
             * @param message Coordinate
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.msg.Coordinate, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: wire.msg.IFloatCoordinate);

            /** FloatCoordinate x. */
            public x: number;

            /** FloatCoordinate y. */
            public y: number;

            /**
             * Creates a new FloatCoordinate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FloatCoordinate instance
             */
            public static create(properties?: wire.msg.IFloatCoordinate): wire.msg.FloatCoordinate;

            /**
             * Encodes the specified FloatCoordinate message. Does not implicitly {@link wire.msg.FloatCoordinate.verify|verify} messages.
             * @param message FloatCoordinate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.msg.IFloatCoordinate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FloatCoordinate message, length delimited. Does not implicitly {@link wire.msg.FloatCoordinate.verify|verify} messages.
             * @param message FloatCoordinate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.msg.IFloatCoordinate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FloatCoordinate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FloatCoordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.FloatCoordinate;

            /**
             * Decodes a FloatCoordinate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FloatCoordinate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.FloatCoordinate;

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
            public static fromObject(object: { [k: string]: any }): wire.msg.FloatCoordinate;

            /**
             * Creates a plain object from a FloatCoordinate message. Also converts values to other types if specified.
             * @param message FloatCoordinate
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.msg.FloatCoordinate, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            state?: (wire.msg.PlayerState|null);
        }

        /** Represents a Player. */
        class Player implements IPlayer {

            /**
             * Constructs a new Player.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.IPlayer);

            /** Player id. */
            public id: string;

            /** Player state. */
            public state: wire.msg.PlayerState;

            /**
             * Creates a new Player instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Player instance
             */
            public static create(properties?: wire.msg.IPlayer): wire.msg.Player;

            /**
             * Encodes the specified Player message. Does not implicitly {@link wire.msg.Player.verify|verify} messages.
             * @param message Player message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.msg.IPlayer, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Player message, length delimited. Does not implicitly {@link wire.msg.Player.verify|verify} messages.
             * @param message Player message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.msg.IPlayer, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Player message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.Player;

            /**
             * Decodes a Player message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.Player;

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
            public static fromObject(object: { [k: string]: any }): wire.msg.Player;

            /**
             * Creates a plain object from a Player message. Also converts values to other types if specified.
             * @param message Player
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.msg.Player, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: wire.msg.IArmy);

            /** Army ownerId. */
            public ownerId: string;

            /** Army strength. */
            public strength: number;

            /**
             * Creates a new Army instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Army instance
             */
            public static create(properties?: wire.msg.IArmy): wire.msg.Army;

            /**
             * Encodes the specified Army message. Does not implicitly {@link wire.msg.Army.verify|verify} messages.
             * @param message Army message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.msg.IArmy, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Army message, length delimited. Does not implicitly {@link wire.msg.Army.verify|verify} messages.
             * @param message Army message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.msg.IArmy, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Army message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Army
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.Army;

            /**
             * Decodes an Army message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Army
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.Army;

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
            public static fromObject(object: { [k: string]: any }): wire.msg.Army;

            /**
             * Creates a plain object from an Army message. Also converts values to other types if specified.
             * @param message Army
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.msg.Army, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            army?: (wire.msg.IArmy|null);

            /** Airplane position */
            position?: (wire.msg.IFloatCoordinate|null);

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
            constructor(properties?: wire.msg.IAirplane);

            /** Airplane id. */
            public id: string;

            /** Airplane army. */
            public army?: (wire.msg.IArmy|null);

            /** Airplane position. */
            public position?: (wire.msg.IFloatCoordinate|null);

            /** Airplane direction. */
            public direction: number;

            /** Airplane speed. */
            public speed: number;

            /**
             * Creates a new Airplane instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Airplane instance
             */
            public static create(properties?: wire.msg.IAirplane): wire.msg.Airplane;

            /**
             * Encodes the specified Airplane message. Does not implicitly {@link wire.msg.Airplane.verify|verify} messages.
             * @param message Airplane message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.msg.IAirplane, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Airplane message, length delimited. Does not implicitly {@link wire.msg.Airplane.verify|verify} messages.
             * @param message Airplane message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.msg.IAirplane, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Airplane message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Airplane
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.Airplane;

            /**
             * Decodes an Airplane message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Airplane
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.Airplane;

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
            public static fromObject(object: { [k: string]: any }): wire.msg.Airplane;

            /**
             * Creates a plain object from an Airplane message. Also converts values to other types if specified.
             * @param message Airplane
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.msg.Airplane, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            army?: (wire.msg.IArmy|null);

            /** Island position */
            position?: (wire.msg.ICoordinate|null);

            /** Island size */
            size?: (number|null);
        }

        /** Represents an Island. */
        class Island implements IIsland {

            /**
             * Constructs a new Island.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.IIsland);

            /** Island id. */
            public id: string;

            /** Island army. */
            public army?: (wire.msg.IArmy|null);

            /** Island position. */
            public position?: (wire.msg.ICoordinate|null);

            /** Island size. */
            public size: number;

            /**
             * Creates a new Island instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Island instance
             */
            public static create(properties?: wire.msg.IIsland): wire.msg.Island;

            /**
             * Encodes the specified Island message. Does not implicitly {@link wire.msg.Island.verify|verify} messages.
             * @param message Island message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.msg.IIsland, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Island message, length delimited. Does not implicitly {@link wire.msg.Island.verify|verify} messages.
             * @param message Island message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.msg.IIsland, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Island message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Island
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.Island;

            /**
             * Decodes an Island message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Island
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.Island;

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
            public static fromObject(object: { [k: string]: any }): wire.msg.Island;

            /**
             * Creates a plain object from an Island message. Also converts values to other types if specified.
             * @param message Island
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.msg.Island, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            size?: (wire.msg.ICoordinate|null);

            /** Game playerNeutral */
            playerNeutral?: (wire.msg.IPlayer|null);

            /** Game players */
            players?: (wire.msg.IPlayer[]|null);

            /** Game islands */
            islands?: (wire.msg.IIsland[]|null);

            /** Game airplanes */
            airplanes?: (wire.msg.IAirplane[]|null);
        }

        /** Represents a Game. */
        class Game implements IGame {

            /**
             * Constructs a new Game.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.IGame);

            /** Game id. */
            public id: string;

            /** Game size. */
            public size?: (wire.msg.ICoordinate|null);

            /** Game playerNeutral. */
            public playerNeutral?: (wire.msg.IPlayer|null);

            /** Game players. */
            public players: wire.msg.IPlayer[];

            /** Game islands. */
            public islands: wire.msg.IIsland[];

            /** Game airplanes. */
            public airplanes: wire.msg.IAirplane[];

            /**
             * Creates a new Game instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Game instance
             */
            public static create(properties?: wire.msg.IGame): wire.msg.Game;

            /**
             * Encodes the specified Game message. Does not implicitly {@link wire.msg.Game.verify|verify} messages.
             * @param message Game message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.msg.IGame, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Game message, length delimited. Does not implicitly {@link wire.msg.Game.verify|verify} messages.
             * @param message Game message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.msg.IGame, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Game message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Game
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.Game;

            /**
             * Decodes a Game message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Game
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.Game;

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
            public static fromObject(object: { [k: string]: any }): wire.msg.Game;

            /**
             * Creates a plain object from a Game message. Also converts values to other types if specified.
             * @param message Game
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.msg.Game, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Game to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an EventEnvelope. */
        interface IEventEnvelope {

            /** EventEnvelope eventGameStart */
            eventGameStart?: (wire.msg.IEventGameStart|null);

            /** EventEnvelope eventGameOver */
            eventGameOver?: (wire.msg.IEventGameOver|null);

            /** EventEnvelope eventGameTick */
            eventGameTick?: (wire.msg.IEventGameTick|null);
        }

        /** Represents an EventEnvelope. */
        class EventEnvelope implements IEventEnvelope {

            /**
             * Constructs a new EventEnvelope.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.IEventEnvelope);

            /** EventEnvelope eventGameStart. */
            public eventGameStart?: (wire.msg.IEventGameStart|null);

            /** EventEnvelope eventGameOver. */
            public eventGameOver?: (wire.msg.IEventGameOver|null);

            /** EventEnvelope eventGameTick. */
            public eventGameTick?: (wire.msg.IEventGameTick|null);

            /** EventEnvelope event. */
            public event?: ("eventGameStart"|"eventGameOver"|"eventGameTick");

            /**
             * Creates a new EventEnvelope instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EventEnvelope instance
             */
            public static create(properties?: wire.msg.IEventEnvelope): wire.msg.EventEnvelope;

            /**
             * Encodes the specified EventEnvelope message. Does not implicitly {@link wire.msg.EventEnvelope.verify|verify} messages.
             * @param message EventEnvelope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.msg.IEventEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EventEnvelope message, length delimited. Does not implicitly {@link wire.msg.EventEnvelope.verify|verify} messages.
             * @param message EventEnvelope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.msg.IEventEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EventEnvelope message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EventEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.EventEnvelope;

            /**
             * Decodes an EventEnvelope message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EventEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.EventEnvelope;

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
            public static fromObject(object: { [k: string]: any }): wire.msg.EventEnvelope;

            /**
             * Creates a plain object from an EventEnvelope message. Also converts values to other types if specified.
             * @param message EventEnvelope
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.msg.EventEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: wire.msg.IEventGameStart);

            /** EventGameStart playerId. */
            public playerId: string;

            /** EventGameStart tickInterval. */
            public tickInterval: number;

            /**
             * Creates a new EventGameStart instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EventGameStart instance
             */
            public static create(properties?: wire.msg.IEventGameStart): wire.msg.EventGameStart;

            /**
             * Encodes the specified EventGameStart message. Does not implicitly {@link wire.msg.EventGameStart.verify|verify} messages.
             * @param message EventGameStart message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.msg.IEventGameStart, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EventGameStart message, length delimited. Does not implicitly {@link wire.msg.EventGameStart.verify|verify} messages.
             * @param message EventGameStart message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.msg.IEventGameStart, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EventGameStart message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EventGameStart
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.EventGameStart;

            /**
             * Decodes an EventGameStart message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EventGameStart
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.EventGameStart;

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
            public static fromObject(object: { [k: string]: any }): wire.msg.EventGameStart;

            /**
             * Creates a plain object from an EventGameStart message. Also converts values to other types if specified.
             * @param message EventGameStart
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.msg.EventGameStart, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: wire.msg.IEventGameOver);

            /** EventGameOver winnerId. */
            public winnerId: string;

            /**
             * Creates a new EventGameOver instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EventGameOver instance
             */
            public static create(properties?: wire.msg.IEventGameOver): wire.msg.EventGameOver;

            /**
             * Encodes the specified EventGameOver message. Does not implicitly {@link wire.msg.EventGameOver.verify|verify} messages.
             * @param message EventGameOver message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.msg.IEventGameOver, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EventGameOver message, length delimited. Does not implicitly {@link wire.msg.EventGameOver.verify|verify} messages.
             * @param message EventGameOver message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.msg.IEventGameOver, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EventGameOver message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EventGameOver
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.EventGameOver;

            /**
             * Decodes an EventGameOver message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EventGameOver
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.EventGameOver;

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
            public static fromObject(object: { [k: string]: any }): wire.msg.EventGameOver;

            /**
             * Creates a plain object from an EventGameOver message. Also converts values to other types if specified.
             * @param message EventGameOver
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.msg.EventGameOver, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EventGameOver to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an EventGameTick. */
        interface IEventGameTick {

            /** EventGameTick game */
            game?: (wire.msg.IGame|null);
        }

        /** Represents an EventGameTick. */
        class EventGameTick implements IEventGameTick {

            /**
             * Constructs a new EventGameTick.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.IEventGameTick);

            /** EventGameTick game. */
            public game?: (wire.msg.IGame|null);

            /**
             * Creates a new EventGameTick instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EventGameTick instance
             */
            public static create(properties?: wire.msg.IEventGameTick): wire.msg.EventGameTick;

            /**
             * Encodes the specified EventGameTick message. Does not implicitly {@link wire.msg.EventGameTick.verify|verify} messages.
             * @param message EventGameTick message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.msg.IEventGameTick, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EventGameTick message, length delimited. Does not implicitly {@link wire.msg.EventGameTick.verify|verify} messages.
             * @param message EventGameTick message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.msg.IEventGameTick, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EventGameTick message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EventGameTick
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.EventGameTick;

            /**
             * Decodes an EventGameTick message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EventGameTick
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.EventGameTick;

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
            public static fromObject(object: { [k: string]: any }): wire.msg.EventGameTick;

            /**
             * Creates a plain object from an EventGameTick message. Also converts values to other types if specified.
             * @param message EventGameTick
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.msg.EventGameTick, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EventGameTick to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an ActionEnvelope. */
        interface IActionEnvelope {

            /** ActionEnvelope actionGameLeave */
            actionGameLeave?: (wire.msg.IActionGameLeave|null);

            /** ActionEnvelope actionGameLaunch */
            actionGameLaunch?: (wire.msg.IActionGameLaunch|null);
        }

        /** Represents an ActionEnvelope. */
        class ActionEnvelope implements IActionEnvelope {

            /**
             * Constructs a new ActionEnvelope.
             * @param [properties] Properties to set
             */
            constructor(properties?: wire.msg.IActionEnvelope);

            /** ActionEnvelope actionGameLeave. */
            public actionGameLeave?: (wire.msg.IActionGameLeave|null);

            /** ActionEnvelope actionGameLaunch. */
            public actionGameLaunch?: (wire.msg.IActionGameLaunch|null);

            /** ActionEnvelope action. */
            public action?: ("actionGameLeave"|"actionGameLaunch");

            /**
             * Creates a new ActionEnvelope instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ActionEnvelope instance
             */
            public static create(properties?: wire.msg.IActionEnvelope): wire.msg.ActionEnvelope;

            /**
             * Encodes the specified ActionEnvelope message. Does not implicitly {@link wire.msg.ActionEnvelope.verify|verify} messages.
             * @param message ActionEnvelope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.msg.IActionEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ActionEnvelope message, length delimited. Does not implicitly {@link wire.msg.ActionEnvelope.verify|verify} messages.
             * @param message ActionEnvelope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.msg.IActionEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ActionEnvelope message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ActionEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.ActionEnvelope;

            /**
             * Decodes an ActionEnvelope message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ActionEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.ActionEnvelope;

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
            public static fromObject(object: { [k: string]: any }): wire.msg.ActionEnvelope;

            /**
             * Creates a plain object from an ActionEnvelope message. Also converts values to other types if specified.
             * @param message ActionEnvelope
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.msg.ActionEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: wire.msg.IActionGameLeave);

            /**
             * Creates a new ActionGameLeave instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ActionGameLeave instance
             */
            public static create(properties?: wire.msg.IActionGameLeave): wire.msg.ActionGameLeave;

            /**
             * Encodes the specified ActionGameLeave message. Does not implicitly {@link wire.msg.ActionGameLeave.verify|verify} messages.
             * @param message ActionGameLeave message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.msg.IActionGameLeave, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ActionGameLeave message, length delimited. Does not implicitly {@link wire.msg.ActionGameLeave.verify|verify} messages.
             * @param message ActionGameLeave message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.msg.IActionGameLeave, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ActionGameLeave message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ActionGameLeave
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.ActionGameLeave;

            /**
             * Decodes an ActionGameLeave message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ActionGameLeave
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.ActionGameLeave;

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
            public static fromObject(object: { [k: string]: any }): wire.msg.ActionGameLeave;

            /**
             * Creates a plain object from an ActionGameLeave message. Also converts values to other types if specified.
             * @param message ActionGameLeave
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.msg.ActionGameLeave, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            constructor(properties?: wire.msg.IActionGameLaunch);

            /** ActionGameLaunch fromId. */
            public fromId: string;

            /** ActionGameLaunch toId. */
            public toId: string;

            /**
             * Creates a new ActionGameLaunch instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ActionGameLaunch instance
             */
            public static create(properties?: wire.msg.IActionGameLaunch): wire.msg.ActionGameLaunch;

            /**
             * Encodes the specified ActionGameLaunch message. Does not implicitly {@link wire.msg.ActionGameLaunch.verify|verify} messages.
             * @param message ActionGameLaunch message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wire.msg.IActionGameLaunch, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ActionGameLaunch message, length delimited. Does not implicitly {@link wire.msg.ActionGameLaunch.verify|verify} messages.
             * @param message ActionGameLaunch message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wire.msg.IActionGameLaunch, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ActionGameLaunch message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ActionGameLaunch
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wire.msg.ActionGameLaunch;

            /**
             * Decodes an ActionGameLaunch message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ActionGameLaunch
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wire.msg.ActionGameLaunch;

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
            public static fromObject(object: { [k: string]: any }): wire.msg.ActionGameLaunch;

            /**
             * Creates a plain object from an ActionGameLaunch message. Also converts values to other types if specified.
             * @param message ActionGameLaunch
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wire.msg.ActionGameLaunch, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ActionGameLaunch to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
