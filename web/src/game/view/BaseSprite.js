import * as PIXI from "pixi.js";

import ResourceHolder from "../../resource/ResourceHolder.js";
import BaseModel from "../model/BaseModel";

export default class BaseSprite extends PIXI.Sprite {

    /**
     * @param {ResourceHolder} resourceHolder
     * @param {string} textureId
     */
    constructor(resourceHolder, textureId) {
        super(resourceHolder.getTexture(textureId));

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
