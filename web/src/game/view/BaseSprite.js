import { Container, Sprite } from "pixi.js";

import ResourceHolder from "../../resource/ResourceHolder.js";
import BaseModel from "../model/BaseModel";

/**
 * BaseSprite is a Container holding an image Sprite (at the bottom), to
 * which subclasses can add more children (e.g. text). Sprites cannot have
 * children in Pixi v8, hence the wrapping Container.
 */
export default class BaseSprite extends Container {

    /**
     * @param {ResourceHolder} resourceHolder
     * @param {string} textureId
     */
    constructor(resourceHolder, textureId) {
        super();

        /**
         * The image sprite. Tint is applied to this sprite only, so that
         * other children (e.g. text) keep their own colors.
         * @member {Sprite}
         * @protected
         */
        this._sprite = new Sprite(resourceHolder.getTexture(textureId));
        this.addChild(this._sprite);

        /**
         * @member {?BaseModel}
         * @protected
         */
        this._model = null;

        this.once("added", this._onAdded.bind(this));
    }

    /**
     * @protected
     */
    _onAdded() {
        if (this._model == null) {
            throw new Error("this._model == null");
        }
        this._model.addChangeListener(this._onModelChanged, this);
        this.once("removed", this._onRemoved.bind(this));
        this._onModelChanged();
    }

    /**
     * @protected
     */
    _onRemoved() {
        this._model.removeChangeListener(this._onModelChanged, this);
        this.once("added", this._onAdded.bind(this));
    }

    /**
     * @param {?BaseModel} model
     */
    set model(model) {
        this._model = model;
    }

    /**
     * Method called when the model that is attached to the view
     * has its properties changed.
     * @protected
     */
    _onModelChanged() {
    }
}
