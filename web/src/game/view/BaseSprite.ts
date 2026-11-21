import { Container, Sprite } from "pixi.js";

import type ResourceHolder from "../../resource/ResourceHolder.ts";
import type OwnableModel from "../model/OwnableModel.ts";
import type { PlayerColor } from "../model/PlayerColors.ts";

/**
 * BaseSprite is a Container holding an image Sprite (at the bottom), to
 * which subclasses can add more children (e.g. text). Sprites cannot have
 * children in Pixi v8, hence the wrapping Container.
 */
export default abstract class BaseSprite<TModel extends OwnableModel> extends Container {

    /**
     * The image sprite. Tint is applied to this sprite only, so that
     * other children (e.g. text) keep their own colors.
     */
    protected readonly _sprite: Sprite;

    readonly model: TModel;

    constructor(resourceHolder: ResourceHolder, textureId: string, model: TModel) {
        super();
        this.model = model;
        this._sprite = new Sprite(resourceHolder.getTexture(textureId));
        this.addChild(this._sprite);
    }

    /**
     * Updates the sprite from its model. Called every frame, before
     * rendering.
     */
    abstract update(): void;
}

/**
 * Returns the color of the model's owner. Models shown on the game board
 * always have an owner (possibly the neutral player).
 */
export function ownerColor(model: OwnableModel): PlayerColor {
    const owner = model.owner;
    if (owner == null) {
        throw new Error(`model ${model.id} has no owner`);
    }
    return owner.color;
}
