import { Assets } from "pixi.js";
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
     * @returns {Promise<ResourceHolder>}
     */
    static async load() {
        // Load images the classic way, with an <img> element on the main
        // thread, to stay within our CSP. By default Pixi decodes images in
        // a web worker created from a blob: URL (blocked by worker-src
        // 'self') and loads them with fetch() (blocked by connect-src 'self'
        // for the small images Vite inlines as data: URLs).
        Assets.setPreferences({ preferWorkers: false, preferCreateImageBitmap: false });

        /** @type {Record<string, import("pixi.js").Texture>} */
        const loaded = await Assets.load(TEXTURES);

        /** @type {Map<string, import("pixi.js").Texture>} */
        const textures = new Map();
        for (const textureId of TEXTURES) {
            const texture = loaded[textureId];
            if (!texture) {
                throw new Error("No texture for textureId: " + textureId);
            }
            textures.set(textureId, texture);
        }
        return new ResourceHolder(textures);
    }
}
