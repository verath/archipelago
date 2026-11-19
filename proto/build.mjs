// Script for building the backend (.pb.go) and frontend (.d.ts, .js) files
// from the protobuf definitions. Run with `npm run proto` from web/.
// Requires protoc, protoc-gen-go and gofmt on PATH.
// Based on https://github.com/cockroachdb/cockroach/blob/0ba0af9ed345ecd645efb4743b8d3100a2a78955/build/protobuf.mk

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const protoDir = path.join(root, "proto");
const libDir = path.join(root, "lib");
const wireDir = path.join(root, "web", "src", "wire");
const jsBundle = path.join(wireDir, "proto_bundle.js");
const tsBundle = path.join(wireDir, "proto_bundle.d.ts");
const binDir = path.join(root, "web", "node_modules", ".bin");

const rel = (p) => path.relative(root, p).split(path.sep).join("/");

function run(cmd, args) {
    // shell: true so that the .cmd shims in node_modules/.bin work on Windows.
    // All arguments are paths/flags without spaces or shell metacharacters.
    const res = spawnSync([cmd, ...args].join(" "), { cwd: root, stdio: "inherit", shell: true });
    if (res.status !== 0) {
        console.error(`Command failed (${res.status}): ${cmd} ${args.join(" ")}`);
        process.exit(res.status || 1);
    }
}

/** Recursively lists files under dir for which pred(name) is true. */
function walk(dir, pred) {
    const out = [];
    for (const name of readdirSync(dir)) {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) {
            out.push(...walk(full, pred));
        } else if (pred(name)) {
            out.push(full);
        }
    }
    return out;
}

/** All directories (recursively) under dir, including dir itself. */
function dirs(dir) {
    const out = [dir];
    for (const name of readdirSync(dir)) {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) {
            out.push(...dirs(full));
        }
    }
    return out;
}

const isProto = (n) => n.endsWith(".proto");
const protoFiles = walk(protoDir, isProto);

console.log("Protobuf definitions:");
protoFiles.forEach((f) => console.log(`\t ${rel(f)}`));

console.log("\nRemoving previously generated go files:");
for (const f of walk(libDir, (n) => n.endsWith(".pb.go"))) {
    console.log(`\t ${rel(f)}`);
    rmSync(f);
}

// protoc-gen-go processes a single go package (directory) at a time.
console.log("\nGenerating go files:");
for (const dir of dirs(protoDir)) {
    const files = readdirSync(dir).filter(isProto).map((n) => rel(path.join(dir, n)));
    if (files.length === 0) {
        continue;
    }
    run("protoc", ["--proto_path=proto", "--go_out=paths=source_relative:lib", ...files]);
}
const pbGoFiles = walk(libDir, (n) => n.endsWith(".pb.go"));
pbGoFiles.forEach((f) => console.log(`\t ${rel(f)}`));

console.log("\nRunning gofmt");
for (const f of pbGoFiles) {
    run("gofmt", ["-s", "-w", rel(f)]);
}

if (!existsSync(binDir)) {
    console.error("web/node_modules not found, run `npm ci` in web/ first.");
    process.exit(1);
}

console.log("\nGenerating .js bundle");
run(`"${path.join(binDir, "pbjs")}"`, [
    "--target", "static-module", "--wrap", "es6",
    "--out", rel(jsBundle),
    ...protoFiles.map(rel),
]);
console.log(`\t ${rel(jsBundle)}`);

console.log("\nGenerating .d.ts bundle (TypeScript definitions)");
run(`"${path.join(binDir, "pbts")}"`, ["--out", rel(tsBundle), rel(jsBundle)]);
console.log(`\t ${rel(tsBundle)}`);
