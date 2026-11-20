import { Container, Sprite } from "pixi.js";

import type ResourceHolder from "../../resource/ResourceHolder.ts";
import type BaseModel from "../model/BaseModel.ts";
import type OwnableModel from "../model/OwnableModel.ts";
import type { PlayerColor } from "../model/PlayerColors.ts";

/**
 * BaseSprite is a Container holding an image Sprite (at the bottom), to
 * which subclasses can add more children (e.g. text). Sprites cannot have
 * children in Pixi v8, hence the wrapping Container.
 */
export default class BaseSprite<TModel extends BaseModel = BaseModel> extends Container {

    /**
     * The image sprite. Tint is applied to this sprite only, so that
     * other children (e.g. text) keep their own colors.
     */
    protected readonly _sprite: Sprite;

    protected _model: TModel | null = null;

    constructor(resourceHolder: ResourceHolder, textureId: string) {
        super();

        this._sprite = new Sprite(resourceHolder.getTexture(textureId));
        this.addChild(this._sprite);

        this.once("added", this._onAdded.bind(this));
    }

    protected _onAdded(): void {
        if (this._model == null) {
            throw new Error("this._model == null");
        }
        this._model.addChangeListener(this._onModelChanged, this);
        this.once("removed", this._onRemoved.bind(this));
        this._onModelChanged();
    }

    protected _onRemoved(): void {
        if (this._model == null) {
            throw new Error("this._model == null");
        }
        this._model.removeChangeListener(this._onModelChanged, this);
        this.once("added", this._onAdded.bind(this));
    }

    set model(model: TModel | null) {
        this._model = model;
    }

    /**
     * Method called when the model that is attached to the view
     * has its properties changed.
     */
    protected _onModelChanged(): void {
    }
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
