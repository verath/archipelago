import * as PIXI from 'pixi.js'

export default class GameView {
    /**
     *
     * @param {GameModel} gameModel
     * @param {PIXI.WebGLRenderer|PIXI.CanvasRenderer} renderer
     */
    constructor(gameModel, renderer) {
        this._renderer = renderer;
        this._stage = new PIXI.Container();

        this._onModelChange = this._onModelChange.bind(this);
        //gameModel.on('change', this._onModelChange)
    }

    _onModelChange() {
        this._stage.removeChildren();

    }

    render() {
        this._renderer.render(this._stage);
    }
}