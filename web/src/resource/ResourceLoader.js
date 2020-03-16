import * as PIXI from "pixi.js";
import ResourceHolder from "./ResourceHolder.js";

import * as images from "../images";

const TEXTURES = [
    images.TEXTURE_AIRPLANE,
    images.TEXTURE_ISLAND1,
    images.TEXTURE_ISLAND2,
    images.TEXTURE_ISLAND3,
    images.TEXTURE_ISLAND4,
    images.TEXTURE_ISLAND5,
    images.TEXTURE_ISLAND6,
    images.TEXTURE_SELECTED,
    images.TEXTURE_FOG,
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
                    // eslint-disable-next-line no-prototype-builtins
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
