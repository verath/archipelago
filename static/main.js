import GameView from "./lib/view/game";

const stageWidth = 600;
const stageHeight = 600;

let renderer = new PIXI.autoDetectRenderer(
    stageWidth, stageHeight,
    {antialias: false, transparent: true, resolution: 1}
);
document.body.appendChild(renderer.view);
let stage = new PIXI.Container();
let textures = {};


let gameView = new GameView(null, stage);

/*
let game = null;

function createAirplane(airplaneData) {
    let width = 64;
    let height = 64;
    let airplane = new PIXI.Sprite(textures.island);
    airplane.anchor.set(0.5, 0.5);
    return airplane;
}

function createAirplanes(stage, game) {
    const gameWidth = game.Board.Size.X;
    const gameHeight = game.Board.Size.Y;
    const tileWidth = stageWidth / gameWidth;
    const tileHeight = stageHeight / gameHeight;

    game.Airplanes.forEach((airplane) => {
        const posX = airplane.Position.X;
        const posY = airplane.Position.Y;
        let airplaneSprite = createAirplane(airplane);
        airplaneSprite.width = 40;
        airplaneSprite.height = 40;
        airplaneSprite.x = posX * tileWidth;
        airplaneSprite.y = posY * tileHeight;
        console.log(posX, posY);
        stage.addChild(airplaneSprite);
    })
}

function createIsland(islandData) {
    let width = 128;
    let height = 128;
    let islandContainer = new PIXI.Container();
    islandContainer.width = width;
    islandContainer.height = height;

    let island = new PIXI.Sprite(textures.island);
    island.width = width - 2;
    island.height = height - 2;
    island.x = 1;
    island.y = 1;
    islandContainer.addChild(island);

    let strengthText = new PIXI.Text(
        islandData.Army.Strength,
        {fontFamily: 'Arial', fontSize: 34, fill: 0x1010ff, align: 'center'}
    );
    strengthText.anchor.set(0.5, 0.5);
    strengthText.x = width / 2;
    strengthText.y = height / 2;
    islandContainer.addChild(strengthText);

    return islandContainer;
}

function createIslands(stage, game) {
    const gameWidth = game.Board.Size.X;
    const gameHeight = game.Board.Size.Y;
    const gameIslands = game.Board.Islands;
    const tileWidth = stageWidth / gameWidth;
    const tileHeight = stageHeight / gameHeight;

    for (let x = 0; x < gameWidth; x++) {
        for (let y = 0; y < gameHeight; y++) {
            let islandIdx = (y * gameWidth + x);
            let islandData = gameIslands[islandIdx];
            if (islandData != null) {
                let islandSprite = createIsland(islandData);
                islandSprite.width = tileWidth;
                islandSprite.height = tileHeight;
                islandSprite.x = x * tileWidth;
                islandSprite.y = y * tileHeight;

                islandSprite.interactive = true;
                islandSprite.on('mousedown', ()=>console.log('click'));
                islandSprite.on('touchstart', ()=>console.log('click'));
                stage.addChild(islandSprite);
            }
        }
    }
}

function createSprites(game) {
    // TODO: we should reuse the sprites...
    stage.removeChildren();
    createIslands(stage, game);
    createAirplanes(stage, game);
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

function onServerTick(game) {
    createSprites(game)
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

    switch (event.Name) {
        case "tick":
            onServerTick(event.Data);
            break;
        default:
            console.log("Unknown event:", event.Name);
    }
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    renderer.render(stage);
}

(function main() {
    new WebSocket("ws://127.0.0.1:8080/ws");
    let wsConn = new WebSocket("ws://127.0.0.1:8080/ws");
    wsConn.addEventListener('open', () => console.log('WS conn opened'));
    wsConn.addEventListener('message', onWSMessage);
    wsConn.addEventListener('close', () => console.log('WS conn closed'));

    loadAssets().then(() => {
        window.requestAnimationFrame(gameLoop);
    });
})();*/