import chokidar from "chokidar";
import { resolve } from "node:path";
import { loadConfig } from "../config-loader";
import { runBuild } from "./build";

export async function runBuildWatch(configPath: string): Promise<void> {
    await runBuild(configPath); // primera pasada, inmediata

    const config = await loadConfig(resolve(process.cwd(), configPath));
    const inputPath = resolve(process.cwd(), config.input);

    console.log(`\nWatching ${inputPath} for changes... (Ctrl+C to stop)\n`);

    const watcher = chokidar.watch(inputPath, { ignoreInitial: true });

    watcher.on("change", async () => {
        console.clear();
        console.log("File changed, rebuilding...\n");
        await runBuild(configPath);
    });

    process.on("SIGINT", async () => {
        await watcher.close();
        process.exit(0);
    });
}
