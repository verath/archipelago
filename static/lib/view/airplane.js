class AirplaneView {

    /**
     * @param {AirplaneModel} model
     * @param {PIXI.Container} stage
     */
    constructor(model, stage) {
        this._model = model;
        this._sprite = AirplaneView._createSprite(stage)
    }

    static _createSprite(stage) {
        let sprite = PIXI.Sprite.fromImage("assets/airplane.png");
        sprite.x = 20;
        sprite.y = 20;
        stage.addChild(sprite);
    }
}