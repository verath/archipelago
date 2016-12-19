export default class ResourceHolder {

    /**
     * @param {Map<string, PIXI.Texture>} textures
     */
    constructor(textures) {
        /**
         * @type {Map<string, PIXI.Texture>}
         * @private
         */
        this._textures = textures;
    }

    /**
     * @param {string} textureId
     * @returns {PIXI.Texture}
     */
    getTexture(textureId) {
        if (!this._textures.has(textureId)) {
            throw new Error("Attempt to load unknown texture: " + textureId);
        }
        return this._textures.get(textureId);
    }
}