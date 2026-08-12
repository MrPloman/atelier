import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildTokens } from "../../build";
import type { AtelierConfig } from "../../config";
import { generateCSS } from "../../generate/css";
import { generateSCSS } from "../../generate/scss";
import { generateTS } from "../../generate/ts";
import { loadConfig } from "../config-loader";
import { reportDiagnostics } from "../report";

const GENERATORS = {
    css: { fn: generateCSS, ext: "css" },
    scss: { fn: generateSCSS, ext: "scss" },
    ts: { fn: generateTS, ext: "ts" },
} as const;

export async function runBuild(configPath: string): Promise<void> {
    const resolvedConfigPath = resolve(process.cwd(), configPath);

    if (!existsSync(resolvedConfigPath)) {
        console.error(`Config file not found: ${resolvedConfigPath}`);
        process.exitCode = 1;
        return;
    }

    const config: AtelierConfig = await loadConfig(resolvedConfigPath);
    const inputPath = resolve(process.cwd(), config.input);

    if (!existsSync(inputPath)) {
        console.error(`Input file not found: ${inputPath}`);
        process.exitCode = 1;
        return;
    }

    const rawJson = readFileSync(inputPath, "utf-8");
    const { tokens, errors } = buildTokens(rawJson, config.transforms ?? []);

    if (errors.length > 0) {
        reportDiagnostics(errors);
    }

    if (tokens.size === 0) {
        console.error("No valid tokens were resolved. Nothing to generate.");
        process.exitCode = 1;
        return;
    }

    const outputDir = resolve(process.cwd(), config.output);
    mkdirSync(outputDir, { recursive: true });

    for (const format of config.formats) {
        const generator = GENERATORS[format];
        const output = generator.fn(tokens);
        const outPath = resolve(outputDir, `tokens.${generator.ext}`);
        writeFileSync(outPath, output, "utf-8");
        console.log(`  wrote ${outPath}`);
    }

    if (errors.length > 0) {
        process.exitCode = 1;
    }
}
