# Archipelago

A 2-player web-based clone of the [android game](https://play.google.com/store/apps/details?id=com.sgg.archipelago_kr) 
with the same name.

![Screenshot Archipelago](assets/screenshot1.png)

[![CircleCI](https://circleci.com/gh/verath/archipelago.svg?style=svg)](https://circleci.com/gh/verath/archipelago)
[![Codeclimate Maintainability](https://api.codeclimate.com/v1/badges/4ae6b5cd15e1050fd3d3/maintainability)](https://codeclimate.com/github/verath/archipelago/maintainability)

The game can be played at https://playarchipelago.com.

## The Archipelago game

The game is about controlling islands by sending airplanes. Each players starts controlling a single 
island. In addition, there are multiple islands, controlled by neither of the two players. Each 
island has an army, that for player-controlled islands increases over time. A player may at anytime 
choose to send an airplane from an island that the player controls to any other island. The airplane 
is created with half the army strength of the island, subtracted from the island.

As an airplane reaches its destination different things happen:
  1. If the owner of the airplane is the same as the owner of the island, then the island strength is 
  increased by the strength of the army on the airplane.
  2. If the owner is not the same, then the army size of the island is subtracted by the army size of 
  the airplane. This in turn can have additional effects:
     1. If the resulting island army size is `<0`, then the player controlling the airplane gets 
     control of the island and the army size of the island is set to the absolute value.
     2. If the resulting island army size is `== 0`, then control of the island is given to the 
     neutral player.

The game is over when a player no longer controls any islands or airplanes.

## Project Overview

The project has two parts; A backend server written in go, and a frontend created in JavaScript. 
Communication between the backend and frontend is done over binary WebSockets messages, serialized
using protocol buffers defined in the [proto](./proto) directory.

### Frontend

The frontend project is found in the [web](./web) directory. It is based on [Pixi.js](https://github.com/pixijs/pixi.js) 
for WebGL/canvas rendering. The frontend is written in ES6, and is transpiled to ES5 via Babel. 
[Yarn](https://yarnpkg.com/lang/en/) is used to manage dependencies, and [Webpack2](https://webpack.js.org/) 
is used to bundle the frontend application (including js, css and images).

### Backend

The backend is written in go and uses [dep](https://github.com/golang/dep) for managing 
vendor dependencies. The backend relies primarily on the go standard library, but 
uses [Gorilla/WebSocket](https://github.com/gorilla/websocket) for WebSocket handling, 
[Logrus](https://github.com/sirupsen/logrus) for logging, and [pkg/errors](https://github.com/pkg/errors) 
for better error handling. 

The backend code is found in the [lib](./lib) directory.

## Running the Project

To run and build the project, make sure to have the following installed:
* [Go](https://golang.org/dl/)
* [Node.JS](https://nodejs.org/en/download/)
* [Yarn](https://yarnpkg.com/en/docs/install)

Then download the project to your `GOPATH`:
```
$ go get github.com/verath/archipelago
```

This will include all dependencies required for the backend code. However, the client 
side dependencies are not included in the repo and have to be fetched via yarn, and then built/bundled:

```
$ cd $GOPATH/src/github.com/verath/archipelago/web
$ yarn install
$ yarn run build:prod
```

Now run the project as a go project, e.g. using `go run` from the root directory:

```
$ cd $GOPATH/src/github.com/verath/archipelago
$ go run main.go -debug -servestatic
```

This should start the server, and make it available at 
[http://localhost:8080](http://localhost:8080) by default.

## Developing

### Protocol Buffers (protobuf)
To regenerate the protobuf files it is necessary to install the protobuf compiler (`protoc`) and
the go proto compiler plugin (`protoc-gen-go`), see the [protoc-gen-go](https://github.com/golang/protobuf)
project for instructions. [dcodeIO/protobuf.js](https://github.com/dcodeIO/ProtoBuf.js/) is also
required but should already be installed via yarn.

With these tools installed and available on the path, use the `proto/build.ps1` PowerShell script
to build both the server (.pb.go) and the client (.js, .d.ts) files.
