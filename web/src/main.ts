// Despite its name, this makes Pixi work *without* 'unsafe-eval': it
// replaces Pixi's generated (new Function) shader/uniform sync code with
// static implementations, so our CSP can omit 'unsafe-eval'.
import "pixi.js/unsafe-eval";
import { Archipelago } from "./Archipelago.tsx";

declare global {
    interface Window {
        /**
         * The running app, set once main() has started it.
         */
        archipelago?: Archipelago;
    }
}

/**
 * The version of the websocket protocol we expect.
 */
const WS_VERSION = "4";

/**
 * The host for the websocket endpoint in production.
 */
const PRODUCTION_WS_HOST = "ws.playarchipelago.com";

/**
 * Hostname that indicates that the site is hosted in production and
 * should connect to the production websocket endpoint.
 */
const PRODUCTION_HOSTNAME = "playarchipelago.com";


(async function main() {
    const wsURL = (() => {
        const protocol = (window.location.protocol === "https:") ? "wss://" : "ws://";
        let host = PRODUCTION_WS_HOST;
        // Override ws host in development.
        if (window.location.hostname !== PRODUCTION_HOSTNAME) {
            host = window.location.hostname + ":" + window.location.port;
        }
        return `${protocol}${host}/app/ws?v=${WS_VERSION}`;
    })();
    const rootElement = document.getElementById("root");
    if (rootElement == null) {
        throw new Error("No #root element to render into");
    }
    const archipelago = new Archipelago(rootElement, wsURL);
    archipelago.init();
    window.archipelago = archipelago;
})().catch(err => console.error(err));
