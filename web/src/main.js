import "./main.css";

// Babel "runtime"/polyfill imports, modified by Babel during compilation
// depending on target browsers.
// See https://babeljs.io/docs/en/babel-preset-env#usebuiltins
import "core-js/stable";
import "regenerator-runtime/runtime";

import { Archipelago } from "./Archipelago";

/**
 * The version of the websocket protocol we expect.
 * @type {string}
 */
const WS_VERSION = "4";

/**
 * The host for the websocket endpoint in production.
 * @type {string}
 */
const PRODUCTION_WS_HOST = "ws.playarchipelago.com";

/**
 * Hostname that indicates that the site is hosted in production and
 * should connect to the production websocket endpoint.
 * @type {string}
 */
const PRODUCTION_HOSTNAME = "playarchipelago.com";


(async function main() {
    // Register service worker.
    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("/sw.js");
        } catch (e) {
            console.error("sw registration failed:", e);
        }
    }

    const wsURL = (() => {
        let protocol = (window.location.protocol === "https:") ? "wss://" : "ws://";
        let host = PRODUCTION_WS_HOST;
        // Override ws host in development.
        if (window.location.hostname !== PRODUCTION_HOSTNAME) {
            host = window.location.hostname + ":" + window.location.port;
        }
        return `${protocol}${host}/app/ws?v=${WS_VERSION}`;
    })();
    const archipelago = new Archipelago(document.getElementById("root"), wsURL);
    archipelago.init();
    window["archipelago"] = archipelago;
})().catch(err => console.error(err));
