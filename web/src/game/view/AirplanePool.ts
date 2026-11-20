import type AirplaneSprite from "./AirplaneSprite.ts";

export type AirplaneCreatorFunc = () => AirplaneSprite;

export default class AirplanePool {
    private readonly _sprites: AirplaneSprite[] = [];

    private readonly _creatorFunc: AirplaneCreatorFunc;

    constructor(initialSize: number, creatorFunc: AirplaneCreatorFunc) {
        this._creatorFunc = creatorFunc;

        for (let i = 0; i < initialSize; i++) {
            this._sprites.push(creatorFunc.call(null));
        }
    }

    get(): AirplaneSprite {
        return this._sprites.pop() || this._creatorFunc.call(null);
    }

    put(sprite: AirplaneSprite): void {
        sprite.model = null;
        this._sprites.push(sprite);
    }

}
