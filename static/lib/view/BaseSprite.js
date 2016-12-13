import * as PIXI from 'pixijs'

export default class BaseSprite extends PIXI.Sprite {

    /**
     * @param {PIXI.Texture} texture
     * @param {BaseModel} model
     */
    constructor(texture, model) {
        super(texture);

        /**
         * @member {BaseModel}
         * @protected
         */
        this._model = model;

        this.once('added', this._onAdded.bind(this));
    }

    /**
     * @protected
     */
    _onAdded() {
        this._onModelChanged();
        this._model.addChangeListener(this._onModelChanged, this);
        this.once('removed', this._onRemoved.bind(this));
    }

    /**
     * @protected
     */
    _onRemoved() {
        this._model.removeChangeListener(this._onModelChanged, this);
        this.once('added', this._onAdded.bind(this));
    }

    /**
     * @protected
     */
    _onModelChanged() {
    }
}