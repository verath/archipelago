# Archipelago

A web-based multiplayer clone of the [android game](https://play.google.com/store/apps/details?id=com.sgg.archipelago_kr) 
with the same name.

![Screenshot Archipelago](assets/screenshot3.png)

[![CI](https://github.com/verath/archipelago/actions/workflows/ci.yml/badge.svg)](https://github.com/verath/archipelago/actions/workflows/ci.yml)

The game can be played at https://playarchipelago.com.

## The Archipelago game

The game is about controlling islands by sending airplanes. Each players starts controlling a single 
island. In addition, there are multiple islands, controlled by neither player. Each island
has an army, that for player-controlled islands increases over time. A player may at anytime
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

The game is over when there is only a single player controlling any islands or airplanes.

## Project Overview

The project has two parts; A backend server written in go, and a frontend created in JavaScript. 
Communication between the backend and frontend is done over binary WebSockets messages, serialized
using protocol buffers defined in the [proto](./proto) directory.

### Frontend

The frontend project is found in the [web](./web) directory. It uses [Pixi.js](https://pixijs.com/) 8
for WebGL rendering and [React](https://react.dev/) 19 for the UI around the game. Dependencies are
managed with npm and the app is bundled with [Vite](https://vite.dev/).

### Backend

The backend is written in Go and uses Go modules. It relies primarily on the Go standard library
(including `log/slog` for logging) and uses [gorilla/websocket](https://github.com/gorilla/websocket)
for WebSocket handling.

The backend code is found in the [lib](./lib) directory.

## Running the Project

To build and run the project, install:
* [Go](https://go.dev/dl/) (the version in `go.mod`; with the default `GOTOOLCHAIN=auto` an older
  Go downloads it automatically)
* [Node.js](https://nodejs.org/en/download/) 24 or newer (npm is included)

Then clone the project and build the frontend:

```
git clone git@github.com:verath/archipelago.git
cd archipelago/web
npm ci
npm run build
```

Now run the backend from the repository root. With `-serveStatic` it also serves the built
frontend from `web/dist`:

```
go run main.go -debug -serveStatic -skipWSOriginCheck
```

The game is then available at [http://localhost:8080](http://localhost:8080).

## Developing

### Frontend dev server

For frontend work, run the backend as above (the `-serveStatic` flag is optional) and start the
Vite dev server in `web/`:

```
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite reloads on changes and proxies the game
WebSocket (`/app/ws`) to the backend on port 8080.

### Checks

These run in CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) on every push and pull request:

```
go vet ./...
go test -race ./...      # -race needs cgo, i.e. a C compiler
cd web && npm run lint && npm run build
```

### Protocol Buffers (protobuf)

The wire format is defined in [proto](./proto). To regenerate the Go (`.pb.go`) and JavaScript
(`.js`, `.d.ts`) files, install the protobuf compiler (`protoc`) and the Go plugin
(`go install google.golang.org/protobuf/cmd/protoc-gen-go@latest`), make sure both are on the
`PATH`, and run from `web/`:

```
npm run proto
```

The JavaScript tooling (protobufjs-cli) is installed by `npm ci`.

## Deployment

Pushes to `master` deploy automatically after CI passes, but only the half that changed:

* **Backend** → [Fly.io](https://fly.io) (`ws.playarchipelago.com`), built from the
  [Dockerfile](Dockerfile) and configured in [fly.toml](fly.toml). It runs on a single machine,
  because game state lives in memory. The machine is suspended when idle and resumes on the next
  connection. To deploy by hand, run `fly deploy` from the repository root.
* **Frontend** → Firebase Hosting (`playarchipelago.com`), configured in
  [web/firebase.json](web/firebase.json). To deploy by hand, run `npm run deploy` in `web/` after
  `npm run build`.

The CI workflow can also be run manually on `master` with "deploy" ticked to deploy both.

Dependencies are kept up to date by Dependabot. Minor and patch updates are merged automatically
once CI passes, and major updates are left for review. Those automatic merges don't trigger a
deploy (GitHub doesn't run workflows for pushes made with the workflow token). They go out with
the next normal push to `master`, or a manual run with "deploy" ticked.
