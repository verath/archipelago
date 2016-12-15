# Archipelago

A 2-player variant of the [android game](https://play.google.com/store/apps/details?id=com.sgg.archipelago_kr) with the same name.

## The Archipelago game

The game is about controlling islands by sending airplanes. Each players starts controlling a single island. In addtion, there are multiple islands, controlled by neither of the two players. Each island has an army, that for player-controlled islands increases over time. A player may at anytime choose to send an airplane from an island that the player controlls to any other island. The airplane is created with half the army strength of the island, subtracted from the island.

As an airplane reaches its destination different things happen:
  1. If the owner of the airplane is the same as the owner of the island, then the island strength is increased by the strength of the army on the airplane.
  1. If the owner is not the same, then the army size of the island is subtracted by the army size of the airplane. This in turn can have additional effects:
     1. If the resulting island army size is <0, then the player controlling the airplane gets controll of the island and the army size of the island is set to the absolute value.
     2. If the resulting island army size is == 0, then controll of the island is given to the neutral player.

## Project Overview

The project has two parts; A server written in go, and a frontend created in JavaScript.

### Frontend

The frontend project is found in the `static` directory and is hosted by the server. The frontend uses [PixiJS](https://github.com/pixijs/pixi.js) for WebGL rendering, with fallback to canvas, and [JSPM](jspm.io) for package management. See the [README.md](static/README.md) file in the `static` directory for more in-depth information.

### Backend

The backend (aka the server), is written in go using [Godep](https://github.com/tools/godep) for managing dependencies. The server is written primarily with the standard library, but uses [Gorilla WebSocket](https://github.com/gorilla/websocket) for WebSocket handling and [Logrus](https://github.com/Sirupsen/logrus) for logging. It also generates ids via [nu7hatch/gouuid](https://github.com/nu7hatch/gouuid).

