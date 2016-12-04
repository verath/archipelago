const stageWidth = 600;
const stageHeight = 600;

// Create and add the PIXI renderer
let renderer = new PIXI.autoDetectRenderer(
    stageWidth, stageHeight,
    {antialias: false, transparent: true, resolution: 1}
);
document.body.appendChild(renderer.view);
let stage = new PIXI.Container();
let textures = {};
let sprites = {};

/**@type object */
let game = null;

function createIsland(width, height) {
    let islandContainer = new PIXI.Container();
    islandContainer.width = width;
    islandContainer.height = height;

    let island = new PIXI.Sprite(textures.island);
    island.width = width - 2;
    island.height = height - 2;
    island.x = 1;
    island.y = 1;
    islandContainer.addChild(island);

    let str = new PIXI.Text(
        "10",
        {fontFamily: 'Arial', fontSize: 24, fill: 0x1010ff, align: 'center'}
    );
    str.anchor.set(0.5, 0.5);
    str.x = width / 2;
    str.y = height / 2;
    islandContainer.addChild(str);

    return islandContainer;
}

function updateIslands(game) {
    const gameWidth = game.Board.Size.X;
    const gameHeight = game.Board.Size.Y;
    const gameIslands = game.Board.Islands;
    const islandWidth = gameWidth / stageWidth;
    const islandHeight = gameHeight / stageHeight;

    for (let x = 0; x < gameWidth; x++) {
        for (let y = 0; y < gameHeight; y++) {
            let islandIdx = (y * gameWidth + x);
            let island = gameIslands[islandIdx];
            updateIsland(island, x, y);
        }
    }
}

function updateSprites(game) {
    if (!game) {
        return;
    }

}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    updateSprites(game);
    renderer.render(stage);
}

function registerAssets(loader, resources) {
    for (const name in resources) {
        if (!resources.hasOwnProperty(name)) {
            continue;
        }
        const res = resources[name];
        if (res.error || !res.texture) {
            throw new Error("Failed loading resource: " + res.url + "." + res.error);
        }
        textures[name] = res.texture;
    }
}

function loadAssets() {
    return new Promise((resolve, reject) => {
        PIXI.loader
            .add('island', 'assets/island.png')
            .once('complete', (loader, resources) => {
                try {
                    registerAssets(loader, resources);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
            .load();
    });
}

function onServerTick(tickData) {
    game = tickData;
}

function onWSMessage(messageEvt) {
    let wsData = messageEvt.data;
    let event = null;
    try {
        event = JSON.parse(wsData);
    } catch (err) {
        console.log('Could not parse websocket data as json', wsData);
        return;
    }

    console.log(event);

    switch (event.Name) {
        case "tick":
            onServerTick(event.Data);
            break;
        default:
            console.log("Unknown event:", event.Name);
    }
}


(function main() {
    let wsConn = new WebSocket("ws://127.0.0.1:8080/ws");
    wsConn.addEventListener('open', () => console.log('WS conn opened'));
    wsConn.addEventListener('message', onWSMessage);
    wsConn.addEventListener('close', () => console.log('WS conn closed'));

    loadAssets().then(() => {
        window.requestAnimationFrame(gameLoop);
    });
})();