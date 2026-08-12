// packages/atelier/src/cli/config-loader.ts
import { createJiti } from "jiti";
import type { AtelierConfig } from "../config";

export async function loadConfig(configPath: string): Promise<AtelierConfig> {
    const jiti = createJiti(import.meta.url);
    const mod = (await jiti.import(configPath)) as
        | { default: AtelierConfig }
        | { default: undefined };
    if (!mod.default) {
        throw new Error(`Failed to load config from ${configPath}`);
    }
    return mod.default;
}
