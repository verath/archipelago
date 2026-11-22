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

The project has two parts; A backend server written in go, and a frontend written in TypeScript. 
Communication between the backend and frontend is done over binary WebSockets messages, serialized
using protocol buffers defined in the [proto](./proto) directory.

### Frontend

The frontend project is found in the [web](./web) directory. It is written in
[TypeScript](https://www.typescriptlang.org/) and uses [Pixi.js](https://pixijs.com/) 8 for WebGL
rendering and [React](https://react.dev/) 19 for the UI around the game. Dependencies are managed
with npm and the app is bundled with [Vite](https://vite.dev/). Vite only strips the types;
`npm run typecheck` in `web/` runs the TypeScript compiler (`tsc`) to check them.

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

Then clone the project and install the frontend dependencies:

```
git clone git@github.com:verath/archipelago.git
cd archipelago/web
npm ci
```

Run the backend from the repository root. It only serves the game WebSocket; the frontend is
served by Vite:

```
go run main.go -debug -skipWSOriginCheck
```

Then, in `web/`, start the Vite dev server:

```
npm run dev
```

The game is then available at [http://localhost:5173](http://localhost:5173). Vite reloads on
changes and proxies the game WebSocket (`/app/ws`) to the backend on port 8080.

To try the production build instead, run `npm run build && npm run preview` and open
[http://localhost:4173](http://localhost:4173). The preview proxies the WebSocket the same way.

## Developing

### Checks and tests

These run in CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) on every push and pull request:

```
go vet ./...
go test -race ./...      # -race needs cgo, i.e. a C compiler
cd web && npm run lint && npm run typecheck && npm test && npm run build
cd web && npm run test:e2e
```

* **Backend unit tests:** `go test ./...`.
* **Frontend unit tests** ([Vitest](https://vitest.dev/)): `npm test` in `web/` (or
  `npm run test:watch`). Tests live next to the code as `*.test.ts(x)` and cover the game models,
  the WebSocket connection, the game controller, the React UI and the protobuf bundle.
* **End-to-end tests** ([Playwright](https://playwright.dev/), Chromium): `npm run test:e2e` in
  `web/`. Before the first run, install the browser with `npx playwright install chromium`. The
  suite builds the Go backend and both frontend builds itself (note: this overwrites `web/dist`),
  then plays real games against a backend started per test. The tests check that:
  * the production build loads under the CSP from `web/firebase.json`;
  * a game against AI starts;
  * launching an airplane works;
  * the remaining player wins when the other one leaves;
  * the UI copes with the backend going away;
  * the client gets a snapshot and then deltas, with compression, and its traffic is small;
  * airplanes move between server messages;
  * the game resumes after the connection breaks, showing "Reconnecting" while the network is down.

  Specs are in [web/e2e](web/e2e). On failure, `npx playwright show-report` opens the report.

The e2e tests use a test build (`npm run build:e2e`, output in `web/dist-e2e`) that exposes a
read-only `window.__archipelagoTest` hook; production builds don't contain it. Both builds are
served by `vite preview` with the headers (incl. the CSP) from `web/firebase.json`. The tests also
use backend flags that make test games fast and predictable:

* `-lobbyWait <duration>`: how long to wait for more players before starting a game (default
  `8s`).
* `-aiPlayers <n>`: `-1` fills each game up to 4 players (default), `0` adds no AI, so a game
  needs 2 humans; `n` adds exactly `n` (at most 10).
* `-resumeGrace <duration>`: how long a client whose connection broke during a game has to
  resume it on a new connection (default `20s`, see "Reconnecting" below).

To profile the backend, run it with `-pprofAddr localhost:6060`: it then serves Go's
`net/http/pprof` endpoints on that address, on a listener separate from the game's (default: off).

### Simulating rule changes

[cmd/sim](cmd/sim) plays headless games between AI players, much faster than real time, and prints
a table comparing rule variants: how often the player leading at 1, 2, 3 and 5 minutes wins, how
the early game goes, how revived players fare, how large armies get. For example:

```
go run ./cmd/sim -games 500 \
    -variant 'baseline:' \
    -variant 'garrison: start=20 revive=20' \
    -variant 'upkeep: upkeep=100@0.7,200@0.4'
```

The rules a variant can change are in `model.Rules` ([lib/game/model/rules.go](lib/game/model/rules.go)),
and are all off in live games:

* `start=N`, `revive=N`: a garrison of `N` on each starting island, and on the island a revived
  player captures. A garrison absorbs attacks before the island's army does, never grows and never
  joins a launch.
* `upkeep=A@G,...`: upkeep tiers, as in Warcraft 3. From a total army (islands and airplanes) of `A`,
  a player's islands grow at `G` (e.g. `0.7`) of the normal rate.
* `un=A@S/I`: the United Nations, who don't want a superpower to own the archipelago. While a
  player's total army is above `A`, a neutral airplane flies in from the edge of the map every `I`
  (e.g. `10s`) against one of the player's islands, with `S` (e.g. `0.1`) of the army above `A`.
  If it defeats the island's army, the island becomes neutral. The same pressure as upkeep, but one
  that players can see coming and react to.

Every variant plays the same seeds, so variants are compared on the same maps, and a seed always
plays the same game. `-bots` picks the AIs, `-json` writes every game's record for further
analysis, `-summarize` prints the table for such a file again, and `go run ./cmd/sim -h` lists the
rest. A variant can also change the smart AI: `smart.K=V` sets a field of `ai.SmartConfig` (e.g.
`smart.hold=0.5`) and `pace.K=V` a field of its `ai.Pace` (e.g. `pace.rate=3`, `pace.live=` to
play at the live AIs' pace), so the same run can compare AI settings. The table then also shows,
per kind of AI, its win rate, launches per minute and captures per attack launch.

The default AI is `smart` (`ai.SmartStrategy`, [lib/game/ai/smart.go](lib/game/ai/smart.go)), which
plays more like a person than the AIs in live games (`opp` and `rand`): it defends islands under
attack (guessing, like a person, which island an enemy airplane is going to from its heading, as
the player's view of the game doesn't say), gathers army from several islands for an attack,
remembers islands it saw before they went into fog of war (and that an island it sees an airplane
leave has half its army left), and moves army from full islands towards the front. It plays at
`ai.HumanPace`: about two launches per second at most, in bursts, acting on what it saw 0.4 s ago.
It is not yet a strong player: head to head, the live `opp` AI beats it about 60% of the time.

The games are between AIs, so they show how rules change the AIs' games, which is a hint, not proof,
of how they change games between people. The results also depend on how the AIs play: with the
live AIs, rules that limit large armies mostly led to stalemates the AIs couldn't break.

### Network traffic

WebSocket messages are compressed with `permessage-deflate`, which all browsers negotiate on their
own, except messages under 128 bytes (most deltas, see below), which deflate would make larger.
The backend flag `-wsCompression=false` turns compression off. When a client disconnects, the backend
logs one `client traffic` line with the messages and bytes sent and received, both before
compression (`payloadBytes*`) and as sent over the connection (`wireBytes*`, after compression
and incl. WebSocket framing, excl. TCP/TLS).

### Protocol Buffers (protobuf)

The wire format is defined in [proto](./proto). To regenerate the Go (`.pb.go`) and JavaScript
(`.js`, `.d.ts`) files, install the protobuf compiler (`protoc`) and the Go plugin
(`go install google.golang.org/protobuf/cmd/protoc-gen-go@latest`), make sure both are on the
`PATH`, and run from `web/`:

```
npm run proto
```

The JavaScript tooling (protobufjs-cli) is installed by `npm ci`.

The backend sends the full game state once (`EventGameSnapshot`), then only what changed each tick
(`EventGameDelta`), about 5% of the size (see `EventEnvelope` in
[game.proto](proto/wire/msg/game.proto)). Airplanes are sent once, when they appear; the client
computes their position from the game time each message carries. The deltas are computed per
client, between the state last sent to it and the current one (both after fog of war), in
[lib/wire/delta.go](lib/wire/delta.go).

The client asks for the protocol version with the `v` query parameter of the WebSocket URL (`5`);
the backend rejects other versions with HTTP 400, e.g. from an old frontend a browser has cached.

The frontend's model (`web/src/game/model/GameModel.ts`) applies the snapshot and deltas, and moves
airplanes in between with a `GameClock` that estimates the server's game time. Our own launches show
right away: a local airplane flies, and the island shows the strength it took, until the server
reports (`Player.last_launch_seq`) that it processed the launch.

#### Reconnecting

A client whose connection breaks during a game (e.g. a phone switching from wifi to mobile
data) can resume the game on a new connection: `EventGameStart` carries a `resume_token`, and
connecting with `?v=5&resume=<token>` within `resume_timeout` (the backend's `-resumeGrace`)
continues the game with a new snapshot. Until then the player stays in the game. A connection the
client closes on purpose (a WebSocket close frame, e.g. when the tab is closed) is not a broken one:
the player leaves right away. A token that can't be resumed gets HTTP 410 Gone. The sessions are in
[lib/session](lib/session).

The frontend's `GameController` retries with backoff until `resume_timeout` has passed and shows
"Reconnecting" meanwhile. Launches it hadn't heard back about are dropped, as they may have been
lost; the snapshot shows what happened.

A player that is too slow to keep up gets only the latest tick of those queued for it (the backend
coalesces them), so it doesn't fall further behind, or get disconnected for it.

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
