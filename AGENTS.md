# Notes for AI agents

Read README.md first: it covers the layout, the protocol, reconnecting, the checks CI runs, and the e2e setup. This file only lists what is easy to get wrong.

## Invariants that span files
- **Protocol version.** It is defined twice: the Go `Version` constant next to the websocket upgrader, and `WS_VERSION` in `web/src/main.ts`. Bump both, plus the version mentioned in `game.proto`'s comments, together. The server answers any other version with HTTP 400.
- **Protobuf code is generated and committed.** That covers `lib/wire/msg/game.pb.go` and `web/src/wire/proto_bundle.{js,d.ts}`. Never hand-edit them; run `npm run proto` in `web/`.
- **Fog of war is computed twice.** The server has `lib/game/model/fog.go`; the client has `generateFogOfWar` in `GameModel.ts`. They must agree: radius 2 around large islands, 1 around other islands and airplanes, positions rounded half away from zero. A hidden strength is sent as `-1`.
- **Game time is whole milliseconds.** The server sends each airplane once, and clients compute its position from the game time (`GameClock`), so a flight is fixed once sent. If a flight does change, the delta encoder re-adds the airplane.

## Things that look simplifiable but aren't
- **Deltas assume in-order delivery.** The delta encoder (`lib/wire/delta.go`) runs per client and considers a state delivered as soon as it is encoded. To skip ticks, don't encode them, the way the controller coalesces queued ticks. Never drop an encoded message.
- **The game loop goroutine must never block.** Events go into each player's queue without blocking; a player whose queue is full is too slow and is disconnected.
- **Model errors come in two kinds.** `model.IllegalActionError` means bad user input: the action is ignored. Any other error from `Action.Apply` ends the game.
- **The server-side client's read pump is required.** It is the only thing that notices a client leaving while it waits in the lobby.
- **A closed connection is not a broken one.** A websocket close frame from the peer (`ErrPeerClosed`, e.g. the tab was closed) means the player leaves now. A broken connection keeps the player in the game for the resume grace period. See `lib/session`.
- **`destination_id` and `launch_seq`** are only sent to the airplane's owner. The client shows its own launches immediately, then reconciles them using `Player.last_launch_seq`. Launch seqs continue across reconnects.
- **CSP.** Production runs without `unsafe-eval`. Keep the `pixi.js/unsafe-eval` import, and keep `Assets` set to load without workers or `fetch` (see `ResourceLoader`).
- **Game state lives in one process's memory.** The backend deploys to a single machine; don't add anything that assumes more than one instance.

## Frontend structure
- The view polls the model: `GameView.render()` syncs sprites from the model every frame. The models have no change events, so don't add any.
- Only `GameController` updates the model. The render loop dispatches `game/frame`, which reaches `GameController.onFrame`, which moves the airplanes. That only happens while `run()` is running.

## Workflow
- Keep changes behaviour-neutral unless asked, and keep them small. The project isn't expected to grow, so avoid new abstractions.
- Commits: an imperative subject, then a wrapped body explaining why. To address review comments on an unmerged PR, amend the relevant commit; don't add fix-up commits.
- PRs are rebase-merged, so a PR stacked on a merged one must be rebased onto `master`, dropping the merged commits. Deleting a PR's branch closes the PRs stacked on it instead of retargeting them, so retarget stacked PRs to `master` first.
- The e2e suite builds the backend itself and overwrites `web/dist`. If the browser installed locally doesn't match the pinned Playwright version, use an uncommitted local config that sets `launchOptions.executablePath`; don't change `playwright.config.ts`.
