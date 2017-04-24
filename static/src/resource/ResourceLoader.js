import ResourceHolder from "./ResourceHolder.js";

import {
    TEXTURE_AIRPLANE,
    TEXTURE_ISLAND1,
    TEXTURE_ISLAND2,
    TEXTURE_ISLAND3,
    TEXTURE_ISLAND4,
    TEXTURE_SELECTED
} from "../images";

const TEXTURES = [
    TEXTURE_AIRPLANE,
    TEXTURE_ISLAND1,
    TEXTURE_ISLAND2,
    TEXTURE_ISLAND3,
    TEXTURE_ISLAND4,
    TEXTURE_SELECTED
];

export default class ResourceLoader {

    /**
     * @returns Promise<ResourceHolder>
     */
    static load() {
        return new Promise((resolve, reject) => {
            let loader = new PIXI.loaders.Loader();
            TEXTURES.forEach(texture => loader.add(texture));
            loader.load((loader, resources) => {
                /** @type {Map<string, PIXI.Texture>} */
                let textures = new Map();
                for (let textureId of TEXTURES) {
                    if (!resources.hasOwnProperty(textureId)) {
                        continue;
                    }
                    let resource = resources[textureId];
                    if (resource.error) {
                        return reject(resource.error);
                    } else if (!resource.texture) {
                        return reject(new Error("No texture for textureId: " + textureId));
                    } else {
                        textures.set(textureId, resource.texture);
                    }
                }

                return resolve(new ResourceHolder(textures));
            });
        });
    }
}