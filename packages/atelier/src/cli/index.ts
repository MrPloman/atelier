#!/usr/bin/env node
import { parseArgs } from "node:util";
import { runBuild } from "./commands/build";

const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
        watch: { type: "boolean", default: false },
        config: { type: "string", default: "./atelier.config.ts" },
    },
    allowPositionals: true,
});

const command = positionals[0];

switch (command) {
    case "build":
        await runBuild(values.config);
        break;
    default:
        console.error(`Unknown command: "${command ?? ""}". Available commands: build`);
        process.exitCode = 1;
}
