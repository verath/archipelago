export default class ResourceHolder {

    /**
     * @param {Map<string, import("pixi.js").Texture>} textures
     */
    constructor(textures) {
        /**
         * @type {Map<string, import("pixi.js").Texture>}
         * @private
         */
        this._textures = textures;
    }

    /**
     * @param {string} textureId
     * @returns {import("pixi.js").Texture}
     */
    getTexture(textureId) {
        if (!this._textures.has(textureId)) {
            throw new Error("Attempt to load unknown texture: " + textureId);
        }
        return this._textures.get(textureId);
    }
}