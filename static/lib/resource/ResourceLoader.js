import ResourceHolder from "./ResourceHolder.js";

const TEXTURES = [
    'assets/airplane.png',
    'assets/island1.png',
    'assets/island2.png',
    'assets/island3.png',
    'assets/island4.png',
    'assets/selected.png'
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