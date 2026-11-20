import type { Texture } from "pixi.js";

export default class ResourceHolder {

    private readonly _textures: Map<string, Texture>;

    constructor(textures: Map<string, Texture>) {
        this._textures = textures;
    }

    getTexture(textureId: string): Texture {
        const texture = this._textures.get(textureId);
        if (texture === undefined) {
            throw new Error("Attempt to load unknown texture: " + textureId);
        }
        return texture;
    }
}
