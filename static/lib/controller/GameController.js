import * as PIXI from 'pixijs'

export default class GameController {

    /**
     * @param {Connection} connection
     * @param {GameModel} gameModel
     * @param {GameView} gameView
     */
    constructor(connection, gameModel, gameView) {
        /**
         * @member {Connection}
         * @private
         */
        this._connection = connection;

        /**
         * @member {GameModel}
         * @private
         */
        this._gameModel = gameModel;

        /**
         * @member {GameView}
         * @private
         */
        this._gameView = gameView;

        /**
         * @type {PIXI.ticker.Ticker}
         * @private
         */
        this._ticker = new PIXI.ticker.Ticker();

        /**
         * @member {number}
         */
        this._lastUpdateMS = 0;

        // Setup event listeners
        this._connection.addServerEventListener(this._onServerEvent, this);
        this._connection.addDisconnectListener(this._onDisconnect, this);
        this._gameView.addIslandClickListener(this._onIslandClicked, this);
        this._ticker.add(this._onTick, this);
    }

    /**
     * @param {GameStartEventData} data
     * @private
     */
    _onGameStartEvent(data) {
        if (this._started) {
            throw new Error("Start event when already started");
        }
        this._started = true;
        this._gameModel.playerId = data.player_id;
        // Starts the ticker, calling this._onTick
        this._ticker.start();
    }

    /**
     * @param {TickEventData} data
     * @private
     */
    _onTickEvent(data) {
        this._lastUpdateMS = performance.now();
        this._gameModel.update(data);
    }

    /**
     * @param {ServerEvent} event
     * @private
     */
    _onServerEvent(event) {
        switch (event.name) {
            case "game_start":
                this._onGameStartEvent(event.data);
                break;
            case "tick":
                this._onTickEvent(event.data);
                break;
            default:
                console.log("Unknown event:", event.name, event);
        }
    }

    _onDisconnect() {
        this._ticker.stop();
        alert("Disconnected! :(");
    }

    /**
     * @param {string} islandId
     * @private
     */
    _onIslandClicked(islandId) {
        let clickedIsland = this._gameModel.islandById(islandId);
        if (!clickedIsland) {
            console.warn("_onIslandClicked: clickedIsland does not exist");
            return;
        }

        let selectedIsland = this._gameModel.islands.find(island => island.selected);
        if (selectedIsland) {
            // If we already had an island selected, send an airplane to the
            // clicked island from the selected island.
            selectedIsland.selected = false;

            if(selectedIsland.id === clickedIsland.id) {
                // Target cannot be the same as the origin
                return;
            }

            this._connection.sendAction({
                "action": "launch",
                "data": {
                    "from": selectedIsland.id,
                    "to": clickedIsland.id
                }
            });
        } else {
            // If we didn't have an island select already, select the clicked island
            // if it is owned by us.
            if (clickedIsland.owner.isSelf()) {
                clickedIsland.selected = true;
            }
        }
    }

    _onTick() {
        let now = performance.now();
        let delta =  now - (this._lastUpdateMS || now);
        this._lastUpdateMS = now;

        this._gameModel.interpolate(delta);
        this._gameView.render();
    }

    run() {
        this._connection.connect();
    }
}
